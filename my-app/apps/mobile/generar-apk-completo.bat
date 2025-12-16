@echo off
echo ========================================
echo  GENERAR APK - PROCESO COMPLETO
echo ========================================

REM Buscar Node.js
set NODE_PATH=C:\Program Files\nodejs
set PATH=%NODE_PATH%;%PATH%

echo.
echo PASO 1: Login en Expo
echo Ingresa tu email y password de Expo
echo.
call "%NODE_PATH%\npx.cmd" eas login

echo.
echo PASO 2: Conectar proyecto
echo.
call "%NODE_PATH%\npx.cmd" eas-cli@latest init --id 0938f308-633d-4b12-bea3-7508fefbf5a7

echo.
echo PASO 3: Generar APK
echo Esto tardara 10-15 minutos...
echo.
call "%NODE_PATH%\npx.cmd" eas build --platform android --profile preview

echo.
echo ========================================
echo  PROCESO COMPLETADO
echo ========================================
echo.
echo Recibiras un link para descargar el APK
echo.

pause
