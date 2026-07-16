import React from 'react';
import { useStore } from '../../store/useStore';

import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function ScheduleTab({ t }) {
  const {
    language, isPlaying, playerProgress, activeTrack, activeZoneId,
    isPanicMode, groups, mixes, ads, scheduleMatrix,
    isLocked, showConfig, cacheLimit, neuroActive, iotModulation, telemetry,
    setLanguage, setIsPlaying, setPlayerProgress, setActiveTrack, setActiveZoneId,
    setIsPanicMode, setGroups, setMixes, setAds, setScheduleMatrix,
    setIsLocked, setShowConfig, setCacheLimit, setNeuroActive, setIotModulation, setTelemetry,
    fetchTelemetry, fetchData, API_URL
  } = useStore();

  const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const DAY_TRANSLATIONS = {
    monday: 'auto.monday',
    tuesday: 'auto.tuesday',
    wednesday: 'auto.wednesday',
    thursday: 'auto.thursday',
    friday: 'auto.friday',
    saturday: 'auto.saturday',
    sunday: 'auto.sunday'
  };
  const SLOTS = ['morning', 'afternoon', 'evening', 'night'];
  const SLOT_TRANSLATIONS = {
    morning: 'auto.morning',
    afternoon: 'auto.afternoon',
    evening: 'auto.evening',
    night: 'auto.night'
  };
  const SLOT_TIMES = {
    morning: '06:00 - 12:00',
    afternoon: '12:00 - 18:00',
    evening: '18:00 - 24:00',
    night: '00:00 - 06:00'
  };

  const getMixIdForSlot = (day, slot) => {
    const entry = scheduleMatrix?.find(s => s.day_of_week === day && s.time_slot === slot);
    return entry ? entry.mix_id : null;
  };

  const handleUpdateSchedule = async (day, slot, mixId) => {
    if (isLocked) return;
    try {
      const response = await fetch(`${API_URL}/api/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day_of_week: day, time_slot: slot, mix_id: mixId ? parseInt(mixId) : null })
      });
      if (response.ok) { await fetchData(); }
    } catch (e) { console.error(e); }
  };

  const renderLockedWarning = () => (
    <div className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-center gap-4 mb-6">
      <ShieldAlert className="text-error w-6 h-6 shrink-0" />
      <div><h4 className="text-error font-medium text-sm">{t("lock.title")}</h4></div>
    </div>
  );

return ( <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {isLocked && renderLockedWarning()}
      <h2 className="font-headline-lg text-3xl font-light text-on-background mb-2">📅 {t("auto.visual_dayparting")}</h2>
      <p className="text-on-surface-variant mb-8 text-sm">{t("auto.define_which_mix_plays_in_each")}</p>
      
      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-surface-container-highest/30 border-b border-white/5">
              <th className="p-4 text-xs font-mono-data uppercase tracking-widest text-on-surface-variant w-40">{t("auto.time_slot")}</th>
              {DAYS.map(day => <th key={day} className="p-4 text-xs font-mono-data uppercase tracking-widest text-on-background text-center">{t(DAY_TRANSLATIONS[day])}</th>)}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map(slot => <tr key={slot} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 border-r border-white/5">
                  <div className="text-primary-fixed font-medium text-sm mb-1">{t(SLOT_TRANSLATIONS[slot])}</div>
                  <div className="text-[10px] text-on-surface-variant font-mono-data">{SLOT_TIMES[slot]}</div>
                </td>
                {DAYS.map(day => {
              const mixId = getMixIdForSlot(day, slot);
              return <td key={day} className="p-3">
                      <select className="w-full bg-surface-container-high/50 border border-white/5 rounded-lg px-2 py-2 text-[11px] text-on-background focus:border-primary-fixed focus:outline-none appearance-none cursor-pointer hover:bg-surface-container-highest transition-colors disabled:opacity-50" value={mixId || ''} disabled={isLocked} onChange={e => handleUpdateSchedule(day, slot, e.target.value)}>
                        <option value="">-- {t("auto.empty")} --</option>
                        {mixes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </td>;
            })}
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>);
}
