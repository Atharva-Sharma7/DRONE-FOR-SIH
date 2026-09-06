'use client';
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Moon, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Plane, 
  Droplets, 
  Sprout, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Flame, 
  Zap, 
  Crosshair, 
  Eye, 
  FileCheck, 
  Activity,
  HeartPulse,
  Compass
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';

export default function KisanRakshakPage() {
  const { t } = useTranslation();
  const { language, isSpeaking, setIsSpeaking } = useAppStore();
  const [activeTab, setActiveTab] = useState<'wildlife' | 'poisoning' | 'seeds' | 'borewell'>('wildlife');

  // Night Patrol Simulation State
  const [patrolStatus, setPatrolStatus] = useState<'patrolling' | 'detected' | 'deterring' | 'cleared'>('detected');
  const [deterrentActive, setDeterrentActive] = useState(false);

  // Germination Audit State
  const [seedAuditGenerated, setSeedAuditGenerated] = useState(false);

  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  const handleTriggerDeterrent = () => {
    setDeterrentActive(true);
    setPatrolStatus('deterring');
    setTimeout(() => {
      setDeterrentActive(false);
      setPatrolStatus('cleared');
    }, 3500);
  };

  const handleVoiceAdvisory = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      let text = '';
      if (activeTab === 'wildlife') {
        text = isMarathi
          ? 'किसान रक्षक रात्रीचे गस्त पथक: उत्तर सीमेवर ३ रानडुक्करांचा प्रादुर्भाव आढळला आहे. ड्रोनने स्वयंचलित ध्वनी व प्रकाश सायरेन सुरू करून जनावरांना पिटाळून लावले आहे. शेतकऱ्यांनी रात्री शेतात जाण्याचा धोका पत्करू नये.'
          : isHindi
          ? 'किसान रक्षक रात्रि गश्त: उत्तर सीमा पर ३ जंगली सूअर देखे गए हैं। ड्रोन ने अल्ट्रासोनिक सायरन और फ्लैश लाइट से उन्हें भगा दिया है। किसानों को रात में खेत जाने की जरूरत नहीं है, आप सुरक्षित रहें।'
          : 'Kisan Rakshak Night Patrol Alert: 3 wild boars detected near North boundary Gat 142/A. Autonomous drone strobe and ultrasonic siren has deterred them back to forest. Farmers do not need to risk snakebites in dark fields.';
      } else if (activeTab === 'poisoning') {
        text = isMarathi
          ? 'शून्य-संपर्क फवारणी सुरक्षा: हाताने पाठीवरच्या पंपाने फवारणी केल्यास विषबाधा होण्याचा १०० टक्के धोका असतो. यवतमाळ व विदर्भातील दुर्घटना टाळण्यासाठी स्वायत्त ड्रोनद्वारे मानवी संपर्काशिवाय शून्य टक्के धोक्यात फवारणी करा.'
          : isHindi
          ? 'शून्य-संपर्क छिड़काव सुरक्षा: पीठ के पंप से छिड़काव करने पर जहरीले रसायनों से सांस की बीमारी और विषबाधा का भारी खतरा होता है। ड्रोन छिड़काव से किसान रसायनों के संपर्क से १००% सुरक्षित रहता है।'
          : 'Zero-Contact Chemical Safety Shield: Traditional knapsack spraying causes severe pesticide inhalation poisoning. Autonomous AgriHawk drone spraying eliminates 100 percent human chemical contact.';
      } else if (activeTab === 'seeds') {
        text = isMarathi
          ? 'बोगस बियाणे तपासणी: पेरणीनंतर ८ व्या दिवशी ड्रोनने केलेल्या तपासणीत उगवण क्षमता फक्त ४१ टक्के भरली आहे. बोगस बियाण्यांविरुद्ध कृषी अधिकाऱ्यांकडे नुकसान भरपाई मागण्यासाठी अधिकृत पंचनामा येथे उपलब्ध आहे.'
          : isHindi
          ? 'नकली बीज जांच: बुवाई के ८ दिन बाद ड्रोन जांच में अंकुरण मात्र ४१% पाया गया। नकली बीज के खिलाफ कृषि विभाग में मुआवजे के लिए आधिकारिक पंचनामा तुरंत डाउनलोड करें।'
          : 'Seed Germination Failure Audit: Drone emergence count reveals only 41 percent germination. Download the certified evidence Panchnama to claim refund from authorized seed distributors.';
      } else {
        text = isMarathi
          ? 'भूजल व रात्रीचे सिंचन नियोजन: विहिरीसाठी चुकीच्या जागी बोअरवेल पाडून कर्जबाजारी होऊ नका. ड्रोन थर्मल नकाशाद्वारे गट १४३ मध्ये सर्वाधिक पाणी साठा आढळला आहे.'
          : isHindi
          ? 'भूजल व रात्रि सिंचाई: गलत जगह बोरवेल करके पैसे बर्बाद न करें। ड्रोन थर्मल मैपिंग द्वारा गट १४३ में भूमिगत जल का सबसे समृद्ध स्रोत पहचाना गया है।'
          : 'Hydro-Thermal Aquifer Locator: Avoid blind borewell drilling. Drone thermal and DEM contours identify the exact fracture line with 85% water recharge probability in Gat 143.';
      }

      speakText(text, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Hero Banner */}
      <div className="rounded-3xl border-2 border-rose-500/40 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-emerald-500/10 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40 shrink-0">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-mono font-extrabold uppercase">
                GIPE & Field Survey Solutions
              </span>
              <span className="text-xs font-mono text-rose-700 dark:text-rose-300 font-bold">
                {isMarathi ? 'शेतकऱ्यांच्या दुर्लक्षित समस्यांवर तंत्रज्ञान' : isHindi ? 'किसानों की अनसुलझी समस्याओं का समाधान' : 'Unnoticed Grassroots Crises Solved by AI'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-1">
              {isMarathi ? 'किसान रक्षक: वन्यजीव, विषबाधा व बियाणे संरक्षण' : isHindi ? 'किसान रक्षक: वन्यजीव, विषबाधा व बीज सुरक्षा केंद्र' : 'Kisan Rakshak: Wildlife, Chemical Shield & Seed Auditor'}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
              {isMarathi 
                ? 'गोखले इन्स्टिट्यूट व विदर्भ सर्वेक्षणातील वास्तविक समस्या: रानडुक्कर उपद्रव, फवारणी विषबाधा आणि बोगस बियाणे यावर ड्रोन AI उपाय' 
                : isHindi 
                ? 'गोखले संस्थान व विदर्भ सर्वेक्षणाधारित वास्तविक समाधान: जंगली जानवरों से बचाव, कीटनाशक विषबाधा से मुक्ति व नकली बीज जांच' 
                : 'Addressing field-surveyed crises: ₹40,000 Cr wildlife crop raids, Yavatmal pesticide poisonings, and bogus seed germination failures.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleVoiceAdvisory}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-95 shrink-0 ${
            isSpeaking ? 'bg-red-500 text-white animate-pulse' : 'bg-[var(--accent)] text-black hover:bg-amber-500'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          <span>{isMarathi ? '🔊 आवाज ऐका' : isHindi ? '🔊 आवाज़ में सुनें' : '🔊 Listen Solution'}</span>
        </button>
      </div>

      {/* Navigation Tabs for the 4 Grassroots Solvers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('wildlife')}
          className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeTab === 'wildlife'
              ? 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 shadow-md ring-2 ring-rose-500/30'
              : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <Moon className="w-5 h-5 text-rose-500" />
            <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-600">
              Survey #1
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-bold text-[var(--text-primary)]">
              {isMarathi ? 'रानडुक्कर व वन्यजीव रडार' : isHindi ? 'जंगली जानवर व नीलगाय रडार' : 'Night Wildlife Deterrent'}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
              {isMarathi ? 'रात्रीची थर्मल गस्त व सायरन' : isHindi ? 'थर्मल गश्त व सायरन' : 'Thermal Drone Patrol'}
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('poisoning')}
          className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeTab === 'poisoning'
              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <HeartPulse className="w-5 h-5 text-emerald-500" />
            <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600">
              Survey #2
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-bold text-[var(--text-primary)]">
              {isMarathi ? 'शून्य-संपर्क विषबाधा कवच' : isHindi ? 'शून्य-संपर्क विषबाधा सुरक्षा' : 'Zero-Contact Chemical Shield'}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
              {isMarathi ? 'यवतमाळ विषबाधा निवारण' : isHindi ? 'कीटनाशक जहर से बचाव' : '100% Inhalation Free'}
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('seeds')}
          className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeTab === 'seeds'
              ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 shadow-md ring-2 ring-amber-500/30'
              : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <Sprout className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600">
              Survey #3
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-bold text-[var(--text-primary)]">
              {isMarathi ? 'बोगस बियाणे तपासणी' : isHindi ? 'नकली बीज व अंकुरण जांच' : 'Bogus Seed Emergence Audit'}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
              {isMarathi ? 'दुबार पेरणी पंचनामा' : isHindi ? 'पुनः बुवाई से बचाव पंचनामा' : 'Legal Grievance Proof'}
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('borewell')}
          className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
            activeTab === 'borewell'
              ? 'bg-blue-500/15 border-blue-500 text-blue-700 dark:text-blue-300 shadow-md ring-2 ring-blue-500/30'
              : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <Droplets className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-600">
              Survey #4
            </span>
          </div>
          <div className="mt-2">
            <p className="text-xs font-bold text-[var(--text-primary)]">
              {isMarathi ? 'भूजल व रात्रीचे सिंचन' : isHindi ? 'भूजल व रात्रि सिंचाई नियोजन' : 'Hydro-Thermal Aquifer Radar'}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">
              {isMarathi ? 'अचूक बोअरवेल ठिकाण' : isHindi ? 'सटीक बोरवेल बिंदु' : 'Borewell Dry-Hole Prevention'}
            </p>
          </div>
        </button>
      </div>

      {/* ── TAB 1: WILDLIFE NIGHT PATROL & STROBE DETERRENT ── */}
      {activeTab === 'wildlife' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Left: Thermal Infrared Night Simulation Viewer */}
          <div className="lg:col-span-7 rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-2)]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  {isMarathi ? 'थर्मल इन्फ्रारेड रात्रीची गस्त (रात्री ०२:४४)' : isHindi ? 'थर्मल इंफ्रारेड रात्रि गश्त (रात ०२:४४)' : 'FLIR Thermal IR Night Patrol (02:44 AM)'}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold">
                YOLOv8-Wildlife Model Active
              </span>
            </div>

            <div className="relative h-80 bg-slate-950 overflow-hidden flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80" 
                alt="Thermal Night Scan"
                className="absolute inset-0 w-full h-full object-cover filter invert contrast-150 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/85 via-slate-950/70 to-rose-950/80 mix-blend-color" />

              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#a855f7 1px, transparent 1px)',
                  backgroundSize: '32px 32px'
                }}
              />

              {patrolStatus !== 'cleared' && (
                <div className="absolute top-16 left-28 z-10 animate-pulse">
                  <div className="relative p-2 rounded-xl border-2 border-red-500 bg-red-600/30 backdrop-blur-sm shadow-2xl flex flex-col items-center">
                    <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-red-600 text-white shadow">
                      ⚠️ 3x Wild Boars (रानडुक्कर)
                    </span>
                    <span className="text-[8px] font-mono text-white bg-black/80 px-1 rounded mt-1">
                      Body Heat: 38.6°C · Moving 3.2 km/h South
                    </span>
                  </div>
                </div>
              )}

              {deterrentActive && (
                <div className="absolute inset-0 bg-white/40 animate-ping z-20 flex items-center justify-center">
                  <span className="text-xl font-mono font-black text-red-600 bg-white px-4 py-2 rounded-2xl shadow-2xl">
                    🔊 110dB ULTRASONIC SIREN + 4000lm STROBE FLASH ENGAGED
                  </span>
                </div>
              )}

              {patrolStatus === 'cleared' && (
                <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-20 animate-fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
                  <h3 className="text-base font-bold text-white">
                    {isMarathi ? 'वन्यजीव शेताबाहेर पिटाळले गेले!' : isHindi ? 'जंगली जानवर खेत से बाहर भगा दिए गए!' : 'Perimeter Secured: Wild Boars Repelled!'}
                  </h3>
                  <p className="text-xs text-emerald-200 mt-1 font-mono">
                    Drone resuming scheduled boundary patrol at Gat 142/A
                  </p>
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-white/20 text-white font-mono text-[10px] flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span>ALT: 20m AGL</span>
                  <span>THERMAL: FLIR Boson 640</span>
                  <span>GAT: 142/A North</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>AUTONOMOUS ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[var(--surface-2)] flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">
                  {isMarathi ? 'शेतकऱ्यांना रात्री शेतात जागण्याची गरज नाही!' : isHindi ? 'किसानों को रात में खेत में जागने की जरूरत नहीं!' : 'Sleep Peacefully at Home — Zero Snakebite Risk'}
                </p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Automated non-lethal deterrent protects your crop and respects wildlife conservation laws.
                </p>
              </div>

              <button
                onClick={handleTriggerDeterrent}
                disabled={deterrentActive || patrolStatus === 'cleared'}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Zap className="w-4 h-4" />
                <span>{isMarathi ? 'सायरन व स्ट्रोब सुरू करा' : isHindi ? 'सायरन व फ्लैश चलाएं' : 'Engage Strobe Deterrent'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-3">
              <span className="text-[10px] font-mono font-extrabold uppercase text-rose-600 dark:text-rose-400 tracking-wider">
                Gokhale Institute Study (2025)
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {isMarathi 
                  ? 'महाराष्ट्रात दरवर्षी ₹१०,००० ते ₹४०,००० कोटींचे वन्यजीव नुकसान!' 
                  : isHindi 
                  ? 'महाराष्ट्र में हर साल ₹१०,००० से ₹४०,००० करोड़ का वन्यजीव नुकसान!' 
                  : '₹10,000 to ₹40,000 Cr Annual Crop Destruction by Wild Boars'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Official surveys reveal that only 1% to 2% of wildlife damage is ever compensated by forest departments due to tedious manual verification. Farmers spend nights in winter and rain, resulting in hundreds of fatal snakebites annually.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[var(--border)] text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[var(--surface-2)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Surveyed Species:</span>
                  <span className="font-bold text-[var(--text-primary)]">Wild Boar (रानडुक्कर), Nilgai</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--surface-2)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Human Safety:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Snakebite Prevention</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase font-mono">
                  {isMarathi ? 'थेट शेतकऱ्याच्या मोबाईलवर व्हॉट्सअॅप / एसएमएस' : isHindi ? 'किसान के मोबाइल पर तुरंत अलर्ट' : 'Instant Vernacular Mobile SMS / Audio Alert'}
                </h4>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                "⚠️ अलर्ट: उत्तर सीमेवर रानडुक्कर आले होते, ड्रोनने सायरन वाजवून त्यांना परत जंगलात पिटाळले आहे. आपण शेतात जाऊ नका, घरातच सुरक्षित राहा."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: ZERO-CONTACT PESTICIDE CHEMICAL SAFETY SHIELD ── */}
      {activeTab === 'poisoning' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          <div className="lg:col-span-7 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                Yavatmal & Vidarbha Field Investigation (MAPPP)
              </span>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mt-1">
                {isMarathi ? 'रासायनिक कीटकनाशक विषबाधेपासून शेतकऱ्यांचे १००% संरक्षण' : isHindi ? 'रासायनिक कीटनाशक जहर से किसानों की १००% सुरक्षा' : 'Eliminating Inhalation Poisoning in Vidarbha Cotton Belts'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                During 2017–2026, hundreds of farmers in Yavatmal, Buldhana, and Akola suffered acute respiratory poisoning, blindness, and death from manual spraying of Monocrotophos and Acephate. AgriHawk Hexa-Rotor removes the farmer entirely from the danger zone.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border-2 border-red-500/40 bg-red-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 font-mono uppercase">
                    ❌ Traditional Backpack Sprayer
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-600 font-bold">
                    High Hazard
                  </span>
                </div>
                <ul className="text-xs space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>100% Inhalation Exposure:</strong> Chemical mist directly breathed in during humid conditions.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>150–200 Liters Water/Acre:</strong> Heavy back pain carrying 16kg tanks for 6 exhausting hours.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Skin Absorption & Dermal Lesions:</strong> Leaking nozzles saturate farmer's clothing.</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono uppercase">
                    ✅ AgriHawk Autonomous Drone
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold">
                    Zero Contact
                  </span>
                </div>
                <ul className="text-xs space-y-2 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>0% Human Chemical Contact:</strong> Farmer stays safely outside the field border with remote telemetry.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Only 10 Liters Water/Acre:</strong> Ultra-low volume (ULV) atomizing nozzles save 90% water.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>8 Minutes per Acre:</strong> Downwash air vortex forces droplets onto underside of leaves where pests hide.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono space-y-2">
              <div className="flex justify-between items-center text-[var(--text-primary)] font-bold">
                <span>WHO Hazard Class & Antidote Quick Reference:</span>
                <span className="text-rose-600">Monocrotophos: Class Ib (Highly Hazardous)</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-sans">
                In case of emergency accidental exposure in village: Administer Atropine Sulfate injection under medical supervision. Immediately strip contaminated clothing and rinse skin with copious water.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <HeartPulse className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {isMarathi ? 'शून्य विषबाधा धोरण' : isHindi ? 'शून्य विषबाधा मिशन' : 'Zero-Poisoning Vision'}
                  </h3>
                  <p className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
                    Vidarbha Agricultural Life Protection
                  </p>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                By shifting to precision drone misting, a village cluster eliminates hospital admissions, prevents chronic neurological degradation among spray laborers, and cuts pesticide purchase cost by 35% through targeted micro-spot application.
              </p>

              <div className="space-y-2 pt-2 border-t border-emerald-500/30 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-emerald-500/20">
                  <span className="text-[var(--text-muted)]">Water Saved:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">140 Liters / Acre</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-500/20">
                  <span className="text-[var(--text-muted)]">Time Saved:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">5.8 Hours / Acre</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--text-muted)]">Human Poisoning Rate:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">0.0% (Absolute Zero)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: BOGUS SEED EMERGENCE AUDIT & RE-SOWING DEFENSE ── */}
      {activeTab === 'seeds' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          <div className="lg:col-span-7 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                NSSO & State Agriculture Dept Survey
              </span>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mt-1">
                {isMarathi ? 'बोगस बियाण्यांमुळे होणारी दुबार पेरणी रोखा' : isHindi ? 'नकली बीज व पुनः बुवाई (दुबार पेरणी) से रक्षा' : 'Pre-Empting Catastrophic Bogus Seed Emergence Failure'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                Counterfeit Bt Cotton and Soybean seeds with poor germination (&lt;50%) force farmers into emergency second sowings (दुबार पेरणी), doubling seed and diesel costs. AgriHawk AI scans fields 8 days post-sowing to count seedling emergence per square meter.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[var(--text-muted)]">
                  Day 8 Emergence Scan · Soybean JS-335 (Gat 143)
                </span>
                <span className="text-xs font-mono font-black text-rose-600 dark:text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded">
                  41.2% GERMINATION (DEFECTIVE SEED LOT)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono pt-2">
                <div className="p-2.5 rounded-xl bg-[var(--surface)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Expected Stand:</span>
                  <span className="font-bold text-emerald-600">14 plants / m²</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--surface)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">AI Detected:</span>
                  <span className="font-bold text-rose-600">5.8 plants / m²</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--surface)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Lot Verification:</span>
                  <span className="font-bold text-amber-500">Uncertified Lot #419</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  {isMarathi ? 'तालुका कृषी अधिकाऱ्यांसाठी अधिकृत तक्रार पंचनामा' : isHindi ? 'कृषि विभाग शिकायत हेतु प्रमाणित पंचनामा' : 'Legal Grievance Panchnama for Agriculture Officer'}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Includes geo-tagged seedling photos, stand count statistics, and merchant invoice number.
                </p>
              </div>

              <button
                onClick={() => setSeedAuditGenerated(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow flex items-center gap-2 transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{seedAuditGenerated ? (isMarathi ? 'डाऊनलोड झाले!' : 'Downloaded!') : (isMarathi ? 'पंचनामा डाऊनलोड' : 'Generate Panchnama')}</span>
              </button>
            </div>

            {seedAuditGenerated && (
              <div className="p-3 rounded-xl bg-emerald-600 text-white font-mono text-xs text-center font-bold shadow animate-fade-in">
                📄 Official Seed Failure Certificate generated: MH-BOGUS-SEED-CLAIM-0824.pdf (Ready for Krishi Kendra refund)
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-3">
              <span className="text-[10px] font-mono font-extrabold uppercase text-amber-600 tracking-wider">
                Farmer Financial Defense
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {isMarathi ? 'दुबार पेरणीचा ₹२५,००० खर्च वाचवा' : isHindi ? 'पुनः बुवाई का ₹२५,००० खर्च बचाएं' : 'Save ₹25,000 in Re-Sowing Sunk Costs'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                When germination failure is detected within 8 days instead of waiting 3 weeks, farmers can still gap-fill or claim replacement seeds under the Maharashtra Quality Control (Seeds) Rules before the monsoon window closes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: HYDRO-THERMAL AQUIFER & NOCTURNAL IRRIGATION ── */}
      {activeTab === 'borewell' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          <div className="lg:col-span-7 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                Sub-Surface Hydrological Mapping
              </span>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mt-1">
                {isMarathi ? 'अंधाधुंद बोअरवेल पाडून कर्जबाजारी होणे थांबवा' : isHindi ? 'अंधाधुंध बोरवेल करके कर्ज में डूबने से बचें' : 'Preventing Dry-Hole Debt: Hydro-Thermal Borewell Locator'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                In Vidarbha, small farmers spend ₹1.5 to ₹3 Lakhs drilling dry borewells that yield zero water. AgriHawk combines thermal canopy transpiration cool-spots with LiDAR Digital Elevation Model (DEM) runoff pooling lines to identify genuine subterranean recharge fractures.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[var(--text-muted)]">
                  Top Recommended Drilling Zone · Gat 143 (South Plot)
                </span>
                <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                  86.4% WATER RECHARGE PROBABILITY
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono pt-2">
                <div className="p-2.5 rounded-lg bg-[var(--surface)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Est. Aquifer Depth:</span>
                  <span className="font-bold text-[var(--text-primary)]">180 – 220 Feet</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Discharge Potential:</span>
                  <span className="font-bold text-blue-600">2.5 Inches (Perennial)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">Fracture Line:</span>
                  <span className="font-bold text-emerald-600">Basalt Inter-trappean</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-blue-500/40 bg-blue-500/10 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs font-mono uppercase">
                <Zap className="w-4 h-4" />
                <span>MSEDCL 3-Phase Agricultural Power Schedule (Waranga Feeder)</span>
              </div>
              <p className="text-xs text-[var(--text-primary)] font-medium">
                Tonight's Power Window: <strong>11:15 PM to 05:45 AM</strong>. Set automated pump timer to avoid walking in waterlogged darkness.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-3">
              <span className="text-[10px] font-mono font-extrabold uppercase text-blue-600 tracking-wider">
                Groundwater Conservation
              </span>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {isMarathi ? 'शाश्वत शेततळे व विहीर पुनर्भरण' : isHindi ? 'सतत फार्म पॉन्ड व कुआं पुनर्भरण' : 'Recharge Over Depletion'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Rather than drilling 400-feet deep borewells that suck mineral-heavy saline water, the platform maps rainwater catchment micro-depressions for farm ponds (शेततळे) under the Jalyukt Shivar 2.0 scheme.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
