/**
 * Phone Directory API - Main Server File
 * Entry point for the application
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("./utils/logger");

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const spamRoutes = require("./routes/spamRoutes");
const searchRoutes = require("./routes/searchRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const connectDB = async () => {
  try {
    const uri = process.env.DB_CONNECTION_STRING;
    if (!uri) {
      throw new Error("DB_CONNECTION_STRING not found in environment variables");
    }
    
    await mongoose.connect(uri);
    logger.info("✓ Database connected successfully");
    console.log("✓ Database connected successfully");
  } catch (error) {
    logger.error(`✗ Database connection failed: ${error.message}`);
    console.error(`✗ Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Security headers
app.disable("x-powered-by");

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Phone Directory API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/spam", spamRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Phone Directory API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      user: "/api/user/*",
      contact: "/api/contact/*",
      spam: "/api/spam/*",
      search: "/api/search/*",
      dashboard: "/api/dashboard/*",
    },
    documentation: "/api/docs",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: false,
    errors: ["Endpoint not found"],
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    status: false,
    errors: [err.message || "Internal server error"],
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    logger.info(`✓ Server is running on port ${PORT}`);
    console.log(`✓ Server is running on port ${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`✓ API Base URL: http://localhost:${PORT}/api`);
    console.log(`✓ Health Check: http://localhost:${PORT}/health`);
  });
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

// Start the application
startServer();

module.exports = app;
