
import { useEffect } from 'react';
import './App.css';
import { ShieldAlert, Globe } from 'lucide-react';
import es from './locales/es.json';
import en from './locales/en.json';
import de from './locales/de.json';
import uk from './locales/uk.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import { useStore } from './store/useStore';
import DashboardTab from './components/tabs/DashboardTab';
import GroupsZonesTab from './components/tabs/GroupsZonesTab';
import MixesTab from './components/tabs/MixesTab';
import AdsTab from './components/tabs/AdsTab';
import ScheduleTab from './components/tabs/ScheduleTab';
import SettingsTab from './components/tabs/SettingsTab';
import SgaeShieldTab from './components/tabs/SgaeShieldTab';

const translations = { es, en, de, uk, ru, zh, ja };

export default function App() {
  const { 
    activeTab, setActiveTab, language, setLanguage, 
    isLocked, setIsLocked, showPinModal, setShowPinModal,
    enteredPin, setEnteredPin
  } = useStore();

  useEffect(() => {
    localStorage.setItem('bmc_language', language);
  }, [language]);

  const t = (keyOrObject) => {
    if (typeof keyOrObject === 'string') {
      return translations[language]?.[keyOrObject] || translations['es'][keyOrObject] || keyOrObject;
    }
    if (typeof keyOrObject === 'object' && keyOrObject !== null) {
      return keyOrObject[language] || keyOrObject['es'] || Object.values(keyOrObject)[0];
    }
    return keyOrObject;
  };

  return (
    <div className="bg-background text-on-background min-h-screen overflow-x-hidden pt-16 md:pt-24 font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col justify-between">
      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-8 text-center border-primary-fixed/20 shadow-[0_0_40px_rgba(195,244,0,0.1)]">
            <ShieldAlert className="w-12 h-12 text-primary-fixed mx-auto mb-4" />
            <h3 className="text-xl text-on-background font-medium mb-2">{t("auto.unlock_interface")}</h3>
            <p className="text-on-surface-variant text-sm mb-6">{t("auto.enter_the_supervisor_pin")}<br/><span className="text-[10px] opacity-50 mt-1 block">(PIN: 1234)</span></p>
            <input type="password" maxLength="4" value={enteredPin} onChange={(e) => setEnteredPin(e.target.value)} placeholder="••••" className="w-full text-center text-3xl tracking-[1em] bg-surface-container-highest border border-white/10 rounded-xl p-4 text-on-background focus:border-primary-fixed focus:outline-none mb-6" />
            <div className="flex gap-3">
              <button onClick={() => { setShowPinModal(false); setEnteredPin(''); }} className="flex-1 px-4 py-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface-variant transition-colors text-sm font-medium">{t("auto.cancel")}</button>
              <button onClick={() => {
                if (enteredPin === '1234') {
                  setIsLocked(false);
                  setShowPinModal(false);
                  setEnteredPin('');
                } else {
                  console.log("❌ PIN Supervisor Incorrecto");
                  setEnteredPin('');
                }
              }} className="flex-1 px-4 py-3 rounded-xl bg-primary-fixed hover:bg-primary-fixed/90 text-background transition-colors text-sm font-medium">{t("auto.validate")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="hidden md:flex fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-2xl border-b border-white/5 px-container-margin h-20 items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-4 shrink-0 pr-4">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <span className="material-symbols-outlined text-white notranslate" translate="no">graphic_eq</span>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white">Brand Music</h1>
                <p className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">Curator Pro</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between px-3 py-1.5 bg-black/40 rounded border border-white/5">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1.5"><Globe className="w-3 h-3 text-emerald-500"/> {language.toUpperCase()}</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent border-none text-[9px] text-white hover:text-emerald-400 focus:outline-none cursor-pointer appearance-none font-mono text-right">
                <option value="es">ESPAÑOL</option>
                <option value="en">ENGLISH</option>
                <option value="de">DEUTSCH</option>
                <option value="ru">РУССКИЙ</option>
                <option value="ja">日本語</option>
                <option value="uk">УКРАЇНСЬКА</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {[
            { id: 'dashboard', label: t('nav.dashboard'), icon: 'dashboard' },
            { id: 'zones', label: t('nav.groups'), icon: 'map' },
            { id: 'mixes', label: t('nav.mixes'), icon: 'graphic_eq' },
            { id: 'ads', label: t('nav.sonic'), icon: 'campaign' },
            { id: 'schedule', label: t('nav.metrics'), icon: 'calendar_today' },
            { id: 'settings', label: t('nav.settings'), icon: 'settings' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === item.id ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
              <span className="material-symbols-outlined text-[18px] notranslate" translate="no">{item.icon}</span> {item.label}
            </button>
          ))}
          <button onClick={() => setActiveTab('sgae')} className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center transition-colors border shrink-0 ${activeTab === 'sgae' ? 'border-error text-error bg-error/10' : 'text-error/70 hover:text-error hover:bg-error/10 border-error/20'}`}><span className="material-symbols-outlined text-[18px] notranslate" translate="no">gpp_bad</span></button>
          <button onClick={() => { if (isLocked) { setShowPinModal(true); } else { setIsLocked(true); } }} className={`ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors border shrink-0 ${isLocked ? 'border-error text-error bg-error/10' : 'border-white/10 text-on-surface-variant hover:text-on-background hover:bg-white/5 hover:text-primary-fixed'}`}><span className="material-symbols-outlined notranslate" style={{fontVariationSettings: "'FILL' 1"}} translate="no">{isLocked ? 'lock' : 'lock_open'}</span></button>
        </div>
      </nav>

      {/* Main Content */}
      {activeTab === 'dashboard' && <DashboardTab t={t} />}
      {activeTab === 'zones' && <GroupsZonesTab t={t} />}
      {activeTab === 'mixes' && <MixesTab t={t} />}
      {activeTab === 'ads' && <AdsTab t={t} />}
      {activeTab === 'schedule' && <ScheduleTab t={t} />}
      {activeTab === 'settings' && <SettingsTab t={t} />}
      {activeTab === 'sgae' && <SgaeShieldTab t={t} />}

      <footer className="w-full text-center shrink-0 border-t border-white/5 mt-12" style={{padding: '16px', fontSize: '0.8rem', color: '#888'}}>
        <p className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <span>{t("auto.created_by")} <a href="https://github.com/produktes-code" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-primary-fixed transition-colors font-semibold">produktes-code</a></span>
          <span className="hidden sm:inline opacity-30">•</span>
          <a href="https://github.com/produktes-code/brand-music-curator" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-primary-fixed transition-colors font-semibold">GitHub</a>
        </p>
      </footer>
    </div>
  );
}
