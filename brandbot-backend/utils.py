def extract_sections(full_response: str):
    # Split into 3 parts: output, rationale, suggestions
    parts = full_response.split("Rationale:")
    if len(parts) < 2:
        return full_response, "Not available", "Not available"
    
    content = parts[0].strip()
    rationale_part = parts[1].split("Marketing Suggestions:")
    rationale = rationale_part[0].strip()
    suggestions = rationale_part[1].strip() if len(rationale_part) > 1 else "Not available"
    
    return content, rationale, suggestions
