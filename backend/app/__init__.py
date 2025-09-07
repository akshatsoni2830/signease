# SignEase Backend Application Package
__version__ = "1.0.0"
__author__ = "SignEase Team"

from .main import app
from .auth_utils import verify_jwt_and_get_user
from .model_utils import (
    extract_landmarks_from_bgr_image,
    extract_landmarks_static,
    predict_from_landmarks,
    normalize_vec
)
from .custom_store import add_samples, get_prototypes, list_labels
from .history_utils import (
    save_translation,
    get_user_history,
    get_user_stats,
    get_global_stats
)

__all__ = [
    'app',
    'verify_jwt_and_get_user',
    'extract_landmarks_from_bgr_image',
    'extract_landmarks_static',
    'predict_from_landmarks',
    'normalize_vec',
    'add_samples',
    'get_prototypes',
    'list_labels',
    'save_translation',
    'get_user_history',
    'get_user_stats',
    'get_global_stats'
]
