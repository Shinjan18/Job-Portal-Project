# Test Backend Endpoints

$baseUrl = "https://job-portal-backend-itvc.onrender.com"

function Test-Endpoint {
    param (
        [string]$url,
        [string]$method = "GET",
        [string]$body = $null,
        [hashtable]$headers = @{}
    )
    
    try {
        $params = @{
            Uri = $url
            Method = $method
            Headers = $headers
            ContentType = 'application/json'
            ErrorAction = 'Stop'
        }
        
        if ($body) {
            $params.Body = $body
        }
        
        $response = Invoke-WebRequest @params
        $content = $response.Content | ConvertFrom-Json
        
        return @{
            Success = $true
            StatusCode = $response.StatusCode
            Response = $content
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMessage = $_.Exception.Message
        
        try {
            $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
            if ($errorDetails) {
                $errorMessage = $errorDetails.message
            }
        } catch {}
        
        return @{
            Success = $false
            StatusCode = $statusCode
            Error = $errorMessage
        }
    }
}

# Test Root Endpoint
Write-Host "Testing Root Endpoint..." -ForegroundColor Cyan
$rootTest = Test-Endpoint -url "$baseUrl/"
if ($rootTest.Success) {
    Write-Host "✅ Root endpoint is working!" -ForegroundColor Green
    $rootTest.Response | ConvertTo-Json -Depth 5 | Out-String | Write-Host -ForegroundColor Green
} else {
    Write-Host "❌ Root endpoint failed with status $($rootTest.StatusCode): $($rootTest.Error)" -ForegroundColor Red
}

# Test Health Check
Write-Host "`nTesting Health Check..." -ForegroundColor Cyan
$healthTest = Test-Endpoint -url "$baseUrl/api/health"
if ($healthTest.Success) {
    Write-Host "✅ Health check passed!" -ForegroundColor Green
    $healthTest.Response | ConvertTo-Json -Depth 5 | Out-String | Write-Host -ForegroundColor Green
} else {
    Write-Host "❌ Health check failed with status $($healthTest.StatusCode): $($healthTest.Error)" -ForegroundColor Red
}

# Test Jobs List
Write-Host "`nTesting Jobs List..." -ForegroundColor Cyan
$jobsTest = Test-Endpoint -url "$baseUrl/api/jobs?page=1&limit=5"
if ($jobsTest.Success) {
    $count = $jobsTest.Response.jobs.Count
    Write-Host "✅ Found $count jobs" -ForegroundColor Green
    Write-Host "First job: $($jobsTest.Response.jobs[0].title) at $($jobsTest.Response.jobs[0].company)" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to fetch jobs: $($jobsTest.Error)" -ForegroundColor Red
}

Write-Host "`n✨ All tests completed!" -ForegroundColor Cyan
