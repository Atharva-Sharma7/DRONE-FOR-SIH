'use client';
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sprout, 
  Droplets, 
  ShieldCheck, 
  BarChart3, 
  Activity, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Compass, 
  Layers,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { useAppStore } from '@/store/useAppStore';
import { speakText } from '@/lib/speech';

// ── 60-Day NDVI Progression Time-Series Data for All Sown Crops ──
const NDVI_PROGRESS_DATA = [
  { day: 'Day 05', cotton: 0.18, soybean: 0.22, tur: 0.16, chana: 0.19, onion: 0.20, benchmark: 0.40 },
  { day: 'Day 15', cotton: 0.32, soybean: 0.41, tur: 0.28, chana: 0.34, onion: 0.35, benchmark: 0.50 },
  { day: 'Day 25', cotton: 0.48, soybean: 0.62, tur: 0.44, chana: 0.51, onion: 0.54, benchmark: 0.60 },
  { day: 'Day 35', cotton: 0.65, soybean: 0.74, tur: 0.58, chana: 0.67, onion: 0.68, benchmark: 0.65 },
  { day: 'Day 45', cotton: 0.76, soybean: 0.81, tur: 0.71, chana: 0.75, onion: 0.76, benchmark: 0.70 },
  { day: 'Day 55', cotton: 0.83, soybean: 0.79, tur: 0.79, chana: 0.80, onion: 0.81, benchmark: 0.70 },
  { day: 'Day 60 (Now)', cotton: 0.86, soybean: 0.76, tur: 0.82, chana: 0.84, onion: 0.83, benchmark: 0.70 },
];

// ── Canopy Ground Cover Expansion (% Closure) ──
const CANOPY_EXPANSION_DATA = [
  { stage: 'Emergence (उगवण)', cotton: 14, soybean: 18, tur: 12, chana: 15, onion: 16 },
  { stage: 'Early Veg (वाढ)', cotton: 36, soybean: 48, tur: 32, chana: 38, onion: 40 },
  { stage: 'Peak Veg (फांद्या)', cotton: 68, soybean: 82, tur: 60, chana: 70, onion: 66 },
  { stage: 'Flowering (फुलोरा)', cotton: 88, soybean: 94, tur: 82, chana: 89, onion: 84 },
  { stage: 'Current (सद्यस्थिती)', cotton: 92, soybean: 89, tur: 86, chana: 91, onion: 88 },
];

// ── Thermal Transpiration & Water Stress Index (CWSI: 0 = No Stress, 1 = Severe Wilt) ──
const WATER_STRESS_DATA = [
  { parcel: 'Gat 142/A (Cotton)', stressIndex: 0.22, optimalRange: 0.35, status: 'Good Hydration' },
  { parcel: 'Gat 143 (Soybean)', stressIndex: 0.48, optimalRange: 0.35, status: 'Mild Stress' },
  { parcel: 'Gat 144 (Tur Dal)', stressIndex: 0.26, optimalRange: 0.35, status: 'Adequate' },
  { parcel: 'Gat 145/B (Chana)', stressIndex: 0.19, optimalRange: 0.35, status: 'Optimal' },
  { parcel: 'Gat 146 (Onion)', stressIndex: 0.28, optimalRange: 0.35, status: 'Moist Soil' },
];

// ── Before vs. After Drone Precision Spray Recovery (Infection Gunthas Affected) ──
const SPRAY_RECOVERY_DATA = [
  { crop: 'Bt Cotton (कपाशी)', beforeSpray: 28, afterSpray: 3, recoveryPct: 89.2 },
  { crop: 'Soybean (सोयाबीन)', beforeSpray: 34, afterSpray: 4, recoveryPct: 88.2 },
  { crop: 'Tur Dal (तूर)', beforeSpray: 16, afterSpray: 1, recoveryPct: 93.8 },
  { crop: 'Chana (हरभरा)', beforeSpray: 12, afterSpray: 1, recoveryPct: 91.7 },
  { crop: 'Onion (कांदा)', beforeSpray: 22, afterSpray: 2, recoveryPct: 90.9 },
];

// ── Projected Harvest Yield vs. Taluka Baseline (Quintals / Acre) ──
const YIELD_FORECAST_DATA = [
  { crop: 'Bt Cotton', projectedYield: 14.5, talukaAverage: 9.8, unit: 'Qtl/Acre' },
  { crop: 'Soybean', projectedYield: 12.8, talukaAverage: 8.5, unit: 'Qtl/Acre' },
  { crop: 'Tur Dal', projectedYield: 8.2, talukaAverage: 5.4, unit: 'Qtl/Acre' },
  { crop: 'Gram / Chana', projectedYield: 10.4, talukaAverage: 7.1, unit: 'Qtl/Acre' },
  { crop: 'Kanda / Onion', projectedYield: 140.0, talukaAverage: 95.0, unit: 'Qtl/Acre' },
];

// ── Phenological Growth Stage Milestones ──
const CROP_MILESTONES = [
  {
    key: 'cotton',
    name: 'Bt Cotton (कपाशी)',
    gat: 'Gat 142/A',
    das: 80,
    totalDays: 160,
    stage: 'Boll Formation & Maturation (बोंड विकास)',
    stageMr: 'बोंड भरणे व वाढीचा टप्पा',
    healthScore: 89,
    statusText: 'Excellent boll count, 32-38 bolls/plant observed by drone RGB',
    statusTextMr: 'झाडावर सरासरी ३२-३८ बोंडे भरली आहेत. कीड नियंत्रणात आहे.',
    color: '#10B981',
  },
  {
    key: 'soybean',
    name: 'Soybean JS-335 (सोयाबीन)',
    gat: 'Gat 143',
    das: 72,
    totalDays: 95,
    stage: 'Pod Filling & Seed Swelling (शेंगा दाणे भरणे)',
    stageMr: 'शेंगांमध्ये दाणे भरण्याची अवस्था',
    healthScore: 82,
    statusText: 'Pods 85% filled. Light root drainage stress flagged in lower slope',
    statusTextMr: 'शेंगा ८५% भरल्या आहेत. उतारावरील भागात हलका पाण्याचा ताण आढळला आहे.',
    color: '#F59E0B',
  },
  {
    key: 'tur',
    name: 'Tur Dal BDN-711 (तूर)',
    gat: 'Gat 144',
    das: 78,
    totalDays: 175,
    stage: 'Vegetative Branching & Bud Emergence (शाकीय वाढ)',
    stageMr: 'शाकीय वाढ व कळ्या लागण्याची सुरुवात',
    healthScore: 92,
    statusText: 'Vigorous canopy architecture with optimal nitrogen absorption',
    statusTextMr: 'उत्कृष्ट वाढ, नत्र शोषण क्षमता उत्तम आहे.',
    color: '#3B82F6',
  },
  {
    key: 'chana',
    name: 'Gram / Chana Digvijay (हरभरा)',
    gat: 'Gat 145/B',
    das: 25,
    totalDays: 105,
    stage: 'Active Tillering & Branching (फुलोरा पूर्व)',
    stageMr: 'फांद्या फुटणे व जोमदार वाढ',
    healthScore: 94,
    statusText: 'Dense root nodulation with uniform soil germination',
    statusTextMr: 'एकसमान उगवण झाली असून मुळांवरील गाठी उत्तम विकसित झाल्या आहेत.',
    color: '#8B5CF6',
  },
  {
    key: 'onion',
    name: 'Fursungi Onion (कांदा)',
    gat: 'Gat 146',
    das: 55,
    totalDays: 120,
    stage: 'Bulb Swelling & Foliage Development (कंद फुगवण)',
    stageMr: 'कंद फुगवण व पानांची वाढ',
    healthScore: 88,
    statusText: 'Bulb diameter reaching 45mm, zero thrips curling recorded',
    statusTextMr: 'कांद्याचा आकार ४५ मिमी पर्यंत वाढला असून थ्रिप्सचा प्रादुर्भाव शून्य आहे.',
    color: '#EC4899',
  },
];

export function CropProgressReviewTab() {
  const { language } = useAppStore();
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  const handleSpeakSummary = () => {
    let text = '';
    if (isMarathi) {
      text = "शेतकरी बंधूंनो, तुमच्या शेतातील पीक वाढ व प्रगती अहवाल असा आहे: कपाशीचे आरोग्य ८९ टक्के असून सरासरी ३५ बोंडे तयार झाली आहेत. सोयाबीन शेंगा भरण्याच्या टप्प्यावर असून ८२ टक्के निरोगी आहे. तूर व हरभरा पिके जोमदार असून ड्रोन फवारणीमुळे ९१ टक्के रोगांचे निर्मूलन झाले आहे. अपेक्षित उत्पादन सरासरीपेक्षा ३० टक्के जास्त येण्याचा अंदाज आहे.";
    } else if (isHindi) {
      text = "किसान भाइयों, आपकी फसलों की प्रगति रिपोर्ट इस प्रकार है: कपास का स्वास्थ्य ८९ प्रतिशत है और प्रति पौधा ३५ गूलर बन चुके हैं। सोयाबीन फलियां भरने की अवस्था में है और ८२ प्रतिशत स्वस्थ है। तुअर और चना फसलें बहुत बढ़िया हैं और ड्रोन छिड़काव से ९१ प्रतिशत रोगों का खात्मा हुआ है। अनुमानित उत्पादन औसत से ३० प्रतिशत अधिक रहने की संभावना है।";
    } else {
      text = "Farmer progress summary: Bt Cotton health is 89% with 35 bolls per plant. Soybean is in pod filling stage at 82% health. Tur and Chana crops are in vigorous condition with 91% disease elimination post drone spray. Projected yields are estimated 30% above the Taluka average.";
    }
    speakText(text, language);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ── Top Summary Header & Audio Narration ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900/50 border border-emerald-500/30 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {isMarathi ? 'थेट उपग्रह व ड्रोन प्रगती विश्लेषण' : isHindi ? 'लाइव उपग्रह व ड्रोन प्रगति समीक्षा' : 'Live Satellite & Drone Growth Audit'}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {isMarathi ? 'अद्ययावत: आज दुपारी १२:३०' : isHindi ? 'अपडेट: आज १२:३० बजे' : 'Updated: Today 12:30 PM'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)]">
            {isMarathi ? '📊 सर्व पिकांचा प्रगती व आरोग्य आलेख' : isHindi ? '📊 सभी फसलों की प्रगति व स्वास्थ्य चार्ट' : '📊 Multi-Crop Progress & Health Review'}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            {isMarathi 
              ? 'एनडीव्हीआय वनस्पती निर्देशांक, झाडांची वाढ, पाण्याचा ताण आणि फवारणीनंतरची सुधारणा एका दृष्टीक्षेपात.' 
              : isHindi
              ? 'एनडीवीआई वनस्पति सूचकांक, पौधे की वृद्धि, जल तनाव और छिड़काव बाद सुधार का विस्तृत विश्लेषण।'
              : 'NDVI vegetative trajectory, canopy expansion, thermal moisture stress, and post-spray recovery.'}
          </p>
        </div>

        <button
          onClick={handleSpeakSummary}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono shadow-lg shadow-emerald-700/30 transition-all active:scale-95 whitespace-nowrap self-start sm:self-auto"
        >
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span>{isMarathi ? '🔊 प्रगती अहवाल ऐका' : isHindi ? '🔊 प्रगति रिपोर्ट सुनें' : '🔊 Listen Growth Report'}</span>
        </button>
      </div>

      {/* ── Key Progress Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase">
              {isMarathi ? 'एकूण क्षेत्र' : isHindi ? 'कुल क्षेत्रफल' : 'Monitored Land'}
            </span>
            <Compass className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-[var(--text-primary)] font-mono">
            18.2 <span className="text-xs font-normal text-[var(--text-muted)]">Acres / ५ गट</span>
          </div>
          <div className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            {isMarathi ? '१००% ड्रोन कव्हरेज पूर्ण' : isHindi ? '१००% ड्रोन कवरेज पूर्ण' : '100% drone verified'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase">
              {isMarathi ? 'सरासरी शेत आरोग्य' : isHindi ? 'औसत खेत स्वास्थ्य' : 'Weighted Health'}
            </span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            88.4<span className="text-xs font-normal text-[var(--text-muted)]">%</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            {isMarathi ? '+६.२% गेल्या आठवड्यापेक्षा' : isHindi ? '+६.२% पिछले सप्ताह से' : '+6.2% vs last week'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase">
              {isMarathi ? 'ड्रोन फवारणी परिणाम' : isHindi ? 'ड्रोन छिड़काव प्रभाव' : 'Spray Efficacy'}
            </span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400 font-mono">
            91.4<span className="text-xs font-normal text-[var(--text-muted)]">%</span>
          </div>
          <div className="text-[11px] text-teal-400 mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            {isMarathi ? 'रोग क्षेत्र ९४ गुंठे कमी झाले' : isHindi ? 'रोग क्षेत्र ९४ गुंठे घटा' : '94 gunthas cured'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase">
              {isMarathi ? 'अपेक्षित उत्पादन वाढ' : isHindi ? 'अपेक्षित उत्पादन वृद्धि' : 'Yield Advantage'}
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            +32<span className="text-xs font-normal text-[var(--text-muted)]">%</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            {isMarathi ? 'तालुका सरासरीपेक्षा अधिक' : isHindi ? 'तहसील औसत से अधिक' : 'Above taluka average'}
          </div>
        </div>
      </div>

      {/* ── Interactive Crop Filter Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { key: 'all', label: isMarathi ? '🌱 सर्व पिके (All Crops)' : isHindi ? '🌱 सभी फसलें' : '🌱 All Crops' },
          { key: 'cotton', label: isMarathi ? 'कपाशी (Bt Cotton)' : isHindi ? 'कपास (Bt Cotton)' : 'Bt Cotton' },
          { key: 'soybean', label: isMarathi ? 'सोयाबीन (Soybean)' : isHindi ? 'सोयाबीन' : 'Soybean' },
          { key: 'tur', label: isMarathi ? 'तूर डाळ (Tur Dal)' : isHindi ? 'तुअर दाल' : 'Tur Dal' },
          { key: 'chana', label: isMarathi ? 'हरभरा (Gram/Chana)' : isHindi ? 'चना' : 'Gram / Chana' },
          { key: 'onion', label: isMarathi ? 'कांदा (Onion)' : isHindi ? 'प्याज' : 'Kanda / Onion' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedCrop(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono whitespace-nowrap transition-all ${
              selectedCrop === tab.key
                ? 'bg-[var(--accent)] text-black shadow-md shadow-amber-500/20'
                : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Charts Grid (Row 1: 60-Day NDVI Trajectory + Canopy Growth) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: 60-Day NDVI Progression */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                {isMarathi ? '६० दिवसांचा एनडीव्हीआय (NDVI) वाढ आलेख' : isHindi ? '६० दिनों का एनडीवीआई वृद्धि ग्राफ' : '60-Day NDVI Biomass Progression'}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                {isMarathi ? '०.७० च्या वर = दाट निरोगी पीक (NDVI 0.0 - 1.0)' : 'Above 0.70 indicates high chlorophyll density'}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Sentinel-2 + Drone Multispectral
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={NDVI_PROGRESS_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: '8px' }} />
                <ReferenceLine y={0.70} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'Healthy (0.70)', fill: '#10b981', fontSize: 10, position: 'insideTopLeft' }} />

                {(selectedCrop === 'all' || selectedCrop === 'cotton') && (
                  <Line type="monotone" dataKey="cotton" name={isMarathi ? 'कपाशी (Cotton)' : 'Bt Cotton'} stroke="#10B981" strokeWidth={3} dot={{ r: 3 }} />
                )}
                {(selectedCrop === 'all' || selectedCrop === 'soybean') && (
                  <Line type="monotone" dataKey="soybean" name={isMarathi ? 'सोयाबीन (Soybean)' : 'Soybean'} stroke="#F59E0B" strokeWidth={3} dot={{ r: 3 }} />
                )}
                {(selectedCrop === 'all' || selectedCrop === 'tur') && (
                  <Line type="monotone" dataKey="tur" name={isMarathi ? 'तूर (Tur Dal)' : 'Tur Dal'} stroke="#3B82F6" strokeWidth={3} dot={{ r: 3 }} />
                )}
                {(selectedCrop === 'all' || selectedCrop === 'chana') && (
                  <Line type="monotone" dataKey="chana" name={isMarathi ? 'हरभरा (Chana)' : 'Gram / Chana'} stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3 }} />
                )}
                {(selectedCrop === 'all' || selectedCrop === 'onion') && (
                  <Line type="monotone" dataKey="onion" name={isMarathi ? 'कांदा (Onion)' : 'Onion'} stroke="#EC4899" strokeWidth={2.5} dot={{ r: 3 }} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Canopy Ground Cover Expansion (% Closure) */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Sprout className="w-4 h-4 text-teal-400" />
                {isMarathi ? 'पानांचा विस्तार व जमिनीचे आच्छादन (%)' : isHindi ? 'पत्तियों का फैलाव व जमीन का आवरण (%)' : 'Canopy Ground Cover Expansion (%)'}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                {isMarathi ? 'ड्रोनद्वारे मोजलेला पानांचा घेर आणि विस्तार टक्केवारी' : 'Drone LiDAR/RGB canopy cover measurement'}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 font-bold border border-teal-500/20">
              LiDAR Canopy Volume
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CANOPY_EXPANSION_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="cottonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="soybeanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: '8px' }} />

                {(selectedCrop === 'all' || selectedCrop === 'cotton') && (
                  <Area type="monotone" dataKey="cotton" name={isMarathi ? 'कपाशी' : 'Bt Cotton'} stroke="#10B981" fillOpacity={1} fill="url(#cottonGrad)" strokeWidth={2} />
                )}
                {(selectedCrop === 'all' || selectedCrop === 'soybean') && (
                  <Area type="monotone" dataKey="soybean" name={isMarathi ? 'सोयाबीन' : 'Soybean'} stroke="#F59E0B" fillOpacity={1} fill="url(#soybeanGrad)" strokeWidth={2} />
                )}
                {(selectedCrop === 'all' || selectedCrop === 'tur') && (
                  <Area type="monotone" dataKey="tur" name={isMarathi ? 'तूर' : 'Tur Dal'} stroke="#3B82F6" fillOpacity={0.2} fill="#3B82F6" strokeWidth={2} />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Charts Grid (Row 2: Spray Recovery + Water Stress + Yield Forecast) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 3: Before vs After Spray Recovery */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {isMarathi ? 'ड्रोन फवारणीनंतर रोग घट' : isHindi ? 'छिड़काव बाद रोग में कमी' : 'Drone Spray Cure Efficacy'}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              {isMarathi ? 'फवारणीपूर्वी वि. फवारणीनंतर बाधित गुंठे' : 'Infected gunthas pre vs post spray'}
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SPRAY_RECOVERY_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="crop" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: '6px' }} />
                <Bar dataKey="beforeSpray" name={isMarathi ? 'फवारणीपूर्वी (गुंठे)' : 'Pre-Spray'} fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="afterSpray" name={isMarathi ? 'फवारणीनंतर (गुंठे)' : 'Post-Spray'} fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Thermal Water Stress (CWSI) */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-400" />
              {isMarathi ? 'पिकांचा पाण्याचा ताण (CWSI)' : isHindi ? 'जल तनाव सूचकांक' : 'Canopy Water Stress (CWSI)'}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              {isMarathi ? 'थर्मल कॅमेरा आधारित पाण्याचे बाष्पीभवन मापन' : 'Thermal IR transpiration deficit index'}
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WATER_STRESS_DATA} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" horizontal={false} />
                <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="parcel" type="category" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }}
                />
                <ReferenceLine x={0.35} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Stress Threshold', fill: '#F59E0B', fontSize: 9 }} />
                <Bar dataKey="stressIndex" name="Stress (CWSI)" fill="#38BDF8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Projected Harvest Yield vs Taluka Average */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              {isMarathi ? 'उत्पादन अंदाज वि. तालुका सरासरी' : isHindi ? 'उत्पादन अनुमान vs तहसील औसत' : 'Yield Forecast vs Taluka Avg'}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              {isMarathi ? 'क्विंटल प्रति एकर (वरंगा परिसर)' : 'Quintals per acre estimation'}
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={YIELD_FORECAST_DATA.slice(0, 4)} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="crop" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: '6px' }} />
                <Bar dataKey="projectedYield" name={isMarathi ? 'आपले शेत (अपेक्षित)' : 'Farm Projected'} fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="talukaAverage" name={isMarathi ? 'तालुका सरासरी' : 'Taluka Avg'} fill="#64748B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Phenological Growth Stage Timeline / Milestones ── */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              {isMarathi ? 'पिकांच्या वाढीचे टप्पे व कापणी प्रगती' : isHindi ? 'फसल वृद्धि चरण व कटाई की प्रगति' : 'Phenological Growth Stages & Harvest Timeline'}
            </h3>
          </div>
          <span className="text-xs font-mono text-[var(--accent)] font-bold">
            {isMarathi ? '५ पिके ट्रॅक होत आहेत' : '5 Crops Tracked'}
          </span>
        </div>

        <div className="space-y-4">
          {CROP_MILESTONES.map((m) => {
            const pct = Math.min(100, Math.round((m.das / m.totalDays) * 100));
            return (
              <div key={m.key} className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="font-bold text-sm text-[var(--text-primary)]">{m.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]">
                      {m.gat}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                      {m.das} / {m.totalDays} {isMarathi ? 'दिवस' : 'Days'} ({pct}%)
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {m.healthScore}% {isMarathi ? 'निरोगी' : 'Health'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-[var(--surface)] overflow-hidden border border-[var(--border)] mb-2">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${pct}%`,
                      backgroundColor: m.color,
                    }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[var(--text-secondary)] gap-1">
                  <span className="font-medium text-[var(--text-primary)]">
                    📌 {isMarathi ? m.stageMr : m.stage}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] italic">
                    {isMarathi ? m.statusTextMr : m.statusText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
