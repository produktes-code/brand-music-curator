import React from 'react';
import { useStore } from '../../store/useStore';

import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function SgaeShieldTab({ t }) {
  const {
    language, isPlaying, playerProgress, activeTrack, activeZoneId,
    isPanicMode, groups, mixes, ads, scheduleMatrix,
    isLocked, showConfig, cacheLimit, neuroActive, iotModulation, telemetry,
    setLanguage, setIsPlaying, setPlayerProgress, setActiveTrack, setActiveZoneId,
    setIsPanicMode, setGroups, setMixes, setAds, setScheduleMatrix,
    setIsLocked, setShowConfig, setCacheLimit, setNeuroActive, setIotModulation, setTelemetry,
    fetchTelemetry, fetchData, API_URL
  } = useStore();

  const handlePanicButton = async () => {
    const nextState = !isPanicMode;
    setIsPanicMode(nextState);
    if (nextState) {
      setActiveTrack({
        id: 101, title: 'Corporate Calm', artist: 'Royalty Free Audio',
        duration: '2:30', source: 'Local - Certified', album: 'RF Library'
      });
      setIsPlaying(true);
      try {
        await fetch(`${API_URL}/api/audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hardware_id: groups[0]?.zones[0]?.hwid || 'FBX-88A-921',
            track_id: 'RF-101', track_title: 'Corporate Calm'
          })
        });
      } catch (e) { console.error(e); }
    } else {
      setActiveTrack({
        id: 1, title: 'Ocean Drive', artist: 'Tidal Drifters', duration: '3:45',
        source: 'Local Cache', album: 'The Algorithm EP'
      });
    }
  };

return ( <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl glass-panel rounded-2xl p-10 max-w-4xl relative overflow-hidden border-error/30 mt-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-error/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="flex items-center gap-4 mb-4">
        <ShieldAlert className="w-10 h-10 text-error" />
        <h2 className="font-headline-lg text-3xl font-light text-on-background">{t("auto.sgae_shield_legal_audit")}</h2>
      </div>
      <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed mb-10">
        {t("auto.the_shield_protects_the_establ")}
      </p>
      
      <button onClick={handlePanicButton} className="w-full md:w-auto bg-error hover:bg-error/80 text-background px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_30px_rgba(255,180,171,0.4)] active:scale-95 flex flex-col items-center gap-2">
        <span>{t("auto.activate_panic_mode")}</span>
        <span className="text-[9px] opacity-80 font-mono-data">{t("auto.force_royalty_free_catalog")}</span>
      </button>
 
      <div className="mt-12 pt-8 border-t border-white/5">
        <h3 className="text-on-surface-variant font-mono-data uppercase tracking-widest text-[11px] mb-6">{t("auto.audit_log_immutable_blockchain")}</h3>
        <ul className="space-y-3 font-mono-data text-[11px] text-on-surface-variant opacity-70">
          <li className="p-3 bg-surface-container-high/30 rounded-lg border border-white/5 flex justify-between">
            <span>[2026-06-12 10:15:00] Location: Serrano</span>
            <span className="text-primary-fixed">Play: Corporate Calm (ID: RF-101) - CERTIFIED</span>
          </li>
          <li className="p-3 bg-surface-container-high/30 rounded-lg border border-white/5 flex justify-between">
            <span>[2026-06-12 10:45:22] Location: Serrano</span>
            <span className="text-primary-fixed">Play: Soft Lounge (ID: RF-042) - CERTIFIED</span>
          </li>
        </ul>
      </div>
    </div>);
}
