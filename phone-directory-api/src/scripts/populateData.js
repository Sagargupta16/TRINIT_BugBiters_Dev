/**
 * Populate database with random test data
 * Usage: node server/scripts/populateData.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Contact = require("../models/Contact");
const SpamReport = require("../models/SpamReport");
const Interaction = require("../models/Interaction");

// Sample data
const firstNames = [
  "John",
  "Jane",
  "Michael",
  "Emily",
  "David",
  "Sarah",
  "Robert",
  "Lisa",
  "William",
  "Jennifer",
  "James",
  "Mary",
  "Richard",
  "Patricia",
  "Thomas",
  "Linda",
  "Charles",
  "Barbara",
  "Daniel",
  "Elizabeth",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Wilson",
  "Anderson",
  "Taylor",
  "Thomas",
  "Jackson",
  "White",
  "Harris",
  "Martin",
  "Thompson",
  "Moore",
];

const domains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "example.com",
];

const spamReasons = [
  "Telemarketing",
  "Scam call",
  "Robocall",
  "Spam message",
  "Unwanted calls",
  "Phishing attempt",
  "Fraudulent activity",
];

// Helper functions
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generatePhoneNumber = () => {
  const areaCode = randomInt(200, 999);
  const exchange = randomInt(200, 999);
  const subscriber = randomInt(1000, 9999);
  return `+1${areaCode}${exchange}${subscriber}`;
};

const generateName = () => {
  return `${randomElement(firstNames)} ${randomElement(lastNames)}`;
};

const generateEmail = (name) => {
  const cleanName = name.toLowerCase().replace(/\s+/g, ".");
  return `${cleanName}@${randomElement(domains)}`;
};

const clearDatabase = async () => {
  console.log("Clearing existing data...");
  await User.deleteMany({});
  await Contact.deleteMany({});
  await SpamReport.deleteMany({});
  await Interaction.deleteMany({});
  console.log("Database cleared.");
};

const createUsers = async (count = 50) => {
  console.log(`Creating ${count} users...`);
  const users = [];
  const hashedPassword = await bcrypt.hash("Password123", 10);

  for (let i = 0; i < count; i++) {
    const name = generateName();
    const user = new User({
      name,
      phoneNumber: generatePhoneNumber(),
      email: Math.random() > 0.3 ? generateEmail(name) : null,
      password: hashedPassword,
    });

    try {
      await user.save();
      users.push(user);
      if ((i + 1) % 10 === 0) {
        console.log(`  Created ${i + 1}/${count} users`);
      }
    } catch (error) {
      // Skip duplicates
      console.log(`  Skipped duplicate: ${user.phoneNumber}`);
    }
  }

  console.log(`Successfully created ${users.length} users.`);
  return users;
};

const createContacts = async (users, contactsPerUser = 10) => {
  console.log(`Creating contacts for users...`);
  let totalContacts = 0;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const numContacts = randomInt(5, contactsPerUser);

    for (let j = 0; j < numContacts; j++) {
      const name = generateName();
      const contact = new Contact({
        name,
        phoneNumber: generatePhoneNumber(),
        email: Math.random() > 0.5 ? generateEmail(name) : null,
        owner: user._id,
        registeredUser: Math.random() > 0.7 ? randomElement(users)._id : null,
        spamLikelihood: randomInt(0, 100),
      });

      try {
        await contact.save();
        await User.findByIdAndUpdate(user._id, {
          $push: { contacts: contact._id },
        });
        totalContacts++;
      } catch (error) {
        // Skip duplicates
      }
    }

    if ((i + 1) % 10 === 0) {
      console.log(`  Processed ${i + 1}/${users.length} users`);
    }
  }

  console.log(`Successfully created ${totalContacts} contacts.`);
};

const createSpamReports = async (users, reportsCount = 100) => {
  console.log(`Creating ${reportsCount} spam reports...`);
  let created = 0;

  for (let i = 0; i < reportsCount; i++) {
    const reporter = randomElement(users);
    const phoneNumber = generatePhoneNumber();
    const reportedUser = Math.random() > 0.5 ? randomElement(users) : null;

    const spamReport = new SpamReport({
      phoneNumber: reportedUser ? reportedUser.phoneNumber : phoneNumber,
      reportedBy: reporter._id,
      reportedUser: reportedUser ? reportedUser._id : null,
      reason: randomElement(spamReasons),
    });

    try {
      await spamReport.save();
      if (reportedUser) {
        await User.findByIdAndUpdate(reportedUser._id, {
          $inc: { spamReportsReceived: 1 },
        });
      }
      created++;
    } catch (error) {
      // Skip duplicates
    }
  }

  console.log(`Successfully created ${created} spam reports.`);
};

const createInteractions = async (users, interactionsCount = 200) => {
  console.log(`Creating ${interactionsCount} interactions...`);
  let created = 0;
  const types = ["call", "message", "spam_report"];

  for (let i = 0; i < interactionsCount; i++) {
    const initiator = randomElement(users);
    let receiver = randomElement(users);

    // Ensure initiator and receiver are different
    while (receiver._id.equals(initiator._id)) {
      receiver = randomElement(users);
    }

    const type = randomElement(types);
    const metadata = {};

    if (type === "call") {
      metadata.duration = randomInt(10, 600); // 10 seconds to 10 minutes
    } else if (type === "message") {
      metadata.content = "Sample message content";
    } else if (type === "spam_report") {
      metadata.reason = randomElement(spamReasons);
    }

    const interaction = new Interaction({
      initiator: initiator._id,
      receiver: receiver._id,
      type,
      metadata,
    });

    try {
      await interaction.save();
      created++;
    } catch (error) {
      console.log(`  Error creating interaction: ${error.message}`);
    }
  }

  console.log(`Successfully created ${created} interactions.`);
};

const main = async () => {
  try {
    console.log("=================================");
    console.log("Phone Directory Data Population");
    console.log("=================================\n");

    // Connect to database
    const uri = process.env.DB_CONNECTION_STRING;
    if (!uri) {
      throw new Error("DB_CONNECTION_STRING not found in environment variables");
    }

    console.log("Connecting to database...");
    await mongoose.connect(uri);
    console.log("Connected to database.\n");

    // Clear existing data
    await clearDatabase();
    console.log("");

    // Create test data
    const users = await createUsers(50);
    console.log("");

    await createContacts(users, 15);
    console.log("");

    await createSpamReports(users, 100);
    console.log("");

    await createInteractions(users, 200);
    console.log("");

    console.log("=================================");
    console.log("Data population completed!");
    console.log("=================================\n");

    console.log("Summary:");
    console.log(`  Users: ${users.length}`);
    console.log(`  Contacts: ${await Contact.countDocuments()}`);
    console.log(`  Spam Reports: ${await SpamReport.countDocuments()}`);
    console.log(`  Interactions: ${await Interaction.countDocuments()}`);

    console.log("\nYou can now test the API with these credentials:");
    console.log("  Any phone number from the generated users");
    console.log("  Password: Password123\n");

    // Display a few sample users
    const sampleUsers = users.slice(0, 5);
    console.log("Sample users:");
    sampleUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} - ${user.phoneNumber}`);
    });

    console.log("\n");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
};

main();
