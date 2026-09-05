import asyncio
import json
from datetime import datetime, timedelta
import bcrypt
_orig_hashpw = bcrypt.hashpw
def _patched_hashpw(password, salt):
    if isinstance(password, (bytes, bytearray)) and len(password) > 72:
        password = password[:72]
    elif isinstance(password, str) and len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72]
    return _orig_hashpw(password, salt)
bcrypt.hashpw = _patched_hashpw

if not hasattr(bcrypt, '__about__'):
    bcrypt.__about__ = type('about', (), {'__version__': getattr(bcrypt, '__version__', '4.0.0')})
from passlib.context import CryptContext
from sqlalchemy.future import select
from geoalchemy2.elements import WKTElement
import shapely.geometry

from app.database import AsyncSessionLocal
from app.models.user import User, UserRole
from app.models.farm import Farm
from app.models.field import Field, CropType
from app.models.drone import Drone, DroneStatus
from app.models.mission import Mission, MissionStatus
from app.models.prediction import Prediction, SeverityEnum
from app.models.terrain_metric import TerrainMetric, MetricType
from app.models.alert import Alert, AlertSeverity
from app.seed.waranga_geodata import FARM_BOUNDARY, FIELD_BOUNDARIES, DISEASE_POLYGONS, TERRAIN_POLYGONS

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def dict_to_wkt(geojson_dict):
    shape = shapely.geometry.shape(geojson_dict)
    return WKTElement(shape.wkt, srid=4326)

async def run_seed():
    async with AsyncSessionLocal() as session:
        # Check user
        res = await session.execute(select(User).where(User.email == "demo@droneplatform.in"))
        if res.scalars().first():
            print("Data already seeded.")
            return

        demo_user = User(
            name="Ramesh Patil",
            email="demo@droneplatform.in",
            hashed_password=pwd_context.hash("demo1234"),
            role=UserRole.farmer
        )
        session.add(demo_user)
        await session.commit()
        await session.refresh(demo_user)

        farm = Farm(
            user_id=demo_user.id,
            name="Patil Sheti",
            location_name="Waranga, Maharashtra",
            boundary=dict_to_wkt(FARM_BOUNDARY)
        )
        session.add(farm)
        await session.commit()
        await session.refresh(farm)

        drone = Drone(
            model="Jetson Orin Nano Demo",
            mac_address="00:11:22:33:44:55",
            firmware_version="1.0.0",
            status=DroneStatus.active
        )
        session.add(drone)
        await session.commit()
        await session.refresh(drone)

        fields = []
        for fb in FIELD_BOUNDARIES:
            f = Field(
                farm_id=farm.id,
                name=fb["name"],
                crop_type=CropType(fb["crop_type"]),
                boundary=dict_to_wkt(fb["boundary"])
            )
            session.add(f)
            fields.append(f)
        await session.commit()
        for f in fields:
            await session.refresh(f)

        now = datetime.utcnow()
        missions = [
            Mission(farm_id=farm.id, drone_id=drone.id, field_id=fields[0].id, status=MissionStatus.completed,
                    start_time=now - timedelta(days=2), end_time=now - timedelta(days=2, hours=-1),
                    coverage_area_ha=48.3, sensors_used=["RGB","Multispectral","LiDAR"]),
            Mission(farm_id=farm.id, drone_id=drone.id, field_id=fields[1].id, status=MissionStatus.processed,
                    start_time=now - timedelta(days=5), end_time=now - timedelta(days=5, hours=-1),
                    coverage_area_ha=24.1, sensors_used=["RGB","Multispectral"]),
            Mission(farm_id=farm.id, drone_id=drone.id, field_id=fields[2].id, status=MissionStatus.syncing,
                    start_time=now - timedelta(days=1), end_time=None,
                    coverage_area_ha=12.5, sensors_used=["RGB"]),
            Mission(farm_id=farm.id, drone_id=drone.id, field_id=fields[0].id, status=MissionStatus.scheduled,
                    start_time=now + timedelta(days=1), end_time=None,
                    coverage_area_ha=48.3, sensors_used=["RGB","Multispectral","LiDAR"])
        ]
        for m in missions:
            session.add(m)
        await session.commit()
        for m in missions:
            await session.refresh(m)

        # 12 Predictions
        diseases = [
            {"name": "Charcoal Rot", "severity": SeverityEnum.severe, "action": "Apply fungicide immediately.", "conf": 0.95},
            {"name": "Charcoal Rot", "severity": SeverityEnum.severe, "action": "Apply fungicide immediately.", "conf": 0.91},
            {"name": "Charcoal Rot", "severity": SeverityEnum.moderate, "action": "Monitor and apply fungicide.", "conf": 0.85},
            {"name": "Charcoal Rot", "severity": SeverityEnum.moderate, "action": "Monitor and apply fungicide.", "conf": 0.82},
            {"name": "Yellow Mosaic Disease", "severity": SeverityEnum.moderate, "action": "Control whitefly vectors.", "conf": 0.88},
            {"name": "Yellow Mosaic Disease", "severity": SeverityEnum.moderate, "action": "Control whitefly vectors.", "conf": 0.86},
            {"name": "Yellow Mosaic Disease", "severity": SeverityEnum.mild, "action": "Monitor for whitefly.", "conf": 0.75},
            {"name": "Target Spot", "severity": SeverityEnum.moderate, "action": "Improve canopy airflow, apply fungicide.", "conf": 0.89},
            {"name": "Target Spot", "severity": SeverityEnum.moderate, "action": "Improve canopy airflow, apply fungicide.", "conf": 0.87},
            {"name": "Target Spot", "severity": SeverityEnum.moderate, "action": "Improve canopy airflow, apply fungicide.", "conf": 0.84},
            {"name": "Root-knot Nematodes", "severity": SeverityEnum.severe, "action": "Implement crop rotation, apply nematicide.", "conf": 0.94},
            {"name": "Root-knot Nematodes", "severity": SeverityEnum.severe, "action": "Implement crop rotation, apply nematicide.", "conf": 0.92},
        ]
        
        for i, d in enumerate(diseases):
            p = Prediction(
                mission_id=missions[0].id,
                disease_class=d["name"],
                confidence=d["conf"],
                severity=d["severity"],
                affected_area_ha=0.5,
                geom=dict_to_wkt(DISEASE_POLYGONS[i]),
                recommended_action=d["action"]
            )
            session.add(p)

        # 8 Terrain Metrics
        for i in range(8):
            m_type = MetricType.water_risk if i % 2 == 0 else MetricType.slope
            t = TerrainMetric(
                field_id=fields[0].id,
                metric_type=m_type,
                value=2.5 if m_type == MetricType.slope else 0.8,
                description="High risk" if m_type == MetricType.water_risk else "Gentle slope",
                geom=dict_to_wkt(TERRAIN_POLYGONS[i])
            )
            session.add(t)

        alerts = [
            Alert(user_id=demo_user.id, mission_id=missions[0].id, severity=AlertSeverity.critical, message="Charcoal Rot detected (91% confidence)."),
            Alert(user_id=demo_user.id, mission_id=missions[0].id, severity=AlertSeverity.high, message="YMD detected."),
            Alert(user_id=demo_user.id, mission_id=missions[0].id, severity=AlertSeverity.high, message="Water pooling risk high."),
            Alert(user_id=demo_user.id, mission_id=missions[0].id, severity=AlertSeverity.medium, message="Target Spot moderate."),
            Alert(user_id=demo_user.id, mission_id=missions[3].id, severity=AlertSeverity.low, message="Mission scheduled for tomorrow."),
            Alert(user_id=demo_user.id, mission_id=None, severity=AlertSeverity.low, message="NDVI slight decline in Cotton North.")
        ]
        for a in alerts:
            session.add(a)

        # Phase 3 Soil Sensor Stations & Readings
        from app.models.soil_sensor import SoilSensorStation, SoilMetricReading
        from app.models.telemetry import DroneTelemetryLog

        station1 = SoilSensorStation(
            field_id=fields[0].id,
            station_code="WARANGA-SOIL-01",
            location=dict_to_wkt({"type": "Point", "coordinates": [76.5667, 20.5500]}),
            soil_type="Black Cotton Soil (Vertisol)"
        )
        station2 = SoilSensorStation(
            field_id=fields[1].id,
            station_code="WARANGA-SOIL-02",
            location=dict_to_wkt({"type": "Point", "coordinates": [76.5680, 20.5520]}),
            soil_type="Medium Black Clay Soil"
        )
        session.add(station1)
        session.add(station2)
        await session.commit()
        await session.refresh(station1)
        await session.refresh(station2)

        readings = [
            SoilMetricReading(station_id=station1.id, moisture_percentage=36.4, temperature_celsius=27.8, nitrogen_mg_kg=45.0, phosphorus_mg_kg=21.0, potassium_mg_kg=220.0, ec_ds_m=1.18),
            SoilMetricReading(station_id=station2.id, moisture_percentage=29.2, temperature_celsius=29.5, nitrogen_mg_kg=38.0, phosphorus_mg_kg=16.5, potassium_mg_kg=195.0, ec_ds_m=1.35)
        ]
        for r in readings:
            session.add(r)

        # Phase 2 Telemetry log
        telem = DroneTelemetryLog(
            drone_id=drone.id,
            mission_id=missions[0].id,
            location=dict_to_wkt({"type": "Point", "coordinates": [76.5667, 20.5500]}),
            altitude_m=45.0,
            velocity_m_s=5.2,
            heading_deg=180.0,
            pitch_deg=-2.1,
            roll_deg=0.5,
            battery_percentage=88.5,
            rtk_fix_status="FIXED_4D",
            signal_rssi_dbm=-62.0,
            jetson_temp_celsius=44.8,
            telemetry_metadata={"payload": "Multispectral_LiDAR_Fusion", "fps": 30}
        )
        session.add(telem)

        await session.commit()
        print("Seeding complete.")

if __name__ == "__main__":
    asyncio.run(run_seed())
