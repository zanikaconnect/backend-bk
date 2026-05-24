# Zanika Backend API

Express.js backend for the Zanika waste management platform with Supabase integration.

## Project Structure

```
zanika-backend/
├── migrations/          # SQL migrations for Supabase
│   └── 001_initial_schema.sql
├── middleware/          # Express middleware
│   ├── authMiddleware.js
│   └── errorHandler.js
├── routes/              # API route handlers
│   ├── auth.js
│   ├── orders.js
│   └── admin.js
├── utils/               # Utility functions
│   └── validators.js
├── server.js            # Main server file
├── package.json         # Dependencies
├── .env.example         # Environment variables template
└── README.md            # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Run the SQL migration from `migrations/001_initial_schema.sql` in the Supabase SQL editor

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Then update with your Supabase credentials:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
JWT_SECRET=your_jwt_secret_min_32_characters
PORT=5000
NODE_ENV=development
```

### 4. Start the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### POST /api/auth/signup
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe",
  "phone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/login
Authenticate user and get JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Orders (Protected - Requires JWT)

#### POST /api/orders/schedule
Schedule a waste pickup.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request:**
```json
{
  "latitude": 17.3850,
  "longitude": 78.4867,
  "wasteTypes": ["Paper", "Plastic"],
  "pickupDate": "2026-05-30",
  "pickupTime": "14:30",
  "mobileNumber": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "latitude": 17.3850,
    "longitude": 78.4867,
    "wasteTypes": ["Paper", "Plastic"],
    "pickupDate": "2026-05-30",
    "pickupTime": "14:30",
    "mobileNumber": "9876543210",
    "created_at": "2026-05-24T10:00:00Z"
  }
}
```

#### GET /api/orders/my-orders
Get all orders for the logged-in user.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "uuid",
      "latitude": 17.3850,
      "longitude": 78.4867,
      "wasteTypes": ["Paper", "Plastic"],
      "pickupDate": "2026-05-30",
      "pickupTime": "14:30",
      "mobileNumber": "9876543210",
      "created_at": "2026-05-24T10:00:00Z"
    }
  ]
}
```

### Admin

#### GET /api/admin/all-orders
Get all orders from the system (no authentication required).

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "uuid",
      "user_email": "user@example.com",
      "latitude": 17.3850,
      "longitude": 78.4867,
      "wasteTypes": ["Paper", "Plastic"],
      "pickupDate": "2026-05-30",
      "pickupTime": "14:30",
      "mobileNumber": "9876543210",
      "created_at": "2026-05-24T10:00:00Z"
    }
  ]
}
```

## Validation Rules

- **Email:** Must be a valid email format
- **Password:** Minimum 8 characters
- **Coordinates:** Latitude -90 to 90, Longitude -180 to 180
- **Pickup Date:** Today or future date only
- **Pickup Time:** HH:MM format (24-hour)
- **Mobile Number:** Exactly 10 digits
- **Waste Types:** Non-empty array of strings

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

**HTTP Status Codes:**
- `400` - Validation error
- `401` - Authentication error
- `404` - Not found
- `500` - Server error

## Security Features

- Password hashing with bcryptjs
- JWT authentication (24-hour expiry)
- Input validation on all endpoints
- Protected routes with authentication middleware
- CORS enabled for cross-origin requests

## Development

To add a new endpoint:

1. Create a route handler in the appropriate file in `routes/`
2. Import it in `server.js`
3. Register it with `app.use()`
4. Add validation using utilities from `utils/validators.js`

## License

MIT
