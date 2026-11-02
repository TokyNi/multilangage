"""
Main FastAPI application entry point.
Configures CORS, routers, multilingual health check and root endpoints.
"""
from typing import Optional
from fastapi import FastAPI, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.endpoints.items import router as items_router, resolve_language
from backend.app.core.translations import get_translation, LANGUAGE_NAMES, SUPPORTED_LANGUAGES

app = FastAPI(
    title="Multilangage API (Malagasy - Français - English)",
    description="Backend API multi-langue propulsé par FastAPI avec support dynamique pour le Malagasy, le Français et l'Anglais.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(items_router, prefix="/api")


@app.get("/")
def read_root(
    lang: Optional[str] = Query(None),
    accept_language: Optional[str] = Header(None, alias="Accept-Language")
):
    selected_lang = resolve_language(lang, accept_language)
    return {
        "status": "online",
        "app": "Multilangage API",
        "language": selected_lang,
        "language_name": LANGUAGE_NAMES.get(selected_lang, "Français"),
        "message": get_translation("welcome", selected_lang),
        "supported_languages": list(SUPPORTED_LANGUAGES),
        "docs": "/docs",
        "endpoints": {
            "health": "/api/health",
            "items": "/api/items",
            "stats": "/api/items/stats"
        }
    }


@app.get("/api/health")
def health_check(
    lang: Optional[str] = Query(None),
    accept_language: Optional[str] = Header(None, alias="Accept-Language")
):
    selected_lang = resolve_language(lang, accept_language)
    return {
        "status": "ok",
        "service": "FastAPI Multilangage Backend",
        "language": selected_lang,
        "message": get_translation("health_ok", selected_lang)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
