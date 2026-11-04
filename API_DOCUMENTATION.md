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

> Implemented in **Phase 4**. Endpoints below marked 🔒 require a valid JWT
> passed as `Authorization: Bearer <token>`.

---

## Canonical Data Entities (Phase 2)

All entities conform strictly to Section 6 of the Task Spec & Common Standard:
* **`Agency`**: Canonical shared tenant root.
* **`AgencyOnboarding`**: Tracks agency profile, type, wizard step, and activation timestamp.
* **`AgencyServiceSelection`**: Selected agency services during wizard steps.
* **`WorkspaceTemplate`**: Seeded templates with rich JSON pipeline and task configurations.
* **`AgencyTemplateSelection`**: Join table of templates chosen by the onboarding agency.
* **`GeneratedWorkspaceConfig`**: Resulting pipeline, project, and task configurations provisioned on confirmation.

---

## Endpoints

### 1. Templates

#### `GET /smart-onboarding/templates`
List available workspace templates filtered by agency type.

**Query Parameters:**

| Parameter    | Type   | Description |
|--------------|--------|-------------|
| `agencyType` | string | Filter by `SOFTWARE_DEVELOPMENT`, `DIGITAL_MARKETING`, or `HYBRID` (optional) |

**Response `200`:**
```json
[
  {
    "id": "t0000000-0000-0000-0000-000000000001",
    "name": "Web Application Development",
    "description": "Full-lifecycle web engineering workspace with agile sprints, code review gates, and CI/CD checklists.",
    "category": "SOFTWARE_ENGINEERING",
    "agencyType": "SOFTWARE_DEVELOPMENT",
    "version": 1,
    "isActive": true,
    "configurationData": {
      "pipeline": {
        "name": "Web Application Lifecycle",
        "stages": [ ... ]
      },
      "taskChecklists": [ ... ]
    }
  }
]
```

---

### 2. Agency Onboarding Session

#### `POST /smart-onboarding/sessions`
Initialize or retrieve an onboarding profile for an agency.

**Request Body:**
```json
{
  "agencyId": "a0000000-0000-0000-0000-000000000001",
  "agencyName": "Acme Innovations",
  "agencyType": "SOFTWARE_DEVELOPMENT"
}
```

**Response `201`:**
```json
{
  "id": "b1111111-1111-1111-1111-111111111111",
  "agencyId": "a0000000-0000-0000-0000-000000000001",
  "agencyName": "Acme Innovations",
  "agencyType": "SOFTWARE_DEVELOPMENT",
  "status": "IN_PROGRESS",
  "currentStep": 1,
  "activatedAt": null,
  "createdAt": "2026-11-04T10:00:00.000Z",
  "updatedAt": "2026-11-04T10:00:00.000Z"
}
```

---

#### `GET /smart-onboarding/sessions/:agencyId`
Retrieve current onboarding progress and state for an agency 🔒.

**Response `200`:**
```json
{
  "id": "b1111111-1111-1111-1111-111111111111",
  "agencyId": "a0000000-0000-0000-0000-000000000001",
  "agencyName": "Acme Innovations",
  "agencyType": "SOFTWARE_DEVELOPMENT",
  "status": "IN_PROGRESS",
  "currentStep": 2,
  "serviceSelections": [ ... ],
  "templateSelections": [ ... ]
}
```

---

#### `POST /smart-onboarding/sessions/:agencyId/confirm`
Confirm template selection and auto-generate workspace configurations 🔒.

**Response `201`:**
```json
{
  "message": "Workspace generated successfully.",
  "status": "COMPLETED",
  "activatedAt": "2026-11-04T10:15:00.000Z",
  "configsCount": 4
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
| `409`       | Conflict — duplicate record                       |
| `422`       | Unprocessable Entity — business rule violation    |
| `500`       | Internal Server Error                             |

---

## Changelog

| Version | Phase | Date       | Description                                                 |
|---------|-------|------------|-------------------------------------------------------------|
| 0.1.0   | 1     | 2026-11-02 | Initial scaffold & infrastructure documentation             |
| 0.2.0   | 2     | 2026-11-04 | Phase 2 Prisma schema, migrations, seed data & entity specs |
