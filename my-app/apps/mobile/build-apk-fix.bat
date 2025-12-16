@echo off
echo ========================================
echo  GENERANDO APK - AUDITORIA NUTRICIONAL
echo ========================================

echo.
echo Buscando Node.js...

REM Buscar Node.js en ubicaciones comunes
set NODE_PATH=
if exist "C:\Program Files\nodejs\node.exe" set NODE_PATH=C:\Program Files\nodejs
if exist "C:\Program Files (x86)\nodejs\node.exe" set NODE_PATH=C:\Program Files (x86)\nodejs
if exist "%USERPROFILE%\AppData\Local\Programs\nodejs\node.exe" set NODE_PATH=%USERPROFILE%\AppData\Local\Programs\nodejs
if exist "%ProgramFiles%\nodejs\node.exe" set NODE_PATH=%ProgramFiles%\nodejs

if "%NODE_PATH%"=="" (
    echo ERROR: No se encontro Node.js
    echo Por favor, cierra esta ventana y abre una nueva terminal
    echo O reinicia tu PC para que se actualice el PATH
    pause
    exit /b 1
)

echo Node.js encontrado en: %NODE_PATH%
set PATH=%NODE_PATH%;%PATH%

echo.
"%NODE_PATH%\node.exe" --version
"%NODE_PATH%\npm.cmd" --version

echo.
echo [1/4] Instalando dependencias...
"%NODE_PATH%\npm.cmd" install
if errorlevel 1 (
    echo ERROR: Fallo la instalacion
    pause
    exit /b 1
)

echo.
echo [2/4] Generando proyecto Android...
"%NODE_PATH%\npx.cmd" expo prebuild --platform android --clean
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
    echo ERROR: Fallo la compilacion
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

pause
