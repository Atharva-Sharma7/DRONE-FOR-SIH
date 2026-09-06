'use client';
import React, { useState } from 'react';
import { 
  TrendingUp, 
  Truck, 
  IndianRupee, 
  Volume2, 
  VolumeX, 
  ArrowUpRight, 
  ArrowDownRight, 
  Navigation, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Scale,
  Sparkles,
  MapPin,
  Clock
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';

interface MandiQuote {
  marketName: string;
  distanceKm: number;
  travelTime: string;
  crop: 'cotton' | 'soybean' | 'tur' | 'chana';
  modalPrice: number; // ₹ per quintal
  minPrice: number;
  maxPrice: number;
  priceChange: number; // ₹ change today
  trend: 'up' | 'down' | 'steady';
  tradingVolumeQuintals: number;
}

const MANDI_DATA: MandiQuote[] = [
  // Cotton (Kapas)
  { marketName: 'Nagpur APMC (Kalamna)', distanceKm: 28, travelTime: '45 mins', crop: 'cotton', modalPrice: 7480, minPrice: 7100, maxPrice: 7620, priceChange: 140, trend: 'up', tradingVolumeQuintals: 3400 },
  { marketName: 'Hingna APMC Sub-Yard', distanceKm: 14, travelTime: '22 mins', crop: 'cotton', modalPrice: 7220, minPrice: 6950, maxPrice: 7350, priceChange: 50, trend: 'up', tradingVolumeQuintals: 1200 },
  { marketName: 'Katol APMC Yard', distanceKm: 42, travelTime: '65 mins', crop: 'cotton', modalPrice: 7350, minPrice: 7050, maxPrice: 7450, priceChange: -30, trend: 'down', tradingVolumeQuintals: 2100 },
  { marketName: 'Wardha APMC Cotton Yard', distanceKm: 52, travelTime: '75 mins', crop: 'cotton', modalPrice: 7410, minPrice: 7150, maxPrice: 7500, priceChange: 80, trend: 'up', tradingVolumeQuintals: 2800 },

  // Soybean
  { marketName: 'Nagpur APMC (Kalamna)', distanceKm: 28, travelTime: '45 mins', crop: 'soybean', modalPrice: 4720, minPrice: 4500, maxPrice: 4850, priceChange: 60, trend: 'up', tradingVolumeQuintals: 4500 },
  { marketName: 'Hingna APMC Sub-Yard', distanceKm: 14, travelTime: '22 mins', crop: 'soybean', modalPrice: 4650, minPrice: 4400, maxPrice: 4740, priceChange: 20, trend: 'up', tradingVolumeQuintals: 1800 },
  { marketName: 'Amravati APMC Terminal', distanceKm: 95, travelTime: '130 mins', crop: 'soybean', modalPrice: 4850, minPrice: 4600, maxPrice: 4980, priceChange: 110, trend: 'up', tradingVolumeQuintals: 6200 },

  // Tur (Pigeon Pea)
  { marketName: 'Nagpur APMC (Kalamna)', distanceKm: 28, travelTime: '45 mins', crop: 'tur', modalPrice: 10400, minPrice: 9800, maxPrice: 10800, priceChange: 320, trend: 'up', tradingVolumeQuintals: 1900 },
  { marketName: 'Hingna APMC Sub-Yard', distanceKm: 14, travelTime: '22 mins', crop: 'tur', modalPrice: 9950, minPrice: 9500, maxPrice: 10200, priceChange: 150, trend: 'up', tradingVolumeQuintals: 800 },

  // Chana (Gram)
  { marketName: 'Nagpur APMC (Kalamna)', distanceKm: 28, travelTime: '45 mins', crop: 'chana', modalPrice: 6150, minPrice: 5800, maxPrice: 6300, priceChange: 40, trend: 'up', tradingVolumeQuintals: 1100 },
  { marketName: 'Katol APMC Yard', distanceKm: 42, travelTime: '65 mins', crop: 'chana', modalPrice: 6020, minPrice: 5750, maxPrice: 6180, priceChange: -20, trend: 'down', tradingVolumeQuintals: 600 },
];

interface CropMspItem {
  name: { en: string; hi: string; mr: string };
  msp: number;
  villagePrice: number;
}

const CROP_MSP: Record<string, CropMspItem> = {
  cotton:  { name: { en: 'Cotton (Long Staple)', hi: 'कपास (लंबा रेशा)', mr: 'कापूस (लांब धागा)' }, msp: 7121, villagePrice: 6400 },
  soybean: { name: { en: 'Soybean (Yellow)', hi: 'सोयाबीन (पीला)', mr: 'सोयाबीन (पिवळा)' }, msp: 4892, villagePrice: 4200 },
  tur:     { name: { en: 'Tur (Pigeon Pea)', hi: 'तुअर (दाल)', mr: 'तूर (लाल)' }, msp: 7550, villagePrice: 8800 },
  chana:   { name: { en: 'Gram (Desi Chickpea)', hi: 'चना (देसी)', mr: 'हरभरा (देशी)' }, msp: 5440, villagePrice: 5100 },
};

export default function MandiPage() {
  const { t } = useTranslation();
  const { language, isSpeaking, setIsSpeaking } = useAppStore();

  const [selectedCrop, setSelectedCrop] = useState<'cotton' | 'soybean' | 'tur' | 'chana'>('cotton');
  const [harvestQuintals, setHarvestQuintals] = useState<number>(25);

  const filteredMandis = MANDI_DATA.filter((m) => m.crop === selectedCrop);
  const mspInfo = CROP_MSP[selectedCrop];

  // Best mandi by price
  const bestMandi = [...filteredMandis].sort((a, b) => b.modalPrice - a.modalPrice)[0];

  // Calculate profit comparison
  const freightPerKm = 35; // ₹35 per km round-trip diesel for Bolero Maxi Truck
  const villageGross = harvestQuintals * mspInfo.villagePrice;

  const mandiCalculations = filteredMandis.map((m) => {
    const gross = harvestQuintals * m.modalPrice;
    const transportCost = Math.round(m.distanceKm * freightPerKm);
    const net = gross - transportCost;
    const profitOverVillage = net - villageGross;
    return { ...m, gross, transportCost, net, profitOverVillage };
  }).sort((a, b) => b.net - a.net);

  const topNetMandi = mandiCalculations[0];

  const handleVoiceAdvisory = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const cropName = mspInfo.name[language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en'];
      const spokenText = language === 'mr'
        ? `शेतकरी मित्रांनो, आज नागपूर कळमणा बाजारात ${cropName} चा भाव सर्वात जास्त म्हणजे ₹${bestMandi.modalPrice} प्रति क्विंटल आहे. गावात न विकता नागपूर बाजारात माल नेल्यास वाहतूक खर्च वजा जाता तुम्हाला तब्बल ₹${topNetMandi.profitOverVillage.toLocaleString('en-IN')} रुपयांचा निव्वळ नफा होईल.`
        : language === 'hi'
        ? `किसान भाइयों, आज नागपुर कलमाना मंडी में ${cropName} का भाव सबसे अधिक यानी ₹${bestMandi.modalPrice} प्रति क्विंटल है। गाँव में व्यापारियों को न बेचकर नागपुर ले जाने पर आपको भाड़ा काटकर ₹${topNetMandi.profitOverVillage.toLocaleString('en-IN')} का शुद्ध अतिरिक्त मुनाफा होगा।`
        : `Farmer notice: Today's top mandi rate for ${cropName} is ₹${bestMandi.modalPrice} per quintal at ${bestMandi.marketName}. Transporting your harvest to Nagpur yields ₹${topNetMandi.profitOverVillage.toLocaleString('en-IN')} higher net profit compared to village buyers.`;

      speakText(spokenText, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* ── Top Hero: Mandi Radar Header with Audio Broadcast ── */}
      <div className="rounded-3xl border-2 border-[var(--accent)] bg-[var(--surface)] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-amber-500/15 text-[var(--accent)] border border-amber-500/30">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] block">
              Vidarbha APMC Market Intelligence · Waranga Cluster
            </span>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-0.5">
              {language === 'mr' ? 'लाईव्ह बाजारभाव व नफा रडार' : language === 'hi' ? 'लाइव मंडी भाव एवं मुनाफा रडार' : 'Live Mandi Bhav & Profit Radar'}
            </h1>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
              Government Agmarknet Daily Modal Rates · Updated Today 11:30 AM
            </p>
          </div>
        </div>

        {/* Listen Voice Broadcast */}
        <button
          onClick={handleVoiceAdvisory}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95 self-start md:self-auto ${
            isSpeaking
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-[var(--accent)] text-black hover:bg-amber-500'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-bounce" />}
          <span className="font-mono text-xs">
            {isSpeaking
              ? (language === 'mr' ? 'थांबवा' : 'Stop')
              : (language === 'mr' ? '🔊 आजचे बाजारभाव ऐका' : language === 'hi' ? '🔊 आज के भाव सुनें' : '🔊 Listen Market Rates')}
          </span>
        </button>
      </div>

      {/* ── Crop Selector Buttons ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['cotton', 'soybean', 'tur', 'chana'] as const).map((crop) => {
          const info = CROP_MSP[crop];
          const active = selectedCrop === crop;
          return (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                active
                  ? 'bg-[var(--accent)] text-black border-[var(--accent)] shadow-lg shadow-amber-500/20 font-bold scale-[1.02]'
                  : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--accent)]'
              }`}
            >
              <span className="text-[10px] font-mono block uppercase opacity-80">
                MSP: ₹{info.msp}
              </span>
              <p className="text-sm font-bold mt-0.5 truncate">{info.name[language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en']}</p>
              <p className={`text-xs mt-1 font-mono ${active ? 'text-black/80 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}`}>
                {crop === 'cotton' ? '₹7,480/q ↑' : crop === 'tur' ? '₹10,400/q ↑' : crop === 'soybean' ? '₹4,720/q' : '₹6,150/q'}
              </p>
            </button>
          );
        })}
      </div>

      {/* ── SMART SELL ADVISOR: Freight & Middlemen Profit Calculator ── */}
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-emerald-500/10 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-mono font-extrabold uppercase">
              {language === 'mr' ? 'शेतकरी नफा सल्लागार' : language === 'hi' ? 'किसान मुनाफा सलाहकार' : 'Smart Profit Calculator'}
            </span>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              {language === 'mr'
                ? `गावात विकू नका! नागपूर बाजारात न्या आणि ₹${topNetMandi.profitOverVillage.toLocaleString('en-IN')} जास्त मिळवा!`
                : language === 'hi'
                ? `गाँव में न बेचें! नागपुर मंडी ले जाएं और ₹${topNetMandi.profitOverVillage.toLocaleString('en-IN')} ज्यादा मुनाफा पाएं!`
                : `Avoid village middlemen! Nagpur Mandi pays ₹${topNetMandi.profitOverVillage.toLocaleString('en-IN')} extra net profit!`}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Based on your estimated harvest volume, local village brokers buy at ₹{mspInfo.villagePrice}/q, while verified APMC mandis pay up to ₹{bestMandi.modalPrice}/q. Transport via mini-truck pays for itself many times over.
            </p>
          </div>

          {/* Harvest Volume Slider */}
          <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-md w-full lg:w-80 space-y-3 shrink-0">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[var(--text-muted)]">{language === 'mr' ? 'अंदाजे उत्पादन' : language === 'hi' ? 'अनुमानित उपज' : 'Harvest Volume'}:</span>
              <span className="font-bold text-base text-[var(--accent)]">{harvestQuintals} Quintals ({harvestQuintals * 100} kg)</span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={harvestQuintals}
              onChange={(e) => setHarvestQuintals(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
              <span>5 Quintals</span>
              <span>150 Quintals</span>
            </div>
          </div>
        </div>

        {/* Profit Comparison Pill Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5 pt-5 border-t border-emerald-500/20">
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-red-500/30">
            <span className="text-[10px] font-mono text-red-600 dark:text-red-400 font-bold uppercase block">
              {language === 'mr' ? 'गावात विक्री (दलाल)' : language === 'hi' ? 'गाँव में बिक्री (बिचौलिए)' : 'Local Village Middlemen'}
            </span>
            <div className="text-2xl font-mono font-bold text-red-600 dark:text-red-400 mt-1">
              ₹{villageGross.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">
              ₹{mspInfo.villagePrice}/q · Zero Transport
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-blue-500/30">
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold uppercase block">
              Hingna APMC (14 km)
            </span>
            <div className="text-2xl font-mono font-bold text-[var(--text-primary)] mt-1">
              ₹{(mandiCalculations.find(m => m.marketName.includes('Hingna'))?.net || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono font-semibold">
              +₹{(mandiCalculations.find(m => m.marketName.includes('Hingna'))?.profitOverVillage || 0).toLocaleString('en-IN')} extra net
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 shadow-md">
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 font-bold uppercase block">
              Nagpur Kalamna APMC (28 km) ⭐
            </span>
            <div className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              ₹{topNetMandi.net.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5 font-mono font-bold">
              +₹{topNetMandi.profitOverVillage.toLocaleString('en-IN')} maximum net profit!
            </p>
          </div>
        </div>
      </div>

      {/* ── LIVE MANDI RATES TABLE ── */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {language === 'mr' ? 'जवळपासच्या बाजार समित्यांमधील भाव' : 'Nearby APMC Yard Rates & Distance'}
            </h3>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
              Sorted by highest modal price for {typeof mspInfo.name === 'object' ? (mspInfo.name[language as 'en' | 'hi' | 'mr'] || mspInfo.name.en) : mspInfo.name}
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Govt MSP: ₹{mspInfo.msp}/q
          </span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[var(--border)] font-mono text-[var(--text-muted)] uppercase text-[10px]">
                <th className="pb-3 font-semibold">Mandi / Yard</th>
                <th className="pb-3 font-semibold">Distance</th>
                <th className="pb-3 font-semibold">Modal Price</th>
                <th className="pb-3 font-semibold">Range (Min - Max)</th>
                <th className="pb-3 font-semibold">Trend</th>
                <th className="pb-3 font-semibold">Net for {harvestQuintals}q</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] font-medium">
              {mandiCalculations.map((item, idx) => (
                <tr key={item.marketName} className="hover:bg-[var(--surface-2)]/60 transition-colors">
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-2">
                      {idx === 0 && <span className="text-amber-500 text-sm">👑</span>}
                      <div>
                        <span className="font-bold text-[var(--text-primary)] block text-sm">{item.marketName}</span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> Opens 6:30 AM · {item.travelTime} drive
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-blue-500" />
                      {item.distanceKm} km
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 font-mono font-bold text-base text-[var(--text-primary)]">
                    ₹{item.modalPrice.toLocaleString('en-IN')}
                    <span className="text-[10px] text-[var(--text-muted)] ml-0.5 font-normal">/q</span>
                  </td>
                  <td className="py-3.5 pr-3 font-mono text-[var(--text-secondary)]">
                    ₹{item.minPrice} - ₹{item.maxPrice}
                  </td>
                  <td className="py-3.5 pr-3">
                    {item.trend === 'up' ? (
                      <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        +₹{item.priceChange}
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-red-600 dark:text-red-400 font-mono font-bold">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        -₹{Math.abs(item.priceChange)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    ₹{item.net.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
