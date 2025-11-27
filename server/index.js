// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes.js");
const studentRoutes = require("./routes/studentRoutes.js");
const tutorRoutes = require("./routes/tutorRoutes.js");
const classRoutes = require("./routes/classRoutes.js");
const flashcardRoutes = require("./routes/flashcardRoutes.js");
const testRoutes = require("./routes/testRoutes.js");
// Phone Directory API Routes
const userRoutes = require("./routes/userRoutes.js");
const contactRoutes = require("./routes/contactRoutes.js");
const spamRoutes = require("./routes/spamRoutes.js");
const searchRoutes = require("./routes/searchRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const { authenticateUser } = require("./middleware/authMiddleware.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const uri = process.env.DB_CONNECTION_STRING;

mongoose
  .connect(uri)
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

// Middleware to hide version information
app.disable("x-powered-by");

// Original routes
app.use("/auth", authRoutes);
app.use("/student", studentRoutes);
app.use("/tutor", tutorRoutes);
app.use("/class", classRoutes);
app.use("/flashcard", flashcardRoutes);
app.use("/test", testRoutes);

// Phone Directory API routes
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/spam", spamRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/token-check", authenticateUser, (req, res) => {
  try {
    res.status(200).json({ isAuthenticated: true });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Phone Directory API is running",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
