# Getting Started with Phone Directory API

This guide will help you set up and run the Phone Directory API in minutes.

## Prerequisites

Before you begin, ensure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)
- **Git** (optional)

## Step 1: Installation

### Option A: From Cloned Repository
```bash
cd phone-directory-api
npm install
```

### Option B: Fresh Setup
```bash
mkdir phone-directory-api
cd phone-directory-api
# Copy all files from this directory
npm install
```

## Step 2: Database Setup

### Start MongoDB

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

### Verify MongoDB is Running
```bash
mongo --eval "db.version()"
# Should print MongoDB version
```

## Step 3: Environment Configuration

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
DB_CONNECTION_STRING=mongodb://localhost:27017/phone_directory
JWT_SECRET=change_this_to_a_secure_random_string
JWT_SALT_ROUNDS=10
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

## Step 4: Start the Server

```bash
npm start
```

You should see:
```
✓ Database connected successfully
✓ Server is running on port 5000
✓ Environment: development
✓ API Base URL: http://localhost:5000/api
✓ Health Check: http://localhost:5000/health
```

## Step 5: Verify Installation

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Phone Directory API is running",
  "timestamp": "2025-10-29T12:00:00.000Z",
  "uptime": 5.123
}
```

## Step 6: Create Your First User

Register a new user:
```bash
curl -X POST http://localhost:5000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phoneNumber": "5551234567",
    "password": "Test123A",
    "email": "test@example.com"
  }'
```

Save the `token` from the response - you'll need it for authenticated requests.

## Step 7: Test an Authenticated Endpoint

Using the token from Step 6:
```bash
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Optional: Populate Test Data

Generate realistic test data:
```bash
npm run populate
```

This creates:
- 50 users (password: `Password123`)
- 500+ contacts
- 100 spam reports
- 200 interactions

You can now login with any generated phone number!

## Next Steps

### 1. Import Postman Collection
- Open Postman
- Import `POSTMAN_COLLECTION.json`
- Set `baseUrl` variable to `http://localhost:5000/api`
- Test all 17 endpoints

### 2. Read the Documentation
- `API_DOCUMENTATION.md` - Complete API reference
- `README.md` - Project overview and features

### 3. Explore the API

Try these common operations:

**Create a contact:**
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","phoneNumber":"5559876543"}'
```

**Search the directory:**
```bash
curl -G http://localhost:5000/api/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --data-urlencode "q=Jane"
```

**Report spam:**
```bash
curl -X POST http://localhost:5000/api/spam \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"5551111111","reason":"Telemarketing"}'
```

**View statistics:**
```bash
curl http://localhost:5000/api/dashboard/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Issue: "MongoDB connection failed"
**Solution:**
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Issue: "JWT_SECRET not found"
**Solution:**
- Ensure `.env` file exists in project root
- Check that `JWT_SECRET` is set in `.env`

### Issue: "Port 5000 already in use"
**Solution:**
- Kill the process: `lsof -ti:5000 | xargs kill -9`
- Or change PORT in `.env`

### Issue: "Module not found"
**Solution:**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

## Development Mode

For development with auto-restart on file changes:
```bash
npm run dev
```

## Production Deployment

For production:
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Use MongoDB Atlas or a managed database
4. Enable HTTPS/TLS
5. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name phone-directory-api
   ```

## Support

For issues or questions:
1. Check `API_DOCUMENTATION.md` for endpoint details
2. Review error logs in `logs/` directory
3. Test with Postman collection
4. Verify MongoDB connection

## What's Next?

- Explore all 17 API endpoints
- Build a frontend application
- Customize for your use case
- Deploy to production

Happy coding! 🚀
