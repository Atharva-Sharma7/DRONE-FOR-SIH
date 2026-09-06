import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Sprout, 
  Map, 
  Plane, 
  TrendingUp, 
  CloudRain, 
  Camera, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';

interface TutorialStep {
  id: string;
  badge: { en: string; hi: string; mr: string };
  title: { en: string; hi: string; mr: string };
  icon: any;
  color: string;
  summary: { en: string; hi: string; mr: string };
  bullets: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  audioSpeech: {
    en: string;
    hi: string;
    mr: string;
  };
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'farmer-center',
    badge: {
      en: 'Module 1: Voice & Action Center',
      hi: 'मॉड्यूल १: आवाज़ और एक्शन केंद्र',
      mr: 'मॉड्यूल १: बोलका सहाय्यक आणि मदत केंद्र'
    },
    title: {
      en: 'Farmer Voice Advisor & Emergency Spray Strip',
      hi: 'किसान वॉयस एडवाइजर व आपातकालीन छिड़काव',
      mr: 'शेतकरी बोलका सल्लागार व तात्काळ फवारणी'
    },
    icon: Sprout,
    color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
    summary: {
      en: 'Designed specifically for grassroots and illiterate farmers. One tap speaks the farm diagnosis aloud in your native language.',
      hi: 'खासकर जमीनी और निरक्षर किसान भाइयों के लिए। सिर्फ एक बटन दबाते ही खेत की पूरी स्थिति आपकी अपनी भाषा में बोलकर बताई जाएगी।',
      mr: 'विशेषतः ग्रामीण आणि निरक्षर शेतकरी बांधवांसाठी. फक्त एक बटण दाबून शेतातील सर्व माहिती तुमच्या मातृभाषेत ऐका.'
    },
    bullets: {
      en: [
        '🔊 Instant Vernacular Voice: Speaks health status, infection risk, and action in 7 Indian languages.',
        '🚀 1-Tap Drone Spray: Dispatches the autonomous drone to spray bio-fungicide on infected coordinates.',
        '🟢 Overall Crop Health Score: Instant 0-100 index computed across all Gat plots.'
      ],
      hi: [
        '🔊 तत्काल क्षेत्रीय भाषा वॉयस: ७ भारतीय भाषाओं में फसल स्वास्थ्य और जरूरी काम बोलकर सुनाता है।',
        '🚀 १-टैप ड्रोन छिड़काव: संक्रमित क्षेत्र में जैविक कवकनाशी छिड़कने के लिए तुरंत ड्रोन भेजता है।',
        '🟢 फसल स्वास्थ्य स्कोर: सभी खेतों का मिलाकर ० से १०० तक स्पष्ट स्वास्थ्य नंबर।'
      ],
      mr: [
        '🔊 थेट मराठी आवाज: ७ भारतीय भाषांमध्ये पिकाचे आरोग्य आणि काय करावे हे बोलून सांगतो.',
        '🚀 १-टॅप ड्रोन फवारणी: कीड किंवा रोगाच्या जागेवर अचूक औषध फवारणीसाठी तात्काळ ड्रोन उड्डाण.',
        '🟢 पीक आरोग्य धावसंख्या: सर्व गट नंबर मिळून १०० पैकी पिकाचे एकूण आरोग्य.'
      ]
    },
    audioSpeech: {
      en: 'Welcome to AgriDrone! In Module 1, the Farmer Action Center allows you to listen to daily farm reports with one tap and trigger instant emergency drone spraying without complicated menus.',
      hi: 'एग्रीड्रोन में आपका स्वागत है! मॉड्यूल १ में किसान एक्शन सेंटर आपको एक क्लिक में खेत की पूरी रिपोर्ट बोलकर सुनाता है और तुरंत ड्रोन छिड़काव शुरू करता है।',
      mr: 'एग्रीड्रोन प्लॅटफॉर्मवर आपले स्वागत आहे! मॉड्यूल १ मध्ये शेतकरी मदत केंद्र आपल्याला एका क्लिकवर शेताचा आवाज ऐकवतो आणि तात्काळ ड्रोन फवारणी सुरू करतो.'
    }
  },
  {
    id: 'cadastral-map',
    badge: {
      en: 'Module 2: Mahabhulekh 7/12 AgroGIS',
      hi: 'मॉड्यूल २: महाभूलेख ७/१२ भू-नक्शा',
      mr: 'मॉड्यूल २: महाभूलेख ७/१२ शेत नकाशा'
    },
    title: {
      en: '7/12 Gat Land Records & Draggable Boundary Map',
      hi: '७/१२ गट सीमा और पिन आधारित उड़ान क्षेत्र',
      mr: '७/१२ गट सीमा आणि ४-पिन उड्डाण क्षेत्र'
    },
    icon: Map,
    color: 'from-blue-500/20 to-sky-500/10 border-blue-500/40 text-blue-600 dark:text-blue-400',
    summary: {
      en: 'Combines government land registry records (Mahabhulekh Satbara 7/12) with multi-spectral satellite imagery and 4-pin boundary selectors.',
      hi: 'सरकारी महाभूलेख ७/१२ रिकॉर्ड को हाई-रेसोल्यूशन सैटेलाइट मैप और ४-पिन बाउंड्री सेलेक्टर के साथ दिखाता है।',
      mr: 'शासकीय महाभूलेख ७/१२ सातबारा नोंदींना उपग्रह नकाशा आणि ४-पिन शेत सीमा नियंत्रकासह जोडतो.'
    },
    bullets: {
      en: [
        '📌 4 Draggable Boundary Pins: Drag Pins 1 to 4 on any corner of your field to auto-calculate acreage.',
        '🌾 7/12 Gat Parcels: Click any Gat plot (142/A, 143, 144) to view legal owner, area, and crop type.',
        '🗺️ Zero-API-Key Free Basemaps: Switch seamlessly between Esri Satellite, CartoDB, and OpenTopoMap.'
      ],
      hi: [
        '📌 ४ ड्रैग करने योग्य पिन: खेत के कोनों पर पिन खींचकर एकड़ और उड़ान क्षेत्र तुरंत निकालें।',
        '🌾 ७/१२ गट पार्सल: किसी भी गट (142/A, 143) पर क्लिक करके मालिक का नाम और फसल देखें।',
        '🗺️ बिल्कुल मुफ्त मैप: इसरी सैटेलाइट, कार्टो और टोपो मैप बिना किसी एपीआई की के आसानी से बदलें।'
      ],
      mr: [
        '📌 ४ हलवता येणारे पिन: शेताच्या चारही कोपऱ्यांवर पिन ठेवून अचूक क्षेत्रफळ (एकर) काढा.',
        '🌾 ७/१२ गट पाहणी: कोणत्याही गटावर (१४२/अ, १४३) क्लिक करून मालकाचे नाव, क्षेत्र व पीक पहा.',
        '🗺️ मोफत उपग्रह नकाशे: इसरी सॅटेलाइट, कार्टो आणि ओपन टोपो नकाशांचा वापर करा.'
      ]
    },
    audioSpeech: {
      en: 'In Module 2, explore the Farmland Map. Click on your seven twelve Gat plots to view government land records, and drag the four boundary pins to set exact flight routes.',
      hi: 'मॉड्यूल २ में खेत का नक्शा देखें। अपने ७/१२ गट पर क्लिक करके जमीन का रिकॉर्ड देखें और ४ पिन खींचकर ड्रोन का रास्ता तय करें।',
      mr: 'मॉड्यूल २ मध्ये शेताचा नकाशा पहा. सातबारा गट नंबरवर क्लिक करून शासकीय नोंदी पहा आणि ४ पिन हलवून ड्रोनचा मार्ग निश्चित करा.'
    }
  },
  {
    id: 'telemetry-fleet',
    badge: {
      en: 'Module 3: Edge AI Avionics',
      hi: 'मॉड्यूल ३: एज AI और ड्रोन हार्डवेयर',
      mr: 'मॉड्यूल ३: एज AI आणि ड्रोन यंत्रणा'
    },
    title: {
      en: 'Autonomous AgriHawk-X8 Hexa-Rotor Fleet',
      hi: 'ऑटोनॉमस एग्रीहॉक-X8 हेक्सा-रोटर ड्रोन',
      mr: 'ऑटोनॉमस एग्रीहॉक-X8 हेक्झा-रोटर ड्रोन'
    },
    icon: Plane,
    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400',
    summary: {
      en: 'Real-time telemetry powered by Raspberry Pi 5 NPU running YOLOv8 plant vision models directly onboard the drone.',
      hi: 'ड्रोन में लगे रास्पबेरी पाई ५ एनपीयू द्वारा संचालित रियल-टाइम टेलीमेट्री जो हवा में ही बीमारी पहचानता है।',
      mr: 'ड्रोनवर बसवलेल्या रॅस्पबेरी पाय ५ एनपीयू द्वारे थेट हवेतच पिकांच्या रोगांचे अचूक निदान केले जाते.'
    },
    bullets: {
      en: [
        '⚡ Raspberry Pi 5 Edge NPU: Processes video at 38 FPS with 11.8ms ultra-low latency without internet.',
        '🛰️ RTK Centimeter Guidance: Sub-2cm accuracy ensures millimeter-accurate chemical droplet placement.',
        '🔋 6S Smart Battery & 8 Motors: Live RPM telemetry and battery health monitoring with return-to-home fail-safes.'
      ],
      hi: [
        '⚡ रास्पबेरी पाई ५ एज NPU: बिना इंटरनेट के ३८ फ्रेम प्रति सेकंड पर तुरंत बीमारी पहचानता है।',
        '🛰️ RTK सेंटीमीटर नेविगेशन: १.२ सेंटीमीटर की अचूक सटीकता से केवल बीमार पौधे पर दवा गिराता है।',
        '🔋 स्मार्ट बैटरी व ८ मोटर: मोटर की गति और बैटरी की रीयल-टाइम जांच एवं सुरक्षा वापसी प्रणाली।'
      ],
      mr: [
        '⚡ रॅस्पबेरी पाय ५ एज NPU: इंटरनेट नसतानाही सेकंदाला ३८ फ्रेम वेगाने रोगांची अचूक ओळख.',
        '🛰️ RTK सेंटीमीटर अचूकता: १.२ सेमी अचूकतेमुळे फक्त कीड लागलेल्या झाडावरच औषध पडते.',
        '🔋 स्मार्ट बॅटरी आणि ८ मोटर्स: मोटर्सचा वेग व बॅटरी पातळीचे सतत निरीक्षण.'
      ]
    },
    audioSpeech: {
      en: 'Module 3 showcases the AgriHawk drone telemetry. Equipped with an onboard Raspberry Pi five NPU, it detects crop diseases in real time with RTK centimeter precision.',
      hi: 'मॉड्यूल ३ में ड्रोन टेलीमेट्री देखें। रास्पबेरी पाई ५ से लैस यह ड्रोन खेत के ऊपर उड़ते हुए पौधों की बीमारी तुरंत पहचान लेता है।',
      mr: 'मॉड्यूल ३ मध्ये ड्रोनची तांत्रिक माहिती पहा. रॅस्पबेरी पाय ५ एनपीयू आणि आरटीके यंत्रणेमुळे हे ड्रोन अचूक उड्डाण करते.'
    }
  },
  {
    id: 'mandi-radar',
    badge: {
      en: 'Module 4: AGMARKNET APMC Radar',
      hi: 'मॉड्यूल ४: सरकारी मंडी भाव और मुनाफा',
      mr: 'मॉड्यूल ४: बाजार समिती भाव व नफा रडार'
    },
    title: {
      en: 'APMC Live Mandi Bhav & Freight Margin Radar',
      hi: 'लाइव मंडी भाव व माल ढुलाई मुनाफा रडार',
      mr: 'थेट कृषी उत्पन्न बाजार भाव व वाहतूक नफा रडार'
    },
    icon: TrendingUp,
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-600 dark:text-purple-400',
    summary: {
      en: 'Compares real-time crop prices across regional APMCs (Nagpur, Khamgaon, Akola, Wardha) and calculates net profit after freight costs.',
      hi: 'आसपास की मंडियों (नागपुर, खामगांव, अकोला) के ताजा भावों की तुलना करके भाड़ा घटाने के बाद आपका असली मुनाफा बताता है।',
      mr: 'नागपूर, खामगाव, अकोला, वर्धा बाजार समित्यांमधील दरांची तुलना करून वाहतूक खर्च वजा जाता शेतकऱ्याचा खरा नफा दाखवतो.'
    },
    bullets: {
      en: [
        '📈 Live AGMARKNET Rates: Daily minimum, maximum, and modal price for Cotton, Soybean, and Tur.',
        '🚛 Freight Profit Optimization: Subtracts diesel/tractor transport costs to highlight the most profitable APMC.',
        '💡 Best APMC Recommendation: Tells you where to sell today to earn ₹1,800 to ₹3,500 more per quintal.'
      ],
      hi: [
        '📈 ताजा मंडी भाव: कपास, सोयाबीन और तुअर के रोजाना के न्यूनतम व उच्चतम भाव।',
        '🚛 भाड़ा खर्च विश्लेषण: डीजल और वाहन का खर्च घटाकर बताता है कि किस मंडी में ले जाना फायदेमंद रहेगा।',
        '💡 सर्वोत्तम मंडी सुझाव: आज माल कहाँ बेचें ताकि आपको प्रति क्विंटल ज्यादा मुनाफा मिले।'
      ],
      mr: [
        '📈 थेट कृषी पणन दर: कापूस, सोयाबीन आणि तुरीचे दररोजचे हमीभाव व कमाल दर.',
        '🚛 वाहतूक खर्च वजावट: डिझेल आणि ट्रॅक्टर भाडे वजा करून निव्वळ नफा दाखवतो.',
        '💡 सर्वात फायदेशीर बाजार: आपला शेतमाल कुठे विकल्यास सर्वाधिक पैसे मिळतील याचा अचूक सल्ला.'
      ]
    },
    audioSpeech: {
      en: 'Module 4 gives you the APMC Mandi Bhav radar. Compare real-time prices across Nagpur, Khamgaon, and Akola markets and calculate your true net profit after diesel freight costs.',
      hi: 'मॉड्यूल ४ में लाइव मंडी भाव देखें। नागपुर, खामगांव और अकोला की मंडियों के भाव की तुलना करें और भाड़ा घटाकर सबसे ज्यादा मुनाफा पाएं।',
      mr: 'मॉड्यूल ४ मध्ये बाजार समिती भाव रडार पहा. विविध बाजारपेठांमधील भावाची तुलना करून जास्तीत जास्त नफा मिळवा.'
    }
  },
  {
    id: 'spray-window',
    badge: {
      en: 'Module 5: Micro-Climate Spray Radar',
      hi: 'मॉड्यूल ५: मौसम व छिड़काव अनुकूल समय',
      mr: 'मॉड्यूल ५: हवामान व फवारणीची योग्य वेळ'
    },
    title: {
      en: '48-Hour Micro-Climate Precision Spray Window',
      hi: '४८ घंटे का मौसम व सटीक छिड़काव समय',
      mr: '४८ तासांचा हवामान अंदाज व फवारणी वेळ'
    },
    icon: CloudRain,
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-600 dark:text-cyan-400',
    summary: {
      en: 'Free Open-Meteo micro-climate forecasting that computes safe flight windows preventing chemical drift and rain wash-off.',
      hi: 'फ्री ओपन-मेटियो मौसम पूर्वानुमान जो तेज हवा और बारिश से दवा बहने से बचाता है और सही समय बताता है।',
      mr: 'ओपन-मेटिओ हवामान अंदाज जो वारा आणि पावसामुळे औषध वाहून जाण्यापासून वाचवतो आणि अचूक वेळ सांगतो.'
    },
    bullets: {
      en: [
        '🟢 Green Optimal Windows: Wind < 12 km/h, zero rain probability, 24°C-28°C ideal transpiration.',
        '🔴 Red No-Spray Warning: Alerts against spraying when rain is forecasted within 6 hours to save money.',
        '💨 Chemical Drift Protection: Ensures chemicals land only on your target crop without polluting water bodies.'
      ],
      hi: [
        '🟢 हरा अनुकूल समय: हवा १२ किमी/घंटे से कम, बारिश की शून्य संभावना — दवा का १००% असर।',
        '🔴 लाल चेतावनी: अगले ६ घंटे में बारिश होने पर दवा छिड़कने से रोकता है ताकि आपका पैसा बर्बाद न हो।',
        '💨 हवा से दवा बहने से बचाव: सटीक समय पर छिड़काव से पर्यावरण और आसपास के खेतों की सुरक्षा।'
      ],
      mr: [
        '🟢 हिरवी सुरक्षित वेळ: वारा १२ किमी/तास पेक्षा कमी, पावसाची शून्य शक्यता — औषधाचा १००% फायदा.',
        '🔴 लाल सावधान इशारा: पुढील ६ तासांत पाऊस येणार असल्यास औषध फवारणी थांबवण्याचा सल्ला.',
        '💨 औषध वाया जाण्यापासून बचाव: योग्य हवेत फवारणी केल्याने औषध उडून न जाता पिकावरच बसते.'
      ]
    },
    audioSpeech: {
      en: 'Module 5 predicts the best spraying windows for the next 48 hours. Never waste expensive chemicals in sudden rain or high wind.',
      hi: 'मॉड्यूल ५ आपको अगले ४८ घंटों में छिड़काव का सबसे सटीक समय बताता है ताकि बारिश या तेज हवा में दवा बर्बाद न हो।',
      mr: 'मॉड्यूल ५ आपल्याला पुढील ४८ तासांत औषध फवारणीसाठी सर्वात योग्य वेळ सांगतो, ज्यामुळे औषध वाया जात नाही.'
    }
  },
  {
    id: 'crop-doctor',
    badge: {
      en: 'Module 6: AI Leaf Clinic & Drone Vision',
      hi: 'मॉड्यूल ६: AI पत्ती डॉक्टर व ४-कैमरा विजन',
      mr: 'मॉड्यूल ६: AI पीक डॉक्टर व ४-कॅमेरा व्हिजन'
    },
    title: {
      en: 'Multimodal 4-Cam Vision & AI Leaf Clinic',
      hi: '४-कैमरा लाइव विजन व AI पत्ती जांच क्लिनिक',
      mr: '४-कॅमेरा थेट व्हिजन व AI पीक डॉक्टर क्लिनिक'
    },
    icon: Camera,
    color: 'from-rose-500/20 to-pink-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400',
    summary: {
      en: 'Upload individual leaf photos from your phone OR select drone aerial captures. Get instant disease diagnoses with kitchen-measure dosages.',
      hi: 'अपने फोन से पत्ती का फोटो अपलोड करें या ड्रोन द्वारा ली गई तस्वीरें चुनें। घरेलू नाप (ढक्कन, चम्मच) में सटीक दवा पाएं।',
      mr: 'मोबाईलने पानाचा फोटो अपलोड करा किंवा ड्रोनने काढलेले फोटो निवडा. घरगुती मापात (झाकण, चमचा) अचूक औषधाची मात्रा मिळवा.'
    },
    bullets: {
      en: [
        '📷 Dual Photo Source: Upload your own plant leaf photo or inspect high-altitude drone captures.',
        '🥄 Kitchen-Measure Dosages: Dosages explained in easy bottle caps and spoons per 15L knapsack pump.',
        '🎥 4-Cam Live Feeds: 4K RGB, RedEdge Multispectral NDVI, Radiometric Thermal IR, and Hyperspectral.'
      ],
      hi: [
        '📷 दोहरी फोटो सुविधा: अपनी खुद की पत्ती का फोटो लगाएं या ड्रोन द्वारा लिए गए एरियल फोटो चुनें।',
        '🥄 घरेलू नाप में दवा: १५ लीटर की टंकी में कितने ढक्कन या चम्मच दवा डालनी है, आसान भाषा में जानें।',
        '🎥 ४-कैमरा लाइव विजन: 4K RGB, रेड-एज मल्टीस्पेक्ट्रल NDVI, थर्मल इंफ्रारेड और हाइपरस्पेक्ट्रल।'
      ],
      mr: [
        '📷 दुहेरी फोटो पर्याय: तुमच्या स्वतःच्या झाडाचा फोटो अपलोड करा किंवा ड्रोनने टिपलेले फोटो निवडा.',
        '🥄 घरगुती मापात औषध: १५ लिटर पंपासाठी किती झाकणे किंवा चमचे औषध टाकावे याची सोपी माहिती.',
        '🎥 ४-कॅमेरा थेट प्रक्षेपण: 4K RGB, रेड-एज एनडीव्हीआय, थर्मल इन्फ्रारेड आणि हायपरस्पेक्ट्रल.'
      ]
    },
    audioSpeech: {
      en: 'Module 6 brings you the AI Leaf Clinic and 4-Cam Live Drone Vision. Upload any crop leaf or choose drone photos to get instant kitchen-measure remedies and launch a targeted spray.',
      hi: 'मॉड्यूल ६ में पत्ती क्लिनिक और ४-कैमरा विजन देखें। पत्ती का फोटो अपलोड करें और घरेलू नाप में तुरंत सटीक उपाय पाएं।',
      mr: 'मॉड्यूल ६ मध्ये AI पीक डॉक्टर आणि ४-कॅमेरा व्हिजन पहा. पानाचा फोटो अपलोड करून घरगुती मापात अचूक औषधाचा उपाय मिळवा.'
    }
  }
];

interface DashboardTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardTutorialModal({ isOpen, onClose }: DashboardTutorialModalProps) {
  const { language, isSpeaking, setIsSpeaking } = useAppStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TUTORIAL_STEPS[currentStepIndex];
  const langKey = (language === 'hi' ? 'hi' : language === 'mr' ? 'mr' : 'en') as 'en' | 'hi' | 'mr';

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const speech = currentStep.audioSpeech[langKey] || currentStep.audioSpeech.en;
      speakText(speech, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
    }
  };

  const handleNext = () => {
    stopSpeaking();
    setIsSpeaking(false);
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    stopSpeaking();
    setIsSpeaking(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--accent)] text-black font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {language === 'mr' ? 'अॅग्रीड्रोन प्लॅटफॉर्म मार्गदर्शिका' : language === 'hi' ? 'एग्रीड्रोन प्लेटफॉर्म मार्गदर्शिका' : 'AgriDrone Dashboard Guide'}
              </h3>
              <p className="text-[11px] font-mono text-[var(--text-muted)]">
                {language === 'mr' 
                  ? `टप्पा ${currentStepIndex + 1} पैकी ${TUTORIAL_STEPS.length}` 
                  : language === 'hi' 
                  ? `कदम ${currentStepIndex + 1} / ${TUTORIAL_STEPS.length}` 
                  : `Step ${currentStepIndex + 1} of ${TUTORIAL_STEPS.length}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Vernacular Audio Read-Aloud */}
            <button
              onClick={handleReadAloud}
              className={`p-2 rounded-xl border transition-all ${
                isSpeaking
                  ? 'bg-red-500 text-white border-red-600 animate-pulse'
                  : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]'
              }`}
              title="Listen in your language"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopSpeaking();
                setIsSpeaking(false);
                onClose();
              }}
              className="p-2 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[var(--surface-2)]">
          <div 
            className="h-full bg-[var(--accent)] transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / TUTORIAL_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Step Hero Banner */}
          <div className={`p-4 rounded-2xl border bg-gradient-to-br ${currentStep.color} flex items-start gap-4`}>
            <div className="p-3 rounded-xl bg-white/20 dark:bg-black/20 shrink-0">
              <StepIcon className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-black/20 text-inherit inline-block mb-1">
                {currentStep.badge[langKey]}
              </span>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                {currentStep.title[langKey]}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed font-medium">
                {currentStep.summary[langKey]}
              </p>
            </div>
          </div>

          {/* Key Feature Bullets */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase text-[var(--text-muted)] tracking-wider">
              {language === 'mr' ? 'महत्त्वाची वैशिष्ट्ये' : language === 'hi' ? 'प्रमुख विशेषताएं' : 'Key Highlights & Instructions'}
            </h4>
            <div className="space-y-2">
              {currentStep.bullets[langKey].map((bullet, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text-primary)] leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Dots Pagination */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {TUTORIAL_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  stopSpeaking();
                  setIsSpeaking(false);
                  setCurrentStepIndex(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex 
                    ? 'w-7 bg-[var(--accent)]' 
                    : 'w-2 bg-[var(--border)] hover:bg-[var(--text-muted)]'
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] bg-[var(--surface-2)]/60">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{language === 'mr' ? 'मागे' : language === 'hi' ? 'पिछला' : 'Previous'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopSpeaking();
                setIsSpeaking(false);
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              {language === 'mr' ? 'वगळा' : language === 'hi' ? 'छोड़ें' : 'Skip Tour'}
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-amber-500 text-black text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <span>
                {currentStepIndex === TUTORIAL_STEPS.length - 1
                  ? (language === 'mr' ? 'सुरू करा' : language === 'hi' ? 'शुरू करें' : 'Get Started')
                  : (language === 'mr' ? 'पुढील' : language === 'hi' ? 'अगला' : 'Next')}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
