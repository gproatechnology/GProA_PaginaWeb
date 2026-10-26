$ErrorActionPreference = 'Stop'

$siteDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $siteDir

$remoteUrl = 'https://github.com/gproatechnology/GProA_PaginaWeb.git'

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  PUSH - GProA Pagina Web" -ForegroundColor Cyan
Write-Host "  Directorio: $siteDir" -ForegroundColor Cyan
Write-Host "  Remoto:     $remoteUrl" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar/inicializar git
if (-not (Test-Path -LiteralPath '.git')) {
    Write-Host "No es un repositorio git. Inicializando..." -ForegroundColor Yellow
    git init
}

# 2. Configurar remoto
$existingRemotes = git remote 2>$null
if ($existingRemotes -notcontains 'origin') {
    Write-Host "Agregando remoto 'origin'..." -ForegroundColor Yellow
    git remote add origin $remoteUrl
} else {
    $currentUrl = (git remote get-url origin)
    if ($currentUrl -ne $remoteUrl) {
        Write-Host "Actualizando URL del remoto 'origin'..." -ForegroundColor Yellow
        git remote set-url origin $remoteUrl
    }
}

# 3. Identidad de git (si falta)
$name = git config user.name 2>$null
$email = git config user.email 2>$null
if (-not $name) {
    $name = Read-Host "Ingresa tu nombre para git (user.name)"
    git config user.name $name
}
if (-not $email) {
    $email = Read-Host "Ingresa tu email para git (user.email)"
    git config user.email $email
}

# 4. Rama
$defaultBranch = 'main'
$branch = Read-Host "Rama a usar [$defaultBranch]"
if ([string]::IsNullOrWhiteSpace($branch)) { $branch = $defaultBranch }

# 5. Mensaje de commit
$commitMsg = Read-Host "Mensaje de commit"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    Write-Host "El mensaje de commit no puede estar vacío." -ForegroundColor Red
    exit 1
}

# 6. Estado previo
Write-Host ""
Write-Host "Estado actual:" -ForegroundColor Cyan
git status --short

# 7. Confirmar
$confirm = Read-Host "¿Proceder con add, commit y push a '$branch'? (s/N)"
if ($confirm -ne 's' -and $confirm -ne 'S') {
    Write-Host "Operación cancelada." -ForegroundColor Yellow
    exit 0
}

# 8. Ejecutar
Write-Host ""
Write-Host "Ejecutando git add . ..." -ForegroundColor Green
git add .

Write-Host "Ejecutando git commit ..." -ForegroundColor Green
git commit -m $commitMsg

Write-Host "Ejecutando git push -u origin $branch ..." -ForegroundColor Green
git push -u origin $branch

Write-Host ""
Write-Host "Push completado exitosamente en la rama '$branch'." -ForegroundColor Green
