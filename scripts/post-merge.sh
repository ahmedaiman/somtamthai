#!/bin/bash
set -e

echo "Running post-merge setup for Next.js app..."

# Install npm dependencies if needed
if [ -f "package.json" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

echo "Post-merge setup complete."
