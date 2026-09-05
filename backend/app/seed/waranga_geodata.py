# Village Waranga, Tal. Hingna, Nagpur District, Maharashtra
# Center: lat=21.1458, lng=79.0530

FARM_BOUNDARY = {
    "type": "Polygon",
    "coordinates": [[
        [79.0440, 21.1380],
        [79.0620, 21.1380],
        [79.0620, 21.1540],
        [79.0440, 21.1540],
        [79.0440, 21.1380]
    ]]
}

FIELD_BOUNDARIES = [
    {
        "name": "Cotton North",
        "crop_type": "cotton",
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[79.0440,21.1460],[79.0620,21.1460],[79.0620,21.1540],[79.0440,21.1540],[79.0440,21.1460]]]
        }
    },
    {
        "name": "Soybean East",
        "crop_type": "soybean",
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[79.0540,21.1380],[79.0620,21.1380],[79.0620,21.1460],[79.0540,21.1460],[79.0540,21.1380]]]
        }
    },
    {
        "name": "Mixed South",
        "crop_type": "mixed",
        "boundary": {
            "type": "Polygon",
            "coordinates": [[[79.0440,21.1380],[79.0540,21.1380],[79.0540,21.1460],[79.0440,21.1460],[79.0440,21.1380]]]
        }
    }
]

# 12 distinct disease hotspot polygons (real sub-field scale, ~0.5-2ha each)
DISEASE_POLYGONS = [
    # Charcoal Rot — Soybean East (4 detections)
    {"type": "Polygon", "coordinates": [[[79.0539, 21.1405], [79.0559, 21.1405], [79.0559, 21.1420], [79.0539, 21.1420], [79.0539, 21.1405]]]},
    {"type": "Polygon", "coordinates": [[[79.0564, 21.1413], [79.0582, 21.1413], [79.0582, 21.1427], [79.0564, 21.1427], [79.0564, 21.1413]]]},
    {"type": "Polygon", "coordinates": [[[79.0544, 21.1433], [79.0560, 21.1433], [79.0560, 21.1445], [79.0544, 21.1445], [79.0544, 21.1433]]]},
    {"type": "Polygon", "coordinates": [[[79.0579, 21.1423], [79.0592, 21.1423], [79.0592, 21.1437], [79.0579, 21.1437], [79.0579, 21.1423]]]},
    # Yellow Mosaic Disease — Cotton North (3 detections)
    {"type": "Polygon", "coordinates": [[[79.0442, 21.1473], [79.0458, 21.1473], [79.0458, 21.1485], [79.0442, 21.1485], [79.0442, 21.1473]]]},
    {"type": "Polygon", "coordinates": [[[79.0474, 21.1483], [79.0492, 21.1483], [79.0492, 21.1497], [79.0474, 21.1497], [79.0474, 21.1483]]]},
    {"type": "Polygon", "coordinates": [[[79.0504, 21.1465], [79.0518, 21.1465], [79.0518, 21.1477], [79.0504, 21.1477], [79.0504, 21.1465]]]},
    # Target Spot — Cotton North (3 detections)
    {"type": "Polygon", "coordinates": [[[79.0549, 21.1475], [79.0564, 21.1475], [79.0564, 21.1487], [79.0549, 21.1487], [79.0549, 21.1475]]]},
    {"type": "Polygon", "coordinates": [[[79.0584, 21.1480], [79.0600, 21.1480], [79.0600, 21.1493], [79.0584, 21.1493], [79.0584, 21.1480]]]},
    {"type": "Polygon", "coordinates": [[[79.0462, 21.1500], [79.0476, 21.1500], [79.0476, 21.1511], [79.0462, 21.1511], [79.0462, 21.1500]]]},
    # Root-knot Nematodes — Mixed South (2 detections)
    {"type": "Polygon", "coordinates": [[[79.0436, 21.1410], [79.0452, 21.1410], [79.0452, 21.1423], [79.0436, 21.1423], [79.0436, 21.1410]]]},
    {"type": "Polygon", "coordinates": [[[79.0484, 21.1400], [79.0499, 21.1400], [79.0499, 21.1413], [79.0484, 21.1413], [79.0484, 21.1400]]]},
]

# 8 DISTINCT terrain analysis zones (slope, water pooling, drainage)
TERRAIN_POLYGONS = [
    # Water pooling depressions (low-lying black soil areas)
    {"type": "Polygon", "coordinates": [[[79.0444, 21.1405], [79.0462, 21.1405], [79.0462, 21.1417], [79.0444, 21.1417], [79.0444, 21.1405]]]},
    {"type": "Polygon", "coordinates": [[[79.0494, 21.1415], [79.0510, 21.1415], [79.0510, 21.1427], [79.0494, 21.1427], [79.0494, 21.1415]]]},
    # Slope zones
    {"type": "Polygon", "coordinates": [[[79.0554, 21.1400], [79.0572, 21.1400], [79.0572, 21.1415], [79.0554, 21.1415], [79.0554, 21.1400]]]},
    {"type": "Polygon", "coordinates": [[[79.0432, 21.1465], [79.0450, 21.1465], [79.0450, 21.1477], [79.0432, 21.1477], [79.0432, 21.1465]]]},
    # Drainage channels
    {"type": "Polygon", "coordinates": [[[79.0524, 21.1470], [79.0538, 21.1470], [79.0538, 21.1483], [79.0524, 21.1483], [79.0524, 21.1470]]]},
    {"type": "Polygon", "coordinates": [[[79.0472, 21.1435], [79.0488, 21.1435], [79.0488, 21.1447], [79.0472, 21.1447], [79.0472, 21.1435]]]},
    # High water-risk zones
    {"type": "Polygon", "coordinates": [[[79.0442, 21.1450], [79.0458, 21.1450], [79.0458, 21.1461], [79.0442, 21.1461], [79.0442, 21.1450]]]},
    {"type": "Polygon", "coordinates": [[[79.0586, 21.1467], [79.0600, 21.1467], [79.0600, 21.1479], [79.0586, 21.1479], [79.0586, 21.1467]]]},
]

# Serpentine flight path covering entire farm
FLIGHT_PATH = {
    "type": "LineString",
    "coordinates": [
        [79.0440, 21.1380], [79.0440, 21.1540],
        [79.0475, 21.1540], [79.0475, 21.1380],
        [79.0510, 21.1380], [79.0510, 21.1540],
        [79.0545, 21.1540], [79.0545, 21.1380],
        [79.0580, 21.1380], [79.0580, 21.1540],
        [79.0620, 21.1540], [79.0620, 21.1380],
    ]
}

# Realistic NDVI/NDRE timeseries (14 days, proper seasonal variation)
from datetime import date, timedelta
import math

def _make_timeseries(crop: str):
    today = date.today()
    result = []
    for i in range(14):
        d = today - timedelta(days=13 - i)
        t = i / 14
        if crop == "cotton":
            ndvi = 0.55 + 0.18 * (1 - math.exp(-t * 4)) + 0.02 * math.sin(t * 8 * math.pi)
            ndre = 0.28 + 0.14 * (1 - math.exp(-t * 3)) + 0.01 * math.sin(t * 6 * math.pi)
        elif crop == "soybean":
            ndvi = 0.48 + 0.28 * math.sin(t * math.pi) + 0.025 * math.sin(t * 10 * math.pi)
            ndre = 0.22 + 0.20 * math.sin(t * math.pi) + 0.015 * math.sin(t * 8 * math.pi)
        else:
            ndvi = 0.50 + 0.20 * math.sin(t * math.pi)
            ndre = 0.24 + 0.15 * math.sin(t * math.pi)
        result.append({"date": d.isoformat(), "ndvi": round(ndvi, 4), "ndre": round(ndre, 4)})
    return result

NDVI_TIMESERIES = [_make_timeseries("cotton"), _make_timeseries("soybean"), _make_timeseries("mixed")]
