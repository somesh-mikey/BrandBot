import json
import os
from datetime import datetime
from typing import List, Dict, Optional
from models import Client, ContentRulesGlobal, ContentRulesClient

# Get the directory where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# File paths (relative to brandbot-backend directory)
CLIENTS_FILE = os.path.join(BASE_DIR, "data", "clients.json")
CONTENT_RULES_FILE = os.path.join(BASE_DIR, "data", "content_rules.json")


def ensure_data_directory():
    """Ensure the data directory exists"""
    data_dir = os.path.join(BASE_DIR, "data")
    os.makedirs(data_dir, exist_ok=True)


def load_clients(exclude_documents: bool = False) -> List[Client]:
    """Load clients from JSON file
    
    Args:
        exclude_documents: If True, exclude instruction_document field for faster loading
    """
    ensure_data_directory()
    try:
        if os.path.exists(CLIENTS_FILE):
            with open(CLIENTS_FILE, "r") as f:
                data = json.load(f)
                if exclude_documents:
                    # Remove instruction_document to speed up loading for list views
                    for client in data:
                        if "instruction_document" in client:
                            client.pop("instruction_document", None)
                return [Client(**client) for client in data]
        return []
    except Exception as e:
        print(f"Error loading clients: {e}")
        return []


def save_clients(clients: List[Client]):
    """Save clients to JSON file"""
    ensure_data_directory()
    try:
        with open(CLIENTS_FILE, "w") as f:
            json.dump([client.dict()
                      for client in clients], f, indent=2, default=str)
    except Exception as e:
        print(f"Error saving clients: {e}")
        raise e


def get_next_client_id() -> int:
    """Get the next available client ID"""
    clients = load_clients()
    if not clients:
        return 1
    return max(client.id for client in clients) + 1


def create_client(client_data: dict) -> Client:
    """Create a new client"""
    clients = load_clients()
    new_client = Client(
        id=get_next_client_id(),
        date_joined=datetime.now(),
        **client_data
    )
    clients.append(new_client)
    save_clients(clients)
    return new_client


def update_client(client_id: int, update_data: dict) -> Optional[Client]:
    """Update an existing client"""
    clients = load_clients()
    for i, client in enumerate(clients):
        if client.id == client_id:
            # Update only provided fields
            for key, value in update_data.items():
                if value is not None:
                    setattr(clients[i], key, value)
            clients[i].last_activity = datetime.now()
            save_clients(clients)
            return clients[i]
    return None


def delete_client(client_id: int) -> bool:
    """Delete a client"""
    clients = load_clients()
    original_count = len(clients)
    clients = [client for client in clients if client.id != client_id]
    if len(clients) < original_count:
        save_clients(clients)
        return True
    return False


def get_client(client_id: int) -> Optional[Client]:
    """Get a specific client by ID"""
    clients = load_clients()
    for client in clients:
        if client.id == client_id:
            return client
    return None


def search_clients(
    query: str = "",
    plan_filter: str = "",
    status_filter: str = "",
    page: int = 1,
    page_size: int = 10
) -> tuple:
    """Search and filter clients with pagination. Returns (page_items, total_count).
    
    Optimized to exclude instruction_document for faster loading.
    """
    # Exclude documents for faster list loading - documents are loaded separately when needed
    clients = load_clients(exclude_documents=True)

    if query:
        clients = [client for client in clients
                   if query.lower() in (client.company_name or "").lower()
                   or query.lower() in (client.contact_person or "").lower()
                   or query.lower() in (client.email or "").lower()]

    if plan_filter:
        clients = [client for client in clients if (
            client.plan_type or "").lower() == plan_filter.lower()]

    if status_filter:
        clients = [client for client in clients if (
            client.status or "").lower() == status_filter.lower()]

    total = len(clients)
    # Ensure sane pagination values
    try:
        page = max(1, int(page))
    except Exception:
        page = 1
    try:
        page_size = max(1, int(page_size))
    except Exception:
        page_size = 10

    start = (page - 1) * page_size
    end = start + page_size
    page_items = clients[start:end]

    return page_items, total


def load_content_rules() -> Dict:
    """Load content rules from JSON file"""
    ensure_data_directory()
    try:
        if os.path.exists(CONTENT_RULES_FILE):
            with open(CONTENT_RULES_FILE, "r") as f:
                return json.load(f)
        return {
            "global_rules": {
                "enabled": True,
                "default_tone": "Professional",
                "default_audience": "B2B",
                "mandatory_keywords": [],
                "excluded_keywords": [],
                "default_content_length": "medium"
            },
            "client_rules": {}
        }
    except Exception as e:
        print(f"Error loading content rules: {e}")
        return {
            "global_rules": {
                "enabled": True,
                "default_tone": "Professional",
                "default_audience": "B2B",
                "mandatory_keywords": [],
                "excluded_keywords": [],
                "default_content_length": "medium"
            },
            "client_rules": {}
        }


def save_content_rules(rules: Dict):
    """Save content rules to JSON file"""
    ensure_data_directory()
    try:
        with open(CONTENT_RULES_FILE, "w") as f:
            json.dump(rules, f, indent=2)
    except Exception as e:
        print(f"Error saving content rules: {e}")
        raise e


def update_global_rules(global_rules: dict):
    """Update global content rules"""
    rules = load_content_rules()
    rules["global_rules"].update(global_rules)
    save_content_rules(rules)


def update_client_rules(client_id: int, client_rules: dict):
    """Update client-specific content rules"""
    rules = load_content_rules()
    rules["client_rules"][str(client_id)] = client_rules
    save_content_rules(rules)


def get_client_rules(client_id: int) -> Optional[dict]:
    """Get client-specific content rules"""
    rules = load_content_rules()
    return rules["client_rules"].get(str(client_id))
