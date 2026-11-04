# Smart Onboarding — Agency OS · Neirah Tech

> A production-ready **NestJS + Next.js** module that guides new agencies through an intelligent onboarding wizard, profiles their agency type, recommends workspace templates, and auto-generates their entire workspace configuration upon confirmation.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Environment Setup](#environment-setup)
6. [Database Migration & Seed Data](#database-migration--seed-data)
7. [Running Backend](#running-backend)
8. [Running Frontend](#running-frontend)
9. [Running Tests](#running-tests)
10. [Build for Production](#build-for-production)
11. [API Documentation](#api-documentation)
12. [Technical Handover](#technical-handover)

---

## Project Overview

When a new agency signs up for **Agency OS**, rather than facing empty dashboards, they complete an intuitive 7-step guided wizard that:

* **Profiles Archetype**: Selects Software Development, Digital Marketing, or Hybrid model.
* **Selects Core Services**: Tailors deliverables and service categories.
* **Deterministic Template Recommendations**: Matches battle-tested pipeline boards and task checklists.
* **Workspace Preview & Customization**: Inspects and localizes stages and project structures.
* **Atomic Workspace Provisioning**: Auto-generates tenant-scoped `GeneratedWorkspaceConfig` records via atomic transaction.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS |
| **Backend** | NestJS · TypeScript · Prisma ORM · Swagger / OpenAPI |
| **Database** | PostgreSQL · Prisma Migrations |
| **Multi-Tenancy** | Strict tenant scoping via `agencyId` context & restrictive cascades |
| **Testing** | Jest · Supertest · Automated unit & integration test suites |

---

## Prerequisites

Ensure you have the following installed locally:

* **Node.js**: v18.17.0+ or v20+
* **npm**: v9+ or v10+
* **PostgreSQL**: v14+ (or connection string from Supabase / Neon / Docker)

---

## Installation

Clone the repository and install dependencies in both applications:

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install
```

---

## Environment Setup

### 1. Backend Environment

Copy the example environment file in `backend/`:

```bash
cd backend
cp .env.example .env
```

Configure your `.env` variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/agency_os?schema=public"
JWT_SECRET="super-secret-development-jwt-key"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

### 2. Frontend Environment

Copy the example environment file in `frontend/`:

```bash
cd frontend
cp .env.example .env.local
```

Configure your `.env.local` variables:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api"
NEXT_PUBLIC_DEMO_AGENCY_ID="a0000000-0000-0000-0000-000000000001"
```

---

## Database Migration & Seed Data

Run the database migration and populate the initial workspace templates and stub agencies:

```bash
cd backend

# Run pending migrations
npx prisma migrate deploy

# Seed stub agencies and 8 workspace templates
npx prisma db seed
```

---

## Running Backend

Start the NestJS API server on `http://localhost:5000/api`:

```bash
cd backend
npm run start:dev
```

* **Swagger API Documentation**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

---

## Running Frontend

Start the Next.js development server on `http://localhost:3000`:

```bash
cd frontend
npm run dev
```

* **Smart Onboarding Wizard**: [http://localhost:3000/smart-onboarding](http://localhost:3000/smart-onboarding)
* **Template Catalog View**: [http://localhost:3000/templates](http://localhost:3000/templates)

---

## Running Tests

Execute the automated test suites covering unit logic, controllers, tenant isolation, DTO validation, and idempotency:

```bash
cd backend

# Run all test suites
npm run test

# Run tests with code coverage
npm run test:cov
```

---

## Build for Production

Compile both frontend and backend for production deployment:

```bash
# Build Backend
cd backend
npm run build

# Build Frontend
cd ../frontend
npm run build
```

---

## API Documentation

For the full endpoint contract, request schemas, and stable error code definitions, see [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md).

---

## Technical Handover

For architectural decisions, recommendation algorithms, tenant isolation mechanisms, and integration guidelines for Neirah Tech, see [`TECHNICAL_HANDOVER.md`](./TECHNICAL_HANDOVER.md).
