@echo off
REM Build a single-file Windows executable for AK Assistant.
REM Requires Python, pip, and pyinstaller installed.

python -m pip install --upgrade pyinstaller
pyinstaller --onefile --windowed assistant.py --name "AK Assistant" --icon AKAssistantIcon.ico --add-data "ak;ak" --add-data "ak\ui;ak\ui"
echo Build complete. Check the dist\AK Assistant.exe file.
pause
