# Phone Directory Backend API

A comprehensive REST API for managing a global phone directory with features including user registration, contact management, spam reporting, fuzzy search, and interaction tracking dashboard.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Database Models](#database-models)

## Features

### Part 1: Core API Features
- ✅ User registration and authentication with phone number
- ✅ Auto-account creation on login if user doesn't exist
- ✅ Contact management (create, read, delete)
- ✅ Spam reporting system
- ✅ Advanced search with fuzzy matching on names
- ✅ Exact phone number search
- ✅ Phone number normalization (supports with/without country codes)
- ✅ Spam likelihood calculation
- ✅ Pagination and de-duplication of results
- ✅ Secure authentication with JWT tokens

### Part 2: User Interaction Dashboard
- ✅ Track interactions (calls, messages, spam reports)
- ✅ Recent interactions with filtering
- ✅ Top contacts identification
- ✅ Spam report analytics and statistics
- ✅ Daily activity trends
- ✅ Interaction type aggregation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing, rate limiting
- **Logging**: Winston

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd workspace
```

2. **Install dependencies**
```bash
cd server
npm install
```

3. **Configure environment variables**
Create a `.env` file in the `server` directory:
```env
PORT=5000
DB_CONNECTION_STRING=mongodb://localhost:27017/phone_directory
JWT_SECRET=your_secret_key_here
JWT_SALT_ROUNDS=10
```

4. **Start the server**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check

#### GET /api/health
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Phone Directory API is running",
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

---

## Authentication

All endpoints except `/api/user/signup` and `/api/user/login` require authentication.

**Include the JWT token in the Authorization header:**
```
Authorization: Bearer <your_token>
```

---

## User Management

### POST /api/user/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "phoneNumber": "1234567890",
  "password": "Password123",
  "email": "john@example.com"  // Optional
}
```

**Response (201):**
```json
{
  "status": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "phoneNumber": "+11234567890",
      "email": "john@example.com"
    }
  },
  "messages": ["User registered successfully"]
}
```

**Error Responses:**
- `400`: Validation errors (missing fields, weak password, duplicate phone/email)
- `500`: Internal server error

**Phone Number Normalization:**
- Numbers without country code get default prefix (+1)
- Example: "1234567890" → "+11234567890"
- Accepts formats: "123-456-7890", "(123) 456-7890", "+1 123 456 7890"

---

### POST /api/user/login
Login existing user or auto-create account if phone doesn't exist.

**Request Body:**
```json
{
  "phoneNumber": "1234567890",
  "password": "Password123",
  "name": "John Doe"  // Required only if creating new account
}
```

**Response (200 - existing user):**
```json
{
  "status": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "phoneNumber": "+11234567890",
      "email": "john@example.com"
    }
  },
  "messages": ["Login successful"]
}
```

**Response (201 - new account created):**
```json
{
  "status": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "phoneNumber": "+11234567890",
      "email": null
    }
  },
  "messages": ["Account created and logged in successfully"]
}
```

**Error Responses:**
- `400`: Missing required fields or validation errors
- `401`: Incorrect password
- `500`: Internal server error

---

### GET /api/user/profile
Get current user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "status": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "phoneNumber": "+11234567890",
      "email": "john@example.com",
      "spamReportsReceived": 0,
      "contactsCount": 15
    }
  }
}
```

---

## Contact Management

### POST /api/contact
Create a new contact for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "phoneNumber": "9876543210",
  "email": "jane@example.com"  // Optional
}
```

**Response (201):**
```json
{
  "status": true,
  "data": {
    "contact": {
      "id": "uuid-here",
      "name": "Jane Smith",
      "phoneNumber": "+19876543210",
      "email": "jane@example.com",
      "spamLikelihood": 0
    }
  },
  "messages": ["Contact created successfully"]
}
```

**Error Responses:**
- `400`: Missing required fields or duplicate contact
- `401`: Unauthorized
- `500`: Internal server error

---

### GET /api/contact
Get all contacts for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200):**
```json
{
  "status": true,
  "data": {
    "contacts": [
      {
        "id": "uuid-1",
        "name": "Jane Smith",
        "phoneNumber": "+19876543210",
        "email": "jane@example.com",
        "spamLikelihood": 0
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalContacts": 45,
      "limit": 20
    }
  }
}
```

---

### DELETE /api/contact/:id
Delete a contact by ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "status": true,
  "messages": ["Contact deleted successfully"]
}
```

**Error Responses:**
- `404`: Contact not found
- `401`: Unauthorized
- `500`: Internal server error

---

## Spam Reporting

### POST /api/spam
Report a phone number as spam.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "phoneNumber": "5551234567",
  "reason": "Telemarketing calls"  // Optional
}
```

**Response (201):**
```json
{
  "status": true,
  "data": {
    "report": {
      "phoneNumber": "+15551234567",
      "reason": "Telemarketing calls",
      "reportedAt": "2025-10-29T12:00:00.000Z"
    }
  },
  "messages": ["Spam report submitted successfully"]
}
```

**Error Responses:**
- `400`: Missing phone number or already reported by user
- `401`: Unauthorized
- `500`: Internal server error

**Notes:**
- Users can report any phone number, even if not registered
- Duplicate reports from the same user are prevented
- Spam likelihood is calculated as: `min((reportCount / 10) * 100, 100)`

---

### GET /api/spam/stats/:phoneNumber
Get spam statistics for a specific phone number.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "status": true,
  "data": {
    "phoneNumber": "+15551234567",
    "spamReportsCount": 5,
    "spamLikelihood": 50
  }
}
```

---

## Search

### GET /api/search?q=query
Search the global directory by name or phone number.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `q` (required): Search query (name or phone number)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example 1: Name Search**
```
GET /api/search?q=John
```

**Response (200):**
```json
{
  "status": true,
  "data": {
    "results": [
      {
        "id": "uuid-1",
        "name": "John Doe",
        "phoneNumber": "+11234567890",
        "email": "john@example.com",
        "isRegistered": true,
        "spamLikelihood": 0,
        "matchScore": 100,
        "matchType": "starts_with"
      },
      {
        "id": "uuid-2",
        "name": "Johnny Smith",
        "phoneNumber": "+19876543210",
        "email": null,
        "isRegistered": true,
        "spamLikelihood": 10,
        "matchScore": 85,
        "matchType": "starts_with"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalResults": 2,
      "limit": 20
    }
  }
}
```

**Example 2: Phone Number Search**
```
GET /api/search?q=1234567890
```

**Response (200):**
```json
{
  "status": true,
  "data": {
    "results": [
      {
        "id": "uuid-1",
        "name": "John Doe",
        "phoneNumber": "+11234567890",
        "email": "john@example.com",
        "isRegistered": true,
        "spamLikelihood": 0,
        "matchScore": 100
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalResults": 1,
      "limit": 20
    }
  }
}
```

**Search Features:**
- **Fuzzy matching** on names using Levenshtein distance
- **Exact matching** on phone numbers
- Results prioritized by: `starts_with > contains`, then by match score
- Automatic de-duplication of phone numbers
- Email only shown if searcher has the contact
- Combined search across registered users and contacts

**Error Responses:**
- `400`: Missing or empty query
- `401`: Unauthorized
- `500`: Internal server error

---

### GET /api/search/detail/:id
Get detailed information for a specific user or contact.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "status": true,
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "phoneNumber": "+11234567890",
    "email": "john@example.com",
    "isRegistered": true,
    "spamLikelihood": 20,
    "spamReportsCount": 2,
    "recentSpamReports": [
      {
        "reason": "Telemarketing",
        "reportedAt": "2025-10-28T10:00:00.000Z"
      },
      {
        "reason": "Scam call",
        "reportedAt": "2025-10-27T15:30:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**
- `404`: Record not found
- `401`: Unauthorized
- `500`: Internal server error

---

## Dashboard & Analytics

### GET /api/dashboard/interactions/recent
Get recent interactions for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `type` (optional): Filter by type (`call`, `message`, `spam_report`)

**Response (200):**
```json
{
  "status": true,
  "data": {
    "interactions": [
      {
        "id": "interaction-id",
        "initiator": {
          "name": "John Doe",
          "phoneNumber": "+11234567890"
        },
        "receiver": {
          "name": "Jane Smith",
          "phoneNumber": "+19876543210"
        },
        "type": "call",
        "metadata": {
          "duration": 120
        },
        "timestamp": "2025-10-29T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalInteractions": 100,
      "limit": 20
    }
  }
}
```

---

### GET /api/dashboard/contacts/top
Get the most frequently contacted users.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional): Number of top contacts to return (default: 10)

**Response (200):**
```json
{
  "status": true,
  "data": {
    "topContacts": [
      {
        "name": "Jane Smith",
        "phoneNumber": "+19876543210",
        "interactionCount": 45,
        "lastInteraction": "2025-10-29T10:00:00.000Z"
      },
      {
        "name": "Bob Johnson",
        "phoneNumber": "+15551234567",
        "interactionCount": 32,
        "lastInteraction": "2025-10-28T15:30:00.000Z"
      }
    ]
  }
}
```

---

### GET /api/dashboard/spam/reports
Get spam report statistics.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (optional): Start date (ISO format, default: 30 days ago)
- `endDate` (optional): End date (ISO format, default: now)

**Response (200):**
```json
{
  "status": true,
  "data": {
    "reportsMade": {
      "count": 5,
      "reports": [
        {
          "phoneNumber": "+15551234567",
          "reportedUser": {
            "name": "Spam Caller",
            "phoneNumber": "+15551234567"
          },
          "reason": "Telemarketing",
          "reportedAt": "2025-10-28T10:00:00.000Z"
        }
      ]
    },
    "reportsReceived": {
      "count": 2,
      "reports": [
        {
          "reportedBy": {
            "name": "User Name",
            "phoneNumber": "+19998887777"
          },
          "reason": "Wrong number",
          "reportedAt": "2025-10-27T14:00:00.000Z"
        }
      ]
    },
    "topReportedNumbers": [
      {
        "phoneNumber": "+15551234567",
        "reportCount": 25
      }
    ]
  }
}
```

---

### GET /api/dashboard/statistics
Get overall user statistics.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "status": true,
  "data": {
    "totalInteractions": 150,
    "interactionsByType": {
      "call": 80,
      "message": 65,
      "spam_report": 5
    },
    "recentActivity": {
      "last30Days": 45
    },
    "dailyActivityTrend": [
      {
        "date": "2025-10-23",
        "count": 5
      },
      {
        "date": "2025-10-24",
        "count": 8
      }
    ],
    "uniqueContactsCount": 25
  }
}
```

---

### POST /api/dashboard/interaction
Create a new interaction (call or message).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "receiverPhoneNumber": "9876543210",
  "type": "call",
  "metadata": {
    "duration": 120
  }
}
```

**For messages:**
```json
{
  "receiverPhoneNumber": "9876543210",
  "type": "message",
  "metadata": {
    "content": "Hello, how are you?"
  }
}
```

**Response (201):**
```json
{
  "status": true,
  "data": {
    "interaction": {
      "id": "interaction-id",
      "type": "call",
      "timestamp": "2025-10-29T12:00:00.000Z"
    }
  },
  "messages": ["Interaction recorded successfully"]
}
```

**Error Responses:**
- `400`: Missing required fields or invalid type
- `404`: Receiver not found
- `401`: Unauthorized
- `500`: Internal server error

---

## Database Models

### User
```javascript
{
  id: String (UUID),
  name: String (required),
  phoneNumber: String (required, unique),
  email: String (optional, unique),
  password: String (hashed, required),
  contacts: [ObjectId ref Contact],
  spamReportsReceived: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Contact
```javascript
{
  id: String (UUID),
  name: String (required),
  phoneNumber: String (required),
  email: String (optional),
  owner: ObjectId ref User (required),
  registeredUser: ObjectId ref User (optional),
  spamLikelihood: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### SpamReport
```javascript
{
  phoneNumber: String (required),
  reportedBy: ObjectId ref User (required),
  reportedUser: ObjectId ref User (optional),
  reason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Interaction
```javascript
{
  initiator: ObjectId ref User (required),
  receiver: ObjectId ref User (required),
  type: String (enum: ['call', 'message', 'spam_report']),
  metadata: {
    duration: Number,      // for calls
    content: String,       // for messages
    reason: String         // for spam reports
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Security Features

1. **JWT Authentication**: All protected endpoints require valid JWT tokens
2. **Password Hashing**: Bcrypt with configurable salt rounds
3. **Rate Limiting**: Prevents brute force attacks
4. **Input Validation**: Comprehensive validation on all endpoints
5. **Phone Number Normalization**: Consistent formatting across the system
6. **Email Privacy**: Email only visible if searcher has the contact

---

## Performance Optimizations

1. **Database Indexes**: Optimized queries with compound indexes
2. **Text Search**: MongoDB text indexes for efficient name search
3. **Pagination**: All list endpoints support pagination
4. **De-duplication**: Search results automatically de-duplicated
5. **Aggregation Pipelines**: Efficient analytics queries

---

## Error Handling

All errors follow a consistent format:

```json
{
  "status": false,
  "errors": ["Error message here"]
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Testing

You can test the API using tools like:
- **Postman**: Import the provided collection
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension

### Example cURL Request

```bash
# Register a user
curl -X POST http://localhost:5000/api/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phoneNumber": "1234567890",
    "password": "Password123",
    "email": "john@example.com"
  }'

# Search for a contact
curl -X GET "http://localhost:5000/api/search?q=John" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

---

## License

This project is licensed under the MIT License.
