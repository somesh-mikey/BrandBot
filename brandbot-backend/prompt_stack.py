import json
import os

def load_business_dna(business_id: str):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dna_path = os.path.join(base_dir, "data", "business_dna.json")
    with open(dna_path, "r") as f:
        dna = json.load(f)
    return dna.get(business_id, {})

def build_full_prompt(user_prompt: str, dna: dict):
    context = (
        f"You are an expert content writer for a brand with the following traits:\n"
        f"- Voice: {dna.get('brand_voice')}\n"
        f"- Target Audience: {dna.get('target_audience')}\n"
        f"- Brand Positioning: {dna.get('brand_positioning')}\n"
        f"- Tone Guide: {dna.get('tone_guide')}\n\n"
        f"User Request: {user_prompt}\n\n"
        f"Generate a response that aligns with the above. Then explain your choices in a rationale and provide 2 marketing suggestions."
    )
    return context
