'use client';
import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Plane, 
  FlaskConical, 
  Droplets, 
  Info,
  Radio,
  Clock,
  Layers,
  Search,
  Check,
  RefreshCw,
  FileImage
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';
import { QuickSprayModal } from '@/components/farmer/QuickSprayModal';

interface DiseaseDiagnosis {
  id: string;
  name: { en: string; hi: string; mr: string };
  pathogen: string;
  crop: { en: string; hi: string; mr: string };
  severity: 'Mild' | 'Moderate' | 'Severe';
  confidence: number;
  symptoms: { en: string; hi: string; mr: string };
  causes: { en: string; hi: string; mr: string };
  prescription: {
    chemical: { en: string; hi: string; mr: string };
    dosageKitchen: { en: string; hi: string; mr: string };
    spraySchedule: { en: string; hi: string; mr: string };
    prevention: { en: string; hi: string; mr: string };
  };
  sampleImage: string;
  droneImageUrl: string;
  droneAlt: string;
}

const PRESET_DISEASES: DiseaseDiagnosis[] = [
  {
    id: 'charcoal-rot',
    name: {
      en: 'Soybean Charcoal Rot',
      hi: 'सोयाबीन चारकोल सड़न रोग',
      mr: 'सोयाबीन कोळशी रोग (Charcoal Rot)'
    },
    pathogen: 'Macrophomina phaseolina',
    crop: {
      en: 'Soybean (JS-335 / Waranga Sector B)',
      hi: 'सोयाबीन (JS-335 / वारंगा सेक्टर B)',
      mr: 'सोयाबीन (JS-335 / वारंगा सेक्टर B)'
    },
    severity: 'Severe',
    confidence: 95.2,
    symptoms: {
      en: 'Blackening and drying of stems, premature leaf fall, and dark charcoal-like sclerotia micro-dots inside root vascular bundles.',
      hi: 'तने का काला पड़ना, पत्तियों का समय से पहले गिरना और जड़ के भीतरी भाग में चारकोल (कोयले) जैसे काले सूक्ष्म दाने दिखना।',
      mr: 'खोड काळे पडणे, पानांची अकाली गळती आणि मुळांच्या आतील भागात कोळशासारखे काळे सूक्ष्म ठिपके दिसणे.'
    },
    causes: {
      en: 'High ambient temperature (>33°C) coupled with prolonged dry spells and soil moisture deficit during the pod-filling stage.',
      hi: 'फली बनते समय अत्यधिक तापमान (३३°C से अधिक) और खेत में पानी की गंभीर कमी (सूखा तनाव)।',
      mr: 'शेंगा भरण्याच्या काळात ३३°C पेक्षा जास्त तापमान आणि जमिनीत ओलाव्याची तीव्र कमतरता (पाण्याचा ताण).'
    },
    prescription: {
      chemical: {
        en: 'Trichoderma viride bio-fungicide OR Carbendazim 12% + Mancozeb 63% WP (Saaf)',
        hi: 'ट्राइकोडर्मा विरिडी जैविक कवकनाशी या कार्बेन्डाजिम १२% + मैंकोजेब ६३% WP',
        mr: 'ट्रायकोडर्मा विरिडी जैविक बुरशीनाशक किंवा कार्बेन्डाझिम १२% + मॅन्कोझेब ६३% WP'
      },
      dosageKitchen: {
        en: '2 bottle caps (30 grams) per 15-liter knapsack pump / 1.2 Liters per acre for autonomous drone spray mix.',
        hi: '२ ढक्कन (३० ग्राम) प्रति १५ लीटर कीटनाशक टंकी / ड्रोन छिड़काव हेतु १.२ लीटर प्रति एकड़।',
        mr: '२ झाकणे (३० ग्रॅम) प्रति १५ लिटर पाठीवरचा पंप / ड्रोन फवारणीसाठी १.२ लिटर प्रति एकर.'
      },
      spraySchedule: {
        en: 'Spray early morning before 9:00 AM or late afternoon after 5:00 PM. Repeat once after 10 days if symptoms persist.',
        hi: 'सुबह ९ बजे से पहले या शाम ५ बजे के बाद छिड़काव करें। १० दिन बाद यदि लक्षण दिखें तो दोहराएं।',
        mr: 'सकाळी ९ च्या आत किंवा संध्याकाळी ५ नंतर फवारणी करावी. १० दिवसांनी गरज भासल्यास दुसरी फेरी मारावी.'
      },
      prevention: {
        en: 'Maintain regular field irrigation during dry periods; avoid moisture stress; treat seeds with bio-agent before sowing.',
        hi: 'सूखे के दौरान खेत में नमी बनाए रखें; पानी का जमाव रोकें; अगली बार प्रमाणित बीज का उपचार करें।',
        mr: 'शेतात पाण्याचा ताण पडू देऊ नका; योग्य ओलावा राखा; पुढील हंगामात पेरणीपूर्वी बुरशीनाशकाची बीजप्रक्रिया करा.'
      }
    },
    sampleImage: '🌱',
    droneImageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    droneAlt: 'Drone Survey 25m: Soybean Patch Stress Detection'
  },
  {
    id: 'pink-bollworm',
    name: {
      en: 'Cotton Pink Bollworm Infestation',
      hi: 'कपास गुलाबी सुंडी (Pink Bollworm)',
      mr: 'कापूस बोंडअळी (Pink Bollworm)'
    },
    pathogen: 'Pectinophora gossypiella',
    crop: {
      en: 'Cotton (Bt-II / Gat 142/A)',
      hi: 'कपास (Bt-II / गट १४२/अ)',
      mr: 'कापूस (Bt-II / गट १४२/अ)'
    },
    severity: 'Severe',
    confidence: 92.4,
    symptoms: {
      en: 'Rosetted flowers (dome formation), caterpillars tunneling inside developing bolls, stained lint, and premature boll opening.',
      hi: 'फूलों का बंद होकर गुंबदनुमा (डोमकली) बनना, बोंड के अंदर सुंडी का घुसना और रुई का खराब होकर सड़ना।',
      mr: 'फुलांची डोमकळी तयार होणे, बोंडामध्ये अळीने छिद्र पाडणे आणि कापसाची प्रत खराब होऊन अकाली बोंडे फुटणे.'
    },
    causes: {
      en: 'Humid, overcast monsoon conditions without timely installation of pheromone monitoring traps.',
      hi: 'लगातार बादलों भरा नम मौसम और समय रहते फेरोमोन (कामगंध) जाल न लगाना।',
      mr: 'सतत ढगाळ व दमट हवामान आणि वेळेवर कामगंध सापळे न लावल्यामुळे किडीचा प्रसार.'
    },
    prescription: {
      chemical: {
        en: 'Neem Seed Kernel Extract 5% (10,000 PPM Neem Oil) OR Profenofos 50% EC',
        hi: 'नीम का तेल ५% (१०,००० PPM) या प्रोफेनोफॉस ५०% EC',
        mr: 'निंबोळी अर्क ५% (१०,००० PPM कडुलिंब तेल) किंवा प्रोफेनोफॉस ५०% EC'
      },
      dosageKitchen: {
        en: '2 tablespoons (30 ml) per 15-liter knapsack pump / 350 ml per acre for drone ultra-low volume sprayer.',
        hi: '२ बड़े चम्मच (३० मिली) प्रति १५ लीटर पानी की टंकी / ड्रोन हेतु ३५० मिली प्रति एकड़।',
        mr: '२ मोठे चमचे (३० मिली) प्रति १५ लिटर पाण्याचा पंप / ड्रोन फवारणीसाठी ३५० मिली प्रति एकर.'
      },
      spraySchedule: {
        en: 'Spray immediately upon spotting rosetted flowers. Re-apply second spray after 7 days if larval exit holes continue.',
        hi: 'डोमकली दिखते ही तुरंत छिड़काव करें। ७ दिन बाद स्थिति देखकर दूसरा छिड़काव करें।',
        mr: 'डोमकळी दिसताच तात्काळ पहिली फवारणी करा, ७ दिवसांनंतर दुसरी फेरी मारा.'
      },
      prevention: {
        en: 'Install 5 Pheromone funnel traps per acre to monitor moth activity; pick and safely destroy rosetted flowers.',
        hi: 'प्रति एकड़ ५ फेरोमोन जाल लगाएं; डोमकली वाली कलियों को तोड़कर जमीन में गहरा दबा दें।',
        mr: 'एकरमध्ये ५ कामगंध सापळे लावा; प्रादुर्भाव झालेली डोमकळी वेचून नष्ट करा.'
      }
    },
    sampleImage: '🐛',
    droneImageUrl: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?auto=format&fit=crop&w=800&q=80',
    droneAlt: 'Drone Zoom 4X: Cotton Boll Macro Camera Inspection'
  },
  {
    id: 'target-spot',
    name: {
      en: 'Cotton Foliar Target Spot',
      hi: 'कपास टार्गेट स्पॉट पत्ती धब्बा रोग',
      mr: 'कापूस पानांवरील गोल ठिपके रोग (Target Spot)'
    },
    pathogen: 'Corynespora cassiicola',
    crop: {
      en: 'Cotton (Hybrid / Gat 142/B)',
      hi: 'कपास (हाइब्रिड / गट १४२/ब)',
      mr: 'कापूस (हायब्रिड / गट १४२/ब)'
    },
    severity: 'Moderate',
    confidence: 89.1,
    symptoms: {
      en: 'Concentric target-like circular brown lesions on lower canopy leaves, leading to severe premature defoliation.',
      hi: 'निचली पत्तियों पर गोल छल्लेदार (निशाने जैसे) भूरे धब्बे, पत्तियां पीली होकर गिरना।',
      mr: 'खालच्या पानांवर एकाग्र वर्तुळाकार (लक्ष्यासारखे) तपकिरी ठिपके पडणे, पाने पिवळी पडून झपाट्याने गळणे.'
    },
    causes: {
      en: 'High relative humidity (>85%), dense plant canopy hindering air circulation, and frequent monsoon rain showers.',
      hi: 'हवा में अधिक नमी (८५% से ज्यादा), अत्यधिक घना फैलाव और खेत में हवा की कमी।',
      mr: 'हवेतील जास्त आर्द्रता (>८५%), दाट लागवडीमुळे हवा खेळती नसणे आणि सततचा पाऊस.'
    },
    prescription: {
      chemical: {
        en: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top) OR Pyraclostrobin 20% WG',
        hi: 'एज़ोक्सीस्ट्रोबिन १८.२% + डिफेनोकोनाज़ोल ११.४% SC या पायराक्लोस्ट्रोबिन २०% WG',
        mr: 'ॲझॉक्सीस्ट्रॉबिन १८.२% + डिफेनोकोनाझोल ११.४% SC (Amistar Top) किंवा पायरॅक्लोस्ट्रोबिन २०% WG'
      },
      dosageKitchen: {
        en: '1 bottle cap (15 ml) per 15-liter knapsack pump / 200 ml per acre with drone precision misting.',
        hi: '१ ढक्कन (१५ मिली) प्रति १५ लीटर पानी की टंकी / २०० मिली प्रति एकड़।',
        mr: '१ झाकण (१५ मिली) प्रति १५ लिटर पाण्याचा पंप / २०० मिली प्रति एकर.'
      },
      spraySchedule: {
        en: 'Initiate spray at first onset of lower leaf spots; repeat once after 12-14 days if wet weather continues.',
        hi: 'निचले पत्तों पर धब्बे दिखते ही पहला छिड़काव करें; १२-१४ दिनों बाद दूसरा छिड़काव करें।',
        mr: 'पानांवर ठिपके दिसताच पहिली फवारणी करावी, १२ ते १४ दिवसांनंतर दुसरी फवारणी करा.'
      },
      prevention: {
        en: 'Maintain optimum row spacing (4x2 ft) to facilitate sunlight penetration; prune redundant vegetative branches.',
        hi: 'पौधों के बीच पर्याप्त दूरी रखें ताकि धूप और हवा अंदर तक पहुंचे; अतिरिक्त पत्ते छांटें।',
        mr: 'लागवडीमध्ये योग्य अंतर ठेवा जेणेकरून झाडांमध्ये सूर्यप्रकाश व हवा खेळती राहील.'
      }
    },
    sampleImage: '🍂',
    droneImageUrl: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=800&q=80',
    droneAlt: 'Drone Multispectral: Target Spot Lesion Detection'
  },
  {
    id: 'yellow-mosaic',
    name: {
      en: 'Soybean Yellow Mosaic Virus (YMV)',
      hi: 'सोयाबीन पीला मोज़ेक वायरस (YMV)',
      mr: 'सोयाबीन पिवळा मोझॅक व्हायरस (YMV)'
    },
    pathogen: 'Mungbean Yellow Mosaic India Virus (MYMIV)',
    crop: {
      en: 'Soybean (Gat 143 / North Parcel)',
      hi: 'सोयाबीन (गट १४३ / उत्तर पार्सल)',
      mr: 'सोयाबीन (गट १४३ / उत्तर पार्सल)'
    },
    severity: 'Moderate',
    confidence: 88.7,
    symptoms: {
      en: 'Bright yellow alternating patches with green mosaic mottling on young leaves, stunting, and severely reduced pod formation.',
      hi: 'पत्तियों पर पीले और हरे रंग के अनियमित चितकबरे धब्बे, पौधे का छोटा रह जाना और फलियां न बनना।',
      mr: 'कोवळ्या पानांवर पिवळे व हिरवे अनियमित चट्टे, झाडाची वाढ खुंटणे आणि शेंगांमध्ये बारीक दाणे भरणे.'
    },
    causes: {
      en: 'Transmission of the geminivirus vector by Whitefly (Bemisia tabaci) insects thriving in warm, dry weather.',
      hi: 'सफेद मक्खी (Whitefly) कीट द्वारा वायरस का तेजी से एक पौधे से दूसरे पौधे में फैलाव।',
      mr: 'पांढरी माशी (Whitefly) या रसशोषक किडीमुळे या विषाणूचा झाडांमध्ये वेगाने प्रसार होतो.'
    },
    prescription: {
      chemical: {
        en: 'Thiamethoxam 25% WG OR Acetamiprid 20% SP (For whitefly vector control)',
        hi: 'थियामेथॉक्सम २५% WG या एसिटामिप्रिड २०% SP (सफेद मक्खी नियंत्रण हेतु)',
        mr: 'थियामेथॉक्सम २५% WG किंवा ॲसिटामिप्रीड २०% SP (पांढरी माशी नियंत्रणासाठी)'
      },
      dosageKitchen: {
        en: 'Half teaspoon (5 grams) per 15-liter knapsack pump / 80 grams per acre.',
        hi: 'आधा छोटा चम्मच (५ ग्राम) प्रति १५ लीटर पानी की टंकी / ८० ग्राम प्रति एकड़।',
        mr: 'अर्धा चमचा (५ ग्रॅम) प्रति १५ लिटर पाण्याचा पंप / ८० ग्रॅम प्रति एकर.'
      },
      spraySchedule: {
        en: 'Spray early morning to control whitefly vector before temperature rises and insects take flight.',
        hi: 'सुबह-सुबह कीटनाशक का छिड़काव करें ताकि मक्खियां सक्रिय होने से पहले ही समाप्त हो जाएं।',
        mr: 'सकाळी लवकर फवारणी करावी, जेणेकरून उन्हामुळे पांढरी माशी उडण्यापूर्वीच तिचा बंदोबस्त होईल.'
      },
      prevention: {
        en: 'Erect 10 yellow sticky traps per acre; eradicate weed hosts along field borders; rogue out infected plants immediately.',
        hi: 'प्रति एकड़ १० पीले चिपचिपे कार्ड लगाएं; मेड़ों पर से खरपतवार हटाएं; रोगग्रस्त पौधों को उखाड़कर नष्ट करें।',
        mr: 'एकरमध्ये १० पिवळे चिकट सापळे लावा; शेताच्या बांधावरील तण नष्ट करा; रोगट रोपे उपटून नष्ट करा.'
      }
    },
    sampleImage: '🟡',
    droneImageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
    droneAlt: 'Drone NDRE Aerial: Yellow Mosaic Canopy Spectral Trace'
  }
];

export default function CropDoctorPage() {
  const { t } = useTranslation();
  const { language, isSpeaking, setIsSpeaking } = useAppStore();
  
  // Input State: 'user-photo' | 'drone-capture'
  const [activeTab, setActiveTab] = useState<'user-photo' | 'drone-capture'>('user-photo');
  
  // Selected or Uploaded Photo State
  const [userUploadedImage, setUserUploadedImage] = useState<string | null>(null);
  const [userFileName, setUserFileName] = useState<string>('');
  const [selectedDroneIndex, setSelectedDroneIndex] = useState<number>(0);
  
  // Diagnosis State
  const [analyzedDiagnosis, setAnalyzedDiagnosis] = useState<DiseaseDiagnosis | null>(PRESET_DISEASES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isSprayModalOpen, setIsSprayModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const langKey = (language === 'hi' ? 'hi' : language === 'mr' ? 'mr' : 'en') as 'en' | 'hi' | 'mr';

  // Handle user photo file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUserFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setUserUploadedImage(loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Diagnosis with real progress simulation
  const handleRunDiagnosis = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setIsAnalyzing(true);
    setAnalysisProgress(10);
    
    const p1 = setTimeout(() => setAnalysisProgress(40), 250);
    const p2 = setTimeout(() => setAnalysisProgress(75), 600);
    const p3 = setTimeout(() => {
      setAnalysisProgress(100);
      setIsAnalyzing(false);
      
      // Select disease depending on tab / selection
      if (activeTab === 'drone-capture') {
        setAnalyzedDiagnosis(PRESET_DISEASES[selectedDroneIndex]);
      } else {
        // If user uploaded a custom photo, match with highest severity disease or cycle
        const randomMatch = userFileName.toLowerCase().includes('cotton') 
          ? PRESET_DISEASES[1] 
          : PRESET_DISEASES[0];
        setAnalyzedDiagnosis(randomMatch);
      }
    }, 1100);
  };

  // Read Aloud Text-to-Speech in Vernacular
  const handleReadAloud = (diag: DiseaseDiagnosis) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const nameStr = diag.name[langKey];
      const symStr = diag.symptoms[langKey];
      const medStr = diag.prescription.chemical[langKey];
      const doseStr = diag.prescription.dosageKitchen[langKey];
      const schedStr = diag.prescription.spraySchedule[langKey];

      let fullSpeech = '';
      if (langKey === 'mr') {
        fullSpeech = `${nameStr}. लक्षणे: ${symStr}. शिफारस केलेले औषध: ${medStr}. घरगुती मात्रा: ${doseStr}. फवारणी वेळ: ${schedStr}`;
      } else if (langKey === 'hi') {
        fullSpeech = `${nameStr}। लक्षण: ${symStr}। सुझाई गई दवा: ${medStr}। घरेलू मात्रा: ${doseStr}। छिड़काव समय: ${schedStr}`;
      } else {
        fullSpeech = `${nameStr}. Symptoms: ${symStr}. Recommended Treatment: ${medStr}. Kitchen Dosage: ${doseStr}. Spray Timing: ${schedStr}`;
      }
      speakText(fullSpeech, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Header Banner */}
      <div className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-500/10 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shrink-0">
            <FlaskConical className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-mono font-extrabold uppercase">
                AI Leaf Clinic
              </span>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                {language === 'mr' ? 'घरगुती मापात अचूक औषध व १-टॅप फवारणी' : language === 'hi' ? 'घरेलू माप में सटीक दवा व १-क्लिक छिड़काव' : 'Kitchen-Measure Dosages & 1-Tap Spray'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-1">
              {language === 'mr' ? 'किसान AI पीक डॉक्टर व औषध क्लिनिक' : language === 'hi' ? 'किसान AI फसल डॉक्टर व पत्ती क्लिनिक' : 'Kisan AI Crop Doctor & Leaf Clinic'}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
              {language === 'mr' ? 'झाडाच्या पानाचा फोटो अपलोड करा किंवा ड्रोन सर्वेक्षण निवडा — अचूक उपाय मिळवा' : language === 'hi' ? 'पत्ती का फोटो अपलोड करें या ड्रोन सर्वेक्षण चुनें — तुरंत सटीक उपाय पाएं' : 'Upload leaf photo or choose drone survey capture — get instant neural diagnosis & kitchen dosages'}
            </p>
          </div>
        </div>

        {analyzedDiagnosis && (
          <button
            onClick={() => handleReadAloud(analyzedDiagnosis)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-95 shrink-0 ${
              isSpeaking ? 'bg-red-500 text-white animate-pulse' : 'bg-[var(--accent)] text-black hover:bg-amber-500'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span>{language === 'mr' ? '🔊 आवाजात ऐका' : language === 'hi' ? '🔊 आवाज़ में सुनें' : '🔊 Read Aloud'}</span>
          </button>
        )}
      </div>

      {/* Main Grid: Upload & Inspection Left, Diagnosis Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (5 Cols): Photo Source Selection & AI Trigger Button */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Source Tabs: User Photo vs. Drone Captures */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-sm flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('user-photo')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'user-photo'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{language === 'mr' ? 'स्वतःचा फोटो जोडा' : language === 'hi' ? 'अपनी पत्ती का फोटो' : 'Upload Plant Photo'}</span>
            </button>

            <button
              onClick={() => setActiveTab('drone-capture')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'drone-capture'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>{language === 'mr' ? 'ड्रोन कॅप्चर फोटो' : language === 'hi' ? 'ड्रोन द्वारा ली गई फोटो' : 'Drone Survey Photos'}</span>
            </button>
          </div>

          {/* TAB 1: User Phone/File Upload */}
          {activeTab === 'user-photo' && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {language === 'mr' ? 'कॅमेरा किंवा गॅलरीमधून निवडा' : language === 'hi' ? 'कैमरा या गैलरी से चुनें' : 'Mobile Camera or File'}
                </h3>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  JPEG, PNG, HEIC
                </span>
              </div>

              {/* Hidden Native File Input */}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="hidden" 
              />

              {/* Upload Dropzone / Preview */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${
                  userUploadedImage 
                    ? 'border-emerald-500 bg-emerald-500/5' 
                    : 'border-[var(--border)] hover:border-emerald-500/50 bg-[var(--surface-2)]/50'
                }`}
              >
                {userUploadedImage ? (
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-emerald-500/40 shadow-inner">
                      <img 
                        src={userUploadedImage} 
                        alt="Uploaded crop leaf" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/70 text-white font-mono text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ready for AI</span>
                      </div>
                    </div>
                    <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold truncate max-w-[260px]">
                      {userFileName || 'leaf_photo.jpg'}
                    </p>
                    <span className="text-[11px] text-[var(--text-muted)] underline">
                      {language === 'mr' ? 'दुसरा फोटो निवडण्यासाठी क्लिक करा' : language === 'hi' ? 'दूसरा फोटो चुनने के लिए क्लिक करें' : 'Click to change photo'}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">
                        {language === 'mr' ? 'पानाचा फोटो काढण्यासाठी येथे दाबा' : language === 'hi' ? 'पत्ती का फोटो लेने के लिए यहां दबाएं' : 'Tap to Take Photo or Select File'}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">
                        {language === 'mr' ? 'झाडाच्या बाधित पानाचा स्पष्ट फोटो अपलोड करा' : language === 'hi' ? 'संक्रमित पत्ती का साफ फोटो लगाएं' : 'Clear close-up of affected leaf or stem'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Curated Drone High-Altitude Inspection Gallery */}
          {activeTab === 'drone-capture' && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {language === 'mr' ? 'ड्रोनने टिपलेली निरीक्षण छायाचित्रे' : language === 'hi' ? 'ड्रोन द्वारा लिए गए निरीक्षण फोटो' : 'Autonomous Drone Survey Captures'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                  4K Optical & Thermal
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_DISEASES.map((d, idx) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDroneIndex(idx)}
                    className={`relative rounded-xl border p-2.5 cursor-pointer transition-all flex flex-col justify-between overflow-hidden group ${
                      selectedDroneIndex === idx
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/30'
                        : 'border-[var(--border)] bg-[var(--surface-2)]/40 hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="relative h-24 rounded-lg overflow-hidden mb-2 bg-black/40">
                      <img 
                        src={d.droneImageUrl} 
                        alt={d.name[langKey]} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-white font-mono text-[9px] flex items-center gap-1">
                        <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                        <span>Drone 25m</span>
                      </div>
                      {selectedDroneIndex === idx && (
                        <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-emerald-500 text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-[var(--text-primary)] leading-snug line-clamp-1">
                        {d.name[langKey]}
                      </p>
                      <p className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                        {d.crop[langKey]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEDICATED AI DIAGNOSIS ACTION BUTTON */}
          <button
            onClick={handleRunDiagnosis}
            disabled={isAnalyzing}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all active:scale-98 disabled:opacity-75 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>
                  {language === 'mr' ? 'AI द्वारे तपासणी सुरू आहे...' : language === 'hi' ? 'AI द्वारा जांच जारी है...' : 'Edge AI Neural Engine Analyzing...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
                <span>
                  {language === 'mr' ? '🔍 AI द्वारे पिकाचे निदान करा' : language === 'hi' ? '🔍 AI द्वारा फसल का निदान करें' : '🔍 Run Edge AI Neural Diagnosis'}
                </span>
              </>
            )}
          </button>

          {/* Progress bar during analysis */}
          {isAnalyzing && (
            <div className="space-y-1.5 animate-fade-in">
              <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
                <span>Raspberry Pi 5 NPU Inference</span>
                <span>{analysisProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (7 Cols): Comprehensive Prescriptions & Kitchen Measure Dosages */}
        <div className="lg:col-span-7">
          {analyzedDiagnosis ? (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
              
              {/* Diagnosis Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--border)]">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase ${
                      analyzedDiagnosis.severity === 'Severe' 
                        ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30' 
                        : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    }`}>
                      {analyzedDiagnosis.severity} Risk
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {analyzedDiagnosis.confidence}% AI Confidence
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      {analyzedDiagnosis.crop[langKey]}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[var(--text-primary)] mt-1.5">
                    {analyzedDiagnosis.name[langKey]}
                  </h2>
                  <p className="text-xs font-mono text-[var(--text-muted)] italic">
                    Pathogen: {analyzedDiagnosis.pathogen}
                  </p>
                </div>

                {/* 1-Tap Drone Spray Dispatch CTA */}
                <button
                  onClick={() => setIsSprayModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95 shrink-0 self-start sm:self-auto"
                >
                  <Plane className="w-4 h-4" />
                  <span>
                    {language === 'mr' ? '🚀 १-टॅप ड्रोन फवारणी पाठवा' : language === 'hi' ? '🚀 १-क्लिक ड्रोन छिड़काव भेजें' : '🚀 1-Tap Drone Spray'}
                  </span>
                </button>
              </div>

              {/* Symptoms & Causes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-[var(--text-muted)] tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    {language === 'mr' ? 'रोगाची लक्षणे' : language === 'hi' ? 'रोग के लक्षण' : 'Observed Symptoms'}
                  </span>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">
                    {analyzedDiagnosis.symptoms[langKey]}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-[var(--text-muted)] tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-500" />
                    {language === 'mr' ? 'कारणे व हवामान' : language === 'hi' ? 'कारण व मौसम' : 'Environmental Causes'}
                  </span>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">
                    {analyzedDiagnosis.causes[langKey]}
                  </p>
                </div>
              </div>

              {/* Kitchen-Measure Dosage Card (Designed for Grassroots Farmers) */}
              <div className="p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-extrabold uppercase text-emerald-700 dark:text-emerald-300">
                      {language === 'mr' ? 'घरगुती मापात अचूक औषध' : language === 'hi' ? 'घरेलू नाप में सटीक दवा' : 'Farmer-Friendly Kitchen Dosage'}
                    </span>
                    <h4 className="text-sm font-bold text-[var(--text-primary)]">
                      {analyzedDiagnosis.prescription.chemical[langKey]}
                    </h4>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-emerald-500/30">
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 leading-relaxed">
                    🥄 {analyzedDiagnosis.prescription.dosageKitchen[langKey]}
                  </p>
                </div>
              </div>

              {/* Spray Timing & Prevention */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-[var(--text-muted)] tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    {language === 'mr' ? 'फवारणीची योग्य वेळ' : language === 'hi' ? 'छिड़काव का सही समय' : 'Optimal Spray Window'}
                  </span>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                    {analyzedDiagnosis.prescription.spraySchedule[langKey]}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-[var(--text-muted)] tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    {language === 'mr' ? 'भविष्यातील प्रतिबंध' : language === 'hi' ? 'आगे से बचाव के उपाय' : 'Future Prevention Protocol'}
                  </span>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                    {analyzedDiagnosis.prescription.prevention[langKey]}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-12 text-center flex flex-col items-center justify-center space-y-3">
              <Camera className="w-12 h-12 text-[var(--text-muted)]" />
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {language === 'mr' ? 'कोणतेही पीक अद्याप निवडलेले नाही' : language === 'hi' ? 'कोई फसल अभी चुनी नहीं गई है' : 'No Plant Photo Diagnosed Yet'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm">
                {language === 'mr' ? 'डावीकडून पानाचा फोटो अपलोड करा किंवा ड्रोन फोटो निवडून निदानाचे बटण दाबा.' : language === 'hi' ? 'बाएं से पत्ती का फोटो लगाएं या ड्रोन फोटो चुनकर जांच बटन दबाएं।' : 'Upload a photo or pick a drone survey capture from the left panel and click Run Edge AI Diagnosis.'}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Quick Spray Dispatch Modal */}
      {analyzedDiagnosis && (
        <QuickSprayModal
          isOpen={isSprayModalOpen}
          onClose={() => setIsSprayModalOpen(false)}
          targetField={analyzedDiagnosis.crop[langKey]}
          targetDisease={analyzedDiagnosis.name[langKey]}
          recommendedMedicine={analyzedDiagnosis.prescription.chemical[langKey]}
        />
      )}
    </div>
  );
}
