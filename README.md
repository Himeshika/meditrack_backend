# MediTrack — Backend

A RESTful API for **MediTrack**, a patient medical record management system. Built with Express 5, TypeScript, and MongoDB, featuring JWT-based authentication, role-based access control, and Cloudinary image uploads.

**Live API:** https://meditrack-backend-rho.vercel.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs |
| File Uploads | Multer + Cloudinary |
| Testing | Jest + Supertest + mongodb-memory-server |
| Dev Server | ts-node-dev |

---

## Project Structure

```
meditrack_backend/
├── src/
│   ├── index.ts              # Entry point — Express app & MongoDB connection
│   ├── middleware/
│   │   ├── authMiddleware.ts  # JWT verification (AuthRequest)
│   │   └── roleMiddleware.ts  # Role-based access control factory
│   ├── models/
│   │   ├── User.ts            # User model + interface
│   │   └── Patient.ts         # Patient record model + interface
│   ├── controllers/
│   │   ├── authController.ts  # register, login, getMe
│   │   └── patientController.ts # CRUD + image upload
│   └── routes/
│       ├── authRoutes.ts
│       └── patientRoutes.ts
├── package.json
├── tsconfig.json
└── .env
```

---

## Prerequisites

- Node.js v18+
- npm
- A MongoDB connection string (MongoDB Atlas recommended)
- A Cloudinary account (for image uploads)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Himeshika/meditrack_backend.git
cd meditrack_backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/meditrack
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the development server

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload (`ts-node-dev`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled production build |
| `npm test` | Run all Jest test suites |
| `npm run test:watch` | Run tests in watch mode |

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/auth/me` | Protected | Get the authenticated user's profile |

### Patients — `/api/patients`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/patients` | Protected | Get all patient records |
| GET | `/api/patients/:id` | Protected | Get a single patient by ID |
| POST | `/api/patients` | Protected | Create a new patient record |
| PUT | `/api/patients/:id` | Protected | Update a patient record |
| DELETE | `/api/patients/:id` | Admin | Delete a patient record |
| POST | `/api/patients/:id/upload` | Protected | Upload a medical image to Cloudinary |

---

## Authentication

All protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are issued on login and contain the user's `id` and `role`. Role-based access is enforced with a `roleMiddleware(...allowedRoles)` factory applied at the route level.

---

## Response Format

All API responses follow a consistent shape:

```json
{
  "message": "Success message",
  "data": { }
}
```

Error responses include an appropriate HTTP status code and a `message` field explaining the error.

---

## Testing

Tests use **Jest** with **Supertest** for HTTP assertions and **mongodb-memory-server** for an in-memory database — no real MongoDB connection required.

```bash
npm test
```

---

## Deployment

The backend is deployed on **Vercel**. The `dist/` build output is served in production. Ensure all environment variables listed above are set in your Vercel project settings.
