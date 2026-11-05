# Smart Onboarding — Agency OS · Neirah Tech

> A production-grade **NestJS + Next.js 14** full-stack module that guides new agencies through an intelligent 7-step onboarding wizard, profiles their business archetype, recommends deterministic workspace templates, isolates tenant data, and auto-generates their complete workspace configuration upon activation.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features & Capabilities](#key-features--capabilities)
3. [Architecture & Multi-Tenancy](#architecture--multi-tenancy)
4. [Tech Stack](#tech-stack)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Environment Setup](#environment-setup)
8. [Database Setup & Migrations](#database-setup--migrations)
9. [Running the Application](#running-the-application)
10. [Application Routes & Portals](#application-routes--portals)
11. [API Endpoints Reference](#api-endpoints-reference)
12. [Running Tests & Quality Checks](#running-tests--quality-checks)
13. [Build for Production](#build-for-production)
14. [Documentation Links](#documentation-links)

---

## Project Overview

When a new agency signs up for **Agency OS**, rather than facing an empty dashboard, they complete an intuitive 7-step guided wizard:

1. **Step 1: Welcome & Overview** — Introduces Agency OS, reviews status, and allows instant creation of new agency workspaces.
2. **Step 2: Define Agency Profile** — Captures the legal agency name and selects their operating archetype (*Software Development*, *Digital Marketing*, or *Hybrid Full-Service*).
3. **Step 3: Select Core Services** — Customizes agency deliverables and service offerings.
4. **Step 4: Deterministic Template Recommendations** — Matches battle-tested pipeline boards and task checklists tailored to the chosen archetype.
5. **Step 5: Workspace Preview** — Inspects the generated pipeline stages, checklist items, and project structures before provisioning.
6. **Step 6: Review & Confirmation** — Validates the full configuration payload and terms.
7. **Step 7: Atomic Workspace Provisioning** — Atomically commits tenant-scoped `GeneratedWorkspaceConfig` records into PostgreSQL with zero downtime.

---

## Key Features & Capabilities

* **Multi-Tenant Agency Management & Switching**:
  * Real-time tenant switcher in the top navigation bar.
  * Dedicated `/agency-profiles` route to view, switch, create, and delete agency workspace profiles.
  * Direct **`+ Create New Agency Workspace`** modal on the Welcome Step to launch new agency setups without modifying existing completed tenants.
* **Non-Blocking Client-Side State Synchronization**:
  * Dynamic step URL routing (`?step=1` through `?step=7`).
  * Interactive Stepper allowing free jumping between completed/current steps.
  * Sticky, non-sliding sidebar navigation that remains pinned during long-page scrolling.
  * Reset Demo Session capability (`POST /api/onboarding/reset`) to restart an onboarding session cleanly.
* **Deterministic Recommendation Engine**:
  * Maps business models to predefined, battle-tested workspace templates.
  * Ensures repeatable, high-quality agency setups with pre-populated pipelines and deliverables.
* **Atomic Workspace Provisioning**:
  * Provisions workspace configurations inside a single Prisma database transaction (`$transaction`), guaranteeing zero partial states.

---

## Architecture & Multi-Tenancy

```
┌────────────────────────────────────────────────────────┐
│                   Next.js 14 Frontend                  │
│       (App Router, Tailwind CSS, Lucide Icons)        │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
     x-agency-id                      x-agency-id
     HTTP Headers                     HTTP Headers
            │                                │
            ▼                                ▼
┌────────────────────────────────────────────────────────┐
│                     NestJS Backend                     │
│         (AgencyContextGuard, OnboardingService)        │
└───────────────────────────┬────────────────────────────┘
                            │
                     Prisma ORM Client
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Neon)                │
│   (Agencies, Onboardings, Templates, WorkspaceConfigs) │
└────────────────────────────────────────────────────────┘
```

* **Tenant Isolation**: Every API request is verified through the `AgencyContextGuard` via the `x-agency-id` header.
* **Cascade Safeguards**: Foreign key relationships strictly scope service selections, template selections, and generated configs to their parent tenant.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Lucide React |
| **Backend** | NestJS 10 · TypeScript · Prisma ORM · Swagger / OpenAPI · class-validator |
| **Database** | Neon Cloud Serverless PostgreSQL (`aws-ap-southeast-1`) / Local PostgreSQL |
| **Multi-Tenancy** | Strict tenant scoping via `x-agency-id` and transactional cascades |
| **Testing** | Jest · Supertest · Automated unit & integration test suites |

---

## Prerequisites

Ensure you have the following installed locally:

* **Node.js**: `v18.17.0+` or `v20+`
* **npm**: `v9+` or `v10+`
* **PostgreSQL**: Local instance or a cloud database (e.g. Neon PostgreSQL)

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

In `backend/`, copy `.env.example` to `.env`:

```bash
cd backend
cp .env.example .env
```

Configure your `.env` variables:

```env
DATABASE_URL="postgresql://<user>:<password>@<neon-host>/<db-name>?sslmode=require"
PORT=5000
FRONTEND_URL="http://localhost:3000"
JWT_SECRET="super-secret-development-jwt-key"
```

### 2. Frontend Environment

In `frontend/`, copy `.env.example` to `.env.local`:

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

## Database Setup & Migrations

Deploy database migrations and seed default workspace templates and demo agencies:

```bash
cd backend

# Deploy migrations to the database
npx prisma migrate deploy

# Seed workspace templates (Software Dev, Digital Marketing, Hybrid) and initial agencies
npx prisma db seed
```

---

## Running the Application

### 1. Start the Backend API

```bash
cd backend
npm run start:dev
```

The NestJS backend will start on **`http://localhost:5000/api`**.
* **Interactive Swagger UI**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

### 2. Start the Frontend

In a separate terminal:

```bash
cd frontend
npm run dev
```

The Next.js frontend will start on **`http://localhost:3000`**.

---

## Application Routes & Portals

| Route | Description |
| :--- | :--- |
| **`/smart-onboarding`** | 7-step guided smart onboarding wizard with interactive stepper. |
| **`/smart-onboarding?step=1`** | Welcome screen with workspace status and **`+ Create New Agency Workspace`**. |
| **`/agency-profiles`** | Manage all agency tenants, switch active workspaces, or create new demo profiles. |
| **`/templates`** | Interactive catalog of all workspace templates, pipeline stages, and checklists. |

---

## API Endpoints Reference

Base URL: `http://localhost:5000/api`  
Tenant Header: `x-agency-id: <uuid>`

### Onboarding Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/onboarding` | Fetch current onboarding progression state for active tenant. |
| `PUT` | `/onboarding/profile` | Update agency name and operating archetype (Step 2). |
| `PUT` | `/onboarding/services` | Save core service selections (Step 3). |
| `PUT` | `/onboarding/templates` | Select workspace templates (Step 4). |
| `POST` | `/onboarding/preview` | Generate preview payload of pipeline boards and checklists (Step 5). |
| `POST` | `/onboarding/activate` | Atomically provision and activate workspace (Step 6 -> Step 7). |
| `POST` | `/onboarding/reset` | Reset onboarding session selections back to Step 1. |

### Agency Management Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/agencies` | List all agency workspaces, their onboarding status, and configs. |
| `POST` | `/agencies` | Create a new isolated agency tenant workspace. |
| `GET` | `/agencies/:id` | Get details for a specific agency workspace. |
| `DELETE` | `/agencies/:id` | Delete an agency workspace and cascade its tenant records. |

### Template Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/templates` | List all available workspace templates. |
| `GET` | `/templates/recommendations?agencyType=:type` | Fetch recommended templates for a specific agency archetype. |

---

## Running Tests & Quality Checks

Run the automated test suites in `backend/`:

```bash
cd backend

# Run all unit and integration tests
npm run test

# Run tests with code coverage report
npm run test:cov
```

Run TypeScript verification in `frontend/`:

```bash
cd frontend
npx tsc --noEmit
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

## Documentation Links

* [API Documentation (`API_DOCUMENTATION.md`)](./API_DOCUMENTATION.md) — Comprehensive API contract, request/response envelopes, and error codes.
* [Technical Handover (`TECHNICAL_HANDOVER.md`)](./TECHNICAL_HANDOVER.md) — Architectural patterns, recommendation engine details, and integration instructions.
