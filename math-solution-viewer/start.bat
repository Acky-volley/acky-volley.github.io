@echo off
chcp 65001 > nul
echo ==================================================
echo   MathArchive - 数学問題・模範解答アーカイブ
echo ==================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Pythonローカルサーバーを起動しています (http://localhost:8000)...
    start "" http://localhost:8000
    python -m http.server 8000
) else (
    echo ブラウザで直接開きます...
    start "" index.html
)
pause
