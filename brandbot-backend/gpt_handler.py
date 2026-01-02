import openai
import os
from dotenv import load_dotenv
import textstat

# Robustly load environment variables, handling files saved with non-UTF-8 encodings (e.g., Notepad UTF-16)
try:
    load_dotenv()
except UnicodeDecodeError:
    for _encoding in ("utf-16", "utf-16-le", "utf-16-be", "utf-8-sig"):
        try:
            load_dotenv(encoding=_encoding, override=True)
            break
        except UnicodeDecodeError:
            continue

_openai_client = None


def _get_openai_client():
    global _openai_client
    if _openai_client is not None:
        return _openai_client

    # Reload env from brandbot-backend/.env so adding/updating works without restart
    try:
        import os as _os
        base_dir = _os.path.dirname(_os.path.abspath(__file__))
        env_path = _os.path.join(base_dir, ".env")
        load_dotenv(dotenv_path=env_path, override=True)
    except UnicodeDecodeError:
        for _encoding in ("utf-16", "utf-16-le", "utf-16-be", "utf-8-sig"):
            try:
                load_dotenv(dotenv_path=env_path, encoding=_encoding, override=True)
                break
            except UnicodeDecodeError:
                continue

    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        # Defer failure until the first GPT call rather than on module import
        raise RuntimeError("OPENAI_API_KEY is not set. Please configure your environment.")
    _openai_client = openai.OpenAI(api_key=openai_api_key)
    return _openai_client


def call_gpt(prompt: str):
    client = _get_openai_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are BrandBot, a helpful content assistant for Dimensions."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2000,  # Increased to handle longer prompts with file content
    )
    return response.choices[0].message.content.strip()


def analyze_readability(text: str):
    sentences = textstat.sentence_count(text)
    words = textstat.lexicon_count(text, removepunct=True)
    avg_sentence_length = words / sentences if sentences > 0 else 0
    return {
        "grade_level": round(textstat.flesch_kincaid_grade(text), 2),
        "sentence_length": round(avg_sentence_length, 2)
    }
