Secure Task Management Dashboard
Overview

This project is part of a full-stack technical assessment to build a secure, type-safe Task Management Dashboard using React, TypeScript, and Node.js.

At the current stage, the backend foundation and authentication system have been implemented. The focus so far has been on establishing a clean architecture, database integration, and secure JWT-based authentication. Task management and frontend integration will follow in subsequent commits.

Project Plan

The development plan is structured in incremental stages:

Backend foundation and database setup

Secure authentication using JWT

Task CRUD functionality

Team and role-based features

Frontend integration with React and TypeScript

UI refinement, state management, and third-party integrations

The repository reflects this progression through structured and descriptive commits.

Project Structure (Current State)
task-dashboard/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
└── README.md

The structure separates responsibilities clearly:

Controllers handle business logic

Routes define API endpoints

Middleware manages authentication

Utils contains shared helpers (e.g., Prisma client)

Types centralize TypeScript interfaces

Implemented Functionality
Backend Setup

Express server configured with TypeScript (strict mode enabled)

Prisma ORM integrated with PostgreSQL

Environment configuration via dotenv

Clean modular architecture

Authentication (JWT)

The authentication system is fully implemented and secured.

Features include:

User registration with password hashing (bcrypt)

User login with credential validation

JWT token generation

Authentication middleware to protect private routes

Type-safe request handling

Environment-based secret management

All protected routes require a valid Bearer token in the Authorization header. Requests without a valid token are rejected.

Running the Project Locally

Clone the repository and navigate to the backend folder:

cd task-dashboard/backend

Install dependencies:

npm install

Create a .env file inside the backend directory with:

DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
PORT=5000

Run Prisma migrations:

npx prisma migrate dev

Start the development server:

npm run dev

The server will run on:

http://localhost:5000

At this stage, authentication endpoints are available and secured.
