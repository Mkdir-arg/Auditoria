@echo off
echo ========================================
echo  INSTALANDO DEPENDENCIAS
echo ========================================

REM Buscar Node.js
set NODE_PATH=
if exist "C:\Program Files\nodejs\node.exe" set NODE_PATH=C:\Program Files\nodejs
if exist "C:\Program Files (x86)\nodejs\node.exe" set NODE_PATH=C:\Program Files (x86)\nodejs
if exist "%USERPROFILE%\AppData\Local\Programs\nodejs\node.exe" set NODE_PATH=%USERPROFILE%\AppData\Local\Programs\nodejs
if exist "%ProgramFiles%\nodejs\node.exe" set NODE_PATH=%ProgramFiles%\nodejs

if "%NODE_PATH%"=="" (
    echo ERROR: Node.js no encontrado
    echo Cierra esta ventana y abre una nueva terminal
    pause
    exit /b 1
)

echo Node.js: %NODE_PATH%
set PATH=%NODE_PATH%;%PATH%

echo.
echo Instalando dependencias...
"%NODE_PATH%\npm.cmd" install

echo.
echo Listo!
pause
