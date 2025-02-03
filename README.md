# PDF Processor App

A Node.js/Express backend and React frontend application that processes PDFs, extracts C++ coding problems, generates solutions using Gemini API, and provides PDF summaries.

## Quick Start

1. **Install:**
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd PDF-Processor-App

# Backend
cd server
npm install
# Add GEMINI_API_KEY and MONGODB_URI to .env

# Frontend
cd client
npm install
```

2. **Run:**
```bash
# Start backend (from server/)
npm start

# Start frontend (from client/)
npm start
```

## Project Structure
```
PDF-Processor-App/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
└── server/          # Express backend
    ├── server.js
    ├── uploads/     # PDF storage
    └── solutions/   # Generated solutions
```

## Features
- PDF upload and processing
- C++ problem extraction
- Solution generation via Gemini API
- PDF content summarization
- Solution download
- Processed PDF history

## Troubleshooting
- Port conflicts: Check for running processes
- API errors: Verify Gemini API key
- MongoDB issues: Check connection URI
- Upload problems: Verify uploads directory exists

Remember to replace YOUR_USERNAME, YOUR_REPO_NAME, YOUR_GEMINI_API_KEY, and MongoDB URI with actual values.
