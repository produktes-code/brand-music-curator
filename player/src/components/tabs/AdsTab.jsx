import React from 'react';
import { useStore } from '../../store/useStore';

import { useState } from 'react';
import { ShieldAlert, Play, Pause, Trash2, Wand2 } from 'lucide-react';

export default function AdsTab({ t }) {
  const {
    language, isPlaying, playerProgress, activeTrack, activeZoneId,
    isPanicMode, groups, mixes, ads, scheduleMatrix,
    isLocked, showConfig, cacheLimit, neuroActive, iotModulation, telemetry,
    setLanguage, setIsPlaying, setPlayerProgress, setActiveTrack, setActiveZoneId,
    setIsPanicMode, setGroups, setMixes, setAds, setScheduleMatrix,
    setIsLocked, setShowConfig, setCacheLimit, setNeuroActive, setIotModulation, setTelemetry,
    fetchTelemetry, fetchData, API_URL
  } = useStore();

  const [adCopy, setAdCopy] = useState('');
  const [adVoice, setAdVoice] = useState('Elena (ES - Mujer)');
  const [isGeneratingAd, setIsGeneratingAd] = useState(false);

  const handleGenerateAd = async () => {
    if (!adCopy.trim() || isLocked) return;
    setIsGeneratingAd(true);
    try {
      const response = await fetch(`${API_URL}/api/ads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: adCopy, voice: adVoice, status: 'Active' })
      });
      if (response.ok) {
        await fetchData();
        setAdCopy('');
      }
    } catch (e) { console.error(e); } finally { setIsGeneratingAd(false); }
  };

  const renderLockedWarning = () => (
    <div className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-center gap-4 mb-6">
      <ShieldAlert className="text-error w-6 h-6 shrink-0" />
      <div><h4 className="text-error font-medium text-sm">{t("lock.title")}</h4></div>
    </div>
  );

return ( <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {isLocked && renderLockedWarning()}
      <h2 className="font-headline-lg text-3xl font-light text-on-background mb-2">🎙️ {t("auto.ad_generator_text_to_speech")}</h2>
      <p className="text-on-surface-variant mb-8 text-sm">{t("auto.write_your_promotion_and_our_a")}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl p-8">
          <h3 className="font-medium text-on-background mb-4">{t("auto.create_new_campaign")}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-on-surface-variant mb-2 block">{t("auto.ad_copy_text")}</label>
              <textarea className="w-full bg-surface-container-highest border border-white/10 rounded-xl p-4 text-sm text-on-background focus:border-primary-fixed focus:outline-none resize-none h-32" placeholder={t("auto.e_g_attention_customers_take_a")} value={adCopy} onChange={e => setAdCopy(e.target.value)} disabled={isLocked} />
            </div>
            
            <div>
              <label className="text-xs text-on-surface-variant mb-2 block">{t("auto.ai_synthetic_voice")}</label>
              <select className="w-full bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-sm text-on-background focus:border-primary-fixed focus:outline-none appearance-none disabled:opacity-50" value={adVoice} onChange={e => setAdVoice(e.target.value)} disabled={isLocked}>
                <option value="Elena (ES - Mujer)">{t("auto.elena_spain_female_young")}</option>
                <option value="Marcos (ES - Hombre)">{t("auto.marcos_spain_male_deep")}</option>
                <option value="Sofia (MX - Mujer)">{t("auto.sofia_mexico_female_friendly")}</option>
                <option value="Diego (AR - Hombre)">{t("auto.diego_argentina_male_dynamic")}</option>
              </select>
            </div>
 
            <button onClick={handleGenerateAd} disabled={!adCopy.trim() || isGeneratingAd || isLocked} className="w-full bg-primary-fixed text-background py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary-fixed/90 transition-colors disabled:opacity-50 mt-4 shadow-[0_0_15px_rgba(195,244,0,0.3)]">
              {isGeneratingAd ? <><span className="material-symbols-outlined animate-spin text-[18px] notranslate" translate="no">sync</span> {t("auto.rendering_audio")}</> : <><span className="material-symbols-outlined text-[18px] notranslate" translate="no">mic</span> {t("ai.generate")}</>}
            </button>
          </div>
        </div>
 
        <div className="space-y-4">
          <h3 className="font-medium text-on-background mb-4">{t("auto.active_campaigns")}</h3>
          {ads.map(ad => <div key={ad.id} className="glass-panel rounded-xl p-4 flex gap-4 items-center border-l-4 border-l-primary-fixed">
              <button className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-fixed shrink-0 hover:bg-primary-fixed/20 transition-colors">
                <span className="material-symbols-outlined notranslate" style={{
              fontVariationSettings: "'FILL' 1"
            }} translate="no">play_arrow</span>
              </button>
              <div className="flex-1">
                <p className="text-sm text-on-background line-clamp-2 italic">"{ad.text}"</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px] notranslate" translate="no">record_voice_over</span> {ad.voice}</span>
                  <span className="px-2 py-1 bg-primary-fixed/10 text-primary-fixed rounded text-[10px] uppercase tracking-widest">{ad.status}</span>
                </div>
              </div>
              <button className="text-on-surface-variant hover:text-error transition-colors p-2" disabled={isLocked} onClick={() => setAds(prev => prev.filter(a => a.id !== ad.id))}>
                <span className="material-symbols-outlined text-sm notranslate" translate="no">delete</span>
              </button>
            </div>)}
          {ads.length === 0 && <div className="text-center p-8 text-on-surface-variant border border-dashed border-white/10 rounded-xl">
              {t("auto.no_active_campaigns")}
            </div>}
        </div>
      </div>
    </div>);
}
