# API Documentation — Smart Onboarding · Agency OS

> **Base URL**: `http://localhost:5000/api/v1`  
> **Auth**: Bearer JWT (required on protected endpoints)  
> **Content-Type**: `application/json`  
> **Interactive Docs**: `http://localhost:5000/api/docs` (Swagger UI)

---

## Overview

The Smart Onboarding API powers the guided wizard that profiles new agencies,
recommends workspace templates, and generates their workspace configuration.

All responses follow the NestJS standard envelope:

```json
{
  "data": { ... },
  "message": "OK",
  "statusCode": 200
}
```

Errors return:

```json
{
  "message": "Descriptive error message",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## Authentication

> Implemented in **Phase 3**. Endpoints below marked 🔒 require a valid JWT
> passed as `Authorization: Bearer <token>`.

---

## Endpoints

> **Phase 1 Note**: No endpoints are implemented yet.  
> This document is a living specification. Endpoints will be added as each
> phase is completed.

---

### Smart Onboarding

#### `POST /smart-onboarding/sessions`
> Phase 2 — Create a new onboarding session

**Request Body:**
```json
{
  "agencyName": "string",
  "agencyType": "CREATIVE | DIGITAL_MARKETING | WEB_DEVELOPMENT | PR | CONSULTING | FULL_SERVICE | OTHER"
}
```

**Response `201`:**
```json
{
  "id": "clxyz...",
  "agencyId": "clxyz...",
  "currentStep": "AGENCY_PROFILE",
  "completedAt": null,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

#### `GET /smart-onboarding/sessions/:id`
> Phase 2 — Retrieve an onboarding session by ID 🔒

**Path Parameters:**

| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| `id`      | string | Onboarding session ID|

**Response `200`:**
```json
{
  "id": "clxyz...",
  "agencyId": "clxyz...",
  "currentStep": "TEMPLATE_SELECTION",
  "completedAt": null,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

#### `PATCH /smart-onboarding/sessions/:id/step`
> Phase 2 — Advance the wizard to the next step 🔒

**Request Body:**
```json
{
  "step": "TEAM_SIZE | TEMPLATE_SELECTION | REVIEW | COMPLETE",
  "payload": { ... }
}
```

---

#### `GET /smart-onboarding/templates`
> Phase 2 — List available workspace templates

**Query Parameters:**

| Parameter    | Type   | Description                             |
|--------------|--------|-----------------------------------------|
| `agencyType` | string | Filter templates by agency type (optional)|

**Response `200`:**
```json
[
  {
    "id": "clxyz...",
    "name": "Creative Agency Starter",
    "description": "Pipelines and checklists optimised for creative studios.",
    "agencyTypes": ["CREATIVE", "FULL_SERVICE"],
    "pipelineCount": 3,
    "projectStructureCount": 5,
    "taskChecklistCount": 12
  }
]
```

---

#### `POST /smart-onboarding/sessions/:id/confirm`
> Phase 2 — Confirm template selection and generate workspace 🔒

Triggers the workspace auto-generation job and marks the session as `COMPLETE`.

**Response `201`:**
```json
{
  "workspaceId": "clxyz...",
  "message": "Workspace generated successfully.",
  "redirectUrl": "/dashboard"
}
```

---

## Error Codes

| HTTP Status | Meaning                                           |
|-------------|---------------------------------------------------|
| `400`       | Bad Request — validation failed                   |
| `401`       | Unauthorised — missing or invalid JWT             |
| `403`       | Forbidden — insufficient RBAC role                |
| `404`       | Not Found — resource does not exist               |
| `409`       | Conflict — e.g. duplicate session for same agency |
| `422`       | Unprocessable Entity — business rule violation    |
| `500`       | Internal Server Error                             |

---

## Changelog

| Version | Phase | Date       | Description                 |
|---------|-------|------------|-----------------------------|
| 0.1.0   | 1     | 2026-11-02 | Initial scaffold & documentation |
