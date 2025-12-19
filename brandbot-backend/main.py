from fastapi import FastAPI, HTTPException, Query, UploadFile, File, Form
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from models import (
    PromptRequest, GPTResponse, ClientCreate, ClientUpdate, Client,
    ContentRulesGlobal, ContentRulesClient, ContentRulesResponse,
    ContentPreviewRequest, ContentPreviewResponse
)
from gpt_handler import call_gpt, analyze_readability
from prompt_stack import load_business_dna, build_full_prompt
from utils import extract_sections
from admin_storage import (
    load_clients, create_client, update_client, delete_client, get_client,
    search_clients, load_content_rules, update_global_rules, update_client_rules,
    get_client_rules
)
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="BrandBot API",
              description="AI-powered content generation for Dimensions")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/")
def read_root():
    return {"message": "BrandBot API is running! Use /docs for API documentation."}


@app.get("/business")
def list_businesses():
    """List available business IDs."""
    from json import load
    try:
        with open("data/business_dna.json", "r") as f:
            data = load(f)
        return {"available_business_ids": list(data.keys())}
    except Exception as e:
        logger.error(f"Error reading business DNA: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to read business configurations")


@app.get("/business/{business_id}")
def get_business_info(business_id: str):
    """Get business DNA information for a specific business ID"""
    dna = load_business_dna(business_id)
    if not dna:
        raise HTTPException(
            status_code=404, detail=f"Business ID '{business_id}' not found")
    return {"business_id": business_id, "dna": dna}


@app.post("/generate", response_model=GPTResponse)
def generate_content(req: PromptRequest):
    """Generate content based on prompt and business DNA or client profile"""
    try:
        logger.info(
            f"Received request: business_id={req.business_id}, client_id={req.client_id}, prompt={req.prompt[:50]}...")

        # Build the full prompt based on client_id or business_id
        if req.client_id:
            # Use client profile and document
            client = get_client(req.client_id)
            if not client:
                raise HTTPException(
                    status_code=404, detail=f"Client ID '{req.client_id}' not found")

            # Build prompt with client profile and document
            client_context = (
                f"You are an expert content writer for {client.company_name}.\n"
                f"- Brand Tone: {client.brand_tone}\n"
                f"- Audience Type: {client.audience_type}\n"
                f"- Plan Type: {client.plan_type}\n"
            )

            # Add instruction document if available
            if client.instruction_document:
                client_context += f"\nClient Instructions:\n{client.instruction_document}\n"

            client_context += f"\nUser Request: {req.prompt}\n\n"
            client_context += "Generate a response that aligns with the client's brand, audience, and instructions above. Then explain your choices in a rationale and provide 2 marketing suggestions."

            full_prompt = client_context
            logger.info(
                f"Built prompt with client profile: {len(full_prompt)} characters")

        elif req.business_id:
            # Use business DNA (backward compatibility)
            dna = load_business_dna(req.business_id)
            if not dna:
                raise HTTPException(
                    status_code=404, detail=f"Business ID '{req.business_id}' not found")

            # Build the full prompt
            full_prompt = build_full_prompt(req.prompt, dna)
            logger.info(
                f"Built prompt with business DNA: {len(full_prompt)} characters")
        else:
            raise HTTPException(
                status_code=400, detail="Either client_id or business_id must be provided")

        # Call GPT
        gpt_output = call_gpt(full_prompt)
        logger.info(f"Received GPT response: {len(gpt_output)} characters")

        # Extract sections
        content, rationale, suggestions = extract_sections(gpt_output)

        # Analyze readability
        readability = analyze_readability(content)
        logger.info(f"Readability analysis: {readability}")

        # Create response
        response = GPTResponse(
            generated_content=content,
            rationale=rationale,
            marketing_suggestions=suggestions,
            readability_score=readability
        )

        logger.info("Successfully generated response")
        return response

    except HTTPException as e:
        # Re-raise FastAPI HTTP errors (e.g., 404 for unknown business_id)
        raise e
    except Exception as e:
        logger.error(f"Error in generate_content: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "BrandBot API"}

# Admin API Endpoints

# Client Management


@app.get("/admin/clients")
def get_clients(
    search: str = Query("", description="Search query for clients"),
    plan_type: str = Query("", description="Filter by plan type"),
    status: str = Query("", description="Filter by status"),
    page: int = Query(1, description="Page number, starting at 1"),
    page_size: int = Query(10, description="Number of items per page")
):
    """Get clients with optional filtering and pagination

    Returns a JSON object with 'items' (list of clients for the page) and 'total' (total matching count).
    """
    try:
        clients_page, total = search_clients(
            search, plan_type, status, page, page_size)
        return {"items": clients_page, "total": total}
    except Exception as e:
        logger.error(f"Error getting clients: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve clients")


@app.post("/admin/clients", response_model=Client)
def create_new_client(client_data: ClientCreate):
    """Create a new client"""
    try:
        client = create_client(client_data.dict())
        logger.info(f"Created new client: {client.company_name}")
        return client
    except Exception as e:
        logger.error(f"Error creating client: {e}")
        raise HTTPException(status_code=500, detail="Failed to create client")


@app.get("/admin/clients/{client_id}", response_model=Client)
def get_client_by_id(client_id: int):
    """Get a specific client by ID"""
    client = get_client(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@app.put("/admin/clients/{client_id}", response_model=Client)
def update_client_by_id(client_id: int, client_update: ClientUpdate):
    """Update a client by ID"""
    try:
        # Convert Pydantic model to dict, excluding None values
        update_data = {k: v for k, v in client_update.dict().items()
                       if v is not None}

        client = update_client(client_id, update_data)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")

        logger.info(f"Updated client: {client.company_name}")
        return client
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating client: {e}")
        raise HTTPException(status_code=500, detail="Failed to update client")


@app.delete("/admin/clients/{client_id}")
def delete_client_by_id(client_id: int):
    """Delete a client by ID"""
    try:
        success = delete_client(client_id)
        if not success:
            raise HTTPException(status_code=404, detail="Client not found")

        logger.info(f"Deleted client with ID: {client_id}")
        return {"message": "Client deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting client: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete client")


@app.post("/admin/clients/{client_id}/upload-document")
async def upload_client_document(client_id: int, file: UploadFile = File(...)):
    """Upload instruction document for a client"""
    try:
        logger.info(
            f"Received document upload request for client {client_id}, filename: {file.filename}")

        # Verify client exists
        client = get_client(client_id)
        if not client:
            logger.error(f"Client {client_id} not found")
            raise HTTPException(status_code=404, detail="Client not found")

        # Read file content
        content = await file.read()
        logger.info(f"Read {len(content)} bytes from file")

        # Try to decode as text (for .txt files)
        try:
            document_text = content.decode('utf-8')
            logger.info("Successfully decoded file as UTF-8")
        except UnicodeDecodeError:
            # If not UTF-8, try other encodings
            try:
                document_text = content.decode('latin-1')
                logger.info("Successfully decoded file as Latin-1")
            except Exception as decode_err:
                logger.error(f"Failed to decode file: {decode_err}")
                raise HTTPException(
                    status_code=400, detail="File must be a text file")

        # Update client with document content
        update_data = {
            "instruction_document": document_text,
            "document_filename": file.filename
        }

        logger.info(f"Updating client {client_id} with document data")
        updated_client = update_client(client_id, update_data)
        if not updated_client:
            logger.error(f"Failed to update client {client_id}")
            raise HTTPException(
                status_code=404, detail="Client not found after update")

        logger.info(
            f"Successfully uploaded document for client {client_id}: {file.filename} ({len(document_text)} chars)")
        return {
            "message": "Document uploaded successfully",
            "filename": file.filename,
            "size": len(document_text)
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"Error uploading document for client {client_id}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Failed to upload document: {str(e)}")


@app.get("/admin/clients/{client_id}/document")
def get_client_document(client_id: int):
    """Get instruction document for a client"""
    try:
        client = get_client(client_id)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")

        return {
            "client_id": client_id,
            "document_content": client.instruction_document or "",
            "filename": client.document_filename or None,
            "has_document": client.instruction_document is not None
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting client document: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve client document")


@app.get("/clients")
def get_all_clients_for_selection():
    """Get all active clients for client-side selection"""
    try:
        # Exclude documents for faster loading - not needed for selection dropdown
        clients = load_clients(exclude_documents=True)
        active_clients = [
            client for client in clients if client.status == "active"]
        return [
            {
                "id": client.id,
                "company_name": client.company_name,
                "plan_type": client.plan_type,
                "brand_tone": client.brand_tone,
                "audience_type": client.audience_type
            }
            for client in active_clients
        ]
    except Exception as e:
        logger.error(f"Error getting clients for selection: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve clients")

# Content Rules Management


@app.get("/admin/content-rules", response_model=ContentRulesResponse)
def get_content_rules():
    """Get all content rules (global and client-specific)"""
    try:
        rules = load_content_rules()
        return ContentRulesResponse(
            global_rules=ContentRulesGlobal(**rules["global_rules"]),
            client_rules=[
                ContentRulesClient(client_id=int(client_id), **client_rules)
                for client_id, client_rules in rules["client_rules"].items()
            ]
        )
    except Exception as e:
        logger.error(f"Error getting content rules: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve content rules")


@app.put("/admin/content-rules/global")
def update_global_content_rules(global_rules: ContentRulesGlobal):
    """Update global content rules"""
    try:
        update_global_rules(global_rules.dict())
        logger.info("Updated global content rules")
        return {"message": "Global content rules updated successfully"}
    except Exception as e:
        logger.error(f"Error updating global content rules: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to update global content rules")


@app.put("/admin/content-rules/client/{client_id}")
def update_client_content_rules(client_id: int, client_rules: ContentRulesClient):
    """Update client-specific content rules"""
    try:
        # Verify client exists
        client = get_client(client_id)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")

        update_client_rules(client_id, client_rules.dict())
        logger.info(f"Updated content rules for client {client_id}")
        return {"message": f"Content rules updated for client {client_id}"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating client content rules: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to update client content rules")


@app.post("/admin/content-preview", response_model=ContentPreviewResponse)
def preview_content_generation(preview_request: ContentPreviewRequest):
    """Preview content generation with specific rules"""
    try:
        # Build a custom prompt based on the rules
        tone = preview_request.tone
        audience = preview_request.audience
        mandatory_keywords = preview_request.mandatory_keywords
        excluded_keywords = preview_request.excluded_keywords
        content_length = preview_request.content_length
        marketing_suggestions = preview_request.marketing_suggestions

        # Create a custom prompt
        custom_prompt = f"""
        Generate content with the following specifications:
        - Tone: {tone}
        - Audience: {audience}
        - Content Length: {content_length}
        - Mandatory Keywords: {', '.join(mandatory_keywords) if mandatory_keywords else 'None'}
        - Excluded Keywords: {', '.join(excluded_keywords) if excluded_keywords else 'None'}
        - Marketing Suggestions: {'Enabled' if marketing_suggestions else 'Disabled'}
        
        User Request: {preview_request.sample_prompt}
        
        Generate a response that aligns with the above specifications. Then explain your choices in a rationale and provide 2 marketing suggestions.
        """

        # Call GPT with custom prompt
        gpt_output = call_gpt(custom_prompt)

        # Extract sections
        content, rationale, suggestions = extract_sections(gpt_output)

        # Create response
        return ContentPreviewResponse(
            generated_content=content,
            settings_used={
                "tone": tone,
                "audience": audience,
                "mandatory_keywords": mandatory_keywords,
                "excluded_keywords": excluded_keywords,
                "content_length": content_length,
                "marketing_suggestions": marketing_suggestions
            }
        )

    except Exception as e:
        logger.error(f"Error generating content preview: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to generate content preview")
