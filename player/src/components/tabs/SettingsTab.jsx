import React from 'react';
import { useStore } from '../../store/useStore';

import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function SettingsTab({ t }) {
  const {
    language, isPlaying, playerProgress, activeTrack, activeZoneId,
    isPanicMode, groups, mixes, ads, scheduleMatrix,
    isLocked, showConfig, cacheLimit, neuroActive, iotModulation, telemetry,
    setLanguage, setIsPlaying, setPlayerProgress, setActiveTrack, setActiveZoneId,
    setIsPanicMode, setGroups, setMixes, setAds, setScheduleMatrix,
    setIsLocked, setShowConfig, setCacheLimit, setNeuroActive, setIotModulation, setTelemetry,
    fetchTelemetry, fetchData, API_URL
  } = useStore();

  const handleSaveSettings = () => {
    if (isLocked) return;
    alert(t("auto.engineering_settings_saved_su"));
  };

  const renderLockedWarning = () => (
    <div className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-center gap-4 mb-6">
      <ShieldAlert className="text-error w-6 h-6 shrink-0" />
      <div><h4 className="text-error font-medium text-sm">{t("lock.title")}</h4></div>
    </div>
  );

return ( <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl glass-panel rounded-2xl p-8 max-w-4xl mt-6">
      {isLocked && renderLockedWarning()}
      <h2 className="font-headline-lg text-3xl font-light text-on-background mb-2">⚙️ {t("auto.settings_logic")}</h2>
      <p className="text-on-surface-variant mb-10 text-sm">{t("auto.manage_the_sensor_infrastructu")}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-primary-fixed font-mono-data uppercase tracking-widest text-[11px] border-b border-white/10 pb-4">{t("auto.offline_architecture_freebox")}</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-background">{t("auto.pre_caching_limit_gb")}</span>
            <input type="number" value={cacheLimit} disabled={isLocked} onChange={e => setCacheLimit(e.target.value)} className="w-20 bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-center text-on-background focus:border-primary-fixed focus:outline-none disabled:opacity-50" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-background">{t("auto.force_cache_download")}</span>
            <button className="text-xs bg-surface-container-high hover:bg-surface-bright text-on-background px-4 py-2 rounded-lg transition-colors border border-white/10 flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] notranslate" translate="no">download</span> {t("auto.sync_14_days")}
            </button>
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-primary-fixed font-mono-data uppercase tracking-widest text-[11px] border-b border-white/10 pb-4">{t("auto.tringbox_ai_engine_iot")}</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-background">{t("auto.neuro_iot_modulation")}</span>
            <button disabled={isLocked} onClick={() => setNeuroActive(!neuroActive)} className={`px-4 py-2 rounded-full text-xs font-mono-data uppercase tracking-widest transition-all ${neuroActive ? 'bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30 shadow-[0_0_15px_rgba(195,244,0,0.2)]' : 'bg-surface-container-high text-on-surface-variant border border-white/5'}`}>
              {neuroActive ? t("auto.active") : t("auto.disabled")}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm text-on-background">{t("auto.smart_iot_auto_modulation")}</span>
              <span className="text-[10px] text-on-surface-variant">{t("auto.sync_with_weather_foot_traffic")}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" checked={iotModulation} onChange={() => setIotModulation(!iotModulation)} disabled={isLocked} />
              <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-fixed"></div>
            </label>
          </div>
        </div>
      </div>
 
      <div className="mt-12 flex justify-end">
        <button onClick={handleSaveSettings} disabled={isLocked} className="bg-primary-fixed text-background px-8 py-3 rounded-xl font-medium hover:bg-primary-fixed/90 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(195,244,0,0.3)] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] notranslate" translate="no">save</span> {t("auto.save_project")}
        </button>
      </div>
    </div>);
}
