const User = require("../models/User");
const Contact = require("../models/Contact");
const SpamReport = require("../models/SpamReport");
const logger = require("../utils/logger");
const { normalizePhoneNumber } = require("./userController");

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
const levenshteinDistance = (str1, str2) => {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }

  return dp[m][n];
};

/**
 * Calculate similarity score (0-100)
 */
const calculateSimilarity = (str1, str2) => {
  const distance = levenshteinDistance(
    str1.toLowerCase(),
    str2.toLowerCase()
  );
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 100;
  return ((maxLength - distance) / maxLength) * 100;
};

/**
 * GET /api/search?q=query
 * Search for users and contacts by name or phone number
 */
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Validation
    if (!q || q.trim() === "") {
      return res.status(400).json({
        status: false,
        errors: ["Search query is required"],
      });
    }

    const query = q.trim();
    const results = [];
    const seenPhoneNumbers = new Set();

    // Check if query looks like a phone number (contains only digits and optional + or -)
    const isPhoneQuery = /^[\d\s\-+()]+$/.test(query);

    if (isPhoneQuery) {
      // Exact phone number search
      const normalizedQuery = normalizePhoneNumber(query);

      // Search in registered users
      const users = await User.find({ phoneNumber: normalizedQuery })
        .select("-password")
        .lean();

      for (const user of users) {
        const spamReportsCount = await SpamReport.countDocuments({
          phoneNumber: user.phoneNumber,
        });

        results.push({
          id: user.id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
          isRegistered: true,
          spamLikelihood: Math.min((spamReportsCount / 10) * 100, 100),
          matchScore: 100, // Exact match
        });

        seenPhoneNumbers.add(user.phoneNumber);
      }

      // Search in contacts
      const contacts = await Contact.find({ phoneNumber: normalizedQuery })
        .populate("owner", "name phoneNumber")
        .lean();

      for (const contact of contacts) {
        if (!seenPhoneNumbers.has(contact.phoneNumber)) {
          const spamReportsCount = await SpamReport.countDocuments({
            phoneNumber: contact.phoneNumber,
          });

          results.push({
            id: contact.id,
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            email: contact.email,
            isRegistered: false,
            spamLikelihood: Math.min((spamReportsCount / 10) * 100, 100),
            matchScore: 100, // Exact match
          });

          seenPhoneNumbers.add(contact.phoneNumber);
        }
      }
    } else {
      // Name-based fuzzy search
      const searchRegex = new RegExp(query.split("").join(".*"), "i");

      // Search in registered users
      const users = await User.find({
        $or: [
          { name: { $regex: searchRegex } },
          { name: { $regex: new RegExp(query, "i") } },
        ],
      })
        .select("-password")
        .lean();

      for (const user of users) {
        const similarity = calculateSimilarity(user.name, query);
        const spamReportsCount = await SpamReport.countDocuments({
          phoneNumber: user.phoneNumber,
        });

        // Check if the searcher has this user in their contacts
        const isInSearcherContacts = await Contact.exists({
          owner: req.user._id,
          phoneNumber: user.phoneNumber,
        });

        results.push({
          id: user.id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          // Only show email if searcher has this contact
          email: isInSearcherContacts ? user.email : null,
          isRegistered: true,
          spamLikelihood: Math.min((spamReportsCount / 10) * 100, 100),
          matchScore: similarity,
          matchType: user.name.toLowerCase().startsWith(query.toLowerCase())
            ? "starts_with"
            : "contains",
        });

        seenPhoneNumbers.add(user.phoneNumber);
      }

      // Search in all contacts
      const contacts = await Contact.find({
        $or: [
          { name: { $regex: searchRegex } },
          { name: { $regex: new RegExp(query, "i") } },
        ],
      })
        .populate("owner", "name phoneNumber")
        .lean();

      for (const contact of contacts) {
        if (!seenPhoneNumbers.has(contact.phoneNumber)) {
          const similarity = calculateSimilarity(contact.name, query);
          const spamReportsCount = await SpamReport.countDocuments({
            phoneNumber: contact.phoneNumber,
          });

          results.push({
            id: contact.id,
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            email: contact.email,
            isRegistered: false,
            spamLikelihood: Math.min((spamReportsCount / 10) * 100, 100),
            matchScore: similarity,
            matchType: contact.name.toLowerCase().startsWith(query.toLowerCase())
              ? "starts_with"
              : "contains",
          });

          seenPhoneNumbers.add(contact.phoneNumber);
        }
      }
    }

    // Sort results by match score and match type
    results.sort((a, b) => {
      // Prioritize "starts_with" over "contains"
      if (a.matchType === "starts_with" && b.matchType !== "starts_with")
        return -1;
      if (a.matchType !== "starts_with" && b.matchType === "starts_with")
        return 1;

      // Then sort by match score
      return b.matchScore - a.matchScore;
    });

    // Apply pagination
    const paginatedResults = results.slice(skip, skip + limit);

    logger.info(`Search performed by ${req.user.phoneNumber}: ${query}`);

    res.status(200).json({
      status: true,
      data: {
        results: paginatedResults,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(results.length / limit),
          totalResults: results.length,
          limit,
        },
      },
    });
  } catch (error) {
    logger.error(`Search error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

/**
 * GET /api/search/detail/:id
 * Get detailed information for a specific user or contact
 */
exports.getDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find as a user first
    let result = await User.findOne({ id })
      .select("-password")
      .lean();

    if (result) {
      // Check if searcher has this user in their contacts
      const isInSearcherContacts = await Contact.exists({
        owner: req.user._id,
        phoneNumber: result.phoneNumber,
      });

      const spamReportsCount = await SpamReport.countDocuments({
        phoneNumber: result.phoneNumber,
      });

      // Get recent spam reports
      const recentReports = await SpamReport.find({
        phoneNumber: result.phoneNumber,
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("reason createdAt");

      return res.status(200).json({
        status: true,
        data: {
          id: result.id,
          name: result.name,
          phoneNumber: result.phoneNumber,
          email: isInSearcherContacts ? result.email : null,
          isRegistered: true,
          spamLikelihood: Math.min((spamReportsCount / 10) * 100, 100),
          spamReportsCount,
          recentSpamReports: recentReports.map((r) => ({
            reason: r.reason,
            reportedAt: r.createdAt,
          })),
        },
      });
    }

    // Try to find as a contact
    result = await Contact.findOne({ id })
      .populate("owner", "name phoneNumber")
      .lean();

    if (result) {
      const spamReportsCount = await SpamReport.countDocuments({
        phoneNumber: result.phoneNumber,
      });

      const recentReports = await SpamReport.find({
        phoneNumber: result.phoneNumber,
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("reason createdAt");

      return res.status(200).json({
        status: true,
        data: {
          id: result.id,
          name: result.name,
          phoneNumber: result.phoneNumber,
          email: result.email,
          isRegistered: false,
          spamLikelihood: Math.min((spamReportsCount / 10) * 100, 100),
          spamReportsCount,
          recentSpamReports: recentReports.map((r) => ({
            reason: r.reason,
            reportedAt: r.createdAt,
          })),
        },
      });
    }

    // Not found
    res.status(404).json({
      status: false,
      errors: ["Record not found"],
    });
  } catch (error) {
    logger.error(`Get detail error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

module.exports = exports;
