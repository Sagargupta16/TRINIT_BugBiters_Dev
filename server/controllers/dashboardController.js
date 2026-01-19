const Interaction = require("../models/Interaction");
const User = require("../models/User");
const SpamReport = require("../models/SpamReport");
const logger = require("../utils/logger");

/**
 * GET /api/dashboard/interactions/recent
 * Get recent interactions for the authenticated user
 */
exports.getRecentInteractions = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type; // Optional filter by type

    const query = {
      $or: [{ initiator: userId }, { receiver: userId }],
    };

    if (type && ["call", "message", "spam_report"].includes(type)) {
      query.type = type;
    }

    const interactions = await Interaction.find(query)
      .populate("initiator", "name phoneNumber")
      .populate("receiver", "name phoneNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalInteractions = await Interaction.countDocuments(query);

    res.status(200).json({
      status: true,
      data: {
        interactions: interactions.map((i) => ({
          id: i._id,
          initiator: {
            name: i.initiator.name,
            phoneNumber: i.initiator.phoneNumber,
          },
          receiver: {
            name: i.receiver.name,
            phoneNumber: i.receiver.phoneNumber,
          },
          type: i.type,
          metadata: i.metadata,
          timestamp: i.createdAt,
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalInteractions / limit),
          totalInteractions,
          limit,
        },
      },
    });
  } catch (error) {
    logger.error(`Get recent interactions error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

/**
 * GET /api/dashboard/contacts/top
 * Get top N most frequently contacted users
 */
exports.getTopContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    // Aggregate interactions where user is initiator
    const topContacts = await Interaction.aggregate([
      {
        $match: {
          initiator: userId,
          type: { $in: ["call", "message"] },
        },
      },
      {
        $group: {
          _id: "$receiver",
          interactionCount: { $sum: 1 },
          lastInteraction: { $max: "$createdAt" },
        },
      },
      {
        $sort: { interactionCount: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          phoneNumber: "$user.phoneNumber",
          interactionCount: 1,
          lastInteraction: 1,
        },
      },
    ]);

    res.status(200).json({
      status: true,
      data: {
        topContacts,
      },
    });
  } catch (error) {
    logger.error(`Get top contacts error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

/**
 * GET /api/dashboard/spam/reports
 * Get spam report statistics
 */
exports.getSpamReports = async (req, res) => {
  try {
    const userId = req.user._id;
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    // Reports made by the user
    const reportsMade = await SpamReport.find({
      reportedBy: userId,
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .populate("reportedUser", "name phoneNumber")
      .sort({ createdAt: -1 })
      .lean();

    // Reports received by the user
    const reportsReceived = await SpamReport.find({
      reportedUser: userId,
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .populate("reportedBy", "name phoneNumber")
      .sort({ createdAt: -1 })
      .lean();

    // Aggregate by phone number
    const topReportedNumbers = await SpamReport.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$phoneNumber",
          reportCount: { $sum: 1 },
        },
      },
      {
        $sort: { reportCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).json({
      status: true,
      data: {
        reportsMade: {
          count: reportsMade.length,
          reports: reportsMade.map((r) => ({
            phoneNumber: r.phoneNumber,
            reportedUser: r.reportedUser
              ? {
                  name: r.reportedUser.name,
                  phoneNumber: r.reportedUser.phoneNumber,
                }
              : null,
            reason: r.reason,
            reportedAt: r.createdAt,
          })),
        },
        reportsReceived: {
          count: reportsReceived.length,
          reports: reportsReceived.map((r) => ({
            reportedBy: {
              name: r.reportedBy.name,
              phoneNumber: r.reportedBy.phoneNumber,
            },
            reason: r.reason,
            reportedAt: r.createdAt,
          })),
        },
        topReportedNumbers: topReportedNumbers.map((item) => ({
          phoneNumber: item._id,
          reportCount: item.reportCount,
        })),
      },
    });
  } catch (error) {
    logger.error(`Get spam reports error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

/**
 * GET /api/dashboard/statistics
 * Get overall user statistics
 */
exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user._id;
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Total interactions
    const totalInteractions = await Interaction.countDocuments({
      $or: [{ initiator: userId }, { receiver: userId }],
    });

    // Interactions by type
    const interactionsByType = await Interaction.aggregate([
      {
        $match: {
          $or: [{ initiator: userId }, { receiver: userId }],
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent activity (last 30 days)
    const recentActivity = await Interaction.countDocuments({
      $or: [{ initiator: userId }, { receiver: userId }],
      createdAt: { $gte: last30Days },
    });

    // Daily activity trend (last 7 days)
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyActivity = await Interaction.aggregate([
      {
        $match: {
          $or: [{ initiator: userId }, { receiver: userId }],
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Unique contacts interacted with
    const uniqueContacts = await Interaction.distinct("receiver", {
      initiator: userId,
    });

    res.status(200).json({
      status: true,
      data: {
        totalInteractions,
        interactionsByType: interactionsByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentActivity: {
          last30Days: recentActivity,
        },
        dailyActivityTrend: dailyActivity.map((day) => ({
          date: day._id,
          count: day.count,
        })),
        uniqueContactsCount: uniqueContacts.length,
      },
    });
  } catch (error) {
    logger.error(`Get statistics error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

/**
 * POST /api/dashboard/interaction
 * Create a new interaction (call or message)
 */
exports.createInteraction = async (req, res) => {
  try {
    const { receiverPhoneNumber, type, metadata } = req.body;
    const initiatorId = req.user._id;

    if (!receiverPhoneNumber || !type) {
      return res.status(400).json({
        status: false,
        errors: ["Receiver phone number and type are required"],
      });
    }

    if (!["call", "message"].includes(type)) {
      return res.status(400).json({
        status: false,
        errors: ["Type must be either 'call' or 'message'"],
      });
    }

    // Find receiver by phone number
    const { normalizePhoneNumber } = require("./userController");
    const normalizedPhone = normalizePhoneNumber(receiverPhoneNumber);
    const receiver = await User.findOne({ phoneNumber: normalizedPhone });

    if (!receiver) {
      return res.status(404).json({
        status: false,
        errors: ["Receiver not found"],
      });
    }

    // Create interaction
    const interaction = new Interaction({
      initiator: initiatorId,
      receiver: receiver._id,
      type,
      metadata: metadata || {},
    });

    await interaction.save();

    logger.info(
      `Interaction created: ${type} from ${req.user.phoneNumber} to ${normalizedPhone}`
    );

    res.status(201).json({
      status: true,
      data: {
        interaction: {
          id: interaction._id,
          type: interaction.type,
          timestamp: interaction.createdAt,
        },
      },
      messages: ["Interaction recorded successfully"],
    });
  } catch (error) {
    logger.error(`Create interaction error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

module.exports = exports;
