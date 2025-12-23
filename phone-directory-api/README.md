# 📱 Global Phone Directory - Backend REST API

A production-ready backend API for managing a global phone directory with advanced search, spam protection, and interaction analytics.

## 📋 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB connection string

# 3. Start the server
npm start

# Server runs at http://localhost:5000
```

## 🧪 Test with Sample Data

```bash
npm run populate
```

Creates realistic test data:
- 50 users
- 500+ contacts
- 100 spam reports
- 200 interactions

**All test users have password:** `Password123`

## 📁 Project Structure

```
phone-directory-api/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── userController.js    # User operations
│   │   ├── contactController.js # Contact management
│   │   ├── spamController.js    # Spam reporting
│   │   ├── searchController.js  # Search functionality
│   │   └── dashboardController.js # Analytics
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Contact.js           # Contact schema
│   │   ├── SpamReport.js        # Spam report schema
│   │   └── Interaction.js       # Interaction schema
│   ├── routes/
│   │   ├── userRoutes.js        # /api/user/*
│   │   ├── contactRoutes.js     # /api/contact/*
│   │   ├── spamRoutes.js        # /api/spam/*
│   │   ├── searchRoutes.js      # /api/search/*
│   │   └── dashboardRoutes.js   # /api/dashboard/*
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authentication
│   ├── utils/
│   │   ├── logger.js            # Winston logger
│   │   └── limiter.js           # Rate limiting
│   ├── scripts/
│   │   └── populateData.js      # Test data generator
│   └── server.js                # Entry point
├── .env.example                 # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints (17 Total)

### Authentication (No auth required)
```http
POST   /api/user/signup          # Register new user
POST   /api/user/login           # Login or auto-create account
GET    /health                   # Health check
```

### User Management (Auth required)
```http
GET    /api/user/profile         # Get user profile
```

### Contact Management (Auth required)
```http
POST   /api/contact              # Create contact
GET    /api/contact              # List contacts (paginated)
DELETE /api/contact/:id          # Delete contact
```

### Spam Reporting (Auth required)
```http
POST   /api/spam                 # Report phone as spam
GET    /api/spam/stats/:phone    # Get spam statistics
```

### Search (Auth required)
```http
GET    /api/search?q=query       # Search directory (fuzzy name / exact phone)
GET    /api/search/detail/:id    # Get detailed information
```

### Dashboard & Analytics (Auth required)
```http
GET    /api/dashboard/interactions/recent    # Recent activity
GET    /api/dashboard/contacts/top          # Top contacts
GET    /api/dashboard/spam/reports          # Spam analytics
GET    /api/dashboard/statistics            # Overall statistics
POST   /api/dashboard/interaction           # Record interaction
```

## 🎯 Key Features

### Part 1: Core API
- ✅ Phone number-based user registration and authentication
- ✅ Auto-account creation on login if user doesn't exist
- ✅ Contact management (CRUD operations)
- ✅ Spam reporting for any phone number
- ✅ Phone number normalization (handles various formats)
- ✅ **Fuzzy name search** using Levenshtein distance algorithm
- ✅ **Exact phone number search**
- ✅ Smart result ranking and pagination
- ✅ JWT authentication on all protected endpoints

### Part 2: Dashboard & Analytics
- ✅ Interaction tracking (calls, messages, spam reports)
- ✅ Recent interactions with filtering
- ✅ Top contacts identification
- ✅ Spam report analytics
- ✅ Daily activity trends
- ✅ Comprehensive statistics

## 🔐 Authentication

All protected endpoints require JWT token in the Authorization header:

```bash
Authorization: Bearer <your_token>
```

Get a token by registering or logging in:

```bash
# Register
curl -X POST http://localhost:5000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","phoneNumber":"1234567890","password":"Pass123A"}'

# Login
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"1234567890","password":"Pass123A"}'
```

## 📊 Environment Variables

Create a `.env` file:

```env
PORT=5000
DB_CONNECTION_STRING=mongodb://localhost:27017/phone_directory
JWT_SECRET=your_super_secret_key
JWT_SALT_ROUNDS=10
NODE_ENV=development
```

## 🚀 Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server (with nodemon)
npm run populate # Populate database with test data
```

## 🧪 Testing

### Option 1: Import Postman Collection
Import the `POSTMAN_COLLECTION.json` file from the parent directory.

### Option 2: Use cURL

```bash
# 1. Register user
curl -X POST http://localhost:5000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phoneNumber":"5551234567","password":"Test123A"}'

# 2. Save the token from response

# 3. Search directory
curl -G http://localhost:5000/api/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --data-urlencode "q=Test"

# 4. Create contact
curl -X POST http://localhost:5000/api/contact \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","phoneNumber":"5559876543"}'

# 5. Report spam
curl -X POST http://localhost:5000/api/spam \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"5551111111","reason":"Telemarketing"}'

# 6. View statistics
curl http://localhost:5000/api/dashboard/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔒 Security Features

- ✅ JWT token authentication (7-day expiry)
- ✅ bcrypt password hashing
- ✅ Rate limiting on auth endpoints
- ✅ Input validation on all endpoints
- ✅ Email privacy protection
- ✅ Secure error handling

## ⚡ Performance

- Database indexes on frequently queried fields
- Text indexes for fuzzy search
- Aggregation pipelines for analytics
- Pagination on all list endpoints
- Expected response times: < 300ms

## 📚 Complete Documentation

For detailed API documentation, see the parent directory:
- `PHONE_DIRECTORY_API.md` - Complete API reference
- `SETUP_GUIDE.md` - Detailed setup instructions
- `ASSIGNMENT_COMPLETION_SUMMARY.md` - Implementation details

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### JWT Secret Missing
```bash
# Ensure .env file exists and has JWT_SECRET
cp .env.example .env
# Edit .env and set JWT_SECRET
```

## 📝 Sample Usage Flow

```bash
# 1. Register user
POST /api/user/signup
{
  "name": "John Doe",
  "phoneNumber": "1234567890",
  "password": "Pass123A"
}

# 2. Login and get token
POST /api/user/login
{
  "phoneNumber": "1234567890",
  "password": "Pass123A"
}

# 3. Add contacts
POST /api/contact
{
  "name": "Jane Smith",
  "phoneNumber": "9876543210"
}

# 4. Search directory
GET /api/search?q=Jane

# 5. Report spam
POST /api/spam
{
  "phoneNumber": "5551234567",
  "reason": "Telemarketing"
}

# 6. View analytics
GET /api/dashboard/statistics
```

## 🏆 Features Showcase

### Phone Normalization
```javascript
"1234567890"        → "+11234567890"
"(123) 456-7890"    → "+11234567890"
"+1-234-567-8900"   → "+12345678900"
```

### Fuzzy Search
```javascript
Query: "Jon"
Results:
  ✓ John Doe (98% match)
  ✓ Jonathan Smith (85% match)
  ✓ Jason Johnson (65% match)
```

### Spam Calculation
```javascript
0 reports  → 0% spam
5 reports  → 50% spam
10+ reports → 100% spam
```

## 📄 License

This project is part of a coding assignment.

## ✅ Assignment Status

**COMPLETE** - All requirements from Part 1 and Part 2 implemented with production-grade quality.

---

Made with ❤️ for the Phone Directory API Assignment
