$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $projectRoot '.env'

if (Test-Path -LiteralPath $envFile) {
  foreach ($line in Get-Content -LiteralPath $envFile) {
    if ($line -match '^\s*(OLLAMA_BASE_URL|OLLAMA_MODEL|OLLAMA_TIMEOUT_MS)\s*=\s*(.+?)\s*$') {
      $name = $Matches[1]
      $value = $Matches[2].Trim('"', "'")
      if (-not [Environment]::GetEnvironmentVariable($name, 'Process')) {
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
      }
    }
  }
}

$ollamaBaseUrl = if ($env:OLLAMA_BASE_URL) { $env:OLLAMA_BASE_URL.TrimEnd('/') } else { 'http://127.0.0.1:11434' }
$ollamaModel = if ($env:OLLAMA_MODEL) { $env:OLLAMA_MODEL } else { 'llama3.1:8b' }
$ollamaCommand = Get-Command ollama -ErrorAction SilentlyContinue

try {
  Invoke-RestMethod -Uri "$ollamaBaseUrl/api/tags" -TimeoutSec 2 | Out-Null
} catch {
  if ($ollamaBaseUrl -ne 'http://127.0.0.1:11434') {
    throw "Configured Ollama endpoint is unavailable: $ollamaBaseUrl"
  }
  if (-not $ollamaCommand) {
    throw 'Ollama is not installed or is not available on PATH.'
  }
  Start-Process -FilePath $ollamaCommand.Source -ArgumentList 'serve' -WindowStyle Hidden
  $ready = $false
  for ($attempt = 0; $attempt -lt 20; $attempt++) {
    Start-Sleep -Milliseconds 500
    try {
      Invoke-RestMethod -Uri "$ollamaBaseUrl/api/tags" -TimeoutSec 2 | Out-Null
      $ready = $true
      break
    } catch {
    }
  }
  if (-not $ready) {
    throw 'Ollama did not become ready.'
  }
}

$availableModels = (Invoke-RestMethod -Uri "$ollamaBaseUrl/api/tags" -TimeoutSec 5).models.name
if ($availableModels -notcontains $ollamaModel) {
  throw "Required model $ollamaModel is not installed. Run: ollama pull $ollamaModel"
}

Set-Location -LiteralPath $projectRoot
npm run db:local:setup | Out-Host
if ($LASTEXITCODE -ne 0) {
  throw 'Local D1 schema setup failed.'
}

try {
  $existingApp = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 2 -UseBasicParsing
  if ($existingApp.StatusCode -eq 200 -and $existingApp.Content -match '<title>SupportFlow</title>') {
    Write-Host 'SupportFlow is already running at http://localhost:3000'
    exit 0
  }
} catch {
}

npm run dev
