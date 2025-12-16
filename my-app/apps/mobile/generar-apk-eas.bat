@echo off
echo ========================================
echo  GENERAR APK CON EAS BUILD
echo ========================================

REM Buscar Node.js
set NODE_PATH=
if exist "C:\Program Files\nodejs\node.exe" set NODE_PATH=C:\Program Files\nodejs
if exist "C:\Program Files (x86)\nodejs\node.exe" set NODE_PATH=C:\Program Files (x86)\nodejs
if exist "%USERPROFILE%\AppData\Local\Programs\nodejs\node.exe" set NODE_PATH=%USERPROFILE%\AppData\Local\Programs\nodejs

set PATH=%NODE_PATH%;%PATH%

echo.
echo [1/3] Instalando EAS CLI...
"%NODE_PATH%\npm.cmd" install -g eas-cli

echo.
echo [2/3] Configurando EAS...
echo Necesitas crear una cuenta gratuita en Expo
echo.
"%NODE_PATH%\npx.cmd" eas login

echo.
echo [3/3] Generando APK...
echo Esto puede tardar 10-15 minutos (se hace en la nube)
echo.
"%NODE_PATH%\npx.cmd" eas build --platform android --profile preview

echo.
echo ========================================
echo  PROCESO COMPLETADO
echo ========================================
echo.
echo El APK se generara en la nube de Expo
echo Recibiras un link para descargarlo
echo.

pause
