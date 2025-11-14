# backend/db.py

import sqlite3
from pathlib import Path

DB_PATH = Path("data/locations.db")

def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS locations (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            city TEXT NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            accessibility_rating INTEGER,

            -- Физическая инвалидность
            wheelchair_friendly BOOLEAN,
            ramp BOOLEAN,
            elevator BOOLEAN,
            accessible_restroom BOOLEAN,
            accessible_parking BOOLEAN,

            -- Слух
            visual_alerts BOOLEAN,
            subtitles_available BOOLEAN,
            text_communication BOOLEAN,

            -- Зрение
            braille_signs BOOLEAN,
            audio_guides BOOLEAN,
            high_contrast_text BOOLEAN,
            good_lighting BOOLEAN,

            -- Когнитивные
            simple_navigation BOOLEAN,
            trained_staff BOOLEAN,
            low_noise BOOLEAN
        )
    """)
    conn.commit()
    conn.close()