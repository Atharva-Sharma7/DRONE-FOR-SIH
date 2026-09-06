'use client';
import React, { useState } from 'react';
import { Award, FileText, Download, CheckCircle2, ShieldCheck, Printer, AlertTriangle, Sparkles, Volume2, VolumeX, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';

export default function YojnaPage() {
  const { t } = useTranslation();
  const { language, isSpeaking, setIsSpeaking } = useAppStore();
  const [showCertificate, setShowCertificate] = useState(false);

  const SCHEMES = [
    {
      id: 'smam-drone',
      title: language === 'mr' ? 'SMAM किसान ड्रोन अनुदान योजना (५०% ते १००%)' : language === 'hi' ? 'SMAM किसान ड्रोन सब्सिडी योजना (५०% से १००%)' : 'Sub-Mission on Agricultural Mechanization (SMAM) Drone Subsidy',
      subsidy: language === 'mr' ? '₹५ लाख पर्यंत ५०% अनुदान (FPO/SC/ST/महिलांसाठी ७५-१००%)' : language === 'hi' ? '₹५ लाख तक ५०% सब्सिडी (FPO/SC/ST/महिला किसानों के लिए ७५-१००%)' : 'Up to 50% (₹5 Lakhs) for Individual Farmers, 75-100% for FPOs/CHCs',
      eligibility: language === 'mr' ? '७/१२ उतारा, आधार कार्ड, बँक खाते व शेतकरी ओळखपत्र' : language === 'hi' ? '७/१२ खतौनी, आधार कार्ड, बैंक पासबुक एवं किसान कार्ड' : '7/12 Satbara Land Record, Aadhaar, Bank Passbook',
      portal: 'mahadbt.maharashtra.gov.in / agrimachinery.nic.in',
      tag: 'Subsidy 50%'
    },
    {
      id: 'pmfby-claim',
      title: language === 'mr' ? 'प्रधानमंत्री पीक विमा योजना (PMFBY) ड्रोन क्लेम' : language === 'hi' ? 'प्रधानमंत्री फसल बीमा योजना (PMFBY) ड्रोन क्लेम' : 'PM Fasal Bima Yojna (PMFBY) Drone Damage Settlement',
      subsidy: language === 'mr' ? 'ड्रोन NDVI पुराव्यासह ७२ तासांत जलद भरपाई' : language === 'hi' ? 'ड्रोन NDVI साक्ष्य के साथ ७२ घंटों में त्वरित मुआवजा' : 'Fast-track Insurance Claim Settlement with Drone Geo-tagged Evidence',
      eligibility: language === 'mr' ? 'नुकसानीनंतर ७२ तासांत इंटिमेशन व ड्रोन अहवाल' : language === 'hi' ? 'नुकसान के ७२ घंटे के भीतर सूचना और ड्रोन रिपोर्ट' : 'Crop damage report within 72 hrs of calamity/disease',
      portal: 'pmfby.gov.in',
      tag: 'Insurance 100%'
    },
    {
      id: 'nanaji-deshmukh',
      title: language === 'mr' ? 'नानाजी देशमुख कृषी संजीवनी प्रकल्प (PoCRA)' : language === 'hi' ? 'नानाजी देशमुख कृषि संजीवनी परियोजना (PoCRA)' : 'Nanaji Deshmukh Krishi Sanjeevani Project (PoCRA Vidarbha)',
      subsidy: language === 'mr' ? 'विदर्भातील दुष्काळ व हवामान बदलावर मात करण्यासाठी सूक्ष्म सिंचन व ड्रोन अर्थसहाय्य' : language === 'hi' ? 'विदर्भ के किसानों के लिए जलवायु अनुकूल कृषि व ड्रोन तकनीक हेतु अनुदान' : 'Climate-resilient precision agriculture assistance in Vidarbha',
      eligibility: language === 'mr' ? 'विदर्भ-मराठवाड्यातील निवडक गावे (वारंगा समाविष्ट)' : language === 'hi' ? 'विदर्भ-मराठवाड़ा के चयनित गांव (वारंगा शामिल)' : 'Vidarbha drought-affected clusters (Waranga covered)',
      portal: 'dbt.mahapocra.gov.in',
      tag: 'Vidarbha Special'
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-7 pb-16 font-sans">
      {/* Top Header */}
      <div className="rounded-3xl border-2 border-amber-500/30 bg-amber-500/10 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-mono font-extrabold uppercase">
                Government Schemes
              </span>
              <span className="text-xs font-mono text-amber-700 dark:text-amber-300 font-bold">
                {language === 'mr' ? 'सरकारी योजना व विमा नुकसान भरपाई' : language === 'hi' ? 'सरकारी योजनाएं व फसल बीमा क्लेम' : 'Subsidies & Official Insurance Proof'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] mt-1">
              {language === 'mr' ? 'किसान योजना केंद्र व अधिकृत ड्रोन नुकसान प्रमाणपत्र' : language === 'hi' ? 'किसान योजना केंद्र व आधिकारिक ड्रोन क्षति प्रमाण पत्र' : 'Kisan Scheme Portal & Drone Damage Certificate'}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
              {language === 'mr' ? '५०% ड्रोन अनुदान मिळवा आणि पीक विम्यासाठी जिओ-टॅग केलेला पंचनामा एका क्लिकवर डाऊनलोड करा' : language === 'hi' ? '५०% ड्रोन सब्सिडी पाएं और फसल बीमा के लिए जियो-टैग्ड पंचनामा एक क्लिक में डाउनलोड करें' : 'Get 50% drone subsidy & generate official geo-tagged crop damage certificate for PMFBY claims'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isSpeaking) {
              stopSpeaking();
              setIsSpeaking(false);
            } else {
              setIsSpeaking(true);
              const text = language === 'mr'
                ? 'किसान योजना केंद्रात आपले स्वागत आहे. येथे आपण ५० टक्के ड्रोन अनुदान आणि प्रधानमंत्री पीक विमा योजनेसाठी अधिकृत ड्रोन पंचनामा प्रमाणपत्र मिळवू शकता.'
                : language === 'hi'
                ? 'किसान योजना केंद्र में आपका स्वागत है। यहां आप ५० प्रतिशत ड्रोन सब्सिडी और प्रधानमंत्री फसल बीमा योजना के लिए आधिकारिक क्षति प्रमाण पत्र प्राप्त कर सकते हैं।'
                : 'Welcome to Kisan Scheme Center. Access 50% drone subsidies and generate official crop damage certificates for PM Fasal Bima claims.';
              speakText(text, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
            }
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-95 ${
            isSpeaking ? 'bg-red-500 text-white animate-pulse' : 'bg-[var(--accent)] text-black hover:bg-amber-500'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          <span>{language === 'mr' ? 'योजनांची माहिती ऐका' : language === 'hi' ? 'योजनाओं की जानकारी सुनें' : 'Read Info'}</span>
        </button>
      </div>

      {/* Government Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SCHEMES.map(s => (
          <div
            key={s.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {s.tag}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">Verified</span>
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] mt-2 leading-snug">
                {s.title}
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">
                {s.subsidy}
              </p>
              <div className="mt-3 p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[11px] text-[var(--text-secondary)]">
                <span className="font-bold text-[var(--text-primary)] block font-mono text-[10px] uppercase">
                  {language === 'mr' ? 'कागदपत्रे / पात्रता:' : language === 'hi' ? 'दस्तावेज / पात्रता:' : 'Required Documents:'}
                </span>
                {s.eligibility}
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs">
              <span className="font-mono text-[11px] text-[var(--text-muted)] truncate max-w-[150px]">
                {s.portal}
              </span>
              <a
                href={`https://${s.portal.split(' ')[0]}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-bold text-[var(--accent)] hover:underline"
              >
                <span>{language === 'mr' ? 'अर्ज करा' : language === 'hi' ? 'आवेदन करें' : 'Apply'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Official PMFBY Drone Crop Damage Certificate Generator */}
      <div className="rounded-2xl border-2 border-emerald-500/40 bg-[var(--surface)] p-6 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-black text-[var(--text-primary)]">
                {language === 'mr' ? 'अधिकृत ड्रोन पीक पंचनामा व नुकसान प्रमाणपत्र (PMFBY Claim Proof)' : language === 'hi' ? 'आधिकारिक ड्रोन फसल पंचनामा व क्षति प्रमाण पत्र' : 'Official Drone Crop Damage & Loss Certificate (PMFBY Ready)'}
              </h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              {language === 'mr' ? 'विमा कंपनी व कृषी विभागासाठी ७/१२ गट क्रमांक व जिओ-टॅग्ड NDVI सह अधिकृत दस्तऐवज' : language === 'hi' ? 'बीमा कंपनी एवं कृषि विभाग के लिए ७/१२ खतौनी और जियो-टैग्ड साक्ष्य के साथ अधिकृत पत्र' : 'Legally valid drone survey certificate with Gat parcel number, GPS timestamp, and NDVI loss index'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCertificate(!showCertificate)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs font-bold transition-all text-[var(--text-primary)]"
            >
              <FileText className="w-4 h-4" />
              <span>{showCertificate ? (language === 'mr' ? 'लपवा' : language === 'hi' ? 'छिपाएं' : 'Hide') : (language === 'mr' ? 'प्रमाणपत्र पूर्वावलोकन' : language === 'hi' ? 'प्रमाण पत्र देखें' : 'Preview Certificate')}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'mr' ? 'प्रिंट / PDF डाऊनलोड' : language === 'hi' ? 'प्रिंट / PDF' : 'Print / Export PDF'}</span>
            </button>
          </div>
        </div>

        {/* Certificate Render (Printable Document) */}
        {showCertificate && (
          <div id="drone-certificate" className="p-8 rounded-2xl bg-white text-black border-2 border-neutral-300 font-serif shadow-lg space-y-6">
            {/* Gov Header */}
            <div className="text-center border-b-2 border-black pb-4">
              <span className="text-[11px] font-mono tracking-widest uppercase font-bold text-neutral-600">
                GOVERNMENT OF MAHARASHTRA · DEPARTMENT OF AGRICULTURE
              </span>
              <h1 className="text-xl font-bold uppercase mt-1">
                Kisan Drone Agricultural Loss Assessment & Survey Certificate
              </h1>
              <p className="text-xs text-neutral-600 font-sans mt-0.5">
                Issued under Pradhan Mantri Fasal Bima Yojna (PMFBY) & Smart Agriculture Drone Mission
              </p>
            </div>

            {/* Meta Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans border-b pb-4">
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Certificate ID</span>
                <span className="font-mono font-bold">MH-NGP-2026-DRN-0941</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Survey Date & Time</span>
                <span className="font-mono font-bold">06-Sep-2026 10:14 IST</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Drone Flight ID</span>
                <span className="font-mono font-bold">MSN-WAR-2026-04</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase">Drone System</span>
                <span className="font-mono font-bold">Kisan-Quad RTK (RPi 5)</span>
              </div>
            </div>

            {/* Farmer & Land Details */}
            <div className="space-y-2 font-sans text-xs">
              <h3 className="font-bold text-sm uppercase text-neutral-800 border-b pb-1">1. Landholder & Cadastral Parcel Particulars</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Farmer Name:</span>
                  <span className="font-bold">Ramesh Narayan Patil (रमेश नारायण पाटील)</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">7/12 Gat Survey No:</span>
                  <span className="font-bold">Gat No. 142/A (गट क्र. १४२/अ)</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Village & Taluka:</span>
                  <span className="font-bold">Waranga, Hingna, Dist. Nagpur</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Total Holding:</span>
                  <span className="font-bold">12.5 Acres (500 Gunthas / 5.06 Ha)</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Standing Crop:</span>
                  <span className="font-bold">Soybean (JS-335) - Flowering Stage</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">GPS Coordinates:</span>
                  <span className="font-mono font-bold">20.5510°N, 76.5720°E</span>
                </div>
              </div>
            </div>

            {/* Assessment Findings */}
            <div className="space-y-2 font-sans text-xs">
              <h3 className="font-bold text-sm uppercase text-neutral-800 border-b pb-1">2. Drone Multispectral & AI Damage Verification</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-2.5 rounded bg-neutral-100">
                  <span className="text-neutral-500 block text-[10px]">Diagnosed Calamity</span>
                  <span className="font-bold text-red-600">Severe Charcoal Rot</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-100">
                  <span className="text-neutral-500 block text-[10px]">Affected Parcel Area</span>
                  <span className="font-bold">1.8 Hectares (4.45 Acres)</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-100">
                  <span className="text-neutral-500 block text-[10px]">Mean NDVI Index Drop</span>
                  <span className="font-bold text-red-600">0.76 → 0.38 (-49.3%)</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-100">
                  <span className="text-neutral-500 block text-[10px]">Assessed Yield Loss</span>
                  <span className="font-bold text-red-600">38.4% Crop Damage</span>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t flex items-end justify-between font-sans text-xs">
              <div>
                <div className="w-32 h-10 border-b border-black flex items-center justify-center font-mono text-[10px] text-neutral-400">
                  [SHA256 SIGNATURE]
                </div>
                <span className="block mt-1 font-bold">Kisan Drone Survey Specialist</span>
                <span className="text-[10px] text-neutral-500">DGCA Remote Pilot Cert #2024-RP-9821</span>
              </div>
              <div className="text-right">
                <div className="w-32 h-10 border-b border-black flex items-center justify-center font-mono text-[10px] text-neutral-400 ml-auto">
                  [PMFBY VERIFIED]
                </div>
                <span className="block mt-1 font-bold">Taluka Agriculture Officer</span>
                <span className="text-[10px] text-neutral-500">Hingna Sub-Division, Nagpur</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
