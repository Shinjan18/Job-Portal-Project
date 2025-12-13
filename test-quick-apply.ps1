<# 
.SYNOPSIS
    Test script for the Quick Apply endpoint
.DESCRIPTION
    This script tests the /api/jobs/:id/quick-apply endpoint with a sample resume file.
    It sends a multipart/form-data request with all required fields.
.NOTES
    Run with: powershell -ExecutionPolicy Bypass -File .\test-quick-apply.ps1
#>

# Configuration
$apiBaseUrl = "http://localhost:5000/api"
$testJobId = "692bf30060d87d1eb180744f"  # Replace with a valid job ID
$testPdfPath = "sample-resume.pdf"      # Path to a sample resume file

# Check if the test file exists
if (-not (Test-Path $testPdfPath)) {
    Write-Host "Creating a sample resume file for testing..."
    $sampleText = @"
Name: Test User
Email: test@example.com
Phone: 123-456-7890

Experience:
- 5+ years of experience in software development
- Proficient in JavaScript, Node.js, and React

Education:
- Bachelor's in Computer Science
"@
    $sampleText | Out-File -FilePath $testPdfPath -Encoding utf8
}

try {
    # Prepare form data
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $fileBytes = [System.IO.File]::ReadAllBytes($testPdfPath)
    $fileContent = [System.Text.Encoding]::GetEncoding('iso-8859-1').GetString($fileBytes)
    $fileName = [System.IO.Path]::GetFileName($testPdfPath)

    $bodyLines = @(
        "--$boundary",
        'Content-Disposition: form-data; name="name"',
        '',
        'Test User',
        "--$boundary",
        'Content-Disposition: form-data; name="email"',
        '',
        'test@example.com',
        "--$boundary",
        'Content-Disposition: form-data; name="phone"',
        '',
        '123-456-7890',
        "--$boundary",
        'Content-Disposition: form-data; name="message"',
        '',
        'This is a test application from PowerShell',
        "--$boundary",
        "Content-Disposition: form-data; name=`"resume`"; filename=`"$fileName`"",
        "Content-Type: application/octet-stream$LF",
        $fileContent,
        "--$boundary--$LF"
    ) -join $LF

    # Send the request
    $uri = "$apiBaseUrl/jobs/$testJobId/quick-apply"
    
    Write-Host "Sending request to: $uri" -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri $uri -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines

    # Output the response
    Write-Host "`nResponse Status: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "Response Body:" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10

} catch {
    Write-Host "`nError occurred:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "Error Details:" -ForegroundColor Red
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json -Depth 10
    }
}
