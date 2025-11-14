# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from pathlib import Path
import uuid

DB_PATH = Path("data/locations.db")
DB_PATH.parent.mkdir(exist_ok=True)

from db import init_db  # ← импортируем из db.py

app = FastAPI(title="MAX Accessibility API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def read_root():
    return {"message": "MAX Accessibility API", "docs": "/docs"}

# GET /api/locations — возвращает данные в camelCase
@app.get("/api/locations")
def get_locations():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM locations").fetchall()
    conn.close()

    result = []
    for row in rows:
        item = dict(row)
        # Маппинг snake_case → camelCase
        mapped = {
            "id": item["id"],
            "name": item["name"],
            "city": item["city"],
            "latitude": item["latitude"],
            "longitude": item["longitude"],
            "accessibilityRating": item["accessibility_rating"],

            # Физ
            "wheelchairFriendly": item["wheelchair_friendly"],
            "ramp": item["ramp"],
            "elevator": item["elevator"],
            "accessibleRestroom": item["accessible_restroom"],
            "accessibleParking": item["accessible_parking"],

            # Слух
            "visualAlerts": item["visual_alerts"],
            "subtitlesAvailable": item["subtitles_available"],
            "textCommunication": item["text_communication"],

            # Зрение
            "brailleSigns": item["braille_signs"],
            "audioGuides": item["audio_guides"],
            "highContrastText": item["high_contrast_text"],
            "goodLighting": item["good_lighting"],

            # Когнитивные
            "simpleNavigation": item["simple_navigation"],
            "trainedStaff": item["trained_staff"],
            "lowNoise": item["low_noise"],
        }
        result.append(mapped)
    return result

# POST /api/locations — принимает camelCase, сохраняет в snake_case
@app.post("/api/locations")
def create_location(data: dict):
    loc_id = str(uuid.uuid4())

    # Маппинг camelCase → snake_case
    payload = {
        "id": loc_id,
        "name": data.get("name", "Новая локация"),
        "city": data.get("city", "Москва"),
        "latitude": data.get("latitude", 0),
        "longitude": data.get("longitude", 0),
        "accessibility_rating": data.get("accessibilityRating", 3),

        "wheelchair_friendly": data.get("wheelchairFriendly", False),
        "ramp": data.get("ramp", False),
        "elevator": data.get("elevator", False),
        "accessible_restroom": data.get("accessibleRestroom", False),
        "accessible_parking": data.get("accessibleParking", False),

        "visual_alerts": data.get("visualAlerts", False),
        "subtitles_available": data.get("subtitlesAvailable", False),
        "text_communication": data.get("textCommunication", False),

        "braille_signs": data.get("brailleSigns", False),
        "audio_guides": data.get("audioGuides", False),
        "high_contrast_text": data.get("highContrastText", False),
        "good_lighting": data.get("goodLighting", False),

        "simple_navigation": data.get("simpleNavigation", False),
        "trained_staff": data.get("trainedStaff", False),
        "low_noise": data.get("lowNoise", False),
    }

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO locations VALUES (
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?, ?
        )
    """, tuple(payload.values()))
    conn.commit()
    conn.close()

    return {**payload, "id": loc_id}

# DELETE /api/locations/{loc_id}
@app.delete("/api/locations/{loc_id}")
def delete_location(loc_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM locations WHERE id = ?", (loc_id,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Location not found")
    conn.commit()
    conn.close()
    return {"message": "Location deleted", "id": loc_id}
