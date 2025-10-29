const SpamReport = require("../models/SpamReport");
const User = require("../models/User");
const Contact = require("../models/Contact");
const Interaction = require("../models/Interaction");
const logger = require("../utils/logger");
const { normalizePhoneNumber } = require("./userController");

/**
 * POST /api/spam
 * Report a phone number as spam
 */
exports.reportSpam = async (req, res) => {
  try {
    const { phoneNumber, reason } = req.body;
    const reporterId = req.user._id;

    // Validation
    if (!phoneNumber) {
      return res.status(400).json({
        status: false,
        errors: ["Phone number is required"],
      });
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    // Check if user has already reported this number
    const existingReport = await SpamReport.findOne({
      phoneNumber: normalizedPhone,
      reportedBy: reporterId,
    });

    if (existingReport) {
      return res.status(400).json({
        status: false,
        errors: ["You have already reported this number as spam"],
      });
    }

    // Check if this phone belongs to a registered user
    const reportedUser = await User.findOne({ phoneNumber: normalizedPhone });

    // Create spam report
    const spamReport = new SpamReport({
      phoneNumber: normalizedPhone,
      reportedBy: reporterId,
      reportedUser: reportedUser ? reportedUser._id : null,
      reason: reason || "",
    });

    await spamReport.save();

    // Update spam count for the reported user if they're registered
    if (reportedUser) {
      await User.findByIdAndUpdate(reportedUser._id, {
        $inc: { spamReportsReceived: 1 },
      });
    }

    // Update spam likelihood for all contacts with this phone number
    const spamReportsCount = await SpamReport.countDocuments({
      phoneNumber: normalizedPhone,
    });
    const spamLikelihood = Math.min((spamReportsCount / 10) * 100, 100);

    await Contact.updateMany(
      { phoneNumber: normalizedPhone },
      { $set: { spamLikelihood } }
    );

    // Create interaction record
    if (reportedUser) {
      await Interaction.create({
        initiator: reporterId,
        receiver: reportedUser._id,
        type: "spam_report",
        metadata: {
          reason: reason || "",
        },
      });
    }

    logger.info(
      `Spam report created by ${req.user.phoneNumber} for ${normalizedPhone}`
    );

    res.status(201).json({
      status: true,
      data: {
        report: {
          phoneNumber: normalizedPhone,
          reason: reason || "",
          reportedAt: spamReport.createdAt,
        },
      },
      messages: ["Spam report submitted successfully"],
    });
  } catch (error) {
    logger.error(`Report spam error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

/**
 * GET /api/spam/stats/:phoneNumber
 * Get spam statistics for a phone number
 */
exports.getSpamStats = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    const spamReportsCount = await SpamReport.countDocuments({
      phoneNumber: normalizedPhone,
    });

    const spamLikelihood = Math.min((spamReportsCount / 10) * 100, 100);

    res.status(200).json({
      status: true,
      data: {
        phoneNumber: normalizedPhone,
        spamReportsCount,
        spamLikelihood: Math.round(spamLikelihood),
      },
    });
  } catch (error) {
    logger.error(`Get spam stats error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

module.exports = exports;
