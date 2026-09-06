$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$ollamaCommand = Get-Command ollama -ErrorAction SilentlyContinue

if (-not $ollamaCommand) {
  throw 'Ollama is not installed or is not available on PATH.'
}

try {
  Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 2 | Out-Null
} catch {
  Start-Process -FilePath $ollamaCommand.Source -ArgumentList 'serve' -WindowStyle Hidden
  $ready = $false
  for ($attempt = 0; $attempt -lt 20; $attempt++) {
    Start-Sleep -Milliseconds 500
    try {
      Invoke-RestMethod -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 2 | Out-Null
      $ready = $true
      break
    } catch {
    }
  }
  if (-not $ready) {
    throw 'Ollama did not become ready.'
  }
}

$models = ollama list | Out-String
if ($models -notmatch 'llama3\.1:8b') {
  throw 'Required model llama3.1:8b is not installed. Run: ollama pull llama3.1:8b'
}

Set-Location -LiteralPath $projectRoot
npm run dev
