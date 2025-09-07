# backend/app/auth_utils.py
import os
import time
import requests
from functools import lru_cache
from typing import Dict, Any, Optional

# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "").strip()

if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL not set. Example: https://<ref>.supabase.co")
if not ANON_KEY:
    raise RuntimeError("SUPABASE_ANON_KEY (anon public key) not set.")

AUTH_USER_URL = f"{SUPABASE_URL}/auth/v1/user"


@lru_cache(maxsize=128)
def _headers() -> Dict[str, str]:
    # apikey header is required by Supabase Auth REST
    return {"apikey": ANON_KEY}


def _get_with_retry(url: str, headers: Dict[str, str], timeout: float = 8.0, retries: int = 2) -> requests.Response:
    last_exc: Optional[Exception] = None
    for attempt in range(retries + 1):
        try:
            resp = requests.get(url, headers=headers, timeout=timeout)
            return resp
        except requests.RequestException as e:
            last_exc = e
            # brief backoff on transient network issues
            time.sleep(0.3 * (attempt + 1))
    # If we get here, all attempts failed
    raise last_exc  # type: ignore


def verify_jwt_and_get_user(token: str) -> Dict[str, Any]:
    """
    Online validation via Supabase Auth REST.
    Returns the user object (dict) on success; raises ValueError/RuntimeError on failure.
    """
    if not token or not isinstance(token, str):
        raise ValueError("Missing token")

    try:
        resp = _get_with_retry(
            AUTH_USER_URL,
            headers={**_headers(), "Authorization": f"Bearer {token}"},
            timeout=8.0,
            retries=1,
        )
    except Exception as e:
        raise RuntimeError(f"Auth service unreachable: {e}")

    # If token invalid/expired or project mismatch, Supabase returns 401/403
    if resp.status_code == 401 or resp.status_code == 403:
        # Include short excerpt to help debugging, but avoid leaking full body
        raise ValueError(f"Unauthorized (status {resp.status_code}). Check token, project ref, and anon key.")
    if resp.status_code == 404:
        raise RuntimeError("Auth endpoint not found (check SUPABASE_URL).")
    if resp.status_code >= 500:
        raise RuntimeError(f"Auth service error (status {resp.status_code}). Try again.")

    try:
        data = resp.json()
    except ValueError:
        raise RuntimeError("Invalid JSON from auth service.")

    # Expected shape includes 'id' (UUID), 'email', etc.
    if "id" not in data:
        raise RuntimeError("Auth response missing 'id'.")
    return data


# --- Optional: FastAPI dependency helper ---
# Import and use in routes: `from app.auth_utils import get_user_id`
def get_user_id_from_authorization_header(authorization: Optional[str]) -> str:
    """
    Parse 'Authorization: Bearer <token>' and return Supabase user id (uuid) after validation.
    Raise ValueError on any problem to let the route convert to HTTP 401.
    """
    if not authorization or not authorization.lower().startswith("bearer "):
        raise ValueError("Missing bearer token")
    token = authorization.split(" ", 1)[1].strip()
    user = verify_jwt_and_get_user(token)
    return str(user.get("id"))
