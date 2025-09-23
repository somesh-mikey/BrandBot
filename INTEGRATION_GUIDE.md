# BrandBot Frontend-Backend Integration Guide

## Overview
The BrandBot application is now fully integrated with the frontend communicating with the backend API to generate AI-powered content.

## Features
- ✅ Content Type selection (Social Post, Email, LinkedIn Post, Blog, SEO Article, PR Article, Deck)
- ✅ Content Goal input
- ✅ Media file upload support
- ✅ Real-time backend connection status
- ✅ Generated content display
- ✅ Audience targeting analysis
- ✅ Marketing suggestions

## Quick Start

### Option 1: Use the Start Scripts (Recommended)
**Windows:**
```bash
start-servers.bat
```

**Linux/Mac:**
```bash
./start-servers.sh
```

### Option 2: Manual Start

1. **Start Backend Server:**
   ```bash
   cd brandbot-backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start Frontend Server:**
   ```bash
   cd brandbot-frontend
   npm run dev
   ```

## Access Points
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## How to Use

1. **Open the Frontend:** Navigate to http://localhost:5173
2. **Check Connection:** Look for the green dot next to "Backend: Connected" in the top-left
3. **Fill the Form:**
   - Select a Content Type from the dropdown
   - Enter your Content Goal in the text field
   - Optionally upload media files
4. **Generate Content:** Click "Generate Content" button
5. **View Results:** The generated content, audience analysis, and marketing suggestions will appear in the right column

## API Integration Details

### Request Format
The frontend sends a POST request to `/generate` with:
```json
{
  "prompt": "Content Type: Social Post\nContent Goal: Promote our new eco-friendly product",
  "business_id": "xyz-dimensions-client-01"
}
```

### Response Format
The backend returns:
```json
{
  "generated_content": "Your AI-generated content...",
  "rationale": "Audience targeting analysis...",
  "marketing_suggestions": "Marketing recommendations...",
  "readability_score": {...}
}
```

## Business Configuration
The system uses the business ID `xyz-dimensions-client-01` which is configured in `brandbot-backend/data/business_dna.json` with:
- Brand voice: professional, optimistic, actionable
- Target audience: sustainability-focused founders and marketers
- Tone guide: Avoid jargon, speak with clarity and purpose
- Brand positioning: Eco-friendly innovation and purpose-driven growth

## Troubleshooting

### Backend Not Connected
- Ensure the backend server is running on port 8000
- Check that all Python dependencies are installed: `pip install -r requirements.txt`
- Verify the business_dna.json file exists

### Frontend Issues
- Ensure Node.js dependencies are installed: `npm install`
- Check that the frontend is running on port 5173
- Verify the API URL in the dashboard component

### Common Issues
1. **CORS Errors:** The backend is configured to allow all origins
2. **Port Conflicts:** Make sure ports 8000 and 5173 are available
3. **Missing Dependencies:** Run `pip install -r requirements.txt` and `npm install`

## File Structure
```
DimensionsCMS/
├── brandbot-backend/          # FastAPI backend
│   ├── main.py               # API endpoints
│   ├── models.py             # Pydantic models
│   ├── gpt_handler.py        # GPT integration
│   └── data/
│       └── business_dna.json # Business configuration
├── brandbot-frontend/         # React frontend
│   └── src/
│       └── components/
│           └── dashboard.jsx  # Main integration component
├── start-servers.bat         # Windows start script
└── start-servers.sh          # Linux/Mac start script
```

