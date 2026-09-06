'use client';
import React, { useState } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Sparkles, 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Video, 
  FlaskConical, 
  Microscope, 
  ShieldAlert, 
  Store, 
  BarChart3, 
  Layers3, 
  Award, 
  Navigation, 
  Settings,
  Search,
  Compass
} from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';

export interface SidebarDirectoryItem {
  id: string;
  href: string;
  icon: any;
  priority: number;
  category: 'core' | 'ai' | 'analytics' | 'system';
  categoryLabel: { en: string; mr: string; hi: string };
  title: { en: string; mr: string; hi: string };
  badge?: string;
  desc: { en: string; mr: string; hi: string };
}

export const SIDEBAR_PRIORITY_ITEMS: SidebarDirectoryItem[] = [
  // ── 1. Daily Core Operations (Priority 1-4) ──
  {
    id: 'dashboard',
    href: '/',
    icon: LayoutDashboard,
    priority: 1,
    category: 'core',
    categoryLabel: { en: '1. Daily Core Operations', mr: '१. दैनंदिन शेती व्यवस्थापन', hi: '१. दैनिक कृषि कार्य' },
    title: { en: 'Dashboard (Main Command)', mr: 'मुख्य डॅशबोर्ड (कमांड सेंटर)', hi: 'मुख्य डैशबोर्ड (कमांड सेंटर)' },
    desc: { en: 'Overall health score, critical alerts, and 1-tap emergency spray', mr: 'शेत आरोग्य, तात्काळ अलर्ट व १-टॅप फवारणी', hi: 'खेत स्वास्थ्य, अलर्ट और तुरंत छिड़काव' },
  },
  {
    id: 'map',
    href: '/map',
    icon: Map,
    priority: 2,
    category: 'core',
    categoryLabel: { en: '1. Daily Core Operations', mr: '१. दैनंदिन शेती व्यवस्थापन', hi: '१. दैनिक कृषि कार्य' },
    title: { en: 'Farm Map & 7/12 Gat Parcels', mr: 'शेत नकाशा व ७/१२ गट भूखंड', hi: 'खेत नक्शा व ७/१२ गट' },
    desc: { en: 'ISRO Bhuvan satellite, 7/12 Gat boundary pins & custom markers', mr: 'इस्रो भुवन नकाशा, ७/१२ गट भूखंड व शेत मार्कर', hi: 'इसरो भुवन नक्शा, ७/१२ गट और मार्कर' },
  },
  {
    id: 'progress',
    href: '/progress',
    icon: TrendingUp,
    priority: 3,
    category: 'core',
    categoryLabel: { en: '1. Daily Core Operations', mr: '१. दैनंदिन शेती व्यवस्थापन', hi: '१. दैनिक कृषि कार्य' },
    title: { en: 'Crop Progress & Charts', mr: 'पीक वाढ व प्रगती आलेख', hi: 'फसल प्रगति व चार्ट' },
    badge: 'NEW',
    desc: { en: '60-day NDVI progression, canopy growth & yield charts for all crops', mr: 'सर्व पिकांचा ६०-दिवसीय एनडीव्हीआय व उत्पादन आलेख', hi: 'सभी फसलों के ६०-दिवसीय एनडीवीआई व उपज चार्ट' },
  },
  {
    id: 'live-feed',
    href: '/live-feed',
    icon: Video,
    priority: 4,
    category: 'core',
    categoryLabel: { en: '1. Daily Core Operations', mr: '१. दैनंदिन शेती व्यवस्थापन', hi: '१. दैनिक कृषि कार्य' },
    title: { en: 'Live Drone Vision Lab', mr: 'थेट ड्रोन कॅमेरा व व्हिडिओ', hi: 'लाइव ड्रोन कैमरा व वीडियो' },
    desc: { en: '4-camera synchronous RGB, multispectral & drone video loops', mr: '४-कॅमेरा एकाच पिकावर थेट व्हिडिओ व स्पेक्ट्रल दृश्य', hi: '४-कैमरा एक साथ लाइव वीडियो व स्पेक्ट्रल' },
  },

  // ── 2. AI Diagnostics & Farmer Protection (Priority 5-8) ──
  {
    id: 'crop-doctor',
    href: '/crop-doctor',
    icon: FlaskConical,
    priority: 5,
    category: 'ai',
    categoryLabel: { en: '2. AI Clinics & Farmer Protection', mr: '२. AI निदान व शेतकरी सुरक्षा', hi: '२. AI निदान व किसान सुरक्षा' },
    title: { en: 'Crop Doctor (Leaf Clinic)', mr: 'पीक डॉक्टर व पान तपासणी', hi: 'क्रॉप डॉक्टर (पौधा जांच)' },
    desc: { en: 'Upload plant or drone photos for 6-AI model diagnosis & prescriptions', mr: 'पानाचा फोटो टाकून ६ AI मॉडेल्सद्वारे रोग निदान', hi: 'पत्ती का फोटो डालकर ६ AI मॉडल से रोग पहचान' },
  },
  {
    id: 'diseases',
    href: '/diseases',
    icon: Microscope,
    priority: 6,
    category: 'ai',
    categoryLabel: { en: '2. AI Clinics & Farmer Protection', mr: '२. AI निदान व शेतकरी सुरक्षा', hi: '२. AI निदान व किसान सुरक्षा' },
    title: { en: 'Disease Detections & Prescriptions', mr: 'रोग शोध व फवारणी औषध', hi: 'रोग पहचान व दवा' },
    desc: { en: 'Active hotspot list with severity and bio-spray prescriptions', mr: 'रोग प्रादुर्भाव यादी, तीव्रता व फवारणी उपाय', hi: 'रोग प्रभावित क्षेत्र, गंभीरता व छिड़काव उपाय' },
  },
  {
    id: 'kisan-rakshak',
    href: '/kisan-rakshak',
    icon: ShieldAlert,
    priority: 7,
    category: 'ai',
    categoryLabel: { en: '2. AI Clinics & Farmer Protection', mr: '२. AI निदान व शेतकरी सुरक्षा', hi: '२. AI निदान व किसान सुरक्षा' },
    title: { en: 'Kisan Rakshak (Safety Shield)', mr: 'किसान रक्षक (सुरक्षा केंद्र)', hi: 'किसान रक्षक (सुरक्षा)' },
    badge: 'SHIELD',
    desc: { en: 'Wild animal night deterrent, chemical poisoning shield & bogus seed auditor', mr: 'रानटी जनावरे प्रतिबंध, विषबाधा सुरक्षा व बोगस बियाणे पंचनामा', hi: 'जंगली जानवर सुरक्षा, कीटनाशक विष बचाव व बीज जांच' },
  },
  {
    id: 'mandi',
    href: '/mandi',
    icon: Store,
    priority: 8,
    category: 'ai',
    categoryLabel: { en: '2. AI Clinics & Farmer Protection', mr: '२. AI निदान व शेतकरी सुरक्षा', hi: '२. AI निदान व किसान सुरक्षा' },
    title: { en: 'Mandi Bhav Radar', mr: 'बाजार भाव (मंडी भाव)', hi: 'मंडी भाव रडार' },
    desc: { en: 'Live APMC rates, MSP comparison & village trader profit radar', mr: 'थेट कृषी उत्पन्न बाजार समिती भाव व हमीभाव तुलना', hi: 'लाइव एपीएमसी मंडी भाव व एमएसपी तुलना' },
  },

  // ── 3. Geospatial Analytics, Schemes & Flights (Priority 9-13) ──
  {
    id: 'analytics',
    href: '/analytics',
    icon: BarChart3,
    priority: 9,
    category: 'analytics',
    categoryLabel: { en: '3. Geospatial & Governance', mr: '३. अॅनालिटिक्स व योजना', hi: '३. विश्लेषण व योजनाएं' },
    title: { en: 'Plant Health Analytics', mr: 'वनस्पती आरोग्य विश्लेषण', hi: 'पौधा स्वास्थ्य विश्लेषण' },
    desc: { en: 'Multispectral NDRE, chlorophyll canopy absorption & field zoning', mr: 'मल्टिस्पेक्ट्रल क्लोरोफिल, एनडीआरई व शेत विभागणी', hi: 'मल्टीस्पेक्ट्रल क्लोरोफिल व खेत ज़ोनिंग' },
  },
  {
    id: 'lidar',
    href: '/lidar',
    icon: Layers3,
    priority: 10,
    category: 'analytics',
    categoryLabel: { en: '3. Geospatial & Governance', mr: '३. अॅनालिटिक्स व योजना', hi: '३. विश्लेषण व योजनाएं' },
    title: { en: '3D LiDAR Terrain', mr: '३D लिडार भूरचना', hi: '३D लिडार स्थलाकृति' },
    desc: { en: 'Point clouds, slope analysis, water pooling & drainage risk', mr: 'उताराचे मोजमाप, पाणी साचण्याचा धोका व ३D पॉईंट क्लाऊड', hi: 'ढलान विश्लेषण, जलभराव जोखिम व ३D पॉइंट' },
  },
  {
    id: 'yojna',
    href: '/yojna',
    icon: Award,
    priority: 11,
    category: 'analytics',
    categoryLabel: { en: '3. Geospatial & Governance', mr: '३. अॅनालिटिक्स व योजना', hi: '३. विश्लेषण व योजनाएं' },
    title: { en: 'Yojna & Claims (Insurance)', mr: 'सरकारी योजना व पिक विमा', hi: 'सरकारी योजना व बीमा' },
    desc: { en: 'PMFBY crop insurance claims, Krishi subsidies & 1-tap panchnama', mr: 'पंतप्रधान पीक विमा दावा, ड्रोन पंचनामा व सबसिडी', hi: 'पीएम फसल बीमा दावा, ड्रोन पंचनामा व सब्सिडी' },
  },
  {
    id: 'missions',
    href: '/missions',
    icon: Navigation,
    priority: 12,
    category: 'analytics',
    categoryLabel: { en: '3. Geospatial & Governance', mr: '३. अॅनालिटिक्स व योजना', hi: '३. विश्लेषण व योजनाएं' },
    title: { en: 'Drone Missions', mr: 'ड्रोन उड्डाण मोहिमा', hi: 'ड्रोन उड़ान मिशन' },
    desc: { en: 'Flight schedules, chunked data syncing & flight logs', mr: 'उड्डाण वेळापत्रक, डेटा सिंक व उड्डाण इतिहास', hi: 'उड़ान कार्यक्रम, डेटा सिंकिंग व लॉग' },
  },
  {
    id: 'settings',
    href: '/settings',
    icon: Settings,
    priority: 13,
    category: 'system',
    categoryLabel: { en: '4. System Configuration', mr: '४. प्रणाली सेटिंग्ज', hi: '४. सिस्टम सेटिंग्स' },
    title: { en: 'Settings & Language', mr: 'सेटिंग्ज व भाषा निवड', hi: 'सेटिंग्स व भाषा' },
    desc: { en: 'Preferences, RTK GPS calibration & languages', mr: 'अॅप प्राधान्ये, आरटीके कॅलिब्रेशन व भाषा बदल', hi: 'भाषा, आरटीके जीपीएस सेटिंग्स' },
  },
];

interface SidebarDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarDirectoryModal({ isOpen, onClose }: SidebarDirectoryModalProps) {
  const { language, isSpeaking, setIsSpeaking } = useAppStore();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  const handleSpeakAll = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    let speechText = '';
    if (isMarathi) {
      speechText = "साइडबारमधील सर्व १३ पर्यायांची प्राधान्यक्रमाने नावे पुढीलप्रमाणे आहेत: " +
        "एक: मुख्य डॅशबोर्ड. दोन: शेत नकाशा व सातबारा. तीन: पीक वाढ व प्रगती आलेख. चार: थेट ड्रोन कॅमेरा. " +
        "पाच: पीक डॉक्टर व पान तपासणी. सहा: रोग शोध व फवारणी. सात: किसान रक्षक सुरक्षा. आठ: बाजार भाव मंडी. " +
        "नऊ: वनस्पती आरोग्य विश्लेषण. दहा: ३D लिडार भूरचना. अकरा: सरकारी योजना व विमा. बारा: ड्रोन उड्डाण मोहिमा. आणि तेरा: सेटिंग्ज.";
    } else if (isHindi) {
      speechText = "साइडबार के सभी १३ विकल्पों के नाम प्राथमिकता के अनुसार: " +
        "एक: मुख्य डैशबोर्ड. दो: खेत नक्शा व सातबारा. तीन: फसल प्रगति व चार्ट. चार: लाइव ड्रोन कैमरा. " +
        "पांच: क्रॉप डॉक्टर व पौधा जांच. छह: रोग पहचान व दवा. सात: किसान रक्षक. आठ: मंडी भाव रडार. " +
        "नौ: पौधा स्वास्थ्य विश्लेषण. दस: ३D लिडार. ग्यारह: सरकारी योजना व बीमा. बारह: ड्रोन मिशन. और तेरह: सेटिंग्स.";
    } else {
      speechText = "Sidebar options in prioritized order: " +
        "One: Dashboard. Two: Farm Map and 7/12. Three: Crop Progress and Charts. Four: Live Drone Vision. " +
        "Five: Crop Doctor. Six: Disease Detections. Seven: Kisan Rakshak. Eight: Mandi Bhav. " +
        "Nine: Plant Health Analytics. Ten: 3D LiDAR Terrain. Eleven: Yojna and Claims. Twelve: Drone Missions. Thirteen: Settings.";
    }

    setIsSpeaking(true);
    speakText(speechText, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
  };

  const filteredItems = SIDEBAR_PRIORITY_ITEMS.filter((item) => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchEn = item.title.en.toLowerCase().includes(q) || item.desc.en.toLowerCase().includes(q);
      const matchMr = item.title.mr.toLowerCase().includes(q) || item.desc.mr.toLowerCase().includes(q);
      const matchHi = item.title.hi.toLowerCase().includes(q) || item.desc.hi.toLowerCase().includes(q);
      return matchEn || matchMr || matchHi;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 border-b border-[var(--border)] bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-[var(--surface-2)]">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500 text-black shadow-lg shadow-amber-500/20">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-[var(--accent)] text-black uppercase">
                  {isMarathi ? 'प्राधान्यक्रमानुसार सर्व पर्याय' : isHindi ? 'प्राथमिकता अनुसार सभी विकल्प' : 'Prioritized Menu Directory'}
                </span>
                <span className="text-xs font-mono text-[var(--accent)] font-bold">13 Total Tools</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-1">
                {isMarathi ? '📋 साइडबारमधील सर्व पर्यायांची नावे व माहिती' : isHindi ? '📋 साइडबार के सभी विकल्पों के नाम व विवरण' : '📋 Complete Sidebar Navigation Directory'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Audio narration button */}
            <button
              onClick={handleSpeakAll}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md active:scale-95 ${
                isSpeaking
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-bounce" />}
              <span>{isSpeaking ? (isMarathi ? 'थांबवा' : 'Stop') : (isMarathi ? '🔊 सर्व नावे ऐका' : isHindi ? '🔊 सभी नाम सुनें' : '🔊 Listen All Names')}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-2)]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
            {[
              { key: 'all', label: isMarathi ? 'सर्व (All 13)' : 'All (13)' },
              { key: 'core', label: isMarathi ? '१. दैनंदिन शेती (Core)' : '1. Daily Core (4)' },
              { key: 'ai', label: isMarathi ? '२. AI व सुरक्षा (Protection)' : '2. AI & Safety (4)' },
              { key: 'analytics', label: isMarathi ? '३. अॅनालिटिक्स व योजना' : '3. Geospatial & Schemes (4)' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterCategory(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  filterCategory === tab.key
                    ? 'bg-[var(--accent)] text-black shadow-md'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isMarathi ? 'पर्याय शोधा...' : isHindi ? 'विकल्प खोजें...' : 'Search options...'}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {/* List of Prioritized Items */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 custom-scrollbar flex-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const currentTitle = isMarathi ? item.title.mr : isHindi ? item.title.hi : item.title.en;
            const currentDesc = isMarathi ? item.desc.mr : isHindi ? item.desc.hi : item.desc.en;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  {/* Priority Number Badge */}
                  <div className="w-8 h-8 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center font-mono font-black text-xs text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-black transition-colors shrink-0">
                    #{item.priority}
                  </div>

                  {/* Icon */}
                  <div className="p-2.5 rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] group-hover:text-[var(--accent)] transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Text Details */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {currentTitle}
                      </h4>
                      {item.badge && (
                        <span className="px-2 py-0.2 text-[9px] font-mono font-extrabold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {item.href}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {currentDesc}
                    </p>
                  </div>
                </div>

                {/* Jump Button */}
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--accent)] self-end sm:self-auto shrink-0 group-hover:translate-x-1 transition-transform">
                  <span>{isMarathi ? 'उघडा' : isHindi ? 'खोलें' : 'Open'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-2)]/80 flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
          <span>{isMarathi ? 'टीप: साइडबारमधील बाणावर क्लिक करून नावे कायमस्वरूपी मोठी ठेवू शकता.' : 'Tip: Click the sidebar toggle arrow to keep names visible permanently.'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] font-bold hover:bg-[var(--border)] transition-colors"
          >
            {isMarathi ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
