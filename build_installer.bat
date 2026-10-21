@echo off
REM Build a Windows installer for AK Assistant using Inno Setup.
REM Requires Inno Setup to be installed and available as iscc in PATH.

if not exist dist\"AK Assistant.exe" (
    echo Build the executable first using build_app.bat
    pause
    exit /b 1
)

iscc installer.iss
if %ERRORLEVEL% neq 0 (
    echo Installer build failed.
    pause
    exit /b 1
)

echo Installer build complete.
pause
