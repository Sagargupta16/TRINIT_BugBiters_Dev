const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

/**
 * Normalize phone number by removing spaces, dashes, and adding default country code if missing
 */
const normalizePhoneNumber = (phone) => {
  // Remove all non-digit characters except +
  let normalized = phone.replace(/[^\d+]/g, "");
  
  // If no country code present, assume default (+1 for US, can be configured)
  if (!normalized.startsWith("+")) {
    normalized = "+1" + normalized;
  }
  
  return normalized;
};

/**
 * POST /api/user/signup
 * Register a new user
 */
exports.signup = async (req, res) => {
  try {
    const { name, phoneNumber, password, email } = req.body;

    // Validation
    if (!name || !phoneNumber || !password) {
      return res.status(400).json({
        status: false,
        errors: ["Name, phone number, and password are required"],
      });
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber: normalizedPhone });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        errors: ["User with this phone number already exists"],
      });
    }

    // Validate password strength
    if (
      password.length < 6 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    ) {
      return res.status(400).json({
        status: false,
        errors: [
          "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit",
        ],
      });
    }

    // Check if email is provided and unique
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          status: false,
          errors: ["Email already in use"],
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.JWT_SALT_ROUNDS) || 10
    );

    // Create new user
    const newUser = new User({
      name,
      phoneNumber: normalizedPhone,
      email: email || null,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        name: newUser.name,
        phoneNumber: newUser.phoneNumber,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    logger.info(`New user registered: ${normalizedPhone}`);

    res.status(201).json({
      status: true,
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          phoneNumber: newUser.phoneNumber,
          email: newUser.email,
        },
      },
      messages: ["User registered successfully"],
    });
  } catch (error) {
    logger.error(`Signup error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

/**
 * POST /api/user/login
 * Login user or auto-create account if phone doesn't exist
 */
exports.login = async (req, res) => {
  try {
    const { phoneNumber, password, name } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        status: false,
        errors: ["Phone number and password are required"],
      });
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    // Find user by phone number
    let user = await User.findOne({ phoneNumber: normalizedPhone });

    // If user doesn't exist, create new account automatically
    if (!user) {
      if (!name) {
        return res.status(400).json({
          status: false,
          errors: ["Name is required for new account creation"],
        });
      }

      // Validate password strength
      if (
        password.length < 6 ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/\d/.test(password)
      ) {
        return res.status(400).json({
          status: false,
          errors: [
            "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit",
          ],
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.JWT_SALT_ROUNDS) || 10
      );

      // Create new user
      user = new User({
        name,
        phoneNumber: normalizedPhone,
        password: hashedPassword,
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          phoneNumber: user.phoneNumber,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      logger.info(`New user auto-created on login: ${normalizedPhone}`);

      return res.status(201).json({
        status: true,
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            email: user.email,
          },
        },
        messages: ["Account created and logged in successfully"],
      });
    }

    // User exists, verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: false,
        errors: ["Incorrect password"],
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    logger.info(`User logged in: ${normalizedPhone}`);

    res.status(200).json({
      status: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
        },
      },
      messages: ["Login successful"],
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

/**
 * GET /api/user/profile
 * Get current user's profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("contacts");

    if (!user) {
      return res.status(404).json({
        status: false,
        errors: ["User not found"],
      });
    }

    res.status(200).json({
      status: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
          spamReportsReceived: user.spamReportsReceived,
          contactsCount: user.contacts.length,
        },
      },
    });
  } catch (error) {
    logger.error(`Get profile error: ${error.message}`);
    res.status(500).json({
      status: false,
      errors: ["Internal server error"],
    });
  }
};

module.exports.normalizePhoneNumber = normalizePhoneNumber;
