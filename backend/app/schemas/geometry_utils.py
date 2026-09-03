"""
Shared geometry utilities for converting GeoAlchemy2 WKBElement
objects to GeoJSON-compatible dicts.
"""
from typing import Any, Dict
import shapely.wkb
import shapely.geometry


def wkb_to_geojson(value: Any) -> Dict[str, Any]:
    """
    Convert a GeoAlchemy2 WKBElement (or hex string) to a GeoJSON geometry dict.
    Works with both the extended WKB format returned by PostGIS and plain WKB.
    """
    if value is None:
        return {}
    try:
        # GeoAlchemy2 WKBElement — access raw bytes via desc attribute or __bytes__
        if hasattr(value, "desc"):
            raw = bytes.fromhex(value.desc)
        elif isinstance(value, (bytes, bytearray)):
            raw = bytes(value)
        elif isinstance(value, str):
            raw = bytes.fromhex(value)
        else:
            raw = bytes(value)

        geom = shapely.wkb.loads(raw, hex=False)
        return shapely.geometry.mapping(geom)
    except Exception:
        # Final fallback — try treating as hex string directly
        try:
            if isinstance(value, str):
                geom = shapely.wkb.loads(value, hex=True)
                return shapely.geometry.mapping(geom)
        except Exception:
            pass
        return {}
