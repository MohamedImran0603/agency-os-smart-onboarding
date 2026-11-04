$ErrorActionPreference = "Stop"
Set-Location "d:\Internship\Development\module-submission"

Write-Host "=== Step 1: Getting GitHub Token from Git Credential Manager ===" -ForegroundColor Cyan
$credInput = "protocol=https`nhost=github.com`n`n"
$credOutput = $credInput | git credential fill
$token = ""
foreach ($line in $credOutput) {
    if ($line -like "password=*") {
        $token = $line.Substring(9).Trim()
    }
}

if (-not $token) {
    throw "Failed to retrieve GitHub token from Git Credential Manager."
}

Write-Host "Token retrieved successfully." -ForegroundColor Green

Write-Host "=== Step 2: Creating Private Repository on GitHub ===" -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $token"
    "User-Agent"    = "AgencyOS-Deploy"
    "Accept"        = "application/vnd.github+json"
}

$body = @{
    name        = "agency-os-smart-onboarding"
    description = "Smart Onboarding module for Agency OS by Neirah Tech"
    private     = $true
} | ConvertTo-Json

try {
    $createResp = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "Repository created successfully: $($createResp.html_url)" -ForegroundColor Green
} catch {
    $errStr = $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $respBody = $reader.ReadToEnd()
        if ($respBody -match "name already exists on this account") {
            Write-Host "Repository already exists on GitHub, proceeding to push..." -ForegroundColor Yellow
        } else {
            Write-Host "API Response: $respBody" -ForegroundColor Red
            throw "GitHub API Error: $errStr"
        }
    } else {
        throw "GitHub API Error: $errStr"
    }
}

Write-Host "=== Step 3: Initializing Local Git Repository ===" -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
    git init -b main
    Write-Host "Git initialized with default branch 'main'." -ForegroundColor Green
} else {
    Write-Host ".git already exists." -ForegroundColor Yellow
}

git config user.name "imran"
git config user.email "mimimran2001@gmail.com"

# Remove deploy-github.ps1 from staging by removing it before commit or letting it be part of tools
Write-Host "=== Step 4: Staging and Committing Phase 1 Code ===" -ForegroundColor Cyan
git add -A

$status = git status --porcelain
if ($status) {
    $commitMsg = "feat(phase-1): project scaffolding and repository setup`n`n- NestJS backend scaffold with strict TypeScript and Swagger`n- Next.js 14 frontend scaffold with App Router and Tailwind CSS`n- PrismaModule and PrismaService with database lifecycle hooks`n- Prisma schema with PostgreSQL datasource`n- Environment variable template (.env.example)`n- Typed API client, domain types, and utility functions`n- GitHub Actions CI workflow (lint and type-check)`n- PR template with phase checklist`n- Comprehensive README and API documentation"
    git commit -m $commitMsg
    Write-Host "Committed Phase 1 changes." -ForegroundColor Green
} else {
    Write-Host "Working tree clean, no new changes to commit." -ForegroundColor Yellow
}

Write-Host "=== Step 5: Configuring Remote Origin ===" -ForegroundColor Cyan
$repoUrl = "https://github.com/MohamedImran0603/agency-os-smart-onboarding.git"
$existingOrigin = git remote get-url origin 2>$null
if ($existingOrigin) {
    git remote set-url origin $repoUrl
} else {
    git remote add origin $repoUrl
}
Write-Host "Remote origin set to $repoUrl" -ForegroundColor Green

Write-Host "=== Step 6: Pushing 'main' branch ===" -ForegroundColor Cyan
git push -u origin main --force

Write-Host "=== Step 7: Creating and Pushing Phase Branches ===" -ForegroundColor Cyan
$phaseBranches = @(
    "phase-1/scaffolding",
    "phase-2/data-models",
    "phase-3/wizard-ui",
    "phase-4/auth-rbac",
    "phase-5/testing",
    "phase-6/polish-deploy"
)

foreach ($b in $phaseBranches) {
    Write-Host "Processing branch: $b" -ForegroundColor Cyan
    git checkout -B $b
    git push -u origin $b --force
    Write-Host "Pushed $b successfully." -ForegroundColor Green
}

git checkout main
Write-Host "Switched back to 'main' branch." -ForegroundColor Green
Write-Host "=== SUCCESS: All phases pushed to private repository! ===" -ForegroundColor Magenta
