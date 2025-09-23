# BrandBot Backend (FastAPI)

FastAPI service powering content generation for Dimensions.

## Requirements
- Python 3.10+
- OpenAI API key

## Setup
```powershell
# From repo root: D:\DimensionsCMS
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install -r brandbot-backend/requirements.txt
```

Create `brandbot-backend/.env`:
```ini
OPENAI_API_KEY=sk-your-key-here
```
Notes:
- Save `.env` as UTF-8 (Notepad: Save As → Encoding: UTF-8).
- The backend reloads `.env` on each `/generate` call.

## Run
```powershell
.\.venv\Scripts\python -m uvicorn main:app --app-dir brandbot-backend --host 127.0.0.1 --port 8000 --reload
```
Open:
- Docs: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/health

## Endpoints
- GET `/` – Info
- GET `/health` – Health check
- GET `/business` – List available business IDs
- GET `/business/{business_id}` – Fetch DNA
- POST `/generate` – Generate content

Example body:
```json
{
  "prompt": "Content Type: Email\nContent Goal: Welcome new subscribers.",
  "business_id": "xyz-dimensions-client-01"
}
```

## Data
- `brandbot-backend/data/business_dna.json` (resolved relative to this folder)

## Troubleshooting
- 500 with OPENAI key missing: ensure `.env` exists and has `OPENAI_API_KEY` with no quotes/trailing spaces.
- 500 file-not-found: confirm `brandbot-backend/data/business_dna.json` exists.
- No reloads: ensure `--reload` flag is present.
