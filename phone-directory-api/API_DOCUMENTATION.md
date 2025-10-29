# Phone Directory API - Complete Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📡 API Endpoints

### 1. User Management

#### POST /api/user/signup
Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "phoneNumber": "1234567890",
  "password": "Pass123A",
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

---

#### POST /api/user/login
Login or auto-create account.

**Request:**
```json
{
  "phoneNumber": "1234567890",
  "password": "Pass123A",
  "name": "John Doe"  // Required only for new accounts
}
```

**Response (200 - Existing User):**
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

**Response (201 - New Account Created):**
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

---

#### GET /api/user/profile
Get current user's profile.

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

### 2. Contact Management

#### POST /api/contact
Create a new contact.

**Headers:** `Authorization: Bearer <token>`

**Request:**
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

---

#### GET /api/contact
List all contacts with pagination.

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

#### DELETE /api/contact/:id
Delete a contact by ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "status": true,
  "messages": ["Contact deleted successfully"]
}
```

---

### 3. Spam Reporting

#### POST /api/spam
Report a phone number as spam.

**Headers:** `Authorization: Bearer <token>`

**Request:**
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

---

#### GET /api/spam/stats/:phoneNumber
Get spam statistics for a phone number.

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

### 4. Search

#### GET /api/search?q=query
Search the directory by name or phone number.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `q` (required): Search query (name or phone number)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example - Name Search:**
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

---

#### GET /api/search/detail/:id
Get detailed information for a user or contact.

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
      }
    ]
  }
}
```

---

### 5. Dashboard & Analytics

#### GET /api/dashboard/interactions/recent
Get recent interactions.

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

#### GET /api/dashboard/contacts/top
Get most frequently contacted users.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)

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
      }
    ]
  }
}
```

---

#### GET /api/dashboard/spam/reports
Get spam report statistics.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)

**Response (200):**
```json
{
  "status": true,
  "data": {
    "reportsMade": {
      "count": 5,
      "reports": [...]
    },
    "reportsReceived": {
      "count": 2,
      "reports": [...]
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

#### GET /api/dashboard/statistics
Get overall statistics.

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
        "date": "2025-10-29",
        "count": 12
      }
    ],
    "uniqueContactsCount": 25
  }
}
```

---

#### POST /api/dashboard/interaction
Record a new interaction.

**Headers:** `Authorization: Bearer <token>`

**Request (Call):**
```json
{
  "receiverPhoneNumber": "9876543210",
  "type": "call",
  "metadata": {
    "duration": 120
  }
}
```

**Request (Message):**
```json
{
  "receiverPhoneNumber": "9876543210",
  "type": "message",
  "metadata": {
    "content": "Hello!"
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

---

## Error Responses

All errors follow this format:

```json
{
  "status": false,
  "errors": ["Error message here"]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- **Auth endpoints** (/signup, /login): 5 requests per 15 minutes per IP
- **General endpoints**: 100 requests per 15 minutes per IP

Exceeded rate limits return:
```json
{
  "status": false,
  "errors": ["Too many requests, please try again later"]
}
```

---

## Phone Number Normalization

All phone numbers are automatically normalized:

```
Input: "1234567890"        → Output: "+11234567890"
Input: "(123) 456-7890"    → Output: "+11234567890"
Input: "+1-234-567-8900"   → Output: "+12345678900"
```

Default country code (+1) is added if missing.

---

## Testing

See `README.md` for cURL examples and testing instructions.
