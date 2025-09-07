import os
import json
from datetime import datetime
from typing import List, Dict, Optional
import sqlite3

# Database setup
DB_PATH = "translation_history.db"

def init_db():
    """Initialize the translation history database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS translation_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            input_text TEXT,
            prediction TEXT NOT NULL,
            confidence REAL NOT NULL,
            processing_time REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            mode TEXT DEFAULT 'translate'
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_stats (
            user_id TEXT PRIMARY KEY,
            total_translations INTEGER DEFAULT 0,
            accuracy_score REAL DEFAULT 0.0,
            last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def save_translation(user_id: str, prediction: str, confidence: float, 
                    input_text: str = None, processing_time: float = None, 
                    mode: str = 'translate'):
    """Save a translation to the history"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO translation_history 
        (user_id, input_text, prediction, confidence, processing_time, mode)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (user_id, input_text, prediction, confidence, processing_time, mode))
    
    # Update user stats
    cursor.execute('''
        INSERT OR REPLACE INTO user_stats (user_id, total_translations, last_activity)
        VALUES (
            ?,
            COALESCE((SELECT total_translations FROM user_stats WHERE user_id = ?), 0) + 1,
            CURRENT_TIMESTAMP
        )
    ''', (user_id, user_id))
    
    conn.commit()
    conn.close()

def get_user_history(user_id: str, limit: int = 50) -> List[Dict]:
    """Get translation history for a user"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT input_text, prediction, confidence, processing_time, timestamp, mode
        FROM translation_history
        WHERE user_id = ?
        ORDER BY timestamp DESC
        LIMIT ?
    ''', (user_id, limit))
    
    rows = cursor.fetchall()
    conn.close()
    
    history = []
    for row in rows:
        history.append({
            'input_text': row[0],
            'prediction': row[1],
            'confidence': row[2],
            'processing_time': row[3],
            'timestamp': row[4],
            'mode': row[5]
        })
    
    return history

def get_user_stats(user_id: str) -> Dict:
    """Get user statistics"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT total_translations, accuracy_score, last_activity, created_at
        FROM user_stats
        WHERE user_id = ?
    ''', (user_id,))
    
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            'total_translations': row[0],
            'accuracy_score': row[1],
            'last_activity': row[2],
            'created_at': row[3]
        }
    else:
        return {
            'total_translations': 0,
            'accuracy_score': 0.0,
            'last_activity': None,
            'created_at': None
        }

def get_global_stats() -> Dict:
    """Get global statistics"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM translation_history')
    total_translations = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(DISTINCT user_id) FROM translation_history')
    unique_users = cursor.fetchone()[0]
    
    cursor.execute('SELECT AVG(confidence) FROM translation_history')
    avg_confidence = cursor.fetchone()[0] or 0.0
    
    cursor.execute('SELECT AVG(processing_time) FROM translation_history WHERE processing_time IS NOT NULL')
    avg_processing_time = cursor.fetchone()[0] or 0.0
    
    conn.close()
    
    return {
        'total_translations': total_translations,
        'unique_users': unique_users,
        'avg_confidence': avg_confidence,
        'avg_processing_time': avg_processing_time
    }

def get_top_predictions(user_id: str = None, limit: int = 10) -> List[Dict]:
    """Get most common predictions"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if user_id:
        cursor.execute('''
            SELECT prediction, COUNT(*) as count, AVG(confidence) as avg_confidence
            FROM translation_history
            WHERE user_id = ?
            GROUP BY prediction
            ORDER BY count DESC
            LIMIT ?
        ''', (user_id, limit))
    else:
        cursor.execute('''
            SELECT prediction, COUNT(*) as count, AVG(confidence) as avg_confidence
            FROM translation_history
            GROUP BY prediction
            ORDER BY count DESC
            LIMIT ?
        ''', (limit,))
    
    rows = cursor.fetchall()
    conn.close()
    
    return [
        {
            'prediction': row[0],
            'count': row[1],
            'avg_confidence': row[2]
        }
        for row in rows
    ]

def export_user_data(user_id: str, format: str = 'json') -> str:
    """Export user data in specified format"""
    history = get_user_history(user_id, limit=1000)
    stats = get_user_stats(user_id)
    
    data = {
        'user_id': user_id,
        'stats': stats,
        'history': history,
        'exported_at': datetime.now().isoformat()
    }
    
    if format == 'json':
        filename = f"user_data_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        return filename
    else:
        raise ValueError(f"Unsupported format: {format}")

# Initialize database on import
init_db()
