# Quick Setup Guide

Follow these steps to get the Zanika backend running.

## Step 1: Prerequisites

- Node.js v14+ installed
- Supabase account
- A Supabase project created

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Create Supabase Database

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select existing one
3. Go to **SQL Editor**
4. Create a new query
5. Copy the entire content from `migrations/001_initial_schema.sql`
6. Paste and run the query
7. Verify that `users` and `orders` tables are created

## Step 4: Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_KEY`

## Step 5: Configure Environment Variables

1. Create `.env` file in the project root:

```bash
cp .env.example .env
```

2. Edit `.env` and add your values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key_here
JWT_SECRET=your_super_secret_key_at_least_32_characters_long
PORT=5000
NODE_ENV=development
```

### Generating JWT_SECRET

Use this command to generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 6: Start the Server

```bash
npm run dev
```

You should see:
```
Server running on port 5000
Environment: development
```

## Step 7: Test the API

### Test Sign Up

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "name": "Test User",
    "phone": "9876543210"
  }'
```

You should get back a token. Save it!

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

### Test Schedule Order

Replace `YOUR_TOKEN` with the token from signup/login:

```bash
curl -X POST http://localhost:5000/api/orders/schedule \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "latitude": 17.3850,
    "longitude": 78.4867,
    "wasteTypes": ["Paper", "Plastic"],
    "pickupDate": "2026-05-30",
    "pickupTime": "14:30",
    "mobileNumber": "9876543210"
  }'
```

### Test Get My Orders

```bash
curl -X GET http://localhost:5000/api/orders/my-orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Get All Orders

```bash
curl -X GET http://localhost:5000/api/admin/all-orders
```

## Step 8: Verify Everything Works

- All endpoints return `{ "success": true, ... }`
- Authentication endpoints return a token
- Protected endpoints work with valid token
- Protected endpoints return 401 without token

## Troubleshooting

### Port Already in Use

If port 5000 is in use, change it in `.env`:
```env
PORT=5001
```

### Supabase Connection Error

- Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
- Make sure the database tables exist (run migration again if needed)
- Check that the Supabase project is active

### JWT Token Invalid

- Ensure `JWT_SECRET` is set and consistent
- Token has 24-hour expiry, sign up again if expired

### CORS Issues

CORS is enabled for all origins. If you need to restrict it, modify `server.js`:

```javascript
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

## Next Steps

- Set up authentication on the frontend
- Create a `.env.production` for production deployment
- Add additional validation as needed
- Consider adding role-based access control for admin endpoints
