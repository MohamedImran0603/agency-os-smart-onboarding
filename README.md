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
6. **Step 6: Review & Confirmation** — Validates the full configuration payload before final activation.
7. **Step 7: Atomic Workspace Provisioning** — Atomically commits tenant-scoped `GeneratedWorkspaceConfig` records into PostgreSQL with zero partial states.

---

## Key Features & Capabilities

* **Multi-Tenant Agency Management & Switching**:
  * Real-time tenant switcher in the top navigation bar.
  * Dedicated `/agency-profiles` route to view, switch, and create agency workspace profiles (*Demo helper — beyond core module scope, provided for evaluation convenience*).
  * Direct **`+ Create New Agency Workspace`** modal on the Welcome Step to test fresh onboarding flows without altering previously completed tenants.
* **Non-Blocking Client-Side State Synchronization**:
  * Dynamic step URL routing (`?step=1` through `?step=7`).
  * Interactive Stepper allowing free jumping between completed/current steps.
  * Sticky, non-sliding sidebar navigation that remains pinned during long-page scrolling.
  * Reset Demo Session capability (`POST /api/onboarding/reset`) to restart an onboarding session cleanly (*Demo utility — not a production requirement*).
* **Deterministic Recommendation Engine**:
  * Maps business models to predefined, battle-tested workspace templates.
  * Ensures repeatable, high-quality agency setups with pre-populated pipelines and deliverables.
* **Atomic Workspace Provisioning**:
  * Provisions workspace configurations inside a single Prisma database transaction (`$transaction`), guaranteeing zero partial states.

---

## Architecture & Multi-Tenancy

```text
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
│                  PostgreSQL Database                   │
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
| **Database** | PostgreSQL · Prisma Migrations |
| **Multi-Tenancy** | Strict tenant scoping via `x-agency-id` header and transactional cascades |
| **Testing** | Jest · Supertest · Automated unit & integration test suites |

---

## Prerequisites

Ensure you have the following installed locally:

* **Node.js**: `v18.17.0+` or `v20+`
* **npm**: `v9+` or `v10+`
* **PostgreSQL**: Local instance or any standard cloud-hosted PostgreSQL database

---

## Installation

Clone the repository and install dependencies in both applications:

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# Generate the Prisma client (required before first run)
npx prisma generate

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

Open `.env` and fill in your values:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db-name>?schema=public"
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

Open `.env.local` and fill in your values:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api"

# After running the seed command in the next step, copy one of the seeded Agency IDs 
# (e.g. from terminal output or seed list) into this variable.
NEXT_PUBLIC_DEMO_AGENCY_ID="<paste-your-seeded-agency-id-here>"
```

> **Note**: An initial seeded demo ID (e.g., `a0000000-0000-0000-0000-000000000001`) is provisioned by the seed script. You can set this variable to any valid agency ID in your database.

---

## Database Setup & Migrations

Deploy database migrations and seed default workspace templates and stub agencies:

```bash
cd backend

# For local development setup (creates migration history and applies schema)
npx prisma migrate dev

# Note: For production / CI environments only, use:
# npx prisma migrate deploy

# Seed workspace templates (Software Dev, Digital Marketing, Hybrid) and stub agencies
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
| **`/agency-profiles`** | *Demo helper*: view, switch, and create agency profiles. (*Beyond core module scope — provided for evaluation convenience*). |
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
| `GET` | `/onboarding/templates` | Return eligible recommended templates for active tenant. |
| `PUT` | `/onboarding/templates` | Save template selections (Step 4). |
| `POST` | `/onboarding/preview` | Generate preview payload of pipeline boards and checklists (Step 5). |
| `POST` | `/onboarding/activate` | Atomically provision and activate workspace (Step 7). |
| `POST` | `/onboarding/reset` | Reset onboarding session back to Step 1. (*Demo utility only — beyond core module scope*). |

### Agency Endpoints *(Demo helpers — beyond core module scope, provided for standalone evaluation)*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/agencies` | List all agency workspaces and their onboarding status. |
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
