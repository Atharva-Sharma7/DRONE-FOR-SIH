import re
import httpx
from urllib.parse import quote
from fastapi import APIRouter, HTTPException, Query, Response

router = APIRouter()

# In-memory audio cache for instant playback of common farm advisories
AUDIO_CACHE: dict[str, bytes] = {}

def chunk_text(text: str, max_chars: int = 150) -> list[str]:
    """Split text into spoken chunks under max_chars for the TTS engine."""
    clean_text = re.sub(r'[*_#`]', '', text).strip()
    if not clean_text:
        return []
    
    sentences = re.split(r'([।\.!\?\n]+)', clean_text)
    chunks = []
    current = ""
    for s in sentences:
        if not s:
            continue
        if len(current) + len(s) <= max_chars:
            current += s
        else:
            if current.strip():
                chunks.append(current.strip())
            if len(s) > max_chars:
                words = s.split(' ')
                sub = ""
                for w in words:
                    if len(sub) + len(w) + 1 <= max_chars:
                        sub += (" " + w if sub else w)
                    else:
                        if sub:
                            chunks.append(sub)
                        sub = w
                if sub:
                    chunks.append(sub)
                current = ""
            else:
                current = s
    if current.strip():
        chunks.append(current.strip())
    return chunks

@router.api_route("/speak", methods=["GET", "HEAD"])
async def get_tts_audio(
    text: str = Query(..., min_length=1),
    lang: str = Query("mr", description="Language code (mr, hi, en, te, ta, gu, pa)")
):
    """
    Generates and returns MP3 audio for regional Indian and English text.
    Enables native vernacular TTS for illiterate farmers across:
    Marathi (mr), Hindi (hi), Telugu (te), Tamil (ta), Gujarati (gu), Punjabi (pa), English (en).
    """
    cache_key = f"{lang}:{text}"
    if cache_key in AUDIO_CACHE:
        return Response(
            content=AUDIO_CACHE[cache_key],
            media_type="audio/mpeg",
            headers={"Cache-Control": "public, max-age=86400"}
        )

    lang_map = {
        "mr": "mr",
        "hi": "hi",
        "en": "en",
        "te": "te",
        "ta": "ta",
        "gu": "gu",
        "pa": "pa",
    }
    target_lang = lang_map.get(lang.lower(), "mr" if lang.startswith("mr") else "hi")

    chunks = chunk_text(text)
    if not chunks:
        raise HTTPException(status_code=400, detail="Empty text")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Referer": "https://translate.google.com/",
    }

    combined_audio = bytearray()
    async with httpx.AsyncClient(timeout=10.0, headers=headers) as client:
        for chunk in chunks:
            encoded_chunk = quote(chunk)
            url = f"https://translate.google.com/translate_tts?ie=UTF-8&q={encoded_chunk}&tl={target_lang}&client=tw-ob"
            try:
                resp = await client.get(url)
                if resp.status_code == 200 and resp.content:
                    combined_audio.extend(resp.content)
            except Exception:
                continue

    if not combined_audio:
        raise HTTPException(status_code=502, detail="TTS service unavailable")

    audio_bytes = bytes(combined_audio)
    if len(AUDIO_CACHE) > 300:
        AUDIO_CACHE.clear()
    AUDIO_CACHE[cache_key] = audio_bytes

    return Response(
        content=audio_bytes,
        media_type="audio/mpeg",
        headers={
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400",
            "Access-Control-Allow-Origin": "*",
        }
    )
