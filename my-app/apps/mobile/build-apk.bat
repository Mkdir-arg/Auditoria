@echo off
echo ========================================
echo  GENERANDO APK - AUDITORIA NUTRICIONAL
echo ========================================

echo.
echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    echo Descarga desde: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js: OK
echo.

echo [1/4] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ERROR: Fallo la instalacion de dependencias
    pause
    exit /b 1
)

echo.
echo [2/4] Generando proyecto Android...
call npx expo prebuild --platform android --clean
if errorlevel 1 (
    echo ERROR: Fallo expo prebuild
    pause
    exit /b 1
)

echo.
echo [3/4] Compilando APK...
cd android
call gradlew.bat assembleRelease
if errorlevel 1 (
    echo ERROR: Fallo la compilacion del APK
    pause
    exit /b 1
)

echo.
echo ========================================
echo  APK GENERADO EXITOSAMENTE!
echo ========================================
echo.
echo Ubicacion: android\app\build\outputs\apk\release\app-release.apk
echo.
echo Para instalar en tu celular:
echo 1. Conecta tu celular por USB
echo 2. Habilita "Depuracion USB" en opciones de desarrollador
echo 3. Ejecuta: adb install app-release.apk
echo.

pause
