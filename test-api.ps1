# Test API Endpoints

# 1. Test GET /api/jobs
Write-Host "Testing GET /api/jobs..." -ForegroundColor Cyan
$jobsResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs" -Method Get
Write-Host "Found $($jobsResponse.jobs.Count) jobs" -ForegroundColor Green

# 2. Test GET /api/jobs/:id
if ($jobsResponse.jobs -and $jobsResponse.jobs.Count -gt 0) {
    $jobId = $jobsResponse.jobs[0]._id
    Write-Host "\nTesting GET /api/jobs/$jobId..." -ForegroundColor Cyan
    $jobResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs/$jobId" -Method Get
    Write-Host "Job Title: $($jobResponse.title)" -ForegroundColor Green
    Write-Host "Company: $($jobResponse.company)" -ForegroundColor Green
}

# 3. Test POST /api/jobs/:id/quick-apply (without file for now)
Write-Host "\nTesting POST /api/jobs/:id/quick-apply..." -ForegroundColor Cyan
$body = @{
    name = "Test User"
    email = "test@example.com"
    phone = "1234567890"
    message = "Test application"
} | ConvertTo-Json

try {
    $applyResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs/$jobId/quick-apply" -Method Post -Body $body -ContentType "application/json"
    Write-Host "Application submitted successfully!" -ForegroundColor Green
    Write-Host "Track token: $($applyResponse.trackToken)" -ForegroundColor Green
    
    # 4. Test GET /api/applications/track/:token
    if ($applyResponse.trackToken) {
        Write-Host "\nTesting GET /api/applications/track/$($applyResponse.trackToken)..." -ForegroundColor Cyan
        $trackResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/applications/track/$($applyResponse.trackToken)" -Method Get
        Write-Host "Application Status: $($trackResponse.status)" -ForegroundColor Green
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response.StatusCode) - $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
}

Write-Host "\nAPI Tests Completed!" -ForegroundColor Green
