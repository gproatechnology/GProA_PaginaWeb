$ErrorActionPreference = 'Stop'
$project = 'Pagina_web'
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$siteDir = Join-Path $repoRoot $project

if (-not (Test-Path -LiteralPath $siteDir)) {
    Write-Host "No se encontró la carpeta '$project' en '$repoRoot'." -ForegroundColor Red
    exit 1
}

Set-Location -LiteralPath $siteDir

if (-not (Test-Path -LiteralPath 'node_modules')) {
    Write-Host "Instalando dependencias en '$siteDir'..." -ForegroundColor Yellow
    npm install
}
else {
    Write-Host "node_modules detectado." -ForegroundColor Cyan
}

Write-Host "Levantando servidor de desarrollo en '$siteDir'..." -ForegroundColor Green
npm run dev
