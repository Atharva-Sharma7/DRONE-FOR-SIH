import boto3
from app.services.interfaces import StorageService
from app.config import settings

class MinIOStorageService(StorageService):
    def __init__(self):
        self.client = boto3.client(
            "s3",
            endpoint_url=settings.minio_endpoint,
            aws_access_key_id=settings.minio_root_user,
            aws_secret_access_key=settings.minio_root_password
        )
        self.bucket = settings.minio_bucket_name
        self._ensure_bucket()

    def _ensure_bucket(self):
        try:
            self.client.head_bucket(Bucket=self.bucket)
        except:
            self.client.create_bucket(Bucket=self.bucket)

    async def upload_file(self, key: str, data: bytes) -> str:
        self.client.put_object(Bucket=self.bucket, Key=key, Body=data)
        return f"{settings.minio_endpoint}/{self.bucket}/{key}"

    async def get_presigned_url(self, key: str) -> str:
        url = self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": key},
            ExpiresIn=3600
        )
        return url
