'use client';
import React, { useState } from 'react';
import { 
  Brain, 
  Cpu, 
  Eye, 
  Layers, 
  CloudRain, 
  TrendingUp, 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  X, 
  Plane, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Microscope,
  Info,
  Calendar,
  MapPin
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';

export interface CropProfile {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  variety: string;
  gat: string;
  gatMr: string;
  gatHi: string;
  age: string;
  area: string;
  soil: string;
  irrigation: string;
  healthScore: number;
  yoloDetection: {
    title: string;
    description: string;
    boxes: { label: string; conf: number; color: string }[];
    latencyMs: number;
  };
  vitClassifier: {
    primaryPathogen: string;
    primaryConf: number;
    distribution: { label: string; pct: number }[];
  };
  deepLabV3: {
    canopyCoverPct: number;
    weedDensityPct: number;
    bareSoilPct: number;
    chlorosisIdx: number;
  };
  fungiRisk: {
    riskPct: number;
    status: 'low' | 'moderate' | 'high' | 'critical';
    wetnessHours: number;
    humidityPct: number;
    summary: string;
  };
  yieldPrediction: {
    forecastQAcre: number;
    talukaAvgQAcre: number;
    harvestDate: string;
    confidence: number;
  };
  soilNPK: {
    deficiency: string;
    fertilizerDose: string;
    organicAlternative: string;
  };
  prescription: {
    sprayName: string;
    droneDose: string;
    knapsackDose: string;
    urgency: 'Immediate (24h)' | 'Standard (48h)' | 'Preventive';
  };
}

export const DEFAULT_CROPS: Record<string, CropProfile> = {
  cotton: {
    id: 'cotton',
    name: 'Bt Cotton',
    nameMr: 'बीटी कपाशी',
    nameHi: 'बीटी कपास',
    variety: 'Hybrid RCH-659 BG-II',
    gat: 'Gat 142/A',
    gatMr: 'गट १४२/अ',
    gatHi: 'गट १४२/अ',
    age: '75 Days (Boll Formation)',
    area: '6.2 Acres',
    soil: 'Deep Black Vertisol (काळी माती)',
    irrigation: 'Inline Drip (ठिबक सिंचन)',
    healthScore: 82,
    yoloDetection: {
      title: 'YOLOv8-Agri Edge NPU Detector (Onboard RPi5)',
      description: 'Scanned 42 plants/frame: 28 healthy green bolls, 2 Pink Bollworm entry pinholes, 5 Target Spot concentric lesions.',
      boxes: [
        { label: 'Target Spot (Lesion)', conf: 91.2, color: 'amber' },
        { label: 'Pink Bollworm (Pinhole)', conf: 88.5, color: 'rose' },
        { label: 'Healthy Boll', conf: 97.4, color: 'emerald' },
      ],
      latencyMs: 24,
    },
    vitClassifier: {
      primaryPathogen: 'Corynespora cassiicola (Target Spot)',
      primaryConf: 89.4,
      distribution: [
        { label: 'Target Spot', pct: 89.4 },
        { label: 'Cercospora Leaf Spot', pct: 6.2 },
        { label: 'Alternaria Macrospora', pct: 4.4 },
      ],
    },
    deepLabV3: {
      canopyCoverPct: 88.4,
      weedDensityPct: 3.2,
      bareSoilPct: 8.4,
      chlorosisIdx: 0.12,
    },
    fungiRisk: {
      riskPct: 72,
      status: 'high',
      wetnessHours: 6.5,
      humidityPct: 88,
      summary: 'High spore incubation risk due to nighttime dew retention on upper foliage.',
    },
    yieldPrediction: {
      forecastQAcre: 12.8,
      talukaAvgQAcre: 9.1,
      harvestDate: '18 November 2026',
      confidence: 93,
    },
    soilNPK: {
      deficiency: 'Sub-optimal Nitrogen & Magnesium during boll swelling',
      fertilizerDose: '25 kg Urea + 1% Magnesium Sulfate foliar spray',
      organicAlternative: 'Dashaparni Ark (10%) + Vermiwash foliar misting',
    },
    prescription: {
      sprayName: 'Chlorantraniliprole 18.5% SC + Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
      droneDose: '60 ml + 200 ml in 12 Liters water per acre (ULV fine mist)',
      knapsackDose: '1 bottle cap (15ml) in 15L hand pump (2 pumps/guntha)',
      urgency: 'Immediate (24h)',
    },
  },
  soybean: {
    id: 'soybean',
    name: 'Soybean',
    nameMr: 'सोयाबीन',
    nameHi: 'सोयाबीन',
    variety: 'JS-335 (Jawahar 335)',
    gat: 'Gat 143',
    gatMr: 'गट १४३',
    gatHi: 'गट १४३',
    age: '67 Days (Pod Fill Stage)',
    area: '4.8 Acres',
    soil: 'Medium Black Silt Loam',
    irrigation: 'Rainfed / Micro-Sprinkler',
    healthScore: 68,
    yoloDetection: {
      title: 'YOLOv8-Agri Edge NPU Detector (Onboard RPi5)',
      description: 'Scanned 58 plants/frame: 4 Charcoal Rot stem cankers, 8 Yellow Mosaic chlorotic leaflets, 46 healthy pod stems.',
      boxes: [
        { label: 'Charcoal Rot (Canker)', conf: 94.6, color: 'rose' },
        { label: 'Yellow Mosaic (Chlorosis)', conf: 91.8, color: 'amber' },
        { label: 'Healthy Pod Cluster', conf: 96.1, color: 'emerald' },
      ],
      latencyMs: 22,
    },
    vitClassifier: {
      primaryPathogen: 'Macrophomina phaseolina (Charcoal Rot)',
      primaryConf: 94.1,
      distribution: [
        { label: 'Charcoal Rot', pct: 94.1 },
        { label: 'Rhizoctonia Aerial Blight', pct: 4.2 },
        { label: 'Anthracnose', pct: 1.7 },
      ],
    },
    deepLabV3: {
      canopyCoverPct: 81.2,
      weedDensityPct: 5.6,
      bareSoilPct: 13.2,
      chlorosisIdx: 0.28,
    },
    fungiRisk: {
      riskPct: 81,
      status: 'critical',
      wetnessHours: 8.0,
      humidityPct: 91,
      summary: 'Post-rain dry spell heat spike triggered virulent sclerotial root infection.',
    },
    yieldPrediction: {
      forecastQAcre: 10.2,
      talukaAvgQAcre: 7.8,
      harvestDate: '06 October 2026',
      confidence: 91,
    },
    soilNPK: {
      deficiency: 'High Potassium draw during grain filling; Rhizobium node stress',
      fertilizerDose: '00:52:34 (MKP) @ 1.5 kg/acre + Trichoderma bio-agent',
      organicAlternative: 'Jeevamrut soil drenching + Panchagavya 3% spray',
    },
    prescription: {
      sprayName: 'Tebuconazole 25.9% EC or Carbendazim 12% + Mancozeb 63% WP (Saaf)',
      droneDose: '250 ml in 10 Liters water per acre with anti-drift nozzles',
      knapsackDose: '2 tablespoons (30g) per 15L knapsack pump',
      urgency: 'Immediate (24h)',
    },
  },
  tur: {
    id: 'tur',
    name: 'Pigeon Pea / Tur Dal',
    nameMr: 'तूर (अरहर)',
    nameHi: 'अरहर (तुअर)',
    variety: 'BDN-711 (Marathwada Special)',
    gat: 'Gat 144',
    gatMr: 'गट १४४',
    gatHi: 'गट १४४',
    age: '73 Days (Branching & Early Buds)',
    area: '2.5 Acres',
    soil: 'Clay Loam (गाळाची माती)',
    irrigation: 'Intercropped with Soybean (Rainfed)',
    healthScore: 86,
    yoloDetection: {
      title: 'YOLOv8-Agri Edge NPU Detector (Onboard RPi5)',
      description: 'Terminal shoot scan: Helicoverpa armigera egg count 2/meter, early Fusarium wilt flagged in isolated row 14.',
      boxes: [
        { label: 'Helicoverpa Egg', conf: 87.2, color: 'amber' },
        { label: 'Healthy Branching', conf: 98.1, color: 'emerald' },
      ],
      latencyMs: 25,
    },
    vitClassifier: {
      primaryPathogen: 'Fusarium udum (Wilt Complex)',
      primaryConf: 87.6,
      distribution: [
        { label: 'Fusarium Wilt', pct: 87.6 },
        { label: 'Phytophthora Blight', pct: 8.1 },
        { label: 'Sterility Mosaic', pct: 4.3 },
      ],
    },
    deepLabV3: {
      canopyCoverPct: 74.5,
      weedDensityPct: 6.8,
      bareSoilPct: 18.7,
      chlorosisIdx: 0.08,
    },
    fungiRisk: {
      riskPct: 45,
      status: 'moderate',
      wetnessHours: 4.2,
      humidityPct: 78,
      summary: 'Moderate risk; field drainage channels must be kept open to prevent collar rot.',
    },
    yieldPrediction: {
      forecastQAcre: 7.4,
      talukaAvgQAcre: 5.5,
      harvestDate: '22 December 2026',
      confidence: 89,
    },
    soilNPK: {
      deficiency: 'Phosphorus mobilization required for root nodule bacteria',
      fertilizerDose: 'Single Super Phosphate (SSP) 50 kg/acre + Rhizobium culture',
      organicAlternative: 'Phosphate Solubilizing Bacteria (PSB) @ 1L/acre',
    },
    prescription: {
      sprayName: 'Emamectin Benzoate 5% SG + Pseudomonas fluorescens',
      droneDose: '80g + 1 Liter in 12 Liters water per acre',
      knapsackDose: '8 grams (1 scoop) per 15L knapsack pump',
      urgency: 'Standard (48h)',
    },
  },
  chana: {
    id: 'chana',
    name: 'Chickpea / Chana',
    nameMr: 'हरभरा (चना)',
    nameHi: 'चना (हरभरा)',
    variety: 'Vijay / Digvijay (Wilt Tolerant)',
    gat: 'Gat 145/B',
    gatMr: 'गट १४५/ब',
    gatHi: 'गट १४५/ब',
    age: '25 Days (Early Stand Emergence)',
    area: '3.0 Acres',
    soil: 'Deep Retentive Silt Black Soil',
    irrigation: 'Broad Bed Furrow (BBF)',
    healthScore: 92,
    yoloDetection: {
      title: 'YOLOv8-Agri Edge NPU Detector (Onboard RPi5)',
      description: 'Seedling emergence scan: 31 healthy plants/m², Cutworm nocturnal clipping found on field margin (2%).',
      boxes: [
        { label: 'Healthy Stand', conf: 96.8, color: 'emerald' },
        { label: 'Cutworm Margin', conf: 84.1, color: 'amber' },
      ],
      latencyMs: 20,
    },
    vitClassifier: {
      primaryPathogen: 'Sclerotium rolfsii (Collar Rot Prevention)',
      primaryConf: 82.3,
      distribution: [
        { label: 'Collar Rot', pct: 82.3 },
        { label: 'Dry Root Rot', pct: 12.1 },
        { label: 'Rhizoctonia', pct: 5.6 },
      ],
    },
    deepLabV3: {
      canopyCoverPct: 42.1,
      weedDensityPct: 8.4,
      bareSoilPct: 49.5,
      chlorosisIdx: 0.04,
    },
    fungiRisk: {
      riskPct: 38,
      status: 'low',
      wetnessHours: 3.0,
      humidityPct: 69,
      summary: 'Optimal dry soil aeration with excellent vegetative vigor.',
    },
    yieldPrediction: {
      forecastQAcre: 9.6,
      talukaAvgQAcre: 7.2,
      harvestDate: '15 January 2027',
      confidence: 94,
    },
    soilNPK: {
      deficiency: 'Initial root establishment stage; balanced micro-nutrients required',
      fertilizerDose: '19:19:19 water soluble @ 1 kg/acre foliar mist',
      organicAlternative: 'Trichoderma viride seed dressing + Cow urine (5%)',
    },
    prescription: {
      sprayName: 'Neem Oil 10,000 PPM + Trichoderma harzianum',
      droneDose: '300 ml + 1 kg in 10 Liters water per acre',
      knapsackDose: '30 ml neem oil per 15L pump with soap surfactant',
      urgency: 'Preventive',
    },
  },
  onion: {
    id: 'onion',
    name: 'Onion',
    nameMr: 'कांदा (प्याज)',
    nameHi: 'प्याज (कांदा)',
    variety: 'Nashik Red / Bhima Super',
    gat: 'Gat 146',
    gatMr: 'गट १४६',
    gatHi: 'गट १४६',
    age: '40 Days (Bulb Enlargement Stage)',
    area: '2.0 Acres',
    soil: 'Light Well-Drained Sandy Loam',
    irrigation: 'Drip Fertigation (ठिबक)',
    healthScore: 76,
    yoloDetection: {
      title: 'YOLOv8-Agri Edge NPU Detector (Onboard RPi5)',
      description: 'Leaf fold micro-inspection: Thrips tabaci silver feeding streaks, 3 Purple Blotch tip burns.',
      boxes: [
        { label: 'Purple Blotch', conf: 92.5, color: 'rose' },
        { label: 'Thrips Streaks', conf: 89.7, color: 'amber' },
        { label: 'Bulb Swell', conf: 95.3, color: 'emerald' },
      ],
      latencyMs: 23,
    },
    vitClassifier: {
      primaryPathogen: 'Alternaria porri (Purple Blotch)',
      primaryConf: 92.5,
      distribution: [
        { label: 'Purple Blotch', pct: 92.5 },
        { label: 'Stemphylium Blight', pct: 5.1 },
        { label: 'Downy Mildew', pct: 2.4 },
      ],
    },
    deepLabV3: {
      canopyCoverPct: 68.2,
      weedDensityPct: 4.1,
      bareSoilPct: 27.7,
      chlorosisIdx: 0.18,
    },
    fungiRisk: {
      riskPct: 68,
      status: 'high',
      wetnessHours: 5.8,
      humidityPct: 84,
      summary: 'Morning fog and dew on tubular leaves accelerates Alternaria spore colonization.',
    },
    yieldPrediction: {
      forecastQAcre: 115.0,
      talukaAvgQAcre: 95.0,
      harvestDate: '10 November 2026',
      confidence: 92,
    },
    soilNPK: {
      deficiency: 'Sulfur deficiency causing bulb skin thinning; Potash required',
      fertilizerDose: 'Bentonite Sulfur 15 kg/acre + 00:00:50 Potash 2 kg via drip',
      organicAlternative: 'Wood ash drenching + Fermented butter-milk spray',
    },
    prescription: {
      sprayName: 'Fipronil 5% SC + Mancozeb 75% WP + Silicon Sticking Agent',
      droneDose: '300 ml + 400 g in 12 Liters water per acre with sticker',
      knapsackDose: '30 ml + 40 g per 15L pump (ensure sticking agent is added)',
      urgency: 'Immediate (24h)',
    },
  },
};

interface CropAIAnalysisModalProps {
  crop: CropProfile;
  isOpen: boolean;
  onClose: () => void;
  onLaunchSpray?: (crop: CropProfile) => void;
}

export function CropAIAnalysisModal({
  crop,
  isOpen,
  onClose,
  onLaunchSpray,
}: CropAIAnalysisModalProps) {
  const { t } = useTranslation();
  const { language, isSpeaking, setIsSpeaking } = useAppStore();
  const [activeTab, setActiveTab] = useState<'models' | 'prescription' | 'yield'>('models');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  const cropDisplayName = isMarathi ? crop.nameMr : isHindi ? crop.nameHi : crop.name;
  const gatDisplayName = isMarathi ? crop.gatMr : isHindi ? crop.gatHi : crop.gat;

  const handleVoiceAdvisory = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      let text = '';
      if (isMarathi) {
        text = `${crop.gatMr} मधील ${crop.nameMr} पिकाचे सखोल AI विश्लेषण: पीक आरोग्य ${crop.healthScore} टक्के आहे. रोगांचे निदान: ${crop.vitClassifier.primaryPathogen}. तात्काळ फवारणी: ${crop.prescription.sprayName}. घरगुती प्रमाण: ${crop.prescription.knapsackDose}. अंदाजे उत्पादन: ${crop.yieldPrediction.forecastQAcre} क्विंटल प्रति एकर अपेक्षित आहे.`;
      } else if (isHindi) {
        text = `${crop.gatHi} के ${crop.nameHi} का AI विश्लेषण: फसल स्वास्थ्य ${crop.healthScore} प्रतिशत है। मुख्य रोग: ${crop.vitClassifier.primaryPathogen}। तुरंत छिड़काव: ${crop.prescription.sprayName}। घरेलू मात्रा: ${crop.prescription.knapsackDose}। अनुमानित उपज: ${crop.yieldPrediction.forecastQAcre} क्विंटल प्रति एकड़ होगी।`;
      } else {
        text = `AI Ensemble Analysis for ${crop.name} in ${crop.gat}. Crop health score is ${crop.healthScore} percent. Primary pathogen identified: ${crop.vitClassifier.primaryPathogen} with ${crop.vitClassifier.primaryConf} percent confidence. Recommended treatment: ${crop.prescription.sprayName}. Kitchen pump dose: ${crop.prescription.knapsackDose}. Forecasted harvest: ${crop.yieldPrediction.forecastQAcre} quintals per acre.`;
      }
      speakText(text, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
    }
  };

  const handleDownloadReport = () => {
    setDownloadSuccess(true);
    const content = `KRISHI-RAKSHAK OFFICIAL AI CROP HEALTH CERTIFICATE
--------------------------------------------------
Parcel ID: ${crop.gat}
Crop: ${crop.name} (${crop.variety})
Age: ${crop.age} | Area: ${crop.area}
Soil: ${crop.soil} | Irrigation: ${crop.irrigation}
Health Score: ${crop.healthScore}/100

AI MODEL 1: YOLOv8-Agri Edge NPU Detector
${crop.yoloDetection.description}
Inference Latency: ${crop.yoloDetection.latencyMs}ms

AI MODEL 2: Vision Transformer (ViT-Base) Pathogen Classifier
Primary Diagnosis: ${crop.vitClassifier.primaryPathogen} (${crop.vitClassifier.primaryConf}%)

AI MODEL 3: DeepLabV3+ Semantic Canopy Segmenter
Canopy Cover: ${crop.deepLabV3.canopyCoverPct}% | Weed Density: ${crop.deepLabV3.weedDensityPct}% | Bare Soil: ${crop.deepLabV3.bareSoilPct}%

AI MODEL 4: Bio-Meteorological FungiRisk Engine
Risk Index: ${crop.fungiRisk.riskPct}% (${crop.fungiRisk.status.toUpperCase()})
Wetness Duration: ${crop.fungiRisk.wetnessHours} hrs | Humidity: ${crop.fungiRisk.humidityPct}%

AI MODEL 5: XGBoost Biomass & Harvest Yield Predictor
Forecast: ${crop.yieldPrediction.forecastQAcre} Quintals/Acre (Taluka Baseline: ${crop.yieldPrediction.talukaAvgQAcre} Q/Acre)
Target Harvest: ${crop.yieldPrediction.harvestDate}

AI MODEL 6: ICAR Soil Nutrient & NPK Recommendation
Deficiency: ${crop.soilNPK.deficiency}
Prescription: ${crop.soilNPK.fertilizerDose}
Bio-Alternative: ${crop.soilNPK.organicAlternative}

AUTONOMOUS DRONE SPRAY RECIPE:
Chemical: ${crop.prescription.sprayName}
Drone ULV Rate: ${crop.prescription.droneDose}
Farmer Knapsack Pump Rate: ${crop.prescription.knapsackDose}
Timestamp: ${new Date().toISOString()}
Verified by: AgriHawk Neural Network v4.2
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Crop_Health_Certificate_${crop.id}_${crop.gat.replace('/', '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
        
        {/* Header Strip */}
        <div className="p-5 border-b border-[var(--border)] bg-gradient-to-r from-emerald-500/10 via-[var(--surface-2)] to-blue-500/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Microscope className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-extrabold uppercase">
                  6 AI Models Ensemble
                </span>
                <span className="text-xs font-mono text-[var(--accent)] font-bold">
                  {gatDisplayName} · {crop.area}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] mt-0.5">
                {cropDisplayName} ({crop.variety})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Narration Button */}
            <button
              onClick={handleVoiceAdvisory}
              className={`p-2.5 rounded-xl font-bold transition-all shadow cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-[var(--accent)] text-black hover:bg-amber-500'
              }`}
              title="Voice advisory read aloud"
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-[var(--border)] bg-[var(--surface)] shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('models')}
            className={`pb-3 text-xs font-mono font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'models'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{isMarathi ? '६ AI मॉडेल विश्लेषण' : isHindi ? '६ AI मॉडल विश्लेषण' : '6 AI Models Analysis'}</span>
          </button>

          <button
            onClick={() => setActiveTab('prescription')}
            className={`pb-3 text-xs font-mono font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'prescription'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>{isMarathi ? 'औषध फवारणी व NPK डोस' : isHindi ? 'दवा छिड़काव व NPK मात्रा' : 'Spray Prescription & NPK'}</span>
          </button>

          <button
            onClick={() => setActiveTab('yield')}
            className={`pb-3 text-xs font-mono font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'yield'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{isMarathi ? 'उत्पादन अंदाज व हवामान' : isHindi ? 'उपज अनुमान व मौसम' : 'Harvest Yield & Micro-Climate'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* ── TAB 1: 6 AI MODELS BREAKDOWN ── */}
          {activeTab === 'models' && (
            <div className="space-y-5 animate-fade-in">
              {/* Quick Health Vigor Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Crop Health</span>
                  <span className={`text-xl font-black ${crop.healthScore > 80 ? 'text-emerald-500' : crop.healthScore > 65 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {crop.healthScore}/100
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Canopy Cover</span>
                  <span className="text-xl font-black text-emerald-500">{crop.deepLabV3.canopyCoverPct}%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Fungi Risk Index</span>
                  <span className={`text-xl font-black ${crop.fungiRisk.riskPct > 70 ? 'text-rose-500' : crop.fungiRisk.riskPct > 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {crop.fungiRisk.riskPct}%
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Forecast Yield</span>
                  <span className="text-xl font-black text-[var(--accent)]">{crop.yieldPrediction.forecastQAcre} Q/Ac</span>
                </div>
              </div>

              {/* MODEL 1 & MODEL 2 GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Model 1: YOLOv8 */}
                <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                        Model 1: YOLOv8-Agri Edge NPU
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                      {crop.yoloDetection.latencyMs}ms Latency
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {crop.yoloDetection.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {crop.yoloDetection.boxes.map((box, idx) => (
                      <span 
                        key={idx}
                        className={`text-[10px] font-mono px-2 py-1 rounded-md font-extrabold border ${
                          box.color === 'rose' 
                            ? 'bg-rose-500/15 text-rose-600 border-rose-500/30' 
                            : box.color === 'amber'
                            ? 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                        }`}
                      >
                        {box.label} ({box.conf}%)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Model 2: Vision Transformer (ViT) */}
                <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                        Model 2: ViT-Base Pathogen Classifier
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold">
                      Softmax Top-3
                    </span>
                  </div>

                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    Primary: <span className="text-purple-600 dark:text-purple-400">{crop.vitClassifier.primaryPathogen}</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {crop.vitClassifier.distribution.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
                          <span>{item.label}</span>
                          <span className="font-bold text-[var(--text-primary)]">{item.pct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--surface)] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MODEL 3 & MODEL 4 GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Model 3: DeepLabV3+ */}
                <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                        Model 3: DeepLabV3+ Canopy Segmentation
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                      Pixel-Level Mask
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                    <div className="p-2 rounded-xl bg-[var(--surface)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Canopy</span>
                      <span className="font-bold text-emerald-600">{crop.deepLabV3.canopyCoverPct}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[var(--surface)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Weed Pressure</span>
                      <span className="font-bold text-amber-600">{crop.deepLabV3.weedDensityPct}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[var(--surface)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Bare Soil</span>
                      <span className="font-bold text-[var(--text-secondary)]">{crop.deepLabV3.bareSoilPct}%</span>
                    </div>
                  </div>
                </div>

                {/* Model 4: Bio-Meteorological FungiRisk */}
                <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                        Model 4: Bio-Meteorological FungiRisk AI
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      crop.fungiRisk.status === 'critical' || crop.fungiRisk.status === 'high'
                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    }`}>
                      {crop.fungiRisk.status}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {crop.fungiRisk.summary}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--text-muted)]">
                    <span>Leaf Wetness: <strong className="text-[var(--text-primary)]">{crop.fungiRisk.wetnessHours} hrs</strong></span>
                    <span>Canopy RH: <strong className="text-[var(--text-primary)]">{crop.fungiRisk.humidityPct}%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: PRESCRIPTION & SOIL NPK ── */}
          {activeTab === 'prescription' && (
            <div className="space-y-5 animate-fade-in">
              {/* Spray Urgent Callout */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-blue-500/10 to-[var(--surface-2)] border-2 border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-extrabold uppercase">
                    AI Agronomic Prescription · {crop.prescription.urgency}
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Zero-Pesticide Exposure Protocol
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {crop.prescription.sprayName}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Target Pathogen: {crop.vitClassifier.primaryPathogen} & sucking pest vectors.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* Drone ULV Rate */}
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[10px] font-mono font-bold text-blue-600 block uppercase">
                      🚁 Autonomous Drone ULV Rate:
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] mt-0.5 block">
                      {crop.prescription.droneDose}
                    </span>
                  </div>

                  {/* Kitchen Hand-Pump Rate */}
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[10px] font-mono font-bold text-amber-600 block uppercase">
                      🧴 Farmer Hand-Pump Kitchen Measure:
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] mt-0.5 block">
                      {crop.prescription.knapsackDose}
                    </span>
                  </div>
                </div>
              </div>

              {/* Model 6: Soil Nutrient & NPK Recommendation */}
              <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                    Model 6: ICAR & State Krishi Vidyapeeth NPK Diagnostic Engine
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Detected Nutrient Stress:</span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">
                    {crop.soilNPK.deficiency}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[10px] font-mono text-emerald-600 block uppercase font-bold">Standard Mineral Dose:</span>
                    <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">
                      {crop.soilNPK.fertilizerDose}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[10px] font-mono text-purple-600 block uppercase font-bold">Organic Bio-Alternative:</span>
                    <span className="text-xs text-[var(--text-secondary)] mt-0.5 block">
                      {crop.soilNPK.organicAlternative}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: YIELD PREDICTION & HARVEST ── */}
          {activeTab === 'yield' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                      Model 5: XGBoost Biomass & Yield Predictor
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                    {crop.yieldPrediction.confidence}% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Your Farm Forecast</span>
                    <span className="text-2xl font-black text-emerald-600 mt-1 block">
                      {crop.yieldPrediction.forecastQAcre}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">Quintals / Acre</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Taluka Average</span>
                    <span className="text-2xl font-black text-[var(--text-secondary)] mt-1 block">
                      {crop.yieldPrediction.talukaAvgQAcre}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">Quintals / Acre</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">Expected Harvest</span>
                    <span className="text-sm font-bold text-[var(--accent)] mt-2 block">
                      {crop.yieldPrediction.harvestDate}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">Target Maturity</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                  🌾 Your crop is outperforming the taluka historical baseline by <strong>+{((crop.yieldPrediction.forecastQAcre - crop.yieldPrediction.talukaAvgQAcre) / crop.yieldPrediction.talukaAvgQAcre * 100).toFixed(1)}%</strong> due to precision micro-irrigation and early pathogen intervention!
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[var(--border)] bg-[var(--surface-2)]/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>AI Verified by AgriHawk Neural Jetson Core v4.2</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Download Certificate */}
            <button
              onClick={handleDownloadReport}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? 'Downloaded!' : (isMarathi ? 'प्रमाणपत्र डाऊनलोड' : isHindi ? 'प्रमाणपत्र डाउनलोड' : 'Download Health Card')}</span>
            </button>

            {/* Launch Drone Spray */}
            {onLaunchSpray && (
              <button
                onClick={() => onLaunchSpray(crop)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Plane className="w-4 h-4" />
                <span>{isMarathi ? 'त्वरित ड्रोन फवारणी' : isHindi ? 'तुरंत ड्रोन छिड़काव' : 'Launch Drone Spray'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
