#!/usr/bin/env pwsh
# =============================================================================
# setup-github.ps1
# Agency OS — Smart Onboarding · Neirah Tech
# 
# PURPOSE: One-shot script that:
#   1. Initialises the git repo
#   2. Creates the GitHub remote repository
#   3. Pushes Phase 1 code on  main  AND  phase-1/scaffolding  branch
#   4. Creates placeholder branches for Phases 2-6
#   5. Opens the repo in the browser
#
# USAGE:   .\setup-github.ps1 -RepoName "agency-os-smart-onboarding" -Visibility "public"
# =============================================================================

param(
    [string]$RepoName   = "agency-os-smart-onboarding",
    [string]$Visibility = "public",    # "public" or "private"
    [string]$RepoRoot   = $PSScriptRoot
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ── Helpers ───────────────────────────────────────────────────────────────────
function Write-Step([string]$msg) {
    Write-Host ""
    Write-Host "▶  $msg" -ForegroundColor Cyan
}
function Write-OK([string]$msg) {
    Write-Host "   ✅  $msg" -ForegroundColor Green
}
function Write-Warn([string]$msg) {
    Write-Host "   ⚠️   $msg" -ForegroundColor Yellow
}

# ── 0. Preflight checks ───────────────────────────────────────────────────────
Write-Step "Checking prerequisites"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "git is not installed or not on PATH."
}
Write-OK "git found: $(git --version)"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    throw "GitHub CLI (gh) is not installed or not on PATH. Run: winget install GitHub.cli"
}
Write-OK "gh found: $(gh --version | Select-Object -First 1)"

# Check auth
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warn "Not authenticated. Launching gh auth login..."
    gh auth login --web --git-protocol https
}
Write-OK "GitHub CLI authenticated"

# ── 1. Git init ───────────────────────────────────────────────────────────────
Write-Step "Initialising local Git repository"

Set-Location $RepoRoot

if (Test-Path ".git") {
    Write-Warn ".git already exists — skipping git init"
} else {
    git init -b main
    Write-OK "Git repo initialised (default branch: main)"
}

# ── 2. Git config ─────────────────────────────────────────────────────────────
Write-Step "Configuring Git identity (if not set)"

$userName  = git config --global user.name  2>$null
$userEmail = git config --global user.email 2>$null

if (-not $userName -or $userName -eq "") {
    $userName = Read-Host "  Enter your Git user name"
    git config --global user.name $userName
}
if (-not $userEmail -or $userEmail -eq "") {
    $userEmail = Read-Host "  Enter your Git email"
    git config --global user.email $userEmail
}
Write-OK "Git identity: $userName <$userEmail>"

# ── 3. Initial commit (Phase 1) ───────────────────────────────────────────────
Write-Step "Staging and committing Phase 1 — Scaffolding"

git add -A
git commit -m "feat(phase-1): project scaffolding & repository setup

- Initialise NestJS backend with TypeScript strict mode
- Initialise Next.js 14 frontend with App Router + Tailwind CSS
- Wire up global PrismaModule + PrismaService with lifecycle hooks
- Configure Prisma schema (PostgreSQL datasource, no models yet)
- Set up .env.example with 5 required variables (no real values)
- Configure strict tsconfig for both apps with path aliases
- Add root .gitignore (node_modules, dist, .env, *.tsbuildinfo, DB dumps)
- Add typed API client, domain types, and utility functions (frontend)
- Add Edge middleware placeholder for JWT auth guard (Phase 4)
- Add Swagger / OpenAPI auto-setup at /api/docs
- Add GitHub Actions CI workflow (lint + type-check)
- Add PR template with phase checklist
- Add README.md and API_DOCUMENTATION.md (living spec)

Co-authored-by: Neirah Tech <dev@neirah.tech>"

Write-OK "Phase 1 commit created on 'main'"

# ── 4. Create GitHub remote repo ──────────────────────────────────────────────
Write-Step "Creating GitHub repository: $RepoName ($Visibility)"

$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Warn "Remote 'origin' already exists: $existingRemote — skipping repo creation"
} else {
    gh repo create $RepoName `
        --$Visibility `
        --description "Smart Onboarding module for Agency OS by Neirah Tech — NestJS + Next.js + Prisma" `
        --source . `
        --remote origin `
        --push
    Write-OK "Repository created and main branch pushed"
}

# ── 5. Push main ──────────────────────────────────────────────────────────────
Write-Step "Pushing 'main' branch"

# Already pushed by --push flag above, but ensure it's up to date
git push --set-upstream origin main --force-with-lease 2>$null
Write-OK "'main' branch pushed"

# ── 6. Create phase branches ──────────────────────────────────────────────────
Write-Step "Creating phase feature branches"

$branches = @(
    @{ name = "phase-1/scaffolding";    desc = "Phase 1: Scaffolding & Repo Setup (COMPLETE)" },
    @{ name = "phase-2/data-models";    desc = "Phase 2: Data Models, DTOs & Core API" },
    @{ name = "phase-3/wizard-ui";      desc = "Phase 3: Onboarding Wizard UI" },
    @{ name = "phase-4/auth-rbac";      desc = "Phase 4: Auth — JWT + RBAC" },
    @{ name = "phase-5/testing";        desc = "Phase 5: Testing — Unit + Integration" },
    @{ name = "phase-6/polish-deploy";  desc = "Phase 6: Polish, Optimisation & Deployment" }
)

foreach ($branch in $branches) {
    $bName = $branch.name
    $bDesc = $branch.desc

    # Check if branch already exists remotely
    $remoteExists = git ls-remote --heads origin $bName 2>$null
    if ($remoteExists) {
        Write-Warn "Branch '$bName' already exists on remote — skipping"
        continue
    }

    git checkout -b $bName
    git push --set-upstream origin $bName
    git checkout main

    Write-OK "Branch created and pushed: $bName  ($bDesc)"
}

# ── 7. Open in browser ────────────────────────────────────────────────────────
Write-Step "Opening repository in browser"
gh repo view --web
Write-OK "Done! Repository is live on GitHub."

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "  🚀  Agency OS — Smart Onboarding is on GitHub!" -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Branch strategy:" -ForegroundColor White
Write-Host "    main                  ← protected, production-ready" -ForegroundColor Green
Write-Host "    phase-1/scaffolding   ← ✅ complete (current)" -ForegroundColor Green
Write-Host "    phase-2/data-models   ← 🔜 next phase" -ForegroundColor Yellow
Write-Host "    phase-3/wizard-ui     ← 🔜 planned" -ForegroundColor DarkGray
Write-Host "    phase-4/auth-rbac     ← 🔜 planned" -ForegroundColor DarkGray
Write-Host "    phase-5/testing       ← 🔜 planned" -ForegroundColor DarkGray
Write-Host "    phase-6/polish-deploy ← 🔜 planned" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Next steps:" -ForegroundColor White
Write-Host "    1. Go to Settings → Branches → add protection rule for 'main'" -ForegroundColor Gray
Write-Host "    2. Require PRs to merge into main" -ForegroundColor Gray
Write-Host "    3. Start Phase 2: git checkout phase-2/data-models" -ForegroundColor Gray
Write-Host ""
