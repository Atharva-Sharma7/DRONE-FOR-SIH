'use client';
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  CheckCircle2, 
  Sprout, 
  Cpu, 
  MapPin, 
  Camera, 
  Microscope, 
  ShieldAlert, 
  TrendingUp, 
  FileText,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';
import Link from 'next/link';

interface FeatureStep {
  id: string;
  titleEn: string;
  titleMr: string;
  titleHi: string;
  tag: string;
  icon: any;
  route: string;
  descriptionEn: string;
  descriptionMr: string;
  descriptionHi: string;
  demoHighlight: string;
  keyPoints: { en: string; mr: string; hi: string }[];
  audioEn: string;
  audioMr: string;
  audioHi: string;
}

const FEATURE_STEPS: FeatureStep[] = [
  {
    id: 'sown-overview',
    titleEn: '1. Sown Crops Overview & Customization',
    titleMr: '१. शेतजमीन व पेरणी नकाशा (पिके बदला)',
    titleHi: '१. बोई गई फसलें व खेत मानचित्र (कस्टमाइज करें)',
    tag: 'Cadastral Crop Allocator',
    icon: Sprout,
    route: '/',
    descriptionEn: 'Interactive holding overview showing what crop is sown in which Gat parcel (Bt Cotton in 142/A, Soybean in 143, Tur Dal in 144, Chana in 145/B, Onion in 146). Farmers can customize crops, varieties, sowing dates, and acreage anytime with automatic local saving.',
    descriptionMr: 'शेतकऱ्याच्या संपूर्ण १८.५ एकर जमिनीचा नकाशा. कोणत्या गटामध्ये कोणते पीक, कोणता वाण, कधी पेरणी केली हे स्पष्ट दिसते. शेतकरी स्वतः पिके बदलू शकतात आणि माहिती आपोआप सेव्ह होते.',
    descriptionHi: 'किसान की पूरी १८.५ एकड़ जमीन का नक्शा। किस गट में कौन सी फसल, कौन सी किस्म और कब बोई गई, यह साफ दिखता है। किसान अपनी मर्जी से फसलें एडिट कर सकते हैं।',
    demoHighlight: '🌾 Click any parcel card on the Dashboard to instantly run deep 6-AI Model analysis!',
    keyPoints: [
      { en: 'Multi-Crop holding: Cotton, Soybean, Tur Dal, Chana, Onion', mr: 'विविध पिके: कपाशी, सोयाबीन, तूर, हरभरा आणि कांदा', hi: 'विविध फसलें: कपास, सोयाबीन, तुअर, चना व प्याज' },
      { en: '1-Click customization modal saved directly to device', mr: '१-क्लिकने पिके व पेरणीची तारीख बदलण्याची सुविधा', hi: '१-क्लिक में फसल और बुवाई की तारीख बदलने की सुविधा' },
      { en: 'Live days-old age counter & health score indicator', mr: 'पेरणीनंतरचे दिवस आणि आरोग्य गुण त्वरित दाखवतो', hi: 'बुवाई के बाद के दिन और फसल स्वास्थ्य स्कोर' },
    ],
    audioEn: 'Feature 1: Sown Crops Field Overview. See exactly what crop is planted in each parcel across your farm. Tap customize to edit varieties or sowing dates anytime, and click any parcel to trigger full AI diagnosis.',
    audioMr: 'पहिले वैशिष्ट्य: शेतजमीन व पेरणी नकाशा. आपल्या कोणत्या गटामध्ये कोणते पीक पेरले आहे ते येथे दिसते. पिके बदला बटण दाबून आपण वाण व तारीख बदलू शकता आणि कोणत्याही पिकावर क्लिक करून AI तपासणी करू शकता.',
    audioHi: 'पहला फीचर: खेत भूमि व बुवाई मानचित्र। आपके किस गट में कौन सी फसल बोई है, यहाँ दिखता है। कस्टमाइज बटन से आप किस्म और तारीख बदल सकते हैं तथा किसी भी फसल पर क्लिक करके AI जांच कर सकते हैं।',
  },
  {
    id: 'ai-ensemble',
    titleEn: '2. Six-AI Model Neural Ensemble',
    titleMr: '२. सहा AI मॉडेल्सचे संयुक्त विश्लेषण',
    titleHi: '२. छह AI मॉडल्स का संयुक्त विश्लेषण',
    tag: 'Edge Neural Diagnosis',
    icon: Cpu,
    route: '/',
    descriptionEn: 'An ensemble of 6 specialized AI models working concurrently on the clicked crop: YOLOv8 Edge NPU Detector, Vision Transformer Classifier, DeepLabV3+ Canopy Segmenter, Bio-Meteorological FungiRisk AI, XGBoost Yield Predictor, and ICAR Soil NPK Recommendation Engine.',
    descriptionMr: 'एकाच वेळी काम करणारे ६ कृषी AI मॉडेल्स: YOLOv8 रोग शोधक, व्हिजन ट्रान्सफॉर्मर, कॅनोपी कव्हर सेगमेंटर, हवामान बुरशी धोका AI, उत्पादन अंदाज मॉडेल आणि ICAR खत शिफारस इंजिन.',
    descriptionHi: 'एक साथ काम करने वाले ६ कृषि AI मॉडल्स: YOLOv8 रोग डिटेक्टर, विजन ट्रांसफार्मर, कैनोपी सेगमेंटर, मौसम फफूंद जोखिम AI, उपज अनुमान मॉडल और ICAR खाद सिफारिश इंजन।',
    demoHighlight: '🧠 24ms Onboard Raspberry Pi 5 NPU edge inference with zero cloud dependency!',
    keyPoints: [
      { en: 'YOLOv8 bounding boxes with real pest & lesion count', mr: 'YOLOv8 द्वारे कीटक व पानांवरील डागांचे थेट मोजमाप', hi: 'YOLOv8 द्वारा कीट और पत्तियों के धब्बों की पहचान' },
      { en: 'Bio-Meteorological FungiRisk index based on leaf wetness', mr: 'पानांवरील ओलावा व आर्द्रतेनुसार बुरशीजन्य रोगाचा धोका', hi: 'पत्तियों की नमी और उमस के अनुसार फफूंद रोग का जोखिम' },
      { en: 'Harvest yield forecast (Quintals/Acre) vs Taluka average', mr: 'तालुक्याच्या सरासरीशी तुलना करून एकरी उत्पादनाचा अंदाज', hi: 'तालुका औसत से तुलना करके प्रति एकड़ उपज का पूर्वानुमान' },
    ],
    audioEn: 'Feature 2: Six AI Model Ensemble. Instead of a simple test, our drone runs 6 neural models simultaneously, giving pest bounding boxes, pathogen probability, canopy cover, fungal risk, yield forecast, and exact fertilizer kilograms.',
    audioMr: 'दुसरे वैशिष्ट्य: ६ AI मॉडेल्सचे संयुक्त विश्लेषण. ड्रोन ६ प्रगत AI मॉडेल्स एकाच वेळी चालवून रोगाचे अचूक नाव, बुरशीचा धोका, उत्पादनाचा अंदाज आणि आवश्यक खताचे अचूक किलो प्रमाण सांगते.',
    audioHi: 'दूसरा फीचर: ६ AI मॉडल्स का संयुक्त विश्लेषण। ड्रोन ६ उन्नत AI मॉडल्स एक साथ चलाकर रोग का नाम, फफूंद का जोखिम, फसल की उपज और खाद की सटीक मात्रा बताता है।',
  },
  {
    id: 'live-feed',
    titleEn: '3. Synchronized 4-Cam Live Drone Vision',
    titleMr: '३. थेट ४-कॅमेरा सिंक्रोनाइझ्ड व्हिजन',
    titleHi: '३. लाइव ४-कैमरा सिंक्रोनाइज्ड विजन',
    tag: 'Multi-Sensor Lock',
    icon: Camera,
    route: '/live-feed',
    descriptionEn: 'All 4 drone sensors simultaneously locked onto the exact same crop parcel. Switching waypoints (Cotton, Soybean, Tur, Chana, Onion) synchronously updates 4K RGB, 5-Band NDVI Heatmap, Radiometric Thermal IR, and 120-Band Micro-Hyperspectral curves without mismatch.',
    descriptionMr: 'सर्व ४ सेन्सर एकाच वेळी एकाच पिकावर रोखलेले असतात. पीक बदलताच ४K आरजीबी, ५-बँड NDVI, थर्मल इन्फ्रारेड आणि १२०-बँड स्पेक्ट्रोमीटर वक्र एकाच पिकाचे अचूक रिअल-टाइम दृश्य दाखवतात.',
    descriptionHi: 'सभी ४ सेंसर एक साथ एक ही फसल पर केंद्रित होते हैं। फसल बदलते ही ४K आरजीबी, ५-बैंड NDVI, थर्मल इंफ्रारेड और १२०-बैंड स्पेक्ट्रोमीटर कर्व एक ही फसल का रियल-टाइम डेटा दिखाते हैं।',
    demoHighlight: '📹 Multi-spectral vigor, moisture stress hotspots, and plant chlorophyll signatures synchronized!',
    keyPoints: [
      { en: 'Zero sensor mismatch: All 4 cams analyze identical crop', mr: 'शून्य तफावत: सर्व ४ कॅमेरे एकाच पिकाचे विश्लेषण करतात', hi: 'शून्य त्रुटि: सभी ४ कैमरे एक ही फसल का विश्लेषण करते हैं' },
      { en: '1X, 2X, 4X optical digital zoom with gimbal target lock', mr: '१X, २X, ४X झूम आणि लक्ष्य लॉक सुविधा', hi: '१X, २X, ४X ज़ूम और टारगेट लॉक सुविधा' },
      { en: 'Snapshot tool saves 4K calibrated frames directly to NVMe', mr: '४K कॅलिब्रेटेड फोटो एका क्लिकमध्ये सेव्ह करण्याची सोय', hi: '४K कैलिब्रेटेड फोटो एक क्लिक में सेव करने की सुविधा' },
    ],
    audioEn: 'Feature 3: Synchronized 4-Cam Live Drone Vision. All four sensors are locked onto the same crop. Switch crops at the top to watch RGB, NDVI, Thermal IR, and Hyperspectral spectrum update simultaneously.',
    audioMr: 'तिसरे वैशिष्ट्य: थेट ४-कॅमेरा सिंक्रोनाइझ्ड व्हिजन. चारही कॅमेरे एकाच पिकावर रोखलेले असतात. वरून पीक बदलताच सर्व कॅमेरे त्या पिकाचे आरजीबी, NDVI आणि थर्मल इन्फ्रारेड डेटा एकत्रित दाखवतात.',
    audioHi: 'तीसरा फीचर: लाइव ४-कैमरा सिंक्रोनाइज्ड विजन। चारों कैमरे एक ही फसल पर लॉक होते हैं। ऊपर से फसल बदलते ही सभी कैमरे उस फसल का आरजीबी, NDVI और थर्मल डेटा एक साथ दिखाते हैं।',
  },
  {
    id: 'farm-map',
    titleEn: '4. Mahabhulekh 7/12 AgroGIS & Zero-Key Map',
    titleMr: '४. महाभूलेख ७/१२ शेत नकाशा (मोफत नकाशे)',
    titleHi: '४. महाभूलेख ७/१२ खेत मानचित्र (फ्री मैप्स)',
    tag: 'Zero-API-Key Satellite',
    icon: MapPin,
    route: '/map',
    descriptionEn: 'Full cadastral survey maps with official Gat boundaries (Gat 142/A, 142/B, 143, 144, 145/B, 146). Powered by high-resolution Google Satellite Hybrid, OpenStreetMap, Topo Contours, and Thermal basemaps requiring ZERO external API keys.',
    descriptionMr: 'अधिकृत ७/१२ गट नंबरानुसार जमिनीच्या सीमा (गट १४२/अ, १४३, १४४ इ.). गुगल सॅटेलाइट आणि ओपनस्ट्रीटनकाशावर आधारित पूर्णपणे मोफत, कोणत्याही API Key ची गरज नसलेला प्रगत शेती नकाशा.',
    descriptionHi: 'आधिकारिक ७/१२ गट नंबर के अनुसार खेत की सीमाएं (गट १४२/अ, १४३, १४४ आदि)। गूगल सैटेलाइट और ओपनस्ट्रीटमैप आधारित पूरी तरह फ्री, बिना किसी API Key के चलने वाला आधुनिक नक्शा।',
    demoHighlight: '🗺️ Distance & acreage measurement tool + Before/After spray time-machine slider included!',
    keyPoints: [
      { en: '100% Free basemaps: Satellite Hybrid, OSM, Topo, Thermal', mr: '१००% मोफत नकाशे: सॅटेलाइट, ओपनस्ट्रीटनकाशा, टोपो', hi: '१००% फ्री मैप्स: सैटेलाइट, ओपनस्ट्रीटनक्शा, टोपो' },
      { en: 'Cadastral Gat parcel popups with land records & owner name', mr: 'गट नंबरवर क्लिक करताच क्षेत्रफळ व मालकाचे नाव दिसते', hi: 'गट नंबर पर क्लिक करते ही क्षेत्रफल व मालिक का नाम दिखता है' },
      { en: 'Interactive measurement tool calculates acres and meters', mr: 'शेताची लांबी आणि क्षेत्रफळ मोजण्याचे डिजिटल साधन', hi: 'खेत की लंबाई और क्षेत्रफल मापने का डिजिटल टूल' },
    ],
    audioEn: 'Feature 4: Farm Map and AgroGIS. Access official 7/12 cadastral boundaries on high-resolution satellite imagery with zero API keys required. Measure plot acreage and slide through before-and-after spray comparisons.',
    audioMr: 'चौथे वैशिष्ट्य: महाभूलेख ७/१२ शेत नकाशा. कोणत्याही API Key शिवाय चालणाऱ्या मोफत सॅटेलाइट नकाशावर आपले गट नंबर पहा, जमिनीचे क्षेत्रफळ मोजा आणि फवारणीपूर्वीचा व नंतरचा फरक तपासा.',
    audioHi: 'चौथा फीचर: महाभूलेख ७/१२ खेत मानचित्र। बिना किसी API Key के चलने वाले फ्री सैटेलाइट नक्शे पर अपने गट नंबर देखें, जमीन नापें और छिड़काव से पहले और बाद का अंतर देखें।',
  },
  {
    id: 'kisan-rakshak',
    titleEn: '5. Kisan Rakshak Survey-Driven Response Hub',
    titleMr: '५. किसान रक्षक: वन्यजीव, विषबाधा व बियाणे संरक्षण',
    titleHi: '५. किसान रक्षक: वन्यजीव, विषबाधा व बीज सुरक्षा',
    tag: 'Survey-Backed Solutions',
    icon: ShieldAlert,
    route: '/kisan-rakshak',
    descriptionEn: 'Engineered directly from GIPE, MAPPP, and NSSO agricultural crisis surveys: Night-watch thermal drone patrol with 110dB ultrasonic deterrent against wild boars, zero-contact chemical misting eliminating pesticide poisonings, day-8 bogus seed germination auditor, and hydro-thermal aquifer fracture mapping.',
    descriptionMr: 'गोखले इन्स्टिट्यूट व विदर्भ सर्वेक्षणावर आधारित ४ दुर्लक्षित समस्यांवर उपाय: रात्री वन्यजीवांपासून पिकांचे रक्षण करणारा सायरन ड्रोन, विषबाधा टाळणारी शून्य-संपर्क फवारणी, बोगस बियाण्यांचा पंचनामा आणि भूजल शोध.',
    descriptionHi: 'गोखले संस्थान व विदर्भ सर्वेक्षण पर आधारित ४ अनसुलझी समस्याओं का समाधान: रात में जंगली जानवरों से रक्षा हेतु सायरन ड्रोन, विषबाधा रोकने वाला शून्य-संपर्क छिड़काव, नकली बीज पंचनामा और भूजल मैपिंग।',
    demoHighlight: '🚨 110dB ultrasonic siren & 4000lm strobe frightening nocturnal crop-destroying animals away!',
    keyPoints: [
      { en: 'Wild Boar & Nilgai night patrol saves farmers from fatal snakebites', mr: 'रात्री शेतात न जाता रानडुक्कर पिटाळण्याची स्वयंचलित सोय', hi: 'रात में खेत जाए बिना जंगली सूअर भगाने की ऑटोमैटिक सुविधा' },
      { en: 'Zero-contact ULV drone spraying ends pesticide inhalation deaths', mr: 'मानवी संपर्काशिवाय फवारणी - कीटकनाशक विषबाधेपासून १००% मुक्ती', hi: 'मानव संपर्क के बिना छिड़काव - कीटनाशक विषबाधा से १००% सुरक्षा' },
      { en: '1-Click legal Panchnama PDF for bogus seed compensation', mr: 'बोगस बियाण्यांविरुद्ध नुकसान भरपाईसाठी अधिकृत कायदेशीर पंचनामा', hi: 'नकली बीज के खिलाफ मुआवजे हेतु अधिकृत कानूनी पंचनामा' },
    ],
    audioEn: 'Feature 5: Kisan Rakshak Hub. Solves real survey-backed crises: Night thermal patrols deter crop-raiding wild boars with sirens so you avoid nocturnal snakebites, zero-contact spraying eliminates pesticide inhalation, and seedling emergence AI catches counterfeit seeds.',
    audioMr: 'पाचवे वैशिष्ट्य: किसान रक्षक केंद्र. रात्री शेतात न जाता रानडुकरांना सायरनने पिटाळून लावा आणि सर्पदंशापासून वाचा, शून्य-संपर्क ड्रोन फवारणीने विषबाधा टाळा आणि बोगस बियाण्यांवर कायदेशीर पंचनामा मिळवा.',
    audioHi: 'पाँचवाँ फीचर: किसान रक्षक केंद्र। रात में खेत जाए बिना जंगली जानवरों को सायरन से भगाएं और सर्पदंश से बचें, शून्य-संपर्क ड्रोन छिड़काव से विषबाधा से बचें और नकली बीजों पर कानूनी पंचनामा पाएं।',
  },
  {
    id: 'crop-doctor',
    titleEn: '6. Kisan AI Leaf Clinic & Drone Uploads',
    titleMr: '६. किसान AI पीक डॉक्टर व औषध प्रमाण',
    titleHi: '६. किसान AI फसल डॉक्टर व दवा की मात्रा',
    tag: 'Dual Photo Diagnostics',
    icon: Microscope,
    route: '/crop-doctor',
    descriptionEn: 'Upload photos of single diseased plant leaves from mobile cameras or high-altitude drone captures. Edge AI identifies pathogens, severity, and prescribes exact farmer kitchen pump dosages (e.g., 1 bottle cap / 15ml per 15L pump) with 1-tap drone dispatch.',
    descriptionMr: 'मोबाईलने काढलेला पानावरील रोगाचा फोटो किंवा ड्रोनने घेतलेला फोटो अपलोड करा. AI प्रणाली रोगाचे निदान करून घरगुती पंपासाठी सोप्या भाषेत औषधाचे प्रमाण सांगते (उदा. १ टोपण प्रति १५ लिटर पंप).',
    descriptionHi: 'मोबाइल से खींचा गया पत्ती का फोटो या ड्रोन से लिया गया फोटो अपलोड करें। AI प्रणाली रोग की पहचान कर घरेलू पंप के लिए आसान भाषा में दवा की मात्रा बताती है (उदा. १ ढक्कन प्रति १५ लीटर पंप)।',
    demoHighlight: '🧴 Simple kitchen dosages + 1-Tap launch drone spray button!',
    keyPoints: [
      { en: 'Dual inputs: Smartphone camera or high-altitude drone captures', mr: 'मोबाईल कॅमेरा किंवा ड्रोनद्वारे टिपलेले फोटो दोन्ही स्वीकारतो', hi: 'मोबाइल कैमरा या ड्रोन द्वारा खींचे गए फोटो दोनों स्वीकार करता है' },
      { en: 'Dosages in bottle caps & tablespoons for illiterate farmers', mr: 'निरक्षर शेतकऱ्यांसाठी टोपण आणि चमच्याच्या परिमाणात औषध मात्रा', hi: 'अशिक्षित किसानों के लिए ढक्कन और चम्मच के माप में दवा की मात्रा' },
      { en: '1-Tap button dispatches autonomous spray drone with exact recipe', mr: '१-टॅप बटण दाबून ड्रोनला त्वरित योग्य औषधासह पाठवण्याची सोय', hi: '१-टैप बटन दबाकर ड्रोन को तुरंत सही दवा के साथ भेजने की सुविधा' },
    ],
    audioEn: 'Feature 6: Kisan AI Leaf Clinic. Snap a photo of any damaged leaf or use drone survey images. Our neural network diagnoses the pathogen and gives exact kitchen dosages like two tablespoons per knapsack pump.',
    audioMr: 'सहावे वैशिष्ट्य: किसान AI पीक डॉक्टर. कोणत्याही खराब पानाचा फोटो काढा किंवा ड्रोनचे फोटो वापरा. AI तात्काळ रोगाचे नाव सांगून घरगुती पंपासाठी १ ते २ टोपण औषधाचे सोपे प्रमाण सांगते.',
    audioHi: 'छठा फीचर: किसान AI फसल डॉक्टर। किसी भी खराब पत्ती का फोटो खींचें या ड्रोन के फोटो का उपयोग करें। AI तुरंत रोग का नाम बताकर घरेलू पंप के लिए १ से २ ढक्कन दवा का सरल माप बताता है।',
  },
  {
    id: 'mandi-bhav',
    titleEn: '7. APMC Live Mandi Bhav & Freight Radar',
    titleMr: '७. थेट कृषी उत्पन्न बाजारभाव व नफा रडार',
    titleHi: '७. लाइव कृषि उपज मंडी भाव व मुनाफा रडार',
    tag: 'Middleman Margin Eliminator',
    icon: TrendingUp,
    route: '/mandi',
    descriptionEn: 'Real-time commodity market prices across Nagpur, Khamgaon, Akola, and Amravati APMCs. Calculates truck diesel freight costs and reveals the net profit difference compared to village middlemen.',
    descriptionMr: 'नागपूर, खामगाव, अकोला व अमरावती बाजार समित्यांचे थेट बाजारभाव. गावात येणाऱ्या दलालांपेक्षा जवळच्या बाजार समितीत माल विकल्यास डिझेल खर्च वजा जाता किती जास्त नफा होईल याचा अचूक हिशोब.',
    descriptionHi: 'नागपुर, खामगांव, अकोला व अमरावती कृषि मंडियों के लाइव भाव। गांव के बिचौलियों की तुलना में मंडी में फसल बेचने पर डीजल खर्च काटकर कितना अधिक शुद्ध मुनाफा होगा, इसका सटीक हिसाब।',
    demoHighlight: '💰 Shows net profit gain after subtracting tempo freight diesel costs!',
    keyPoints: [
      { en: 'Real-time APMC Mandi rates for Cotton, Soybean, Tur, Chana, Onion', mr: 'कपाशी, सोयाबीन, तूर, हरभरा व कांद्याचे थेट बाजारभाव', hi: 'कपास, सोयाबीन, तुअर, चना व प्याज के लाइव मंडी भाव' },
      { en: 'Dynamic transport freight calculator per kilometer', mr: 'प्रति किलोमीटर वाहतूक डिझेल खर्चाची स्वयंचलित वजावट', hi: 'प्रति किलोमीटर परिवहन डीजल खर्च की ऑटोमैटिक गणना' },
      { en: 'Middleman rip-off alert highlighting highest net realization', mr: 'दलालांच्या फसवणुकीपासून बचाव करणारा नफा दर्शक', hi: 'बिचौलियों से बचाकर अधिकतम मुनाफा दिलाने वाला इंडिकेटर' },
    ],
    audioEn: 'Feature 7: APMC Live Mandi Bhav. Compares real-time mandi prices across regional markets, calculates your transport diesel freight, and shows exactly how much extra profit you earn avoiding village middlemen.',
    audioMr: 'सातवे वैशिष्ट्य: थेट कृषी उत्पन्न बाजारभाव. विविध बाजार समित्यांमधील भाव तपासून वाहनाचा डिझेल खर्च वजा जाता आपल्याला गावातल्या दलालापेक्षा किती हजार रुपये जास्त नफा मिळेल ते दाखवते.',
    audioHi: 'सातवाँ फीचर: लाइव मंडी भाव। विभिन्न मंडियों के भाव देखकर गाड़ी का डीजल खर्च काटकर आपको बिचौलियों से कितना अधिक शुद्ध मुनाफा मिलेगा, यह स्पष्ट बताता है।',
  },
  {
    id: 'yojna-pmfby',
    titleEn: '8. Government Yojna & 1-Click Insurance Claims',
    titleMr: '८. शासकीय योजना व विमा नुकसान भरपाई',
    titleHi: '८. सरकारी योजनाएं व बीमा मुआवजा',
    tag: 'PMFBY Panchnama',
    icon: FileText,
    route: '/yojna',
    descriptionEn: 'Eligibility matcher for PM-Kisan, Namo Shetkari, and Krishi Drone Subsidies. Automatically compiles drone multispectral crop damage evidence into a certified 1-click legal PDF Panchnama for instant PMFBY insurance claims.',
    descriptionMr: 'पीएम-किसान, नमो शेतकरी आणि कृषी ड्रोन अनुदानाच्या योजनांची माहिती. अवकाळी पाऊस किंवा रोगामुळे झालेल्या पिकांच्या नुकसानीचा ड्रोनद्वारे प्रमाणित PDF पंचनामा १-क्लिकमध्ये तयार करून विम्याचा दावा करा.',
    descriptionHi: 'पीएम-किसान, नमो शेतकरी और कृषि ड्रोन सब्सिडी योजनाओं की जानकारी। बेमौसम बारिश या रोग से हुए नुकसान का ड्रोन प्रमाणित PDF पंचनामा १-क्लिक में तैयार कर बीमा क्लेम करें।',
    demoHighlight: '📄 1-Click official legal PDF Panchnama certificate with timestamped GPS coordinates!',
    keyPoints: [
      { en: 'Scheme eligibility checker with application status tracking', mr: 'शासकीय योजनांची पात्रता तपासणी व अर्ज स्थिती ट्रॅकिंग', hi: 'सरकारी योजनाओं की पात्रता जांच और आवेदन स्टेटस ट्रैकिंग' },
      { en: 'Drone-certified crop damage area and loss percentage', mr: 'ड्रोनद्वारे अचूक मोजलेले नुकसान क्षेत्र व टक्केवारी', hi: 'ड्रोन द्वारा सटीक मापा गया नुकसान क्षेत्र व प्रतिशत' },
      { en: 'Downloadable official legal document accepted by insurance officers', mr: 'विमा कंपनी व कृषी अधिकाऱ्यांना सादर करता येणारा अधिकृत पंचनामा', hi: 'बीमा कंपनी और कृषि अधिकारियों को मान्य अधिकृत पंचनामा' },
    ],
    audioEn: 'Feature 8: Government Schemes and Crop Insurance. Match eligible state agricultural subsidies and generate a certified drone crop loss panchnama PDF in one click to claim your PMFBY insurance payout.',
    audioMr: 'आठवे वैशिष्ट्य: शासकीय योजना व पीक विमा पंचनामा. आपल्यासाठी उपलब्ध कृषी योजनांची माहिती मिळवा आणि पिकांचे नुकसान झाल्यास १-क्लिकमध्ये प्रमाणित PDF पंचनामा डाऊनलोड करून विम्याचे पैसे मिळवा.',
    audioHi: 'आठवाँ फीचर: सरकारी योजनाएं व फसल बीमा पंचनामा। अपने लिए उपलब्ध कृषि योजनाओं की जानकारी लें और फसल नुकसान होने पर १-क्लिक में प्रमाणित PDF पंचनामा डाउनलोड कर बीमा क्लेम पाएं।',
  },
];

interface InteractiveFeatureDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InteractiveFeatureDemoModal({ isOpen, onClose }: InteractiveFeatureDemoModalProps) {
  const { language, isSpeaking, setIsSpeaking } = useAppStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  const step = FEATURE_STEPS[currentStepIndex];

  // Stop speaking when modal closes
  useEffect(() => {
    if (!isOpen && isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
  }, [isOpen, isSpeaking, setIsSpeaking]);

  if (!isOpen) return null;

  const handleVoicePlay = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const audioText = isMarathi ? step.audioMr : isHindi ? step.audioHi : step.audioEn;
      speakText(audioText, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
    }
  };

  const handleNext = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    if (currentStepIndex < FEATURE_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setCurrentStepIndex(0);
    }
  };

  const handlePrev = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[var(--surface)] border-2 border-emerald-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
        
        {/* Top Header */}
        <div className="p-5 border-b border-[var(--border)] bg-gradient-to-r from-emerald-500/15 via-[var(--surface-2)] to-indigo-500/15 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40">
              <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-extrabold uppercase tracking-wider">
                  Interactive Platform Guide
                </span>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Step {currentStepIndex + 1} of {FEATURE_STEPS.length}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] mt-0.5">
                {isMarathi ? 'सर्व वैशिष्ट्यांची प्रात्यक्षिक मार्गदर्शिका' : isHindi ? 'सभी फीचर्स की लाइव डेमो गाइड' : 'Complete Platform Features Demo Tour'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Narration Button */}
            <button
              onClick={handleVoicePlay}
              className={`p-2.5 rounded-xl font-bold transition-all shadow cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-[var(--accent)] text-black hover:bg-amber-500'
              }`}
              title="Listen to feature demo in your language"
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

        {/* Feature Steps Progress Bar */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-1 bg-[var(--surface-2)]/60 border-b border-[var(--border)] overflow-x-auto">
          {FEATURE_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                  setIsSpeaking(false);
                }
                setCurrentStepIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentStepIndex 
                  ? 'w-10 bg-emerald-500' 
                  : idx < currentStepIndex 
                  ? 'w-4 bg-emerald-500/50' 
                  : 'w-4 bg-[var(--border)] hover:bg-[var(--text-muted)]'
              }`}
              title={s.titleEn}
            />
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Step Hero Card */}
          <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                <StepIcon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[var(--accent)] tracking-wider">
                  {step.tag}
                </span>
                <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)] mt-0.5">
                  {isMarathi ? step.titleMr : isHindi ? step.titleHi : step.titleEn}
                </h3>
              </div>
            </div>

            {/* Direct Link to live page */}
            <Link
              href={step.route}
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 shadow transition-all active:scale-95"
            >
              <span>{isMarathi ? 'थेट पानावर जा' : isHindi ? 'सीधे पेज पर जाएं' : 'Open Live Page'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Description Paragraph */}
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              {isMarathi ? step.descriptionMr : isHindi ? step.descriptionHi : step.descriptionEn}
            </p>

            {/* Demo Highlight Callout */}
            <div className="mt-3.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
              {step.demoHighlight}
            </div>
          </div>

          {/* 3 Key Points */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
              {isMarathi ? 'प्रमुख वैशिष्ट्ये:' : isHindi ? 'प्रमुख विशेषताएं:' : 'Core Capabilities:'}
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {step.keyPoints.map((point, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-[var(--text-primary)] font-medium">
                    {isMarathi ? point.mr : isHindi ? point.hi : point.en}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Navigation Strip */}
        <div className="p-4 sm:p-5 border-t border-[var(--border)] bg-[var(--surface-2)]/90 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentStepIndex === 0
                ? 'opacity-40 border-[var(--border)] text-[var(--text-muted)] cursor-not-allowed'
                : 'bg-[var(--surface)] hover:bg-[var(--border)] border-[var(--border)] text-[var(--text-primary)]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isMarathi ? 'मागे' : isHindi ? 'पिछला' : 'Previous'}</span>
          </button>

          <div className="text-xs font-mono text-[var(--text-muted)] hidden sm:block">
            {currentStepIndex + 1} / {FEATURE_STEPS.length}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <span>{currentStepIndex === FEATURE_STEPS.length - 1 ? (isMarathi ? 'सुरुवातीला जा' : 'Start Over') : (isMarathi ? 'पुढील वैशिष्ट्य' : isHindi ? 'अगला फीचर' : 'Next Feature')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
