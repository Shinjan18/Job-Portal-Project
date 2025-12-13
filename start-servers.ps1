# Start backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

# Start frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"
