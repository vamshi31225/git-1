@echo off
cd "c:\Users\pvred\OneDrive\Desktop\gen ai"
start /b npm start
timeout /t 3 /nobreak > nul
start http://localhost:8081