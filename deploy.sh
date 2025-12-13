#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")"

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
  echo "Committing changes..."
  git add .
  git commit -m "Update: Add root route, health check, and improve CORS"
  git push origin main
  echo "Changes pushed to repository. Render will automatically deploy the updates."
else
  echo "No changes to commit. Deployment is up to date."
fi

echo "✅ Deployment initiated. Check Render dashboard for progress."
