# Firebase Cloud Functions - Session Management API

A serverless backend built with Firebase Cloud Functions for managing training sessions. Provides REST endpoints to create, retrieve, update, and list sessions with authentication and validation.

## What This Does

This project gives you HTTP endpoints to manage training sessions stored in Firestore. All endpoints require authentication using a Bearer token in the Authorization header.

## Getting Started

You'll need:
- Pull the project
- Node.js 18 or higher
- A Firebase project (create one at [console.firebase.google.com](https://console.firebase.google.com))

### Setup Steps

1. Clone the repo and go into the project folder
2. Install dependencies:
   ```bash
   cd functions
   npm install
   ```
3. Set up Firebase project ID in `.firebaserc`:
   ```json
   {
     "projects": {
       "default": "project-id"
     }
   }
   ```
4. Set the API key environment variable. For local development, create a `.env` file in the `functions` directory 
    using the .env.example:
   ```
   API_KEY=api-key
   ```

## Running Locally

Build the TypeScript code:
```bash
cd functions
npm run build
```

Run tests:
```bash
npm test
```

Start the Firebase emulators:
```bash
firebase emulators:start
```

This starts:
- Functions on port 5001
- Firestore on port 8080
- Emulator UI on port 4000

Test endpoints at `http://localhost:5001/medverse-826dc/us-central1/...`

## Deploying

Deploy everything:
```bash
firebase deploy
```

Or deploy just functions:
```bash
firebase deploy --only functions
```

Or just Firestore rules:
```bash
firebase deploy --only firestore:rules
```

## API Usage

All endpoints need authentication. Send API key in the Authorization header like this:
```
Authorization: Bearer api-key
```

### Base URLs

- **Production**: `https://us-central1-medverse-826dc.cloudfunctions.net`
- **Local**: `http://localhost:5001/medverse-826dc/us-central1`

### Response Format

Success responses look like:
```json
{
  "success": true,
  "data": { ... }
}
```

Error responses look like:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

## Endpoints

### Create Session

Creates a new session

**POST** `/createSession`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "region": "eu-central"
}
```

**Valid regions:** `eu-central`, `us-east`, `us-west`, `ap-southeast`

**Response:** 201 Created
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "region": "eu-central",
    "status": "pending",
    "createdAt": { "seconds": 1234567890, "nanoseconds": 0 },
    "updatedAt": { "seconds": 1234567890, "nanoseconds": 0 }
  }
}
```

---

### Get Session

Get a session by its ID.

**GET** `/getSession?sessionId=550e8400-e29b-41d4-a716-446655440000`

**Response:** 200 OK
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "region": "eu-central",
    "status": "active",
    "createdAt": { ... },
    "updatedAt": { ... }
  }
}
```

**Errors:**
- 400 - Invalid session ID
- 401 - Missing or invalid API key
- 404 - Session not found

---

### Update Session Status

Update a session's status.

**PATCH** or **POST** `/updateSessionStatus?sessionId=550e8400-e29b-41d4-a716-446655440000`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "status": "active"
}
```

You can also put the sessionId in the body instead of the query:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "active"
}
```

**Valid statuses:** `pending`, `active`, `completed`, `failed`

**Response:** 200 OK with updated session data

**Errors:**
- 400 - Invalid status or session ID
- 401 - Missing or invalid API key
- 404 - Session not found

---

### List Sessions

Get a list of sessions with optional filters and pagination.

**GET** `/listSessions?status=active&region=eu-central&limit=20&offset=0`

**Query parameters:**
- `status` (optional) - Filter by status: `pending`, `active`, `completed`, `failed`
- `region` (optional) - Filter by region
- `limit` (optional) - Results per page, 1-100 (default: 50)
- `offset` (optional) - Number to skip (default: 0)

**Response:** 200 OK
```json
{
  "success": true,
  "data": [
    {
      "sessionId": "550e8400-e29b-41d4-a716-446655440000",
      "region": "eu-central",
      "status": "active",
      "createdAt": { ... },
      "updatedAt": { ... }
    }
  ],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0
  }
}
```

**Errors:**
- 400 - Invalid query parameters
- 401 - Missing or invalid API key

## Testing

Run the test suite:
```bash
cd functions
npm test
```

Watch mode:
```bash
npm run test:watch
```

## Notes

- Authentication uses Bearer tokens in the Authorization header
- Custom errors for a better response and lower bundle weight
- All errors return consistent JSON format with codes and messages
- TypeScript strict mode is enabled for better type safety
- As long as there is only one .env variable, no need to implement 
  validation mechanism. But could be improved
