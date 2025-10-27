# Rentopia Backend (scaffold)

This is a minimal Express + TypeScript backend scaffold for Rentopia.

Features included:
- TypeScript
- MongoDB connection via Mongoose
- Basic User model
- Auth routes: signup and login (JWT Bearer tokens)

Quick start

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:

```powershell
cd backend
npm install
```

3. Run in development:

```powershell
npm run dev
```

Endpoints
- POST /auth/signup
- POST /auth/login

Next steps
- Add property models & CRUD
- Add saved-properties, messages and conversations
- Add input validation, tests and rate limiting
