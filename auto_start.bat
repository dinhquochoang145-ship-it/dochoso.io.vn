@echo off
title AUTO START - DNA KINH DOANH
echo ==================================================
echo 🚀 DANG KHI DONG CAC CONG CU RUNTIME CHAY NGAM...
echo ==================================================
cd /d "E:\TỬ VI ADS"

:: Start MCP Server
echo [*] Khoi dong MCP Server (Port 3001)...
start /b node mcp/index.js

:: Start Chatbot Web Server
echo [*] Khoi dong Chatbot Web Server (Port 3000)...
start /b node server.js

echo ==================================================
echo 🎉 DA KHI DONG THANH CONG!
echo ==================================================
pause
