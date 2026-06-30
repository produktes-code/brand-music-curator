import { useState, useEffect, useRef } from 'react';
import './App.css';
import { LayoutDashboard, Map, Calendar, Settings, ShieldAlert, MoreVertical, Play, Pause, Shuffle, Repeat, SkipBack, SkipForward, Mic2, Globe, BrainCircuit } from 'lucide-react';
import MusicUpload from './components/MusicUpload';
import es from './locales/es.json';
import en from './locales/en.json';
import de from './locales/de.json';
import uk from './locales/uk.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
const translations = {
  es,
  en,
  de,
  uk,
  ru,
  zh,
  ja
};
const AVAILABLE_GENRES = ['Indie Pop', 'Deep House', 'Chillout', 'Jazz', 'Rock', 'Pop Comercial', 'Latino/Urbano', 'Clásica', 'Blues', 'Soul', 'Lo-Fi Hip Hop', 'Acoustic Folk', 'Bossa Nova', 'Tech House', 'Nu-Disco', 'Ambient', 'R&B', 'Reggae', 'Funk', 'Synthwave', 'Classical Crossover', 'Afrobeat', 'Electro Swing', 'Neo-Soul', 'Alternative Rock', 'Country', 'K-Pop', 'Flamenco Chill', 'Trap', 'Lounge', 'Trip Hop', 'Melodic Techno', 'Minimal Synth', 'Baroque', 'Post-Rock', 'Ska', 'Gospel', 'Bluegrass', 'Samba', 'Tango', 'Salsa', 'Downtempo', 'Vaporwave', 'Shoegaze', 'Dream Pop'].sort();
const ENERGY_LEVELS = ['Low', 'Medium', 'High'];
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const SLOTS = ['Mañana', 'Mediodía', 'Tarde', 'Noche/Cierre'];
const SLOT_TIMES = {
  'Mañana': '08:00 - 12:00',
  'Mediodía': '12:00 - 16:00',
  'Tarde': '16:00 - 20:00',
  'Noche/Cierre': '20:00 - 00:00'
};
const DAY_TRANSLATIONS = {
  'Lunes': {
    es: 'Lunes',
    en: 'Monday',
    de: 'Montag',
    ru: 'Понедельник',
    ja: '月曜日',
    uk: 'Понеділок',
    zh: '星期一'
  },
  'Martes': {
    es: 'Martes',
    en: 'Tuesday',
    de: 'Dienstag',
    ru: 'Вторник',
    ja: '火曜日',
    uk: 'Вівторок',
    zh: '星期二'
  },
  'Miércoles': {
    es: 'Miércoles',
    en: 'Wednesday',
    de: 'Mittwoch',
    ru: 'Среда',
    ja: '水曜日',
    uk: 'Середа',
    zh: '星期三'
  },
  'Jueves': {
    es: 'Jueves',
    en: 'Thursday',
    de: 'Donnerstag',
    ru: 'Четверг',
    ja: '木曜日',
    uk: 'Четвер',
    zh: '星期四'
  },
  'Viernes': {
    es: 'Viernes',
    en: 'Friday',
    de: 'Freitag',
    ru: 'Пятница',
    ja: '金曜日',
    uk: 'П’ятниця',
    zh: '星期五'
  },
  'Sábado': {
    es: 'Sábado',
    en: 'Saturday',
    de: 'Samstag',
    ru: 'Суббота',
    ja: '土曜日',
    uk: 'Субота',
    zh: '星期六'
  },
  'Domingo': {
    es: 'Domingo',
    en: 'Sunday',
    de: 'Sonntag',
    ru: 'Воскресенье',
    ja: '日曜日',
    uk: 'Неділя',
    zh: '星期日'
  }
};
const SLOT_TRANSLATIONS = {
  'Mañana': {
    es: 'Mañana',
    en: 'Morning',
    de: 'Morgen',
    ru: 'Утро',
    ja: '朝',
    uk: 'Ранок',
    zh: '上午'
  },
  'Mediodía': {
    es: 'Mediodía',
    en: 'Noon',
    de: 'Mittag',
    ru: 'Полдень',
    ja: '昼',
    uk: 'Полудень',
    zh: '中午'
  },
  'Tarde': {
    es: 'Tarde',
    en: 'Afternoon',
    de: 'Nachmittag',
    ru: 'День',
    ja: '夕方',
    uk: 'День',
    zh: '下午'
  },
  'Noche/Cierre': {
    es: 'Noche/Cierre',
    en: 'Night/Closing',
    de: 'Nacht/Schließung',
    ru: 'Ночь/Закрытие',
    ja: '夜 / 閉店',
    uk: 'Ніч/Закриття',
    zh: '晚上/打烊'
  }
};
export default function App() {
  // --- GLOBAL STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const canvasRef = useRef(null);

  // Language State
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('bmc_language') || 'es';
  });
  useEffect(() => {
    localStorage.setItem('bmc_language', language);
  }, [language]);
  const t = keyOrObject => {
    // Si recibe un string (clave del JSON), busca en las traducciones
    if (typeof keyOrObject === 'string') {
      return translations[language]?.[keyOrObject] || translations['es'][keyOrObject] || keyOrObject;
    }
    // Si recibe un objeto (formato antiguo inline), usa el idioma actual
    if (typeof keyOrObject === 'object' && keyOrObject !== null) {
      return keyOrObject[language] || keyOrObject['es'] || Object.values(keyOrObject)[0];
    }
    return keyOrObject;
  };

  // Dashboard State
  const [activeTrack, setActiveTrack] = useState({
    id: 1,
    title: 'Ocean Drive',
    artist: 'Tidal Drifters',
    duration: '3:45',
    source: 'Local Cache',
    album: 'The Algorithm EP'
  });

  // Groups & Zones State
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');

  // Mixes State
  const [mixes, setMixes] = useState([]);
  const [newMixName, setNewMixName] = useState('');

  // LLM Brand Prompt State
  const [showBrandPrompt, setShowBrandPrompt] = useState(false);
  const [brandPromptText, setBrandPromptText] = useState('');
  const [isGeneratingMix, setIsGeneratingMix] = useState(false);

  // Ad-Generator State
  const [ads, setAds] = useState([]);
  const [adCopy, setAdCopy] = useState('');
  const [adVoice, setAdVoice] = useState('Elena (ES - Mujer)');
  const [isGeneratingAd, setIsGeneratingAd] = useState(false);

  // Schedule Matrix State (Dayparting)
  const [scheduleMatrix, setScheduleMatrix] = useState([]);

  // B2B Player Security Locking State
  const [isLocked, setIsLocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');

  // Settings State
  const [cacheLimit, setCacheLimit] = useState(4);
  const [neuroActive, setNeuroActive] = useState(true);
  const [iotModulation, setIotModulation] = useState(true); // New IoT State

  const API_URL = 'http://localhost:4000';
  const [telemetry, setTelemetry] = useState({
    hardware_status: 'Healthy',
    memory: 'Loading...',
    network_latency_ms: '...',
    is_fallback_mode: false
  });
  const fetchTelemetry = async () => {
    try {
      const res = await fetch(`${API_URL}/api/telemetry`);
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
        setIsOffline(data.is_fallback_mode);
      }
    } catch (e) {
      setIsOffline(true);
    }
  };

  // Data Fetching - Connect to Real Express Backend API
  const fetchData = async () => {
    try {
      // 1. Fetch Zones
      const zonesRes = await fetch(`${API_URL}/api/zones`);
      if (zonesRes.ok) {
        const zonesData = await zonesRes.json();
        const grouped = {};
        zonesData.forEach(z => {
          if (!grouped[z.group_name]) grouped[z.group_name] = [];
          grouped[z.group_name].push({
            id: z.id,
            location: z.location,
            name: z.zone_name,
            hwid: z.hardware_id,
            status: z.status
          });
        });
        const formattedGroups = Object.keys(grouped).map((groupName, idx) => ({
          id: idx + 1,
          name: `📍 ${groupName}`,
          zones: grouped[groupName]
        }));
        setGroups(formattedGroups.length > 0 ? formattedGroups : [{
          id: 1,
          name: '📍 Default Group',
          zones: []
        }]);
      }

      // 2. Fetch Mixes
      const mixesRes = await fetch(`${API_URL}/api/mixes`);
      if (mixesRes.ok) {
        const mixesData = await mixesRes.json();
        setMixes(mixesData.map(m => ({
          id: m.id,
          name: m.name,
          genre_a: m.genre_a || 'Indie Pop',
          genre_b: m.genre_b || 'Deep House',
          ratio: m.playlist_a_ratio !== undefined ? m.playlist_a_ratio : 50,
          energy_level: m.energy_level || 'Medium',
          ad_frequency: m.ad_frequency !== undefined ? m.ad_frequency : 30,
          blockExplicit: m.block_explicit === 1 || m.block_explicit === true,
          blockUrban: m.block_urban === 1 || m.block_urban === true
        })));
      }

      // 3. Fetch Schedule
      const scheduleRes = await fetch(`${API_URL}/api/schedule`);
      if (scheduleRes.ok) {
        const scheduleData = await scheduleRes.json();
        setScheduleMatrix(scheduleData);
      }

      // 4. Fetch Telemetry
      await fetchTelemetry();
    } catch (e) {
      console.error("Error loading data from API:", e);
      setIsOffline(true);
    }
  };
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  // Audio Visualizer Animation
  useEffect(() => {
    if (activeTab === 'dashboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationFrameId;
      const resize = () => {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      };
      window.addEventListener('resize', resize);
      resize();
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const time = Date.now() * 0.001;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const baseRadius = Math.min(canvas.width, canvas.height) * 0.3;
        ctx.lineWidth = 2;
        for (let j = 0; j < 5; j++) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(195, 244, 0, ${0.1 + j * 0.15})`;
          for (let i = 0; i <= 360; i++) {
            const angle = i * Math.PI / 180;
            let noise = 0;
            if (isPlaying) {
              noise = Math.sin(angle * (3 + j) + time * 2) * (15 + j * 5) + Math.cos(angle * (2 - j) + time * 3) * 10;
            } else {
              noise = Math.sin(angle * (3 + j) + time * 0.5) * (5 + j * 2);
            }
            const r = baseRadius + noise + j * 15;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.shadowBlur = 20;
          ctx.shadowColor = 'rgba(195, 244, 0, 0.5)';
        }
        animationFrameId = requestAnimationFrame(draw);
      };
      draw();
      return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [activeTab, isPlaying]);

  // --- EVENT HANDLERS ---
  const handleAddGroup = async () => {
    if (!newGroupName.trim() || isLocked) return;
    try {
      const response = await fetch(`${API_URL}/api/zones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
    } catch (e) {
      console.error("Error adding group:", e);
    }
  };
  const handleAddMix = async () => {
    if (!newMixName.trim() || isLocked) return;
    try {
      const response = await fetch(`${API_URL}/api/mixes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newMixName,
          genre_a: 'Indie Pop',
          genre_b: 'Deep House',
          ratio: 50,
          energy_level: 'Medium',
          ad_frequency: 30,
          block_explicit: 0,
          block_urban: 0
        })
      });
      if (response.ok) {
        await fetchData();
        setNewMixName('');
      }
    } catch (e) {
      console.error("Error creating mix:", e);
    }
  };
  const handleGenerateBrandMix = async () => {
    if (!brandPromptText.trim() || isLocked) return;
    setIsGeneratingMix(true);
    // Simular llamada al LLM local y guardar el mix generado en la base de datos
    setTimeout(async () => {
      const isRelax = brandPromptText.toLowerCase().includes('relax') || brandPromptText.toLowerCase().includes('tranquilo') || brandPromptText.toLowerCase().includes('café');
      const isUrban = brandPromptText.toLowerCase().includes('urbano') || brandPromptText.toLowerCase().includes('joven') || brandPromptText.toLowerCase().includes('calle');
      try {
        const response = await fetch(`${API_URL}/api/mixes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: `✨ AI Mix: ${brandPromptText.substring(0, 15)}...`,
            genre_a: isRelax ? 'Lo-Fi Hip Hop' : isUrban ? 'Trap' : 'Nu-Disco',
            genre_b: isRelax ? 'Acoustic Folk' : isUrban ? 'Afrobeat' : 'Tech House',
            ratio: 65,
            energy_level: isRelax ? 'Low' : 'Medium',
            ad_frequency: 30,
            block_explicit: isUrban ? 0 : 1,
            block_urban: isRelax ? 1 : 0
          })
        });
        if (response.ok) {
          await fetchData();
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsGeneratingMix(false);
        setShowBrandPrompt(false);
        setBrandPromptText('');
      }
    }, 1500);
  };
  const handleGenerateAd = () => {
    if (!adCopy.trim() || isLocked) return;
    setIsGeneratingAd(true);
    setTimeout(() => {
      setAds(prev => [{
        id: Date.now(),
        text: adCopy,
        voice: adVoice,
        status: 'Active'
      }, ...prev]);
      setIsGeneratingAd(false);
      setAdCopy('');
    }, 2000);
  };
  const handleSaveMix = async mix => {
    if (isLocked) return;
    try {
      const response = await fetch(`${API_URL}/api/mixes/${mix.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: mix.name,
          genre_a: mix.genre_a,
          genre_b: mix.genre_b,
          ratio: mix.ratio,
          energy_level: mix.energy_level,
          ad_frequency: mix.ad_frequency,
          block_explicit: mix.blockExplicit ? 1 : 0,
          block_urban: mix.blockUrban ? 1 : 0
        })
      });
      if (response.ok) {
        alert(t("auto.mix_successfully_saved_to_the").replace('{}', newMixName));
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleDeleteMix = async mixId => {
    if (isLocked) return;
    try {
      const response = await fetch(`${API_URL}/api/mixes/${mixId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleUpdateSchedule = async (day, slot, mixId) => {
    if (isLocked) return;
    try {
      const response = await fetch(`${API_URL}/api/schedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          day_of_week: day,
          time_slot: slot,
          mix_id: mixId ? parseInt(mixId) : null
        })
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleSaveSettings = () => {
    if (isLocked) return;
    alert(t("auto.engineering_settings_saved_su"));
  };
  const handlePanicButton = () => {
    console.log("🛡️ SGAE SHIELD ACTIVADO");
    setActiveTrack({
      id: 101,
      title: 'Corporate Calm',
      artist: 'Royalty Free Audio',
      duration: '2:30',
      source: 'Local - Certified',
      album: 'RF Library'
    });
  };
  const handleUploadSuccess = async files => {
    // Process each uploaded file through the Python DSP engine
    for (const file of files) {
      try {
        const response = await fetch(`${API_URL}/api/audio/process`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            trackPath: file.path,
            highPassFilter: true,
            targetBpm: 'auto'
          })
        });
        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success') {
            const pythonOutput = JSON.parse(result.output);
            console.log("Python DSP Result:", pythonOutput);

            // Set the active track in player with the real analyzed metadata!
            setActiveTrack({
              id: Date.now(),
              title: file.originalname.split('.')[0],
              artist: 'Analyzed Track',
              duration: '3:30',
              source: `Local - DSP (BPM: ${pythonOutput.bpm}, Key: ${pythonOutput.key})`,
              album: pythonOutput.dsp_applied
            });
            alert(t("auto.audio_analyzed_successfully_n").replace('{}', pythonOutput.bpm).replace('{}', pythonOutput.key).replace('{}', pythonOutput.energy));
          } else {
            alert(t("auto.error_processing_audio").replace('{}', result.output));
          }
        }
      } catch (e) {
        console.error("Error calling Python bridge:", e);
      }
    }
  };
  const getMixIdForSlot = (day, slot) => {
    const match = scheduleMatrix.find(s => s.day_of_week === day && s.time_slot === slot);
    return match ? match.mix_id : '';
  };

  // --- VIEWS ---
  const renderLockedWarning = () => <div className="bg-error-container/20 border border-error text-error px-5 py-3 rounded-xl mb-6 font-medium flex items-center gap-3 text-sm backdrop-blur-md">
      <ShieldAlert className="w-5 h-5" />
      <span>{t("auto.interface_locked_local_control")}</span>
    </div>;
  const renderDashboard = () => <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {/* Context Header & Licensing */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <p className="font-mono-data text-mono-data text-on-surface-variant mb-1 uppercase tracking-widest text-[10px] opacity-70">
            {t("location.active")}
          </p>
          <div className="flex items-center gap-3">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-light tracking-tight">Lux Boutique - Madrid</h2>
            <span className="material-symbols-outlined text-on-surface-variant text-sm hover:text-primary-fixed transition-colors cursor-pointer notranslate" translate="no">expand_more</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-surface-container-low/50 backdrop-blur-md shadow-sm">
          <div className="w-2 h-2 rounded-full bg-primary-fixed pulse-dot"></div>
          <span className="font-mono-data text-mono-data text-[11px] text-on-background opacity-90 uppercase tracking-wider">
            {t("auto.commercial_license")}: <span className="text-primary-fixed">{t("auto.active_safe")}</span>
          </span>
          <span className="material-symbols-outlined text-primary-fixed text-[14px] ml-1 opacity-80 notranslate" translate="no">verified_user</span>
        </div>
      </div>

      {/* Music Upload Component (Fase 2) */}
      <div className="mb-8">
        <MusicUpload onUploadSuccess={handleUploadSuccess} isLocked={isLocked} t={t} />
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-6">
        
        {/* Main Player Panel */}
        <div className="md:col-span-8 glass-panel rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[480px]">
          <div className="grain-overlay"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary-fixed/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          
          {isLocked && <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
              <ShieldAlert className="w-12 h-12 text-error mb-4" />
              <h3 className="text-xl text-on-background font-medium mb-2">
                {t("lock.title")}
              </h3>
              <p className="text-on-surface-variant text-sm mb-6">
                {t("lock.description")}
              </p>
              <button onClick={() => setShowPinModal(true)} className="bg-error hover:bg-error/80 text-background px-6 py-2 rounded-full font-medium transition-colors">
                {t("lock.unlock")}
              </button>
            </div>}

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full bg-surface-container-high/40 border border-white/5 font-mono-data text-mono-data text-[10px] text-primary-fixed uppercase tracking-widest flex items-center gap-2 backdrop-blur-md">
                  <span className="material-symbols-outlined text-[14px] notranslate" style={{
                  fontVariationSettings: "'FILL' 1"
                }} translate="no">graphic_eq</span>
                  {t("auto.deep_house")}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-surface-container-high/30 border border-white/5 font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest backdrop-blur-md">
                  {t("auto.morning_flow")}
                </span>
                {iotModulation && <span className="px-4 py-1.5 rounded-full bg-primary-fixed/10 border border-primary-fixed/20 font-mono-data text-[10px] text-primary-fixed uppercase tracking-widest backdrop-blur-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] notranslate" translate="no">cloud</span> IoT Sync
                  </span>}
              </div>
              <button className="w-10 h-10 rounded-full bg-surface-container-low/50 border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary-fixed transition-colors backdrop-blur-md">
                <span className="material-symbols-outlined text-sm notranslate" translate="no">more_vert</span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-10 mb-4 mt-auto">
              <div className="w-full max-w-[400px] aspect-square rounded-2xl overflow-hidden relative group shrink-0 flex items-center justify-center">
                <canvas ref={canvasRef} className="w-full h-full" id="audio-visualizer"></canvas>
              </div>

              <div className="flex-1 text-center w-full max-w-xl mx-auto">
                <h3 className="font-headline-lg-mobile text-[28px] md:font-display-lg md:text-[36px] text-on-background font-medium mb-1 tracking-tight truncate">{activeTrack.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-8 font-light tracking-wide truncate">{activeTrack.artist} <span className="opacity-50 mx-2">•</span> {activeTrack.album}</p>
                
                <div className="w-full relative group mb-8">
                  <div className="flex justify-between font-mono-data text-mono-data text-[11px] text-on-surface-variant mb-3 opacity-70 tracking-wider">
                    <span>02:14</span>
                    <span>-{activeTrack.duration}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-highest/50 rounded-full overflow-hidden relative cursor-pointer backdrop-blur-sm border border-white/5">
                    <div className="absolute top-0 left-0 h-full bg-primary-fixed/80 rounded-full w-[45%] shadow-[0_0_15px_rgba(195,244,0,0.5)]"></div>
                  </div>
                  <div className="absolute top-[26px] left-[45%] w-3 h-3 bg-primary-fixed rounded-full shadow-[0_0_10px_rgba(195,244,0,0.8)] -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"></div>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <button className="text-on-surface-variant hover:text-on-background btn-minimal"><span className="material-symbols-outlined text-[20px] notranslate" translate="no">shuffle</span></button>
                  <button className="text-on-background hover:text-primary-fixed btn-minimal"><span className="material-symbols-outlined text-[28px] notranslate" style={{
                    fontVariationSettings: "'FILL' 1"
                  }} translate="no">skip_previous</span></button>
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-surface-container-high/80 border border-white/10 text-on-background flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-primary-fixed/50 hover:text-primary-fixed active:scale-95 transition-all backdrop-blur-xl">
                    <span className="material-symbols-outlined text-[28px] notranslate" style={{
                    fontVariationSettings: "'FILL' 1"
                  }} translate="no">{isPlaying ? 'pause' : 'play_arrow'}</span>
                  </button>
                  <button className="text-on-background hover:text-primary-fixed btn-minimal"><span className="material-symbols-outlined text-[28px] notranslate" style={{
                    fontVariationSettings: "'FILL' 1"
                  }} translate="no">skip_next</span></button>
                  <button className="text-on-surface-variant hover:text-on-background btn-minimal"><span className="material-symbols-outlined text-[20px] notranslate" translate="no">repeat</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vibe Metrics */}
        <div className="md:col-span-4 flex flex-col gap-gutter md:gap-6">
          <div className="glass-panel rounded-2xl p-6 flex-1 relative overflow-hidden group">
            <div className="grain-overlay"></div>
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h4 className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-[0.2em] font-medium">
                {t("nav.sonic")}
              </h4>
              <span className="material-symbols-outlined text-primary-fixed/40 text-[18px] notranslate" translate="no">waves</span>
            </div>
            <div className="h-32 flex items-end justify-between gap-[2px] w-full mt-auto relative z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
              {[0.1, 0.3, 0.2, 0.5, 0.4, 0.6, 0.2, 0.7, 0.3, 0.1, 0.5, 0.8, 0.4, 0.2].map((delay, i) => <div key={i} className="w-full bg-primary-fixed/60 rounded-t-sm wave-bar" style={{
              animationDelay: `${delay}s`
            }}></div>)}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-primary-fixed/10 to-transparent pointer-events-none z-0"></div>
          </div>

          <div className="glass-panel rounded-2xl p-6 flex-1 glass-card-inner relative overflow-hidden">
            <div className="grain-overlay"></div>
            <h4 className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-[0.2em] font-medium mb-8 relative z-10">
              {t("metrics.title")}
            </h4>
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-end">
                  <span className="font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">
                    {t("metrics.energy")} {iotModulation && '(IoT Auto)'}
                  </span>
                  <span className="font-mono-data text-mono-data text-[12px] font-medium text-on-background">85%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-primary-fixed/80 rounded-full w-[85%] shadow-[0_0_10px_rgba(195,244,0,0.5)]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between items-end">
                  <span className="font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">
                    {t("metrics.ram")}
                  </span>
                  <span className="font-mono-data text-mono-data text-[11px] font-medium text-on-background">{telemetry.memory}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between items-end">
                  <span className="font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">
                    {t("metrics.latency")}
                  </span>
                  <span className="font-mono-data text-mono-data text-[11px] font-medium text-on-background">{telemetry.network_latency_ms} ms</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between items-end">
                  <span className="font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">
                    {t("metrics.hardware")}
                  </span>
                  <span className="font-mono-data text-mono-data text-[11px] font-medium text-primary-fixed">
                    {telemetry.hardware_status === 'Healthy' ? t("metrics.healthy") : telemetry.hardware_status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>;
  const renderGroupsZones = () => <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
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
    </div>;
  const renderMixes = () => <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
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
    </div>;
  const renderAds = () => <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
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
    </div>;
  const renderSchedule = () => <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
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
    </div>;
  const renderSettings = () => <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl glass-panel rounded-2xl p-8 max-w-4xl mt-6">
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
    </div>;
  const renderSgaeShield = () => <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl glass-panel rounded-2xl p-10 max-w-4xl relative overflow-hidden border-error/30 mt-6">
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
    </div>;
  return <div className="bg-background text-on-background min-h-screen overflow-x-hidden pt-16 md:pt-24 font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col justify-between">
      {/* PIN entry modal */}
      {showPinModal && <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-8 text-center border-primary-fixed/20 shadow-[0_0_40px_rgba(195,244,0,0.1)]">
            <ShieldAlert className="w-12 h-12 text-primary-fixed mx-auto mb-4" />
            <h3 className="text-xl text-on-background font-medium mb-2">{t("auto.unlock_interface")}</h3>
            <p className="text-on-surface-variant text-sm mb-6">{t("auto.enter_the_supervisor_pin")}<br /><span className="text-[10px] opacity-50 mt-1 block">(PIN: 1234)</span></p>
            <input type="password" maxLength="4" value={enteredPin} onChange={e => setEnteredPin(e.target.value)} placeholder="••••" className="w-full text-center text-3xl tracking-[1em] bg-surface-container-highest border border-white/10 rounded-xl p-4 text-on-background focus:border-primary-fixed focus:outline-none mb-6" />
            <div className="flex gap-3">
              <button onClick={() => {
            setShowPinModal(false);
            setEnteredPin('');
          }} className="flex-1 px-4 py-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface-variant transition-colors text-sm font-medium">
                {t("auto.cancel")}
              </button>
              <button onClick={() => {
            if (enteredPin === '1234') {
              setIsLocked(false);
              setShowPinModal(false);
              setEnteredPin('');
            } else {
              console.log("❌ PIN Supervisor Incorrecto");
              setEnteredPin('');
            }
          }} className="flex-1 px-4 py-3 rounded-xl bg-primary-fixed hover:bg-primary-fixed/90 text-background transition-colors text-sm font-medium">
                {t("auto.validate")}
              </button>
            </div>
          </div>
        </div>}

      {/* Desktop Navigation Shell (from Stitch) */}
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
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-emerald-500" /> {language.toUpperCase()}
              </span>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-transparent border-none text-[9px] text-white hover:text-emerald-400 focus:outline-none cursor-pointer appearance-none font-mono text-right">
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
          <button onClick={() => setActiveTab('sgae')} className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center transition-colors border shrink-0 ${activeTab === 'sgae' ? 'border-error text-error bg-error/10' : 'text-error/70 hover:text-error hover:bg-error/10 border-error/20'}`}>
            <span className="material-symbols-outlined text-[18px] notranslate" translate="no">gpp_bad</span>
          </button>
          <button onClick={() => {
          if (isLocked) {
            setShowPinModal(true);
          } else {
            setIsLocked(true);
          }
        }} className={`ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors border shrink-0 ${isLocked ? 'border-error text-error bg-error/10' : 'border-white/10 text-on-surface-variant hover:text-on-background hover:bg-white/5 hover:text-primary-fixed'}`}>
            <span className="material-symbols-outlined notranslate" style={{
            fontVariationSettings: "'FILL' 1"
          }} translate="no">{isLocked ? 'lock' : 'lock_open'}</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'zones' && renderGroupsZones()}
      {activeTab === 'mixes' && renderMixes()}
      {activeTab === 'ads' && renderAds()}
      {activeTab === 'schedule' && renderSchedule()}
      {activeTab === 'settings' && renderSettings()}
      {activeTab === 'sgae' && renderSgaeShield()}
      {/* Footer de Atribución (Fase 9) */}
      <footer className="w-full text-center shrink-0 border-t border-white/5 mt-12" style={{
      padding: '16px',
      fontSize: '0.8rem',
      color: '#888'
    }}>
        <p className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <span>{t("auto.created_by")} <a href="https://github.com/produktes-code" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-primary-fixed transition-colors font-semibold">produktes-code</a></span>
          <span className="hidden sm:inline opacity-30">•</span>
          <a href="https://github.com/produktes-code/brand-music-curator" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-primary-fixed transition-colors font-semibold">GitHub</a>
        </p>
      </footer>
    </div>;
}