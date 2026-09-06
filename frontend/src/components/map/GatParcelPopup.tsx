'use client';
import React from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { FileText, Droplets, Sprout, ShieldCheck, X, Plane } from 'lucide-react';

export interface GatParcelData {
  gatNumber: string;
  subDivision: string;
  khataNumber: string;
  ownerName: string;
  areaAcres: number;
  areaGunthas: number;
  areaHa: number;
  cropType: string;
  soilType: string;
  irrigationType: string;
  ndviScore: number;
  healthStatus: 'healthy' | 'moderate' | 'stress';
  centerLng: number;
  centerLat: number;
}

interface GatParcelPopupProps {
  parcel: GatParcelData;
  onClose: () => void;
  onLaunchSpray?: (parcel: GatParcelData) => void;
}

export function GatParcelPopup({ parcel, onClose, onLaunchSpray }: GatParcelPopupProps) {
  const { t } = useTranslation();
  const { language } = useAppStore();

  return (
    <Popup
      longitude={parcel.centerLng}
      latitude={parcel.centerLat}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      className="z-50 custom-gat-popup"
      maxWidth="340px"
    >
      <div className="p-3 font-sans bg-[var(--surface)] text-[var(--text-primary)] rounded-2xl border border-[var(--border)] shadow-2xl">
        {/* Header: Official 7/12 Satbara Badge */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-[var(--accent)] border border-amber-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)] block leading-none">
                {language === 'mr' ? 'गाव नमुना ७/१२ अभिलेख' : language === 'hi' ? 'भू-अभिलेख खसरा ७/१२' : 'Cadastral 7/12 Record'}
              </span>
              <h4 className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                {language === 'mr' ? `गट क्रमांक ${parcel.gatNumber}` : language === 'hi' ? `खसरा संख्या ${parcel.gatNumber}` : `Gat Survey No. ${parcel.gatNumber}`}
              </h4>
            </div>
          </div>
        </div>

        {/* Parcel Details Grid */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between py-1 border-b border-[var(--border)]/60">
            <span className="text-[var(--text-muted)] font-mono">{language === 'mr' ? 'खातेदार नाव' : language === 'hi' ? 'खातेदार का नाम' : 'Owner'}:</span>
            <span className="font-bold text-[var(--text-primary)]">{parcel.ownerName}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-[var(--border)]/60">
            <span className="text-[var(--text-muted)] font-mono">{language === 'mr' ? 'एकूण क्षेत्र' : language === 'hi' ? 'कुल रकबा' : 'Area'}:</span>
            <span className="font-bold text-[var(--text-primary)]">
              {parcel.areaAcres} {language === 'mr' ? 'एकर' : language === 'hi' ? 'एकड़' : 'Acres'} {parcel.areaGunthas} {language === 'mr' ? 'गुंठे' : language === 'hi' ? 'गुंठा' : 'Gunthas'} ({parcel.areaHa} ha)
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-[var(--border)]/60">
            <span className="text-[var(--text-muted)] font-mono">{language === 'mr' ? 'हंगामी पीक' : language === 'hi' ? 'मौजूदा फसल' : 'Crop'}:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5" />
              {parcel.cropType}
            </span>
          </div>

          <div className="flex justify-between py-1 border-b border-[var(--border)]/60">
            <span className="text-[var(--text-muted)] font-mono">{language === 'mr' ? 'माती व सिंचन' : language === 'hi' ? 'मिट्टी व सिंचाई' : 'Soil & Water'}:</span>
            <span className="font-medium text-[var(--text-secondary)]">
              {parcel.soilType} · {parcel.irrigationType}
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-[var(--text-muted)] font-mono">NDVI Health:</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
              parcel.healthStatus === 'healthy'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
            }`}>
              {parcel.ndviScore} ({parcel.healthStatus === 'healthy' ? 'Normal' : 'Inspection Required'})
            </span>
          </div>
        </div>

        {/* 1-Tap Spray for this Parcel */}
        {onLaunchSpray && (
          <button
            onClick={() => onLaunchSpray(parcel)}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Plane className="w-3.5 h-3.5" />
            <span>
              {language === 'mr' ? `गट ${parcel.gatNumber} वर ड्रोन पाठवा` : language === 'hi' ? `खसरा ${parcel.gatNumber} पर ड्रोन भेजें` : `Deploy Drone to Gat ${parcel.gatNumber}`}
            </span>
          </button>
        )}
      </div>
    </Popup>
  );
}
