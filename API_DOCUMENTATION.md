# API Documentation — Smart Onboarding · Agency OS

> **Base URL**: `http://localhost:5000/api`  
> **Auth Header (Demo)**: `x-agency-id: <agency-uuid>`  
> **Content-Type**: `application/json`  
> **Interactive Swagger UI**: `http://localhost:5000/api/docs`

---

## Standard Response Contract

### Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Envelope
```json
{
  "success": false,
  "message": "Descriptive human-readable error message",
  "code": "STABLE_ERROR_CODE",
  "details": {}
}
```

---

## Authentication & Multi-Tenancy

Every request requires the `x-agency-id` header representing the authenticated agency tenant context.
Missing headers return:
```json
{
  "success": false,
  "message": "Missing or invalid \"x-agency-id\" authentication header.",
  "code": "MISSING_AGENCY_CONTEXT",
  "details": {}
}
```

---

## Endpoints

### 1. `GET /api/onboarding`
Retrieve current onboarding state and progress for the authenticated agency, or automatically initialize a fresh `IN_PROGRESS` session.

**Headers:**
`x-agency-id: a0000000-0000-0000-0000-000000000001`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "b1111111-1111-1111-1111-111111111111",
    "agencyId": "a0000000-0000-0000-0000-000000000001",
    "agencyName": "Apex Digital Labs",
    "agencyType": "SOFTWARE_DEVELOPMENT",
    "status": "IN_PROGRESS",
    "currentStep": 1,
    "activatedAt": null,
    "serviceSelections": [],
    "templateSelections": [],
    "generatedConfigs": []
  },
  "message": "Operation successful"
}
```

---

### 2. `PUT /api/onboarding/profile`
Save or update the agency profile name and archetype. Advances `currentStep` to 2.

**Request Body:**
```json
{
  "agencyName": "Apex Digital Labs",
  "agencyType": "SOFTWARE_DEVELOPMENT"
}
```
* `agencyName`: `string`, minimum 2 characters.
* `agencyType`: Enum (`SOFTWARE_DEVELOPMENT` | `DIGITAL_MARKETING` | `HYBRID`).

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "b1111111-1111-1111-1111-111111111111",
    "agencyId": "a0000000-0000-0000-0000-000000000001",
    "agencyName": "Apex Digital Labs",
    "agencyType": "SOFTWARE_DEVELOPMENT",
    "currentStep": 2,
    "status": "IN_PROGRESS"
  },
  "message": "Operation successful"
}
```

---

### 3. `PUT /api/onboarding/services`
Save selected agency service offerings. Replaces existing selections and advances `currentStep` to 3.

**Request Body:**
```json
{
  "services": [
    "Web Application Development",
    "SaaS Platform Development",
    "DevOps & Cloud Infrastructure"
  ]
}
```
* `services`: `string[]`, minimum 1 item required.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "b1111111-1111-1111-1111-111111111111",
    "currentStep": 3,
    "serviceSelections": [
      {
        "id": "s-1",
        "serviceName": "Web Application Development"
      }
    ]
  },
  "message": "Operation successful"
}
```

---

### 4. `GET /api/onboarding/templates`
Deterministically fetch recommended workspace templates matching the agency's profiled archetype and services.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "t0000000-0000-0000-0000-000000000001",
      "name": "Web Application Development",
      "description": "Full-lifecycle web engineering workspace with agile sprints, code review gates, and CI/CD checklists.",
      "category": "SOFTWARE_ENGINEERING",
      "agencyType": "SOFTWARE_DEVELOPMENT",
      "version": 1,
      "isActive": true,
      "configurationData": {
        "pipeline": { ... },
        "taskChecklists": [ ... ]
      }
    }
  ],
  "message": "Operation successful"
}
```

**Error Code:**
* `PROFILE_REQUIRED`: Returned if called before Step 2 profile has been saved.

---

### 5. `PUT /api/onboarding/templates`
Save chosen template IDs. Validates that all templates exist and are active, replaces selections, and advances `currentStep` to 4.

**Request Body:**
```json
{
  "templateIds": [
    "t0000000-0000-0000-0000-000000000001",
    "t0000000-0000-0000-0000-000000000002"
  ]
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "b1111111-1111-1111-1111-111111111111",
    "currentStep": 4,
    "templateSelections": [ ... ]
  },
  "message": "Operation successful"
}
```

**Error Code:**
* `INVALID_TEMPLATE_SELECTION`: If any template ID is inactive or invalid.

---

### 6. `POST /api/onboarding/preview`
Synthesize and inspect the full workspace schema (pipelines, task checklists, default roles) without committing any writes to the database.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "agencyName": "Apex Digital Labs",
    "agencyType": "SOFTWARE_DEVELOPMENT",
    "selectedServices": ["Web Application Development"],
    "preview": {
      "totalPipelines": 2,
      "totalTaskChecklists": 4,
      "totalProjectTemplates": 2,
      "pipelines": [
        {
          "name": "Web Application Lifecycle",
          "stages": [
            { "id": "discovery", "label": "Architecture & Discovery", "color": "#6366F1" },
            { "id": "sprint_planning", "label": "Sprint Backlog", "color": "#8B5CF6" }
          ],
          "sourceTemplate": "Web Application Development"
        }
      ],
      "taskChecklists": [ ... ]
    }
  },
  "message": "Operation successful"
}
```

---

### 7. `POST /api/onboarding/activate`
Atomic activation endpoint. Provisions `GeneratedWorkspaceConfig` records in a Prisma transaction, transitions onboarding status to `COMPLETED`, and sets `activatedAt`. Idempotent: returns existing configuration if already completed.

**Request Body:** `{}` (empty object)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Workspace successfully provisioned and activated.",
    "status": "COMPLETED",
    "activatedAt": "2026-11-04T16:00:00.000Z",
    "configs": [
      {
        "id": "cfg-1",
        "agencyId": "a0000000-0000-0000-0000-000000000001",
        "configType": "PIPELINE",
        "name": "Web Application Development Pipeline"
      }
    ]
  },
  "message": "Operation successful"
}
```

**Idempotent Second Call Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "ONBOARDING_ALREADY_ACTIVATED",
    "status": "COMPLETED",
    "activatedAt": "2026-11-04T16:00:00.000Z",
    "configs": [ ... ]
  },
  "message": "Operation successful"
}
```

---

### 8. `GET /api/templates`
List all active `WorkspaceTemplate` records across all categories and archetypes for the template catalog demo view.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "t0000000-0000-0000-0000-000000000001",
      "name": "Web Application Development",
      "category": "SOFTWARE_ENGINEERING",
      "agencyType": "SOFTWARE_DEVELOPMENT",
      "version": 1,
      "isActive": true
    }
  ],
  "message": "Operation successful"
}
```

---

## Stable Error Codes

| Error Code | HTTP Status | Meaning |
| :--- | :--- | :--- |
| `MISSING_AGENCY_CONTEXT` | 401 | Missing `x-agency-id` header in request |
| `VALIDATION_ERROR` | 400 | DTO validation failed (invalid payload format or undeclared property) |
| `PROFILE_REQUIRED` | 400 | Profile (Step 2) required before recommending templates or activating |
| `INVALID_TEMPLATE_SELECTION`| 400 | Template does not exist or has `isActive = false` |
| `ONBOARDING_INCOMPLETE` | 400 | Attempted activation before completing steps |
| `FORBIDDEN_TENANT_ACCESS` | 403 | Attempted access or modification of another agency's record |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server error |
