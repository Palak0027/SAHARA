# 🤝 SAHARA

> **"Give What You Can, Get What You Need"**  
> A modern mutual aid, donation management, and community resource distribution platform designed to bridge the gap between donors and those in need.

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Structure](#-project-architecture--structure)
- [Prerequisites](#-prerequisites)
- [Getting Started & Installation](#-getting-started--installation)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend (Client) Setup](#2-frontend-client-setup)
- [Running the Project](#-running-the-project)
  - [Option A: Running Separately (Recommended for debugging)](#option-a-running-separately-recommended-for-debugging)
  - [Option B: Running from Root Directory](#option-b-running-from-root-directory)
- [Environment Configuration](#-environment-configuration)
- [Production Build](#-production-build)
- [Development Guidelines](#-development-guidelines)

---

## 📖 About the Project

**SAHARA** is an open, transparent community aid system. It provides a structured workflow for:
1. **Donors**: Listing items, funds, or services they want to donate.
2. **Beneficiaries**: Submitting requests for specific needs or essential supplies.
3. **Volunteers & Admins**: Managing inventory, verifying requests, matching donations to requests, and tracking physical/logistical distribution.

---

## ✨ Key Features

- **Authentication & Roles**: Secure JWT-based auth with Role-Based Access Control (Admin, Volunteer, Donor, Recipient).
- **Donation Management**: Real-time listing, categorizing, and status updates for donated goods.
- **Request Tracking**: Need requests categorized by urgency (Low, Medium, High, Critical).
- **Volunteer Coordination**: Assigning pickups and deliveries to ground volunteers.
- **Reports & Analytics**: Visual insights on donations received, items disbursed, and pending needs.

---

## 🛠 Tech Stack

### Frontend (Client)
- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend (Server)
- **Runtime & Framework**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) ODM
- **Security**: [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Authentication**: JSON Web Tokens ([jsonwebtoken](https://github.com/auth0/node-jsonwebtoken))
- **Validation**: [express-validator](https://express-validator.github.io/)
- **API Documentation**: [Swagger](https://swagger.io/) (`swagger-jsdoc` & `swagger-ui-express`)

---

## 📁 Project Architecture & Structure

The codebase is organized into a modular enterprise pattern inspired by clean architecture:

```text
SAHARA/
├── backend/                        # Node.js + Express + MongoDB REST API
│   ├── docs/                       # API docs and schemas
│   ├── uploads/                    # User uploaded images & receipts
│   ├── src/
│   │   ├── config/                 # DB connection (Mongoose), Swagger, & permission settings
│   │   ├── controllers/            # HTTP request/response handlers
│   │   ├── middlewares/            # Auth guards, role checks & error handlers
│   │   │   └── validators/         # Input validation schemas (express-validator)
│   │   ├── models/                 # Mongoose schemas & data models
│   │   ├── repository/             # Database access layer
│   │   ├── routes/                 # Express API endpoints routing
│   │   ├── services/               # Core business logic
│   │   ├── utils/                  # Response formatters, ApiError, helpers
│   │   │   └── email/              # Email/Notification templates
│   │   └── server.js               # Backend entry point
│   ├── .env.example                # Sample backend environment keys
│   ├── .gitignore                  # Backend git ignore file
│   └── package.json                # Backend dependencies & npm scripts
│
├── client/                         # React + Vite + Tailwind CSS v4 Frontend
│   ├── public/                     # Static media & assets
│   │   └── img/                    # Logos, banners, illustrations
│   ├── src/
│   │   ├── assets/                 # SVGs, icons, static imports
│   │   ├── components/             # Reusable UI widgets
│   │   │   ├── common/             # Modals, Dropdowns, Pagination, Loaders
│   │   │   └── layout/             # Navbar, Sidebar, Footer
│   │   ├── context/                # Global state (AuthContext, AlertContext)
│   │   ├── hooks/                  # Custom React hooks (useAuth, useValidation)
│   │   ├── pages/                  # Route views (Auth, Dashboard, Donations, etc.)
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── donations/
│   │   │   ├── inventory/
│   │   │   ├── reports/
│   │   │   ├── requests/
│   │   │   ├── settings/
│   │   │   └── volunteers/
│   │   ├── routes/                 # Navigation paths and Route definitions
│   │   ├── services/               # Frontend API calls & Axios client
│   │   │   └── api/                # Endpoints, interceptors, types
│   │   ├── shared/                 # Shared TypeScript models and constants
│   │   ├── styles/                 # Tailwind v4 import & custom styles (index.css)
│   │   ├── utils/                  # Formatting, helpers, local storage
│   │   ├── App.tsx                 # Main root component
│   │   ├── main.tsx                # DOM mount entrypoint
│   │   └── vite-env.d.ts           # Vite TypeScript definitions
│   ├── .env.example                # Sample client environment variables
│   ├── .gitignore                  # Client git ignore file
│   ├── index.html                  # HTML entrypoint
│   ├── package.json                # Client dependencies & scripts
│   ├── tsconfig.json               # TypeScript project reference
│   ├── tsconfig.app.json           # App compilation configuration
│   ├── tsconfig.node.json          # Node/Vite build config
│   └── vite.config.ts              # Vite + Tailwind v4 bundler config
│
├── .gitignore                      # Git ignore rules for the entire repository
└── README.md                       # Main documentation file (this document)
```

---

## 💻 Prerequisites

Ensure you have the following installed on your system before proceeding:
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (bundled with Node.js)
- **MongoDB**: Local MongoDB Community Server (`v6.0+`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster

---

## 🚀 Getting Started & Installation

### 1. Backend Setup

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create your local environment configuration:
   ```bash
   cp .env.example .env
   # On Windows PowerShell:
   # Copy-Item .env.example .env
   ```

4. Configure your `.env` file with your MongoDB connection string:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/sahara_db
   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sahara_db?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   ```

---

### 2. Frontend (Client) Setup

1. In a separate terminal or tab, navigate to the client folder:
   ```bash
   cd client
   ```

2. Install client dependencies:
   ```bash
   npm install
   ```

3. Create the client environment file:
   ```bash
   cp .env.example .env
   # On Windows PowerShell:
   # Copy-Item .env.example .env
   ```

4. Verify your `client/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

---

## 🏃 Running the Project

### Option A: Running Separately (Recommended for debugging)

#### Start Backend:
```bash
cd backend
npm run dev
```
> Server runs at: **`http://localhost:5000`**  
> API Documentation: **`http://localhost:5000/api-docs`**

#### Start Frontend (Client):
```bash
cd client
npm run dev
```
> Frontend app will open at: **`http://localhost:5173`**

---

### Option B: Running from Root Directory

From the project root (`SAHARA/`):

```bash
# Run both Backend & Frontend concurrently
npm run dev

# Or run specific layers from root:
npm run dev:backend
npm run dev:client
```

---

## ⚙️ Environment Configuration

| Variable | Description | Default | Layer |
|---|---|---|---|
| `PORT` | Backend server port | `5000` | Backend |
| `NODE_ENV` | Application environment (`development` / `production`) | `development` | Backend |
| `MONGODB_URI` | MongoDB connection URI (Local or Atlas) | `mongodb://127.0.0.1:27017/sahara_db` | Backend |
| `JWT_SECRET` | Secret key for signing auth tokens | - | Backend |
| `VITE_API_BASE_URL` | Base URL of backend API for client requests | `http://localhost:5000` | Client |

---

## 📦 Production Build

To test and create an optimized production build of the frontend:

```bash
cd client
npm run build
```
This runs TypeScript checking (`tsc -b`) and builds production-ready bundles inside `client/dist`.

To preview the built production bundle locally:
```bash
npm run preview
```

---

## 📐 Development Guidelines

1. **Separation of Concerns**:
   - Routes (`src/routes/`) define endpoints and connect middlewares.
   - Controllers (`src/controllers/`) parse parameters and format HTTP responses.
   - Services (`src/services/`) handle core business logic.
   - Repositories (`src/repository/`) interact directly with the database.
2. **Client Components**:
   - Keep reusable generic components inside `client/src/components/common/`.
   - Layout elements (Navbars, Sidebars) belong in `client/src/components/layout/`.
   - Pages belong in `client/src/pages/<feature-name>/`.
3. **Styling with Tailwind CSS v4**:
   - Use utility-first classes directly.
   - Global custom theme definitions and tokens can be set in `client/src/styles/index.css`.
4. **Git Hygiene**:
   - Never commit sensitive `.env` files.
   - Empty directories are kept in Git via `.gitkeep`.
