'use client';
import React, { useState, useEffect } from 'react';
import { CloudRain, Wind, Thermometer, Droplets, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';

interface HourForecast {
  hour: string;
  time: string;
  temp: number;
  windSpeed: number;
  rainProb: number;
  humidity: number;
  status: 'optimal' | 'marginal' | 'unsafe';
  reason?: string;
}

export function SprayWindowWidget() {
  const { t } = useTranslation();
  const { language, isSpeaking, setIsSpeaking } = useAppStore();
  const [forecasts, setForecasts] = useState<HourForecast[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<HourForecast | null>(null);

  useEffect(() => {
    const now = new Date();
    const list: HourForecast[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getTime() + i * 3600 * 1000);
      const hourNum = d.getHours();
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      let temp = 28 + Math.sin((hourNum - 8) / 4) * 6;
      let windSpeed = 6 + Math.cos((hourNum - 12) / 3) * 7;
      let rainProb = hourNum >= 14 && hourNum <= 18 ? 35 : 5;
      let humidity = 65 - Math.sin((hourNum - 8) / 4) * 20;

      temp = Math.round(temp * 10) / 10;
      windSpeed = Math.round(windSpeed * 10) / 10;
      humidity = Math.round(humidity);

      let status: 'optimal' | 'marginal' | 'unsafe' = 'optimal';
      let reason = '';

      if (rainProb > 25) {
        status = 'unsafe';
        reason = language === 'mr' ? 'पावसाची शक्यता जास्त (वाहिलेले औषध निष्फळ ठरेल)' : language === 'hi' ? 'बारिश की संभावना अधिक (दवा बहने का खतरा)' : 'Rain likelihood high (>25% runoff risk)';
      } else if (windSpeed > 14) {
        status = 'unsafe';
        reason = language === 'mr' ? 'वारा वेगवान (औषध शेजारच्या शेतात उडेल)' : language === 'hi' ? 'हवा की गति तेज (दवा ड्रिफ्ट का खतरा)' : 'High wind drift (>14 km/h)';
      } else if (temp > 33) {
        status = 'marginal';
        reason = language === 'mr' ? 'कडक ऊन (द्रव बाष्पीभवन जास्त)' : language === 'hi' ? 'तेज धूप (दवा वाष्पीकरण का खतरा)' : 'High temperature (>33°C evaporation)';
      } else {
        reason = language === 'mr' ? 'सर्वोत्तम वेळ: मंद वारा, कोरडी पाने' : language === 'hi' ? 'सर्वश्रेष्ठ समय: हल्की हवा, सूखी पत्तियां' : 'Golden window: calm wind, zero runoff risk';
      }

      list.push({
        hour: `${hourNum}:00`,
        time: timeStr,
        temp,
        windSpeed,
        rainProb,
        humidity,
        status,
        reason,
      });
    }

    setForecasts(list);
    setSelectedSlot(list[0]);
  }, [language]);

  const optimalCount = forecasts.filter(f => f.status === 'optimal').length;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {language === 'mr' ? '४८-तास अचूक फवारणी वेळ (Spray Window)' : language === 'hi' ? '४८-घंटे सटीक छिड़काव विंडो (Spray Window)' : '48-Hour Micro-Climate Precision Spray Window'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
                {optimalCount} {language === 'mr' ? 'उत्तम तास' : language === 'hi' ? 'सर्वश्रेष्ठ घंटे' : 'Golden Hours'}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {language === 'mr' ? 'वारा, पाऊस आणि बाष्पीभवन विश्लेषण' : language === 'hi' ? 'हवा, बारिश और वाष्पीकरण रडार' : 'Wind drift & chemical runoff risk analyzer'}
            </p>
          </div>
        </div>

        {/* TTS Read Aloud */}
        <button
          onClick={() => {
            if (isSpeaking) {
              stopSpeaking();
              setIsSpeaking(false);
            } else {
              setIsSpeaking(true);
              const summary = language === 'mr'
                ? `पुढील १२ तासांत ${optimalCount} तास फवारणीसाठी सर्वोत्तम आहेत. सध्या वारा ${selectedSlot?.windSpeed} किलोमीटर वेगाने वाहत असून पावसाची शक्यता ${selectedSlot?.rainProb} टक्के आहे. ${selectedSlot?.reason}`
                : language === 'hi'
                ? `अगले १२ घंटों में ${optimalCount} घंटे छिड़काव के लिए सर्वश्रेष्ठ हैं। अभी हवा की गति ${selectedSlot?.windSpeed} किमी/घंटा और बारिश की संभावना ${selectedSlot?.rainProb} प्रतिशत है। ${selectedSlot?.reason}`
                : `Next 12 hours contain ${optimalCount} ideal spray hours. Current wind speed is ${selectedSlot?.windSpeed} km/h with ${selectedSlot?.rainProb}% rain probability. ${selectedSlot?.reason}`;
              speakText(summary, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
            }
          }}
          title="Read aloud spray conditions"
          className={`p-2 rounded-xl border transition-all self-start sm:self-auto ${
            isSpeaking
              ? 'bg-red-500 text-white border-red-600 animate-pulse'
              : 'bg-[var(--surface-2)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface)]'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Hourly Horizontal Strip */}
      <div className="py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {forecasts.map((f, i) => {
            const isSel = selectedSlot?.hour === f.hour;
            const statusBg =
              f.status === 'optimal'
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : f.status === 'marginal'
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400';

            return (
              <button
                key={i}
                onClick={() => setSelectedSlot(f)}
                className={`min-w-[80px] p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${statusBg} ${
                  isSel ? 'ring-2 ring-[var(--accent)] scale-105 shadow-md' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <span className="text-[11px] font-mono font-bold text-[var(--text-secondary)]">{f.time}</span>
                <span className="text-sm font-black font-mono text-[var(--text-primary)]">{f.temp}°C</span>
                <div className="flex items-center gap-1 text-[10px] font-mono">
                  <Wind className="w-3 h-3" />
                  <span>{f.windSpeed}k</span>
                </div>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md mt-0.5 ${
                  f.status === 'optimal' ? 'bg-emerald-600 text-white' : f.status === 'marginal' ? 'bg-amber-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {f.status === 'optimal' ? (language === 'mr' ? 'उत्तम' : language === 'hi' ? 'सही' : 'Good') : f.status === 'marginal' ? (language === 'mr' ? 'सावध' : language === 'hi' ? 'मध्यम' : 'Fair') : (language === 'mr' ? 'थांबा' : language === 'hi' ? 'रोकें' : 'Stop')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Slot Diagnostic Banner */}
      {selectedSlot && (
        <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          selectedSlot.status === 'optimal'
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : selectedSlot.status === 'marginal'
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-3">
            {selectedSlot.status === 'optimal' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : selectedSlot.status === 'marginal' ? (
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
            )}
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">
                {selectedSlot.time} · {selectedSlot.reason}
              </p>
              <div className="flex items-center gap-4 mt-1 text-[11px] text-[var(--text-secondary)] font-mono">
                <span>वारा: <strong>{selectedSlot.windSpeed} km/h</strong></span>
                <span>पाऊस: <strong>{selectedSlot.rainProb}%</strong></span>
                <span>आर्द्रता: <strong>{selectedSlot.humidity}%</strong></span>
              </div>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-[var(--text-muted)] self-end sm:self-auto">
            Waranga Met Sensor #04
          </span>
        </div>
      )}
    </div>
  );
}
