# Technical Handover — Smart Onboarding Module
**Agency OS by Neirah Tech**

---

## 1. Architecture Overview

The Smart Onboarding module consists of a decoupled NestJS backend and Next.js 14 (App Router) frontend, linked via typed REST contracts, deterministic recommendation engines, and strict multi-tenant isolation.

```
                      ┌─────────────────────────────────────────┐
                      │          Agency OS Frontend             │
                      │  Next.js 14 · App Router · Tailwind CSS │
                      └────────────────────┬────────────────────┘
                                           │
                                           │ HTTP (Bearer JWT / x-agency-id)
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │          NestJS API Gateway             │
                      │   Global ValidationPipe · Filters       │
                      └────────────────────┬────────────────────┘
                                           │
                     ┌─────────────────────┴─────────────────────┐
                     ▼                                           ▼
       ┌───────────────────────────┐               ┌───────────────────────────┐
       │   AgencyContextGuard      │               │   HttpExceptionFilter     │
       │   Tenant Context (Header) │               │   Standard Response Shape │
       └─────────────┬─────────────┘               └─────────────┬─────────────┘
                     │                                           │
                     └─────────────────────┬─────────────────────┘
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │       SmartOnboardingService            │
                      │   Deterministic Template Matcher        │
                      │   Preview Engine & Atomic Provisioning  │
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │        Prisma ORM & PostgreSQL         │
                      │  Tenant-Scoped: where: { agencyId }     │
                      └─────────────────────────────────────────┘
```

---

## 2. Key Design Decisions & Rationale

1. **Strict Separation of Concerns**: Controllers deal strictly with HTTP transport, serialization, and swagger metadata. All business logic, transaction boundaries, and authorization checks reside in `SmartOnboardingService`.
2. **Standard Response Envelope**: Every HTTP response is normalized:
   - Success: `{ "success": true, "data": { ... }, "message": "..." }`
   - Error: `{ "success": false, "message": "...", "code": "STABLE_CODE", "details": { ... } }`
3. **Tenant-Safe Routing**: The tenant `agencyId` is **never** accepted from user-supplied request bodies. It is extracted securely by `AgencyContextGuard` and injected via `@AgencyId()` parameter decorators.
4. **Deterministic Recommendation Engine**: Template matching operates without nondeterministic external LLM calls or latency, guaranteeing reproducible, zero-cost, and instant template recommendations.
5. **Atomic Workspace Provisioning**: During activation, creation of pipelines, tasks, and project configurations occurs within an isolated `prisma.$transaction`.

---

## 3. Smart Recommendation Logic

The recommendation algorithm matches an agency's profile to pre-configured templates deterministically:
* **`SOFTWARE_DEVELOPMENT`**: Returns templates where `agencyType = SOFTWARE_DEVELOPMENT` or `agencyType = HYBRID` or `agencyType IS NULL`.
* **`DIGITAL_MARKETING`**: Returns templates where `agencyType = DIGITAL_MARKETING` or `agencyType = HYBRID` or `agencyType IS NULL`.
* **`HYBRID`**: Receives all active templates across both disciplines.
* **Deterministic Sorting**: Results are consistently ordered by `name ASC`.

---

## 4. Workspace Generation Logic

Upon user confirmation in Step 6, the `activate()` service method parses each selected template's `configurationData` JSON and provisions:
1. **`PIPELINE` Configurations**: Stages, custom WIP thresholds, and transition gates.
2. **`PROJECT` Configurations**: Default team roles (Technical Lead, Senior Engineer, Copywriter, etc.) and category metadata.
3. **`TASK` Configurations**: Deliverable checklists (initiation, security gates, quality benchmarks).
4. **`MARKETING_WORKFLOW` Configurations**: Campaign stages and conversion funnel milestones for marketing/hybrid agencies.

---

## 5. Tenant Isolation Approach

* Every table in PostgreSQL (`agency_onboardings`, `agency_service_selections`, `agency_template_selections`, `generated_workspace_configs`) includes an explicit `agencyId` column indexed as a foreign key.
* The service strictly applies `where: { agencyId }` to every query and mutation.
* Foreign key references enforce `onDelete: Restrict` on audit-sensitive records to prevent accidental cascading deletion of historical client workspace artifacts.
* `assertAgencyOwnership(record, agencyId)` verifies that any referenced records belong to the active authenticated tenant.

---

## 6. Idempotency Protection

* **Status Check**: If an agency's onboarding status is already `COMPLETED`, invoking `POST /api/onboarding/activate` does **not** duplicate workspace configurations.
* It immediately returns the existing configurations accompanied by stable code/message `ONBOARDING_ALREADY_ACTIVATED` and HTTP `200 OK`.
* Prevents accidental double-clicks, duplicate billing triggers, or duplicate boards.

---

## 7. Known Limitations

* **Single Active Onboarding Per Agency**: The schema enforces `@@unique([agencyId])` for onboarding sessions. Multi-brand agencies requiring multiple onboarding profiles should represent each brand as a distinct `Agency` entity.
* **Pre-baked Configurations**: Custom stages created in Step 5 preview are currently stored locally in the wizard state and apply to the default template JSON during generation.

---

## 8. Integration Notes for Neirah Tech

When integrating this module into the primary Agency OS monorepo:
1. **Replace Demo Guard with Real JWT Guard**:
   In [`backend/src/common/guards/agency-context.guard.ts`](file:///d:/Internship/Development/module-submission/backend/src/common/guards/agency-context.guard.ts):
   Replace the header reader with standard Passport JWT user extraction:
   ```ts
   // Replace:
   // const agencyId = request.headers['x-agency-id'];
   // With:
   // const agencyId = request.user?.agencyId;
   ```
2. **Prisma Schema Merge**:
   The models in `backend/prisma/schema.prisma` are designed to merge directly into the central schema. Ensure canonical `Agency` table relationships remain aligned.
3. **Frontend API URL**:
   Set `NEXT_PUBLIC_API_BASE_URL` to point to your production gateway (e.g. `https://api.agencyos.neirah.tech/api`).

---

## 9. Dependencies Added

| Package | Purpose |
| :--- | :--- |
| `@prisma/client` & `prisma` | Type-safe database client and migrations |
| `class-validator` & `class-transformer` | DTO validation and implicit type conversion |
| `@nestjs/swagger` | OpenAPI documentation generation |
| `tailwindcss` | Agency OS tokenized styling |
