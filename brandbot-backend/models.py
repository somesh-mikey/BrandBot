from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PromptRequest(BaseModel):
    prompt: str
    business_id: str

class GPTResponse(BaseModel):
    generated_content: str
    rationale: str
    marketing_suggestions: str
    readability_score: dict

# Admin Models
class ClientCreate(BaseModel):
    company_name: str
    contact_person: str
    email: str
    plan_type: str
    brand_tone: str
    audience_type: str
    marketing_suggestions: bool = True

class ClientUpdate(BaseModel):
    company_name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    plan_type: Optional[str] = None
    brand_tone: Optional[str] = None
    audience_type: Optional[str] = None
    marketing_suggestions: Optional[bool] = None

class Client(BaseModel):
    id: int
    company_name: str
    contact_person: str
    email: str
    plan_type: str
    brand_tone: str
    audience_type: str
    marketing_suggestions: bool
    status: str = "active"
    date_joined: datetime
    last_activity: Optional[datetime] = None

class ContentRulesGlobal(BaseModel):
    enabled: bool = True
    default_tone: str = "Professional"
    default_audience: str = "B2B"
    mandatory_keywords: List[str] = []
    excluded_keywords: List[str] = []
    default_content_length: str = "medium"

class ContentRulesClient(BaseModel):
    client_id: int
    tone: Optional[str] = None
    audience: Optional[str] = None
    mandatory_keywords: List[str] = []
    excluded_keywords: List[str] = []
    content_length: Optional[str] = None
    marketing_suggestions: bool = True

class ContentRulesResponse(BaseModel):
    global_rules: ContentRulesGlobal
    client_rules: List[ContentRulesClient]

class ContentPreviewRequest(BaseModel):
    tone: str
    audience: str
    mandatory_keywords: List[str] = []
    excluded_keywords: List[str] = []
    content_length: str = "medium"
    marketing_suggestions: bool = True
    sample_prompt: str = "Write a product description"

class ContentPreviewResponse(BaseModel):
    generated_content: str
    settings_used: dict
