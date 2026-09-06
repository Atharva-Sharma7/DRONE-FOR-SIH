'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
  Radio,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  Volume2,
  VolumeX,
  ListOrdered
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { SidebarDirectoryModal, SIDEBAR_PRIORITY_ITEMS } from './SidebarDirectoryModal';
import { speakText, stopSpeaking } from '@/lib/speech';

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { language, sidebarExpanded, toggleSidebarExpanded, isSpeaking, setIsSpeaking } = useAppStore();
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);

  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  const handleSpeakNames = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    let speechText = '';
    if (isMarathi) {
      speechText = "साइडबारमधील प्राधान्यक्रमाने सर्व पर्याय: " +
        "१: मुख्य डॅशबोर्ड. २: शेत नकाशा व सातबारा. ३: पीक वाढ व प्रगती आलेख. ४: थेट ड्रोन कॅमेरा. " +
        "५: पीक डॉक्टर व पान तपासणी. ६: रोग शोध व फवारणी. ७: किसान रक्षक. ८: बाजार भाव मंडी. " +
        "९: वनस्पती आरोग्य विश्लेषण. १०: ३D लिडार. ११: सरकारी योजना व विमा. १२: ड्रोन मोहिमा. १३: सेटिंग्ज.";
    } else if (isHindi) {
      speechText = "साइडबार के मुख्य विकल्प: " +
        "१: मुख्य डैशबोर्ड. २: खेत नक्शा व सातबारा. ३: फसल प्रगति चार्ट. ४: लाइव ड्रोन कैमरा. " +
        "५: क्रॉप डॉक्टर. ६: रोग पहचान. ७: किसान रक्षक. ८: मंडी भाव. " +
        "९: पौधा स्वास्थ्य विश्लेषण. १०: ३D लिडार. ११: सरकारी योजना. १२: ड्रोन मिशन. १३: सेटिंग्स.";
    } else {
      speechText = "Sidebar options by priority: " +
        "1: Dashboard. 2: Farm Map. 3: Crop Progress. 4: Live Drone Vision. " +
        "5: Crop Doctor. 6: Disease Detections. 7: Kisan Rakshak. 8: Mandi Bhav. " +
        "9: Plant Health Analytics. 10: 3D LiDAR. 11: Yojna and Claims. 12: Drone Missions. 13: Settings.";
    }

    setIsSpeaking(true);
    speakText(speechText, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 bottom-0 z-30 flex flex-col transition-all duration-300 ease-in-out font-sans ${
          sidebarExpanded ? 'w-64' : 'w-16'
        }`}
        style={{
          backgroundColor: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          boxShadow: sidebarExpanded ? '4px 0 24px rgba(0,0,0,0.18)' : 'none',
        }}
      >
        {/* Top Header: Drone Icon + Toggle Expand Button */}
        <div className="h-16 flex items-center justify-between px-3 border-b border-[var(--border)] shrink-0 bg-[var(--surface-2)]/40">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <DroneIconMark />
            {sidebarExpanded && (
              <div className="animate-fade-in truncate">
                <span className="font-mono font-black text-sm text-[var(--accent)] tracking-wider block">
                  AGRIDRONE
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono block -mt-0.5">
                  Waranga Autonomous
                </span>
              </div>
            )}
          </div>

          {/* Toggle Expand / Collapse Button (Always visible) */}
          <button
            onClick={toggleSidebarExpanded}
            title={sidebarExpanded ? (isMarathi ? 'मेनू लहान करा' : 'Collapse Sidebar') : (isMarathi ? 'सर्व नावे दाखवा' : isHindi ? 'सभी नाम दिखाएं' : 'Expand Sidebar Names')}
            className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all cursor-pointer shadow-sm active:scale-95"
            aria-label="Toggle Sidebar Names"
          >
            {sidebarExpanded ? (
              <PanelLeftClose className="w-4 h-4 text-[var(--accent)]" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-[var(--accent)]" />
            )}
          </button>
        </div>

        {/* Quick Directory Button & Voice Speaker Strip */}
        <div className="px-2 py-2 border-b border-[var(--border)] bg-[var(--surface-2)]/20 flex items-center justify-between gap-1">
          {/* Button to get all option names in a popup list */}
          <button
            onClick={() => setIsDirectoryOpen(true)}
            title={isMarathi ? 'सर्व पर्यायांची नावे व यादी पहा' : isHindi ? 'सभी विकल्पों के नाम देखें' : 'View All Option Names (Directory)'}
            className={`w-full py-1.5 px-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              sidebarExpanded
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500 hover:text-black'
                : 'bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--accent)]'
            }`}
          >
            <ListOrdered className="w-4 h-4 shrink-0 text-[var(--accent)]" />
            {sidebarExpanded && (
              <span className="truncate">
                {isMarathi ? '📋 सर्व पर्यायांची नावे' : isHindi ? '📋 सभी विकल्पों के नाम' : '📋 All Options Directory'}
              </span>
            )}
          </button>

          {/* Voice Read-Aloud Button for Illiterate Farmers */}
          {sidebarExpanded && (
            <button
              onClick={handleSpeakNames}
              title={isMarathi ? 'सर्व नावे ऐका' : 'Listen All Names'}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isSpeaking
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                  : 'bg-[var(--surface)] hover:bg-emerald-600 hover:text-white text-[var(--text-muted)] border-[var(--border)]'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Prioritized Nav Items List */}
        <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto custom-scrollbar">
          {SIDEBAR_PRIORITY_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            const titleText = isMarathi ? item.title.mr : isHindi ? item.title.hi : item.title.en;

            // Show category header in expanded mode when transitioning categories
            const showCategoryHeader = sidebarExpanded && (
              index === 0 || SIDEBAR_PRIORITY_ITEMS[index - 1].category !== item.category
            );

            return (
              <React.Fragment key={item.id}>
                {showCategoryHeader && (
                  <div className="pt-3 pb-1 px-2.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] border-t border-[var(--border)]/60 first:border-t-0 first:pt-1">
                    {isMarathi ? item.categoryLabel.mr : isHindi ? item.categoryLabel.hi : item.categoryLabel.en}
                  </div>
                )}

                <Link
                  href={item.href}
                  title={`${item.priority}. ${titleText}`}
                  className={`
                    relative flex items-center rounded-xl transition-all duration-150 group cursor-pointer
                    ${sidebarExpanded ? 'px-3 py-2 gap-3 justify-start' : 'w-11 h-11 mx-auto justify-center'}
                    ${ active
                      ? 'bg-amber-500/15 text-[var(--accent)] font-bold shadow-sm border border-amber-500/40 dark:bg-amber-500/20'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] border border-transparent'
                    }
                  `}
                >
                  {/* Left Active Accent Indicator */}
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-md bg-[var(--accent)]"
                    />
                  )}

                  {/* Priority Number Pill in Expanded View */}
                  {sidebarExpanded && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ${
                      active ? 'bg-[var(--accent)] text-black font-extrabold' : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
                    }`}>
                      #{item.priority}
                    </span>
                  )}

                  {/* Icon */}
                  <Icon className="w-5 h-5 shrink-0" strokeWidth={active ? 2.2 : 1.8} />

                  {/* Full Name in Expanded View */}
                  {sidebarExpanded && (
                    <div className="flex-1 truncate">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate text-[var(--text-primary)]">
                          {titleText}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono font-extrabold rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Floating Tooltip in Collapsed View */}
                  {!sidebarExpanded && (
                    <span className="absolute left-16 px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl font-sans flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[var(--accent)]">#{item.priority}</span>
                      <span>{titleText}</span>
                    </span>
                  )}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Bottom Status / RTK Indicator */}
        <div className="p-2 border-t border-[var(--border)] bg-[var(--surface-2)]/30 flex items-center justify-between">
          <div className="flex items-center gap-2 px-2 py-1">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
            {sidebarExpanded && (
              <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold truncate">
                RTK FIXED · 20.55°N
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Complete Sidebar Directory Modal */}
      <SidebarDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
      />
    </>
  );
}

function DroneIconMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#FBBF24" />
      <line x1="12" y1="12" x2="4"  y2="4"  stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="12" x2="20" y2="4"  stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="12" x2="4"  y2="20" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="12" x2="20" y2="20" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4"  cy="4"  r="2.5" fill="#22C55E" />
      <circle cx="20" cy="4"  r="2.5" fill="#FBBF24" />
      <circle cx="4"  cy="20" r="2.5" fill="#FBBF24" />
      <circle cx="20" cy="20" r="2.5" fill="#22C55E" />
    </svg>
  );
}
