import React from 'react';
import { useStore } from '../../store/useStore';

import { useState } from 'react';
import { ShieldAlert, CheckCircle2, CircleDashed, Wand2 } from 'lucide-react';

export default function MixesTab({ t }) {
  const {
    language, isPlaying, playerProgress, activeTrack, activeZoneId,
    isPanicMode, groups, mixes, ads, scheduleMatrix,
    isLocked, showConfig, cacheLimit, neuroActive, iotModulation, telemetry,
    setLanguage, setIsPlaying, setPlayerProgress, setActiveTrack, setActiveZoneId,
    setIsPanicMode, setGroups, setMixes, setAds, setScheduleMatrix,
    setIsLocked, setShowConfig, setCacheLimit, setNeuroActive, setIotModulation, setTelemetry,
    fetchTelemetry, fetchData, API_URL
  } = useStore();

  const [newMixName, setNewMixName] = useState('');
  const [showBrandPrompt, setShowBrandPrompt] = useState(false);
  const [brandPromptText, setBrandPromptText] = useState('');
  const [isGeneratingMix, setIsGeneratingMix] = useState(false);

  const handleAddMix = async () => {
    if (!newMixName.trim() || isLocked) return;
    try {
      const response = await fetch(`${API_URL}/api/mixes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMixName,
          genre_a: 'Pop', genre_b: 'Electronic', ratio: 50, energy_level: 'Medium',
          ad_frequency: 30, block_explicit: 0, block_urban: 0
        })
      });
      if (response.ok) {
        await fetchData();
        setNewMixName('');
      }
    } catch (e) { console.error(e); }
  };

  const handleSaveMix = async (mix) => {
    if (isLocked) return;
    try {
      const response = await fetch(`${API_URL}/api/mixes/${mix.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mix.name, genre_a: mix.genre_a, genre_b: mix.genre_b, ratio: mix.ratio,
          energy_level: mix.energy_level, ad_frequency: mix.ad_frequency,
          block_explicit: mix.blockExplicit ? 1 : 0, block_urban: mix.blockUrban ? 1 : 0
        })
      });
      if (response.ok) {
        alert(t("auto.mix_successfully_saved_to_the").replace('{}', mix.name));
        await fetchData();
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteMix = async (mixId) => {
    if (isLocked) return;
    try {
      const response = await fetch(`${API_URL}/api/mixes/${mixId}`, { method: 'DELETE' });
      if (response.ok) { await fetchData(); }
    } catch (e) { console.error(e); }
  };

  const handleGenerateMixFromBrand = async () => {
    if (!brandPromptText.trim() || isLocked) return;
    setIsGeneratingMix(true);
    try {
      const response = await fetch(`${API_URL}/api/ai/mix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: brandPromptText })
      });
      if (response.ok) {
        await fetchData();
        setShowBrandPrompt(false);
        setBrandPromptText('');
      }
    } catch (e) { console.error(e); } finally { setIsGeneratingMix(false); }
  };

  return (
    <div className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-center gap-4 mb-6">
      <ShieldAlert className="text-error w-6 h-6 shrink-0" />
      <div><h4 className="text-error font-medium text-sm">{t("lock.title")}</h4></div>
    </div>
  );

return ( <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {isLocked && renderLockedWarning()}
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-headline-lg text-3xl font-light text-on-background">🎛️ {t("nav.mixes")}</h2>
        
        <div className="flex gap-3">
          <button onClick={() => setShowBrandPrompt(!showBrandPrompt)} disabled={isLocked} className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-primary-fixed/20 hover:from-purple-500/30 hover:to-primary-fixed/30 text-white border border-primary-fixed/30 px-6 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50">
            <span className="material-symbols-outlined text-[18px] text-primary-fixed notranslate" translate="no">auto_awesome</span>
            {t("ai.prompt_label")}
          </button>
          <div className="w-px h-6 bg-white/10 self-center mx-2"></div>
          <input type="text" placeholder={t("mixes.new_placeholder")} value={newMixName} onChange={e => setNewMixName(e.target.value)} disabled={isLocked} className="bg-surface-container-high/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-on-background focus:border-primary-fixed focus:outline-none" />
          <button onClick={handleAddMix} disabled={isLocked} className="bg-primary-fixed/10 hover:bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30 px-6 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
            {t("mixes.create")}
          </button>
        </div>
      </div>

      {showBrandPrompt && <div className="glass-panel rounded-2xl p-6 mb-8 border border-primary-fixed/30 shadow-[0_0_30px_rgba(195,244,0,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/5 blur-[100px] rounded-full pointer-events-none"></div>
          <h3 className="text-lg font-medium text-on-background mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed notranslate" translate="no">auto_awesome</span>
            {t("ai.playlist_label")}
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">{t("auto.describe_the_type_of_business")}</p>
          <div className="flex gap-4">
            <input type="text" placeholder={t("auto.e_g_relaxing_music_for_a_hipst")} value={brandPromptText} onChange={e => setBrandPromptText(e.target.value)} className="flex-1 bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-sm text-on-background focus:border-primary-fixed focus:outline-none" />
            <button onClick={handleGenerateBrandMix} disabled={!brandPromptText.trim() || isGeneratingMix} className="bg-primary-fixed text-background px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
              {isGeneratingMix ? <><span className="material-symbols-outlined animate-spin text-[18px] notranslate" translate="no">sync</span> {t("auto.processing")}</> : <><span className="material-symbols-outlined text-[18px] notranslate" translate="no">magic_button</span> {t("auto.generate_mix")}</>}
            </button>
          </div>
        </div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mixes.map((mix, idx) => <div key={mix.id} className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-on-background truncate pr-4">{mix.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 block font-mono-data">{t("auto.style_a_base")}</label>
                <select className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-sm text-on-background focus:border-primary-fixed focus:outline-none disabled:opacity-50 appearance-none" value={mix.genre_a} disabled={isLocked} onChange={e => {
              const nm = [...mixes];
              nm[idx].genre_a = e.target.value;
              setMixes(nm);
            }}>
                  {AVAILABLE_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 block font-mono-data">{t("auto.style_b")}</label>
                <select className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-sm text-on-background focus:border-primary-fixed focus:outline-none disabled:opacity-50 appearance-none" value={mix.genre_b} disabled={isLocked} onChange={e => {
              const nm = [...mixes];
              nm[idx].genre_b = e.target.value;
              setMixes(nm);
            }}>
                  {AVAILABLE_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono-data text-primary-fixed mb-2 tracking-wider">
                <span>{mix.genre_a}: {mix.ratio}%</span>
                <span>{mix.genre_b}: {100 - mix.ratio}%</span>
              </div>
              <input type="range" min="0" max="100" className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none accent-primary-fixed disabled:opacity-50" value={mix.ratio} disabled={isLocked} onChange={e => {
            const nm = [...mixes];
            nm[idx].ratio = parseInt(e.target.value);
            setMixes(nm);
          }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 block font-mono-data">{t("auto.energy_tempo")}</label>
                <select className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-sm text-on-background focus:border-primary-fixed disabled:opacity-50 appearance-none" value={mix.energy_level} disabled={isLocked} onChange={e => {
              const nm = [...mixes];
              nm[idx].energy_level = e.target.value;
              setMixes(nm);
            }}>
                  {ENERGY_LEVELS.map(el => <option key={el} value={el}>{t({
                  es: el === 'Low' ? 'Bajo' : el === 'Medium' ? 'Medio' : 'Alto',
                  en: el,
                  de: el === 'Low' ? 'Niedrig' : el === 'Medium' ? 'Mittel' : 'Hoch',
                  ru: el === 'Low' ? 'Низкий' : el === 'Medium' ? 'Средний' : 'Высокий',
                  ja: el === 'Low' ? '低' : el === 'Medium' ? '中' : '高',
                  uk: el === 'Low' ? 'Низький' : el === 'Medium' ? 'Середній' : 'Високий',
                  zh: el === 'Low' ? '低' : el === 'Medium' ? '中' : '高'
                })}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 block font-mono-data">{t("auto.cu_as_ads")}</label>
                <select className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-sm text-on-background focus:border-primary-fixed disabled:opacity-50 appearance-none" value={mix.ad_frequency} disabled={isLocked} onChange={e => {
              const nm = [...mixes];
              nm[idx].ad_frequency = parseInt(e.target.value);
              setMixes(nm);
            }}>
                  <option value={15}>{t("auto.every_15m")}</option>
                  <option value={30}>{t("auto.every_30m")}</option>
                  <option value={45}>{t("auto.every_45m")}</option>
                  <option value={60}>{t("auto.every_60m")}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-3 text-sm text-on-surface-variant cursor-pointer hover:text-on-background transition-colors">
                <input type="checkbox" className="rounded border-white/20 bg-surface-container-highest text-primary-fixed focus:ring-primary-fixed/50 disabled:opacity-50" checked={mix.blockExplicit} disabled={isLocked} onChange={() => {
              const nm = [...mixes];
              nm[idx].blockExplicit = !nm[idx].blockExplicit;
              setMixes(nm);
            }} />
                {t("auto.block_explicit_lyrics")}
              </label>
              <label className="flex items-center gap-3 text-sm text-on-surface-variant cursor-pointer hover:text-on-background transition-colors">
                <input type="checkbox" className="rounded border-white/20 bg-surface-container-highest text-primary-fixed focus:ring-primary-fixed/50 disabled:opacity-50" checked={mix.blockUrban} disabled={isLocked} onChange={() => {
              const nm = [...mixes];
              nm[idx].blockUrban = !nm[idx].blockUrban;
              setMixes(nm);
            }} />
                {t("auto.block_reggaeton_urban")}
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5 mt-2">
              <button disabled={isLocked} onClick={() => handleSaveMix(mix)} className="flex-1 bg-surface-container-high hover:bg-surface-bright text-on-background px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
                {t("auto.save")}
              </button>
              <button disabled={isLocked} onClick={() => handleDeleteMix(mix.id)} className="flex-1 bg-error/10 hover:bg-error/20 text-error border border-error/20 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
                {t("auto.delete")}
              </button>
            </div>
          </div>)}
      </div>
    </div>);
}
