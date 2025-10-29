# Phone Directory API - Setup Guide

Complete setup guide for the Phone Directory Backend API assignment.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Git

## Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd workspace
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
DB_CONNECTION_STRING=mongodb://localhost:27017/phone_directory
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_SALT_ROUNDS=10
```

**Important Security Notes:**
- Change `JWT_SECRET` to a strong, random string in production
- Never commit the `.env` file to version control
- Use a secure MongoDB connection string with authentication in production

### 4. Start MongoDB

Ensure MongoDB is running on your system:

**On Linux/Mac:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**On Windows:**
```bash
net start MongoDB
```

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 5. Start the Server

```bash
npm start
```

The server will start on `http://localhost:5000`

You should see:
```
Server is running on port 5000
Database connected!
```

## Database Population (Optional)

To populate the database with test data for easier testing:

```bash
npm run populate
```

This will create:
- 50 test users
- ~500 contacts
- 100 spam reports
- 200 interactions

All test users have the password: `Password123`

## Testing the API

### Option 1: Using Postman

1. Import the Postman collection:
   - Open Postman
   - Click "Import"
   - Select `POSTMAN_COLLECTION.json` from the root directory

2. Update the `baseUrl` variable if needed (default: `http://localhost:5000/api`)

3. Run requests in order:
   - Health Check
   - User Signup/Login
   - Create Contacts
   - Search
   - Dashboard queries

### Option 2: Using cURL

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**User Signup:**
```bash
curl -X POST http://localhost:5000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phoneNumber": "1234567890",
    "password": "Password123",
    "email": "john@example.com"
  }'
```

Save the returned token for subsequent requests.

**Search (with token):**
```bash
curl -X GET "http://localhost:5000/api/search?q=John" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 3: Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Import the Postman collection JSON
3. Test the endpoints

## Project Structure

```
workspace/
├── server/
│   ├── controllers/         # Request handlers
│   │   ├── userController.js
│   │   ├── contactController.js
│   │   ├── spamController.js
│   │   ├── searchController.js
│   │   └── dashboardController.js
│   ├── models/             # Database schemas
│   │   ├── User.js
│   │   ├── Contact.js
│   │   ├── SpamReport.js
│   │   └── Interaction.js
│   ├── routes/             # API routes
│   │   ├── userRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── spamRoutes.js
│   │   ├── searchRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/         # Custom middleware
│   │   └── authMiddleware.js
│   ├── utils/             # Utility functions
│   │   ├── logger.js
│   │   └── limiter.js
│   ├── scripts/           # Utility scripts
│   │   └── populateData.js
│   ├── index.js           # Entry point
│   ├── package.json
│   └── .env              # Environment variables
├── PHONE_DIRECTORY_API.md  # Complete API documentation
├── POSTMAN_COLLECTION.json # Postman collection
└── SETUP_GUIDE.md         # This file
```

## API Endpoints Overview

### User Management
- `POST /api/user/signup` - Register new user
- `POST /api/user/login` - Login or auto-create account
- `GET /api/user/profile` - Get user profile

### Contact Management
- `POST /api/contact` - Create contact
- `GET /api/contact` - List contacts
- `DELETE /api/contact/:id` - Delete contact

### Spam Reporting
- `POST /api/spam` - Report spam
- `GET /api/spam/stats/:phoneNumber` - Get spam stats

### Search
- `GET /api/search?q=query` - Search by name/phone
- `GET /api/search/detail/:id` - Get detailed info

### Dashboard & Analytics
- `GET /api/dashboard/interactions/recent` - Recent interactions
- `GET /api/dashboard/contacts/top` - Top contacts
- `GET /api/dashboard/spam/reports` - Spam analytics
- `GET /api/dashboard/statistics` - Overall statistics
- `POST /api/dashboard/interaction` - Record interaction

## Features Implemented

### Part 1: Core API Features ✅
- [x] User registration with phone number as unique identifier
- [x] Auto-account creation on login if phone doesn't exist
- [x] Contact management (CRUD operations)
- [x] Spam reporting for any phone number
- [x] Phone number normalization (handles with/without country codes)
- [x] Advanced search with fuzzy matching on names
- [x] Exact phone number search
- [x] Spam likelihood calculation
- [x] Result ranking and pagination
- [x] JWT-based authentication
- [x] Comprehensive error handling

### Part 2: User Interaction Dashboard ✅
- [x] Interaction tracking (calls, messages, spam reports)
- [x] Recent interactions with filtering
- [x] Top contacts identification
- [x] Spam report aggregation
- [x] Daily activity trends
- [x] Interaction type statistics
- [x] Date range filtering

## Best Practices Implemented

### Security
- ✅ Password hashing with bcrypt
- ✅ JWT authentication on all protected routes
- ✅ Rate limiting on auth endpoints
- ✅ Input validation and sanitization
- ✅ Email privacy (only shown if in contacts)

### Performance
- ✅ Database indexes on frequently queried fields
- ✅ Compound indexes for complex queries
- ✅ Text indexes for fuzzy search
- ✅ Pagination on all list endpoints
- ✅ Efficient aggregation pipelines

### Code Quality
- ✅ Modular architecture (MVC pattern)
- ✅ Consistent error handling
- ✅ Comprehensive logging with Winston
- ✅ Clean code with comments
- ✅ RESTful API design

### Scalability
- ✅ MongoDB with proper indexing
- ✅ Efficient query optimization
- ✅ De-duplication of search results
- ✅ Aggregation for analytics

## Common Issues & Solutions

### Issue 1: MongoDB Connection Error
**Error:** `MongoNetworkError: failed to connect to server`

**Solution:**
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Issue 2: JWT Secret Not Found
**Error:** `JWT_SECRET not found`

**Solution:**
- Ensure `.env` file exists in `server/` directory
- Copy from `.env.example`: `cp .env.example .env`
- Set a strong JWT_SECRET value

### Issue 3: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
- Kill the process using port 5000:
  ```bash
  # Linux/Mac
  lsof -ti:5000 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```
- Or change PORT in `.env`

### Issue 4: Population Script Fails
**Error:** `Error: DB_CONNECTION_STRING not found`

**Solution:**
- Ensure `.env` file is in `server/` directory
- Run from server directory: `cd server && npm run populate`

## Testing Checklist

- [ ] Health check endpoint works
- [ ] User signup with valid data
- [ ] User login with correct credentials
- [ ] Auto-account creation on login
- [ ] Create contact
- [ ] List contacts with pagination
- [ ] Delete contact
- [ ] Report spam
- [ ] Search by name (fuzzy matching)
- [ ] Search by phone number
- [ ] Get search detail
- [ ] Recent interactions
- [ ] Top contacts
- [ ] Spam analytics
- [ ] Statistics dashboard
- [ ] Record new interaction

## Performance Benchmarks

Expected performance (with 10,000 users):
- User signup: < 500ms
- Login: < 200ms
- Search by name: < 300ms
- Search by phone: < 100ms
- Create contact: < 150ms
- Dashboard queries: < 500ms

## Production Deployment Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS/TLS
- [ ] Set up proper CORS
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Use environment-specific configs
- [ ] Set up backup strategy
- [ ] Configure error tracking (e.g., Sentry)

## Additional Resources

- **Complete API Documentation:** See `PHONE_DIRECTORY_API.md`
- **Postman Collection:** Import `POSTMAN_COLLECTION.json`
- **MongoDB Documentation:** https://docs.mongodb.com/
- **Express.js Documentation:** https://expressjs.com/
- **JWT Documentation:** https://jwt.io/

## Support

For issues or questions:
1. Check the API documentation
2. Review error logs in `server/logs/`
3. Test with Postman collection
4. Check MongoDB connection and data

## License

This project is part of a coding assignment.
