import asyncio
import random
from app.services.interfaces import InferenceService
from typing import List, Dict, Any

class MockInferenceService(InferenceService):
    async def run_inference(self, image_tile_path: str) -> List[Dict[str, Any]]:
        await asyncio.sleep(random.uniform(0.5, 1.5))
        
        diseases = [
            ("Charcoal Rot", "severe", "Apply appropriate fungicide immediately."),
            ("Yellow Mosaic Disease", "moderate", "Control whitefly vectors."),
            ("Target Spot", "moderate", "Improve canopy airflow, apply fungicide."),
            ("Root-knot Nematodes", "severe", "Implement crop rotation, apply nematicide.")
        ]
        
        detections = []
        for _ in range(random.randint(0, 3)):
            disease, severity, action = random.choice(diseases)
            detections.append({
                "disease_class": disease,
                "confidence": round(random.uniform(0.78, 0.96), 2),
                "severity": severity,
                "recommended_action": action,
                "affected_area_ha": round(random.uniform(0.1, 1.5), 2),
            })
            
        return detections
