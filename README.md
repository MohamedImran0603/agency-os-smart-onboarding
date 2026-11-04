# Smart Onboarding — Agency OS · Neirah Tech

> A production-ready **NestJS + Next.js** module that guides new agencies
> through an intelligent onboarding wizard, profiles their agency type,
> recommends workspace templates, and auto-generates their entire workspace
> configuration upon confirmation.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Repository Structure](#repository-structure)
4. [Prerequisites](#prerequisites)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Database Setup](#database-setup)
8. [Running the Application](#running-the-application)
9. [Testing](#testing)
10. [Phase Roadmap](#phase-roadmap)
11. [API Documentation](#api-documentation)
12. [Contributing](#contributing)

---

## Project Overview

When a new agency signs up for **Agency OS**, instead of facing blank screens
they are guided through a smart onboarding wizard that:

- **Profiles** the agency type (Creative, Digital Marketing, Web Dev, PR, etc.)
- **Recommends** workspace templates (pipelines, project structures, task checklists)
- **Auto-generates** the entire workspace configuration upon confirmation

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Next.js 14 · TypeScript · Tailwind CSS (App Router) |
| Backend    | NestJS · TypeScript                             |
| Database   | PostgreSQL · Prisma ORM                         |
| Auth       | JWT · RBAC (Phase 3)                            |
| Testing    | Jest · Supertest · API integration tests        |
| API Docs   | Swagger / OpenAPI (auto-generated)              |

---

## Repository Structure

```
module-submission/
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── smart-onboarding/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                   ← Shared UI primitives
│   │   └── smart-onboarding/     ← Wizard-specific components
│   ├── lib/
│   │   ├── api/                  ← Typed HTTP client
│   │   ├── types/                ← Domain types / interfaces
│   │   └── utils/                ← Pure utility functions
│   ├── public/
│   ├── middleware.ts             ← Auth guard (Edge Runtime)
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.ts
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── smart-onboarding/
│   │   │   ├── dto/
│   │   │   ├── smart-onboarding.controller.ts
│   │   │   ├── smart-onboarding.service.ts
│   │   │   └── smart-onboarding.module.ts
│   │   ├── common/              ← Guards, filters, interceptors, decorators
│   │   ├── prisma/              ← Global PrismaModule + PrismaService
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── tsconfig.build.json
├── .gitignore
├── README.md
└── API_DOCUMENTATION.md
```

---

## Prerequisites

- **Node.js** ≥ 20.x
- **pnpm** ≥ 8.x (or npm ≥ 10.x)
- **PostgreSQL** ≥ 15
- **Git**

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd module-submission
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env          # Fill in your values
npm install
npm run prisma:generate       # Generate Prisma client
npm run prisma:migrate        # Run DB migrations (Phase 2+)
npm run start:dev             # http://localhost:5000
```

### 3. Set up the frontend

```bash
cd ../frontend
cp ../.env.example .env.local # Fill in NEXT_PUBLIC_API_BASE_URL
npm install
npm run dev                   # http://localhost:3000
```

---

## Environment Variables

See [`backend/.env.example`](./backend/.env.example) for the full list.

| Variable                  | Description                                   | Required |
|---------------------------|-----------------------------------------------|----------|
| `DATABASE_URL`            | PostgreSQL connection string                  | ✅       |
| `JWT_SECRET`              | Secret key for signing JWT tokens             | ✅       |
| `PORT`                    | NestJS server port (default: 5000)            | ✅       |
| `FRONTEND_URL`            | Allowed CORS origin for the frontend          | ✅       |
| `NEXT_PUBLIC_API_BASE_URL`| Public API base URL consumed by Next.js       | ✅       |

---

## Database Setup

```bash
# In backend/
npm run prisma:generate       # Regenerate client after schema changes
npm run prisma:migrate        # Apply pending migrations (dev)
npm run prisma:migrate:prod   # Apply pending migrations (production)
npm run prisma:studio         # Open Prisma Studio GUI
```

---

## Running the Application

```bash
# Backend (NestJS) — port 5000
cd backend && npm run start:dev

# Frontend (Next.js) — port 3000
cd frontend && npm run dev
```

Swagger UI: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

---

## Testing

```bash
# Backend unit tests
cd backend && npm run test

# Backend unit tests with coverage
cd backend && npm run test:cov

# Backend e2e / integration tests
cd backend && npm run test:e2e
```

---

## Phase Roadmap

| Phase | Title                                 | Status      |
|-------|---------------------------------------|-------------|
| 1     | Project Scaffolding & Repo Setup      | ✅ Complete |
| 2     | Data Models, DTOs & Core API          | 🔜 Planned  |
| 3     | Onboarding Wizard UI                  | 🔜 Planned  |
| 4     | Auth (JWT + RBAC)                     | 🔜 Planned  |
| 5     | Testing (Unit + Integration)          | 🔜 Planned  |
| 6     | Polish, Optimisation & Deployment     | 🔜 Planned  |

---

## API Documentation

See [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) for the full REST API reference.
Auto-generated Swagger docs are available at `/api/docs` when the backend is running.

---

## Contributing

1. Branch from `main` using the convention: `feat/<feature-name>` or `fix/<issue>`
2. Follow the TypeScript strict mode — no `any` types
3. All new endpoints must have corresponding DTOs with `class-validator` decorators
4. All new features must have unit + integration tests before merging
5. Run `npm run lint` and `npm run type-check` before opening a PR
