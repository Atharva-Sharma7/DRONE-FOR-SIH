'use client';
import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Layers, 
  Calendar, 
  MapPin, 
  Droplets, 
  Cpu, 
  Edit3, 
  Plus, 
  RotateCcw, 
  Save, 
  X, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  Plane,
  Volume2,
  TrendingUp,
  Microscope
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';
import { CropProfile, DEFAULT_CROPS, CropAIAnalysisModal } from './CropAIAnalysisModal';
import { QuickSprayModal } from './QuickSprayModal';

export interface SownParcel {
  id: string;
  gatNumber: string;
  gatNumberMr: string;
  cropKey: string;
  cropName: string;
  variety: string;
  sowingDate: string;
  areaAcres: number;
  irrigation: string;
  soilType: string;
  status: 'optimal' | 'attention' | 'critical';
}

const DEFAULT_PARCELS: SownParcel[] = [
  {
    id: 'parcel-1',
    gatNumber: 'Gat 142/A',
    gatNumberMr: 'गट १४२/अ',
    cropKey: 'cotton',
    cropName: 'Bt Cotton (कपाशी)',
    variety: 'Hybrid RCH-659 BG-II',
    sowingDate: '2026-06-18',
    areaAcres: 6.2,
    irrigation: 'Inline Drip (ठिबक सिंचन)',
    soilType: 'Deep Black Vertisol (काळी माती)',
    status: 'optimal',
  },
  {
    id: 'parcel-2',
    gatNumber: 'Gat 143',
    gatNumberMr: 'गट १४३',
    cropKey: 'soybean',
    cropName: 'Soybean (सोयाबीन)',
    variety: 'JS-335 (Jawahar)',
    sowingDate: '2026-06-26',
    areaAcres: 4.8,
    irrigation: 'Micro-Sprinkler / Rainfed',
    soilType: 'Medium Black Silt Loam',
    status: 'attention',
  },
  {
    id: 'parcel-3',
    gatNumber: 'Gat 144',
    gatNumberMr: 'गट १४४',
    cropKey: 'tur',
    cropName: 'Tur Dal / Arhar (तूर)',
    variety: 'BDN-711 (Marathwada)',
    sowingDate: '2026-06-20',
    areaAcres: 2.5,
    irrigation: 'Intercropped Rainfed',
    soilType: 'Clay Loam (गाळाची माती)',
    status: 'optimal',
  },
  {
    id: 'parcel-4',
    gatNumber: 'Gat 145/B',
    gatNumberMr: 'गट १४५/ब',
    cropKey: 'chana',
    cropName: 'Gram / Chana (हरभरा)',
    variety: 'Vijay / Digvijay',
    sowingDate: '2026-08-12',
    areaAcres: 3.0,
    irrigation: 'Broad Bed Furrow (BBF)',
    soilType: 'Deep Retentive Silt',
    status: 'optimal',
  },
  {
    id: 'parcel-5',
    gatNumber: 'Gat 146',
    gatNumberMr: 'गट १४६',
    cropKey: 'onion',
    cropName: 'Onion (कांदा / प्याज)',
    variety: 'Nashik Red / Bhima Super',
    sowingDate: '2026-07-28',
    areaAcres: 2.0,
    irrigation: 'Drip Fertigation (ठिबक)',
    soilType: 'Sandy Loam (हलकी जमीन)',
    status: 'attention',
  },
];

export function FieldSowingOverview() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  const [parcels, setParcels] = useState<SownParcel[]>(DEFAULT_PARCELS);
  const [selectedCropProfile, setSelectedCropProfile] = useState<CropProfile | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isSprayModalOpen, setIsSprayModalOpen] = useState(false);

  // Edit parcel state
  const [editingParcel, setEditingParcel] = useState<SownParcel | null>(null);

  // Load customizations from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('farmer_sown_parcels');
      if (saved) {
        setParcels(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveParcels = (newParcels: SownParcel[]) => {
    setParcels(newParcels);
    try {
      localStorage.setItem('farmer_sown_parcels', JSON.stringify(newParcels));
    } catch {
      // ignore
    }
  };

  const handleResetToDefault = () => {
    saveParcels(DEFAULT_PARCELS);
    setIsCustomizeModalOpen(false);
    setEditingParcel(null);
  };

  const handleOpenAICheck = (parcel: SownParcel) => {
    const profile = DEFAULT_CROPS[parcel.cropKey] || DEFAULT_CROPS.cotton;
    // Overlay customized parcel metadata if modified
    const customizedProfile: CropProfile = {
      ...profile,
      gat: parcel.gatNumber,
      gatMr: parcel.gatNumberMr,
      gatHi: parcel.gatNumber,
      area: `${parcel.areaAcres} Acres`,
      variety: parcel.variety,
      soil: parcel.soilType,
      irrigation: parcel.irrigation,
    };
    setSelectedCropProfile(customizedProfile);
    setIsAIModalOpen(true);
  };

  const handleSaveParcelEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParcel) return;
    const updated = parcels.map((p) => (p.id === editingParcel.id ? editingParcel : p));
    saveParcels(updated);
    setEditingParcel(null);
  };

  const calculateDaysSinceSowing = (sowingDate: string) => {
    const start = new Date(sowingDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.max(1, Math.round((now - start) / (1000 * 60 * 60 * 24)));
    return diffDays;
  };

  const totalAcres = parcels.reduce((sum, p) => sum + p.areaAcres, 0).toFixed(1);

  return (
    <div className="space-y-4 font-sans">
      {/* Overview Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Sprout className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-extrabold uppercase">
                {isMarathi ? 'शेतजमीन व पेरणी नकाशा' : isHindi ? 'खेत भूमि व बुवाई मानचित्र' : 'Field Sowing Overview & Cadastre'}
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {parcels.length} {isMarathi ? 'गट भूखंड' : isHindi ? 'गट भूखंड' : 'Gat Parcels'} · {totalAcres} {isMarathi ? 'एकर क्षेत्र' : isHindi ? 'एकड़ क्षेत्र' : 'Acres Total'}
              </span>
            </div>
            <h2 className="text-lg font-black text-[var(--text-primary)] mt-0.5">
              {isMarathi 
                ? 'कोणत्या गटामध्ये कोणते पीक पेरले आहे? (तपासणीसाठी पिकावर क्लिक करा)' 
                : isHindi 
                ? 'किस गट में कौन सी फसल बोई है? (जांच के लिए फसल पर क्लिक करें)' 
                : 'What is Sown Where? (Click any crop to run 6-AI Model Analysis)'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {isMarathi
                ? 'आपल्या शेतातील पिके, वाण, तारीख व क्षेत्र आपल्या सोयीनुसार बदला व AI तपासा.'
                : isHindi
                ? 'अपनी फसलों, किस्म, तारीख व क्षेत्र को किसान अपनी मर्जी से बदल सकते हैं।'
                : 'Interactive crop allocations. Farmer can customize crops, varieties, and sowing dates anytime.'}
            </p>
          </div>
        </div>

        {/* Customization Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCustomizeModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-[var(--accent)]" />
            <span>{isMarathi ? '✏️ पिके बदला / एडिट करा' : isHindi ? '✏️ फसल बदलें / एडिट करें' : '✏️ Customize Sown Crops'}</span>
          </button>
        </div>
      </div>

      {/* Sown Parcels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {parcels.map((parcel) => {
          const profile = DEFAULT_CROPS[parcel.cropKey] || DEFAULT_CROPS.cotton;
          const daysOld = calculateDaysSinceSowing(parcel.sowingDate);
          const isOptimal = parcel.status === 'optimal';

          return (
            <div
              key={parcel.id}
              onClick={() => handleOpenAICheck(parcel)}
              className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/80 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Top Gat & Status Pill */}
              <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-mono text-xs font-extrabold text-[var(--text-primary)]">
                    {isMarathi ? parcel.gatNumberMr : parcel.gatNumber}
                  </span>
                </div>

                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  isOptimal 
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                }`}>
                  {isOptimal ? 'Optimal' : 'Action Req'}
                </span>
              </div>

              {/* Crop & Variety Details */}
              <div className="py-3 space-y-1.5">
                <h3 className="text-sm font-black text-[var(--text-primary)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {isMarathi ? profile.nameMr : isHindi ? profile.nameHi : parcel.cropName}
                </h3>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">
                  {parcel.variety}
                </p>

                <div className="pt-2 space-y-1 text-xs font-mono text-[var(--text-secondary)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[var(--text-muted)]">Area:</span>
                    <span className="font-bold text-[var(--text-primary)]">{parcel.areaAcres} Acres</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[var(--text-muted)]">Sown:</span>
                    <span className="font-bold text-[var(--text-primary)]">{daysOld} Days ago</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[var(--text-muted)]">Health:</span>
                    <span className={`font-bold ${profile.healthScore > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {profile.healthScore}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Trigger Prompt */}
              <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-extrabold group-hover:translate-x-0.5 transition-transform">
                <span className="flex items-center gap-1">
                  <Microscope className="w-3.5 h-3.5" />
                  {isMarathi ? 'AI मॉडेल विश्लेषण' : isHindi ? 'AI मॉडल विश्लेषण' : '6-AI Model Audit'}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CUSTOMIZE SOWN CROPS MODAL ── */}
      {isCustomizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl p-6 space-y-5 my-auto">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/30">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {isMarathi ? 'शेतकऱ्याची पिके व गट व्यवस्थापन' : isHindi ? 'किसान फसल व गट प्रबंधन' : 'Customize Sown Crops & Farm Parcels'}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    {isMarathi ? 'येथे आपण पेरलेले पीक, वाण, तारीख व एकर बदलू शकता.' : 'Edit what you have sown in each parcel. Saved directly to your device.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomizeModalOpen(false)}
                className="p-2 rounded-xl bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Editable Parcels */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {parcels.map((parcel) => (
                <div 
                  key={parcel.id} 
                  className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                        {parcel.gatNumber}
                      </span>
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {parcel.cropName}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                      {parcel.variety} · {parcel.areaAcres} Acres · Sown: {parcel.sowingDate}
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingParcel(parcel)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--border)] text-xs font-mono font-bold text-[var(--text-primary)] border border-[var(--border)] flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Edit</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Sub-form when editing a single parcel */}
            {editingParcel && (
              <form onSubmit={handleSaveParcelEdit} className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
                  <span>Editing {editingParcel.gatNumber}</span>
                  <button 
                    type="button" 
                    onClick={() => setEditingParcel(null)}
                    className="text-xs underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">Crop Type</label>
                    <select
                      value={editingParcel.cropKey}
                      onChange={(e) => {
                        const key = e.target.value;
                        const defaultP = DEFAULT_CROPS[key];
                        setEditingParcel({
                          ...editingParcel,
                          cropKey: key,
                          cropName: defaultP ? defaultP.name : key,
                          variety: defaultP ? defaultP.variety : editingParcel.variety,
                        });
                      }}
                      className="w-full p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]"
                    >
                      <option value="cotton">Bt Cotton (कपाशी)</option>
                      <option value="soybean">Soybean (सोयाबीन)</option>
                      <option value="tur">Pigeon Pea / Tur Dal (तूर)</option>
                      <option value="chana">Gram / Chickpea (हरभरा)</option>
                      <option value="onion">Onion (कांदा / प्याज)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">Seed Variety</label>
                    <input
                      type="text"
                      value={editingParcel.variety}
                      onChange={(e) => setEditingParcel({ ...editingParcel, variety: e.target.value })}
                      className="w-full p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">Area (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingParcel.areaAcres}
                      onChange={(e) => setEditingParcel({ ...editingParcel, areaAcres: parseFloat(e.target.value) || 1.0 })}
                      className="w-full p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[var(--text-muted)] mb-1">Sowing Date</label>
                    <input
                      type="date"
                      value={editingParcel.sowingDate}
                      onChange={(e) => setEditingParcel({ ...editingParcel, sowingDate: e.target.value })}
                      className="w-full p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}

            {/* Reset Defaults & Close Button Strip */}
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-2 rounded-xl text-xs font-mono text-[var(--text-muted)] hover:text-rose-500 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Village Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCustomizeModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6-AI MODEL ENSEMBLE MODAL ── */}
      {selectedCropProfile && (
        <CropAIAnalysisModal
          crop={selectedCropProfile}
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onLaunchSpray={() => {
            setIsAIModalOpen(false);
            setIsSprayModalOpen(true);
          }}
        />
      )}

      {/* ── 1-TAP QUICK SPRAY MODAL ── */}
      {isSprayModalOpen && (
        <QuickSprayModal
          isOpen={isSprayModalOpen}
          onClose={() => setIsSprayModalOpen(false)}
        />
      )}
    </div>
  );
}
