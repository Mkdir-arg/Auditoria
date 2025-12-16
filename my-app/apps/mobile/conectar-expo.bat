@echo off
REM Buscar Node.js
set NODE_PATH=
if exist "C:\Program Files\nodejs\node.exe" set NODE_PATH=C:\Program Files\nodejs
if exist "C:\Program Files (x86)\nodejs\node.exe" set NODE_PATH=C:\Program Files (x86)\nodejs
if exist "%USERPROFILE%\AppData\Local\Programs\nodejs\node.exe" set NODE_PATH=%USERPROFILE%\AppData\Local\Programs\nodejs

set PATH=%NODE_PATH%;%PATH%

echo Conectando proyecto a Expo...
"%NODE_PATH%\npx.cmd" eas-cli@latest init --id 0938f308-633d-4b12-bea3-7508fefbf5a7

pause
