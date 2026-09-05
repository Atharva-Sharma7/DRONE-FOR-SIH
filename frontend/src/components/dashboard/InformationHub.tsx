'use client';
import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ShieldAlert, ChevronRight, Bell, Volume2, VolumeX, Plane } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';
import { QuickSprayModal } from '@/components/farmer/QuickSprayModal';

type InfoCategory = 'all' | 'critical' | 'agronomic' | 'soil' | 'drone';

interface BulletinDef {
  id: string;
  itemKey: 'crit1' | 'crit2' | 'agro1' | 'agro2' | 'soil1' | 'drone1';
  category: 'critical' | 'agronomic' | 'soil' | 'drone';
  isCritical: boolean;
  defaultTitle: string;
  defaultLocation: string;
  defaultDescription: string;
  defaultAction: string;
  defaultTimestamp: string;
}

const BULLETIN_DEFS: BulletinDef[] = [
  {
    id: 'crit-1',
    itemKey: 'crit1',
    category: 'critical',
    isCritical: true,
    defaultTitle: 'Severe Charcoal Rot Detected In Soybean East Field',
    defaultLocation: 'Sector B-3 · Waranga Farmland East',
    defaultDescription: 'Hyperspectral and RGB analysis identified fungal mycelium infection (Macrophomina phaseolina) affecting 1.4 hectares of soybean canopy.',
    defaultAction: 'Immediate spot-application of Trichoderma viride bio-fungicide within 24 hours. Isolate drainage runoff to adjacent cotton plots.',
    defaultTimestamp: '14 Mins Ago',
  },
  {
    id: 'crit-2',
    itemKey: 'crit2',
    category: 'critical',
    isCritical: true,
    defaultTitle: 'High Elevation Water Pooling Depression Risk',
    defaultLocation: 'Sector N-1 · Cotton North Field',
    defaultDescription: 'LiDAR elevation DEM revealed a 1.2m contour depression collecting heavy rainwater. High susceptibility to root asphyxiation.',
    defaultAction: 'Dispatch field labor to cut surface drainage trench towards South-East drainage line.',
    defaultTimestamp: '42 Mins Ago',
  },
  {
    id: 'agro-1',
    itemKey: 'agro1',
    category: 'agronomic',
    isCritical: false,
    defaultTitle: 'Target Spot Foliar Fungus Emerging In Cotton Canopy',
    defaultLocation: 'Sector N-2 · Cotton North Field',
    defaultDescription: 'Multispectral Red-Edge index dropped to 0.41, indicating Corynespora cassiicola spore concentration on lower foliage.',
    defaultAction: 'Prepare Azoxystrobin + Difenoconazole spray mixture for scheduled drone precision payload flight.',
    defaultTimestamp: '2 Hours Ago',
  },
  {
    id: 'agro-2',
    itemKey: 'agro2',
    category: 'agronomic',
    isCritical: false,
    defaultTitle: 'Yellow Mosaic Disease Vector Whitefly Concentration',
    defaultLocation: 'Sector S-1 · Mixed South Parcel',
    defaultDescription: 'Optical AI cameras detected Bemisia tabaci whitefly clusters on soybean leaf underside at threshold density.',
    defaultAction: 'Install yellow sticky traps and initiate neem oil preventive spray.',
    defaultTimestamp: '3 Hours Ago',
  },
  {
    id: 'soil-1',
    itemKey: 'soil1',
    category: 'soil',
    isCritical: false,
    defaultTitle: 'Soil Moisture Level Dropping Below 28% VWC',
    defaultLocation: 'Station 02 · Soybean East Plot',
    defaultDescription: 'Ground IoT probe records Volumetric Water Content at 27.8% VWC. Vertisol cracking beginning on surface soil.',
    defaultAction: 'Schedule drip irrigation cycle for 45 minutes during evening low-evaporation window.',
    defaultTimestamp: '5 Hours Ago',
  },
  {
    id: 'drone-1',
    itemKey: 'drone1',
    category: 'drone',
    isCritical: false,
    defaultTitle: 'Raspberry Pi 5 Edge AI Hailo-8 NPU Engine Calibrated',
    defaultLocation: 'AgriHawk-X8 UAS · Onboard Hardware',
    defaultDescription: 'All 4 vision pipelines (4K RGB, RedEdge Multispectral, TIR Thermal, Hyperspectral) synchronized at 38 FPS with 1.2cm RTK fix.',
    defaultAction: 'Drone battery bank charged to 100%. Ready for next automated flight mission.',
    defaultTimestamp: '1 Hour Ago',
  },
];

export function InformationHub() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const [activeTab, setActiveTab] = useState<InfoCategory>('all');
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);
  const [speakingItemId, setSpeakingItemId] = useState<string | null>(null);
  const [sprayModalData, setSprayModalData] = useState<{
    isOpen: boolean;
    targetField: string;
    targetDisease: string;
    recommendedMedicine: string;
  }>({
    isOpen: false,
    targetField: '',
    targetDisease: '',
    recommendedMedicine: '',
  });

  const criticalCount = BULLETIN_DEFS.filter(b => b.isCritical).length;

  const filteredItems = BULLETIN_DEFS.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'critical') return item.isCritical;
    return item.category === activeTab;
  });

  const toggleAcknowledge = (id: string) => {
    setAcknowledgedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSpeakItem = (id: string, title: string, action: string) => {
    if (speakingItemId === id) {
      stopSpeaking();
      setSpeakingItemId(null);
    } else {
      setSpeakingItemId(id);
      const textToSpeak = `${title}. ${action}`;
      speakText(
        textToSpeak,
        language,
        () => setSpeakingItemId(id),
        () => setSpeakingItemId(null)
      );
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm font-sans transition-colors">
      {/* Header with Title Case */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-[var(--accent)] border border-amber-500/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-wide">
              {t('infoHub.title')}
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
              {t('infoHub.subtitle')}
            </p>
          </div>
        </div>

        {/* Live Critical Indicator Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-mono font-bold animate-pulse self-start sm:self-auto">
          <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span>{criticalCount} {t('infoHub.criticalWarnings')}</span>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-4 pb-4 border-b border-[var(--border)] text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'all'
              ? 'bg-[var(--text-primary)] text-[var(--surface)] shadow-md font-bold'
              : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {t('infoHub.all')} ({BULLETIN_DEFS.length})
        </button>

        <button
          onClick={() => setActiveTab('critical')}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
            activeTab === 'critical'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
              : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/20'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{t('infoHub.critical')} ({criticalCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('agronomic')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'agronomic'
              ? 'bg-[var(--text-primary)] text-[var(--surface)] shadow-md font-bold'
              : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {t('infoHub.agronomic')}
        </button>

        <button
          onClick={() => setActiveTab('soil')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'soil'
              ? 'bg-[var(--text-primary)] text-[var(--surface)] shadow-md font-bold'
              : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {t('infoHub.soil')}
        </button>

        <button
          onClick={() => setActiveTab('drone')}
          className={`px-3.5 py-2 rounded-xl transition-all ${
            activeTab === 'drone'
              ? 'bg-[var(--text-primary)] text-[var(--surface)] shadow-md font-bold'
              : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {t('infoHub.drone')}
        </button>
      </div>

      {/* Bulletins List */}
      <div className="space-y-3.5 pt-4">
        {filteredItems.map((item) => {
          const isAck = acknowledgedIds.includes(item.id);
          const k = item.itemKey;

          // Fetch dynamic translations with fallback to item defaults
          const itemTitle = t(`infoHub.items.${k}.title`, { defaultValue: item.defaultTitle });
          const itemLoc = t(`infoHub.items.${k}.location`, { defaultValue: item.defaultLocation });
          const itemDesc = t(`infoHub.items.${k}.description`, { defaultValue: item.defaultDescription });
          const itemAction = t(`infoHub.items.${k}.action`, { defaultValue: item.defaultAction });
          const itemTime = t(`infoHub.items.${k}.timestamp`, { defaultValue: item.defaultTimestamp });

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                item.isCritical
                  ? 'bg-red-500/5 dark:bg-red-950/20 border-red-500/50 hover:border-red-500'
                  : 'bg-[var(--surface-2)]/60 border-[var(--border)] hover:border-[var(--accent)]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.isCritical ? (
                      <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-mono font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-sm">
                        <AlertCircle className="w-3 h-3" />
                        {t('infoHub.actionRequired')}
                      </span>
                    ) : item.category === 'agronomic' ? (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-mono font-bold uppercase">
                        {t('infoHub.cropProtection', { defaultValue: 'Crop Protection' })}
                      </span>
                    ) : item.category === 'soil' ? (
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] font-mono font-bold uppercase">
                        {t('infoHub.soilNotice', { defaultValue: 'Soil Sensor Notice' })}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold uppercase">
                        {t('infoHub.rpiEdge', { defaultValue: 'Raspberry Pi 5 Edge' })}
                      </span>
                    )}

                    <h3 className={`text-sm font-bold ${
                      item.isCritical ? 'text-red-700 dark:text-red-400 font-extrabold' : 'text-[var(--text-primary)]'
                    }`}>
                      {itemTitle}
                    </h3>
                  </div>

                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    {itemLoc} • <span className="text-[var(--accent)] font-semibold">{itemTime}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start flex-wrap mt-2 md:mt-0">
                  {/* Voice Listen Button for Illiterate Farmers */}
                  <button
                    onClick={() => handleSpeakItem(item.id, itemTitle, itemAction)}
                    title="Listen to this advisory read aloud"
                    className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 shadow-sm ${
                      speakingItemId === item.id
                        ? 'bg-red-500 text-white border-red-600 animate-pulse'
                        : 'bg-[var(--accent)] text-black border-[var(--accent)] hover:bg-amber-500'
                    }`}
                  >
                    {speakingItemId === item.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>{t('topbar.stopSpeaking', { defaultValue: 'Stop' })}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{t('infoHub.listen', { defaultValue: 'Listen' })}</span>
                      </>
                    )}
                  </button>

                  {/* 1-Tap Quick Drone Spray Dispatcher */}
                  {(item.category === 'critical' || item.category === 'agronomic') && (
                    <button
                      onClick={() => setSprayModalData({
                        isOpen: true,
                        targetField: itemLoc,
                        targetDisease: itemTitle,
                        recommendedMedicine: itemAction,
                      })}
                      className="text-[11px] font-mono font-bold px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 active:scale-95"
                    >
                      <Plane className="w-3.5 h-3.5" />
                      <span>{t('infoHub.quickSpray', { defaultValue: '1-Tap Spray' })}</span>
                    </button>
                  )}

                  {/* Acknowledge Button */}
                  <button
                    onClick={() => toggleAcknowledge(item.id)}
                    className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                      isAck
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
                        : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-primary)]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAck ? t('infoHub.acknowledged') : t('infoHub.acknowledge')}</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2 font-medium">
                {itemDesc}
              </p>

              <div className={`mt-3 p-3 rounded-lg flex items-start gap-2.5 text-xs font-sans ${
                item.isCritical
                  ? 'bg-red-600/10 border border-red-600/30 text-red-800 dark:text-red-300 font-semibold'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]'
              }`}>
                <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${item.isCritical ? 'text-red-600' : 'text-[var(--accent)]'}`} />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] block font-mono text-[var(--text-muted)]">
                    {t('infoHub.recommendedAction')}:
                  </span>
                  <span>{itemAction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 1-Tap Spray Dispatch Modal */}
      <QuickSprayModal
        isOpen={sprayModalData.isOpen}
        onClose={() => setSprayModalData(prev => ({ ...prev, isOpen: false }))}
        targetField={sprayModalData.targetField}
        targetDisease={sprayModalData.targetDisease}
        recommendedMedicine={sprayModalData.recommendedMedicine}
      />
    </div>
  );
}
