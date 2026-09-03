from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

from app.routers import auth, farms, fields, missions, predictions, terrain, alerts
import boto3

app = FastAPI(
    title="Intelligent Agricultural Drone Platform",
    description="API for managing drone missions and analyzing agricultural data",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(farms.router, prefix="/api/v1/farms", tags=["farms"])
app.include_router(fields.router, prefix="/api/v1/fields", tags=["fields"])
app.include_router(missions.router, prefix="/api/v1/missions", tags=["missions"])
app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["predictions"])
app.include_router(terrain.router, prefix="/api/v1/terrain", tags=["terrain"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["alerts"])

@app.on_event("startup")
async def startup_event():
    try:
        s3_client = boto3.client(
            "s3",
            endpoint_url=settings.minio_endpoint,
            aws_access_key_id=settings.minio_root_user,
            aws_secret_access_key=settings.minio_root_password
        )
        try:
            s3_client.head_bucket(Bucket=settings.minio_bucket_name)
        except Exception:
            s3_client.create_bucket(Bucket=settings.minio_bucket_name)
    except Exception as e:
        print(f"Failed to initialize MinIO bucket: {e}")
