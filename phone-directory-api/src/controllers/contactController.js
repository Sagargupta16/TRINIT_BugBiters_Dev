const Contact = require("../models/Contact");
const User = require("../models/User");
const SpamReport = require("../models/SpamReport");
const logger = require("../utils/logger");
const { normalizePhoneNumber } = require("./userController");

/**
 * POST /api/contact
 * Create a new contact for the authenticated user
 */
exports.createContact = async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    const userId = req.user._id;

    // Validation
    if (!name || !phoneNumber) {
      return res.status(400).json({
        status: false,
        errors: ["Name and phone number are required"],
      });
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    // Check if contact already exists for this user
    const existingContact = await Contact.findOne({
      owner: userId,
      phoneNumber: normalizedPhone,
    });

    if (existingContact) {
      return res.status(400).json({
        status: false,
        errors: ["Contact with this phone number already exists"],
      });
    }

    // Check if this phone number belongs to a registered user
    const registeredUser = await User.findOne({ phoneNumber: normalizedPhone });

    // Calculate spam likelihood for this phone number
    const spamReportsCount = await SpamReport.countDocuments({
      phoneNumber: normalizedPhone,
    });

    const spamLikelihood = Math.min((spamReportsCount / 10) * 100, 100);

    // Create new contact
    const newContact = new Contact({
      name,
      phoneNumber: normalizedPhone,
      email: email || null,
      owner: userId,
      registeredUser: registeredUser ? registeredUser._id : null,
      spamLikelihood,
    });

    await newContact.save();

    // Add contact to user's contacts array
    await User.findByIdAndUpdate(userId, {
      $push: { contacts: newContact._id },
    });

    logger.info(
      `New contact created by user ${req.user.phoneNumber}: ${normalizedPhone}`
    );

    res.status(201).json({
      status: true,
      data: {
        contact: {
          id: newContact.id,
          name: newContact.name,
          phoneNumber: newContact.phoneNumber,
          email: newContact.email,
          spamLikelihood: newContact.spamLikelihood,
        },
      },
      messages: ["Contact created successfully"],
    });
  } catch (error) {
    logger.error(`Create contact error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

/**
 * GET /api/contact
 * Get all contacts for the authenticated user
 */
exports.getContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find({ owner: userId })
      .select("-owner -__v")
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const totalContacts = await Contact.countDocuments({ owner: userId });

    res.status(200).json({
      status: true,
      data: {
        contacts: contacts.map((c) => ({
          id: c.id,
          name: c.name,
          phoneNumber: c.phoneNumber,
          email: c.email,
          spamLikelihood: c.spamLikelihood,
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalContacts / limit),
          totalContacts,
          limit,
        },
      },
    });
  } catch (error) {
    logger.error(`Get contacts error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

/**
 * DELETE /api/contact/:id
 * Delete a contact
 */
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const contact = await Contact.findOne({ id, owner: userId });

    if (!contact) {
      return res.status(404).json({
        status: false,
        errors: ["Contact not found"],
      });
    }

    await Contact.findByIdAndDelete(contact._id);

    // Remove from user's contacts array
    await User.findByIdAndUpdate(userId, {
      $pull: { contacts: contact._id },
    });

    logger.info(
      `Contact deleted by user ${req.user.phoneNumber}: ${contact.phoneNumber}`
    );

    res.status(200).json({
      status: true,
      messages: ["Contact deleted successfully"],
    });
  } catch (error) {
    logger.error(`Delete contact error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

module.exports = exports;
