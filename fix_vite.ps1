# Fix Vite Configuration Script

# STEP A: Environment & Backups
Write-Host "=== STEP A: Environment & Backups ===" -ForegroundColor Cyan
$pwd = Get-Location
Write-Host "Working Directory: $pwd"
Write-Host "Node.js Version: $(node --version)"

# Create backup directory if it doesn't exist
$backupDir = "$pwd\windsuf_backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# Backup important files
$backupFiles = @(
    "$pwd\client\package.json",
    "$pwd\client\package-lock.json"
)

foreach ($file in $backupFiles) {
    if (Test-Path $file) {
        $backupPath = "$backupDir\$(Split-Path $file -Leaf).bak"
        Copy-Item -Path $file -Destination $backupPath -Force
        Write-Host "Backed up: $file -> $backupPath"
    }
}

# STEP B: Clean
Write-Host "`n=== STEP B: Clean ===" -ForegroundColor Cyan
$itemsToRemove = @(
    "$pwd\node_modules",
    "$pwd\client\node_modules",
    "$pwd\client\.vite-temp",
    "$pwd\client\dist",
    "$pwd\package-lock.json"
)

foreach ($item in $itemsToRemove) {
    if (Test-Path $item) {
        Remove-Item -Path $item -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Removed: $item"
    }
}

# Clear npm cache
npm cache clean --force

# STEP C: Ensure Vite in package.json
Write-Host "`n=== STEP C: Check Vite in package.json ===" -ForegroundColor Cyan
$packageJsonPath = "$pwd\client\package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    
    if (-not $packageJson.devDependencies.vite) {
        Write-Host "Adding Vite to devDependencies..."
        if (-not $packageJson.devDependencies) {
            $packageJson | Add-Member -MemberType NoteProperty -Name 'devDependencies' -Value @{}
        }
        $packageJson.devDependencies | Add-Member -MemberType NoteProperty -Name 'vite' -Value '^5.0.0' -Force
        $packageJson | ConvertTo-Json -Depth 10 | Set-Content -Path $packageJsonPath -Encoding UTF8
        Write-Host "✅ Added Vite to devDependencies"
        $viteAdded = $true
    } else {
        Write-Host "✅ Vite is already in devDependencies"
        $viteAdded = $false
    }
}

# STEP D: Install & Build
Write-Host "`n=== STEP D: Install & Build ===" -ForegroundColor Cyan
Set-Location "$pwd\client"

# Install dependencies
Write-Host "Installing dependencies..."
npm install --no-audit --no-fund
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}

# Build the project
Write-Host "`nBuilding project..."
npm run build *> "$pwd\windsurf-client-build.log"
$buildOutput = Get-Content "$pwd\windsurf-client-build.log" -Raw

# Show build status
if ($buildOutput -match "error") {
    Write-Host "❌ Build failed. Check windsurf-client-build.log for details." -ForegroundColor Red
    Write-Host "=== Build Output (last 20 lines) ==="
    Get-Content "$pwd\windsurf-client-build.log" -Tail 20
} else {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
}

# STEP E: Start Dev Server (optional)
Write-Host "`n=== STEP E: Start Dev Server (Optional) ===" -ForegroundColor Cyan
$startDev = Read-Host "Start development server? (y/n)"
if ($startDev -eq 'y') {
    Write-Host "Starting development server..."
    npm run dev
}

Write-Host "`n=== Fix Vite Script Complete ===" -ForegroundColor Green
