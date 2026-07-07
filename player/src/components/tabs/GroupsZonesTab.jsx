import React from 'react';
import { useStore } from '../../store/useStore';

import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function GroupsZonesTab({ t }) {
  const {
    language, isPlaying, playerProgress, activeTrack, activeZoneId,
    isPanicMode, groups, mixes, ads, scheduleMatrix,
    isLocked, showConfig, cacheLimit, neuroActive, iotModulation, telemetry,
    setLanguage, setIsPlaying, setPlayerProgress, setActiveTrack, setActiveZoneId,
    setIsPanicMode, setGroups, setMixes, setAds, setScheduleMatrix,
    setIsLocked, setShowConfig, setCacheLimit, setNeuroActive, setIotModulation, setTelemetry,
    fetchTelemetry, fetchData, API_URL
  } = useStore();

  const [newGroupName, setNewGroupName] = useState('');

  const handleAddGroup = async () => {
    if (!newGroupName.trim() || isLocked) return;
    try {
      const response = await fetch(`${API_URL}/api/zones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_name: newGroupName,
          location: 'Default Location',
          zone_name: 'Main Zone',
          hardware_id: `FBX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
        })
      });
      if (response.ok) {
        await fetchData();
        setNewGroupName('');
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-center gap-4 mb-6">
      <ShieldAlert className="text-error w-6 h-6 shrink-0" />
      <div>
        <h4 className="text-error font-medium text-sm">{t("lock.title")}</h4>
        <p className="text-error/80 text-xs mt-1">{t("lock.warning_b2b")}</p>
      </div>
    </div>
  );

return ( <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {isLocked && renderLockedWarning()}
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-headline-lg text-3xl font-light text-on-background">🏢 {t("nav.groups")}</h2>
        <div className="flex gap-3">
          <input type="text" placeholder={t("groups.new_placeholder")} value={newGroupName} onChange={e => setNewGroupName(e.target.value)} disabled={isLocked} className="bg-surface-container-high/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-on-background focus:border-primary-fixed focus:outline-none" />
          <button onClick={handleAddGroup} disabled={isLocked} className="bg-primary-fixed/10 hover:bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30 px-6 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
            {t("groups.add")}
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {groups.map(group => <div key={group.id} className="glass-panel rounded-2xl overflow-hidden">
            <div className="p-6 bg-surface-container-high/30 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-medium text-on-background">{group.name}</h3>
              <span className="text-sm text-on-surface-variant">
                {group.zones.length} {t("groups.locations")}
              </span>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest/50 text-xs uppercase tracking-widest text-on-surface-variant font-mono-data border-b border-white/5">
                    <th className="p-4 font-normal">{t("auto.location")}</th>
                    <th className="p-4 font-normal">{t("groups.zone_name")}</th>
                    <th className="p-4 font-normal">{t("groups.hardware_id")}</th>
                    <th className="p-4 font-normal">{t("files.status")}</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {group.zones.map(z => <tr key={z.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-on-background">{z.location}</td>
                      <td className="p-4 text-primary-fixed font-medium">{z.name}</td>
                      <td className="p-4 font-mono text-on-surface-variant opacity-70">{z.hwid}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border ${z.status?.includes('Online') ? 'bg-primary-fixed/10 text-primary-fixed border-primary-fixed/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${z.status?.includes('Online') ? 'bg-primary-fixed' : 'bg-orange-500'}`}></div>
                          {z.status?.includes('Online') ? t("groups.online") : t("groups.offline")}
                        </span>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>)}
      </div>
    </div>);
}
