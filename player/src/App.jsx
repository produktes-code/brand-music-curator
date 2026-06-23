import { useState, useEffect, useRef } from 'react';
import './App.css';
import { LayoutDashboard, Map, Calendar, Settings, ShieldAlert, MoreVertical, Play, Pause, Shuffle, Repeat, SkipBack, SkipForward, Mic2, Globe, BrainCircuit } from 'lucide-react';
import MusicUpload from './components/MusicUpload';

const AVAILABLE_GENRES = [
  'Indie Pop', 'Deep House', 'Chillout', 'Jazz', 'Rock', 'Pop Comercial', 'Latino/Urbano', 
  'Clásica', 'Blues', 'Soul', 'Lo-Fi Hip Hop', 'Acoustic Folk', 'Bossa Nova', 'Tech House', 
  'Nu-Disco', 'Ambient', 'R&B', 'Reggae', 'Funk', 'Synthwave', 'Classical Crossover', 
  'Afrobeat', 'Electro Swing', 'Neo-Soul', 'Alternative Rock', 'Country', 'K-Pop', 
  'Flamenco Chill', 'Trap', 'Lounge', 'Trip Hop', 'Melodic Techno', 'Minimal Synth',
  'Baroque', 'Post-Rock', 'Ska', 'Gospel', 'Bluegrass', 'Samba', 'Tango', 'Salsa', 
  'Downtempo', 'Vaporwave', 'Shoegaze', 'Dream Pop'
].sort();

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
  'Lunes': { es: 'Lunes', en: 'Monday', de: 'Montag', ru: 'Понедельник', ja: '月曜日', uk: 'Понеділок', zh: '星期一' },
  'Martes': { es: 'Martes', en: 'Tuesday', de: 'Dienstag', ru: 'Вторник', ja: '火曜日', uk: 'Вівторок', zh: '星期二' },
  'Miércoles': { es: 'Miércoles', en: 'Wednesday', de: 'Mittwoch', ru: 'Среда', ja: '水曜日', uk: 'Середа', zh: '星期三' },
  'Jueves': { es: 'Jueves', en: 'Thursday', de: 'Donnerstag', ru: 'Четверг', ja: '木曜日', uk: 'Четвер', zh: '星期四' },
  'Viernes': { es: 'Viernes', en: 'Friday', de: 'Freitag', ru: 'Пятница', ja: '金曜日', uk: 'П’ятниця', zh: '星期五' },
  'Sábado': { es: 'Sábado', en: 'Saturday', de: 'Samstag', ru: 'Суббота', ja: '土曜日', uk: 'Субота', zh: '星期六' },
  'Domingo': { es: 'Domingo', en: 'Sunday', de: 'Sonntag', ru: 'Воскресенье', ja: '日曜日', uk: 'Неділя', zh: '星期日' }
};

const SLOT_TRANSLATIONS = {
  'Mañana': { es: 'Mañana', en: 'Morning', de: 'Morgen', ru: 'Утро', ja: '朝', uk: 'Ранок', zh: '上午' },
  'Mediodía': { es: 'Mediodía', en: 'Noon', de: 'Mittag', ru: 'Полдень', ja: '昼', uk: 'Полудень', zh: '中午' },
  'Tarde': { es: 'Tarde', en: 'Afternoon', de: 'Nachmittag', ru: 'День', ja: '夕方', uk: 'День', zh: '下午' },
  'Noche/Cierre': { es: 'Noche/Cierre', en: 'Night/Closing', de: 'Nacht/Schließung', ru: 'Ночь/Закрытие', ja: '夜 / 閉店', uk: 'Ніч/Закриття', zh: '晚上/打烊' }
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

  const t = (translations) => {
    if (typeof translations === 'string') return translations;
    return translations[language] || translations['en'] || translations['es'] || '';
  };
  
  // Dashboard State
  const [activeTrack, setActiveTrack] = useState({ id: 1, title: 'Ocean Drive', artist: 'Tidal Drifters', duration: '3:45', source: 'Local Cache', album: 'The Algorithm EP' });

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
        setGroups(formattedGroups.length > 0 ? formattedGroups : [
          { id: 1, name: '📍 Default Group', zones: [] }
        ]);
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
            ctx.strokeStyle = `rgba(195, 244, 0, ${0.1 + (j * 0.15)})`;
            
            for (let i = 0; i <= 360; i++) {
                const angle = (i * Math.PI) / 180;
                let noise = 0;
                if (isPlaying) {
                  noise = Math.sin(angle * (3 + j) + time * 2) * (15 + j * 5) + Math.cos(angle * (2 - j) + time * 3) * 10;
                } else {
                  noise = Math.sin(angle * (3 + j) + time * 0.5) * (5 + j * 2);
                }
                
                const r = baseRadius + noise + (j * 15);
                const x = centerX + Math.cos(angle) * r;
                const y = centerY + Math.sin(angle) * r;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
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
    } catch (e) {
      console.error("Error adding group:", e);
    }
  };

  const handleAddMix = async () => {
    if (!newMixName.trim() || isLocked) return;
    try {
      const response = await fetch(`${API_URL}/api/mixes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `✨ AI Mix: ${brandPromptText.substring(0, 15)}...`,
            genre_a: isRelax ? 'Lo-Fi Hip Hop' : (isUrban ? 'Trap' : 'Nu-Disco'),
            genre_b: isRelax ? 'Acoustic Folk' : (isUrban ? 'Afrobeat' : 'Tech House'),
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
      setAds(prev => [{ id: Date.now(), text: adCopy, voice: adVoice, status: 'Active' }, ...prev]);
      setIsGeneratingAd(false);
      setAdCopy('');
    }, 2000);
  };

  const handleSaveMix = async (mix) => {
    if (isLocked) return;
    try {
      const response = await fetch(`${API_URL}/api/mixes/${mix.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
        alert(t({
          es: `✅ Mix "${mix.name}" guardado exitosamente en el servidor.`,
          en: `✅ Mix "${mix.name}" successfully saved to the server.`,
          de: `✅ Mix "${mix.name}" erfolgreich auf dem Server gespeichert.`,
          ru: `✅ Микс "${mix.name}" успешно сохранен на сервере.`,
          ja: `✅ ミックス "${mix.name}" がサーバーに正常に保存されました。`,
          uk: `✅ Мікс "${mix.name}" успішно збережено на сервері.`,
          zh: `✅ 混音 "${mix.name}" 已成功保存到服务器。`
        }));
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMix = async (mixId) => {
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
        headers: { 'Content-Type': 'application/json' },
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
    alert(t({
      es: "✅ Configuraciones de Ingeniería Guardadas Exitosamente.",
      en: "✅ Engineering Settings Saved Successfully.",
      de: "✅ Technische Einstellungen erfolgreich gespeichert.",
      ru: "✅ Инженерные настройки успешно сохранены.",
      ja: "✅ エンジニアリング設定が正常に保存されました。",
      uk: "✅ Інженерні налаштування успішно збережено.",
      zh: "✅ 工程设置保存成功。"
    }));
  };

  const handlePanicButton = () => {
    console.log("🛡️ SGAE SHIELD ACTIVADO");
    setActiveTrack({ id: 101, title: 'Corporate Calm', artist: 'Royalty Free Audio', duration: '2:30', source: 'Local - Certified', album: 'RF Library' });
  };

  const handleUploadSuccess = async (files) => {
    // Process each uploaded file through the Python DSP engine
    for (const file of files) {
      try {
        const response = await fetch(`${API_URL}/api/audio/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
            alert(t({
              es: `🎉 Audio analizado con éxito:\nBPM: ${pythonOutput.bpm}\nTonalidad: ${pythonOutput.key}\nEnergía: ${pythonOutput.energy}`,
              en: `🎉 Audio analyzed successfully:\nBPM: ${pythonOutput.bpm}\nKey: ${pythonOutput.key}\nEnergy: ${pythonOutput.energy}`,
              de: `🎉 Audio erfolgreich analysiert:\nBPM: ${pythonOutput.bpm}\nTonart: ${pythonOutput.key}\nEnergie: ${pythonOutput.energy}`,
              ru: `🎉 Аудио успешно проанализировано:\nBPM: ${pythonOutput.bpm}\nТональность: ${pythonOutput.key}\nЭнергия: ${pythonOutput.energy}`,
              ja: `🎉 オーディオの分析に成功しました:\nBPM: ${pythonOutput.bpm}\nキー: ${pythonOutput.key}\nエネルギー: ${pythonOutput.energy}`,
              uk: `🎉 Аудіо успішно проаналізовано:\nBPM: ${pythonOutput.bpm}\nТональність: ${pythonOutput.key}\nЕнергія: ${pythonOutput.energy}`,
              zh: `🎉 音频分析成功：\nBPM: ${pythonOutput.bpm}\n调性: ${pythonOutput.key}\n能量: ${pythonOutput.energy}`
            }));
          } else {
            alert(t({
              es: `❌ Error al procesar audio: ${result.output}`,
              en: `❌ Error processing audio: ${result.output}`,
              de: `❌ Fehler bei der Audioverarbeitung: ${result.output}`,
              ru: `❌ Ошибка при обработке аудио: ${result.output}`,
              ja: `❌ オーディオ処理エラー: ${result.output}`,
              uk: `❌ Помилка при обробці аудіо: ${result.output}`,
              zh: `❌ 处理音频时发生错误: ${result.output}`
            }));
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
  const renderLockedWarning = () => (
    <div className="bg-error-container/20 border border-error text-error px-5 py-3 rounded-xl mb-6 font-medium flex items-center gap-3 text-sm backdrop-blur-md">
      <ShieldAlert className="w-5 h-5"/>
      <span>{t({
        es: 'INTERFAZ BLOQUEADA: Controles locales deshabilitados. Desbloquee con el PIN supervisor para guardar cambios.',
        en: 'INTERFACE LOCKED: Local controls disabled. Unlock with supervisor PIN to save changes.',
        de: 'INTERFACES GESPERRT: Lokale Steuerelemente deaktiviert. Entsperren Sie mit der Supervisor-PIN, um Änderungen zu speichern.',
        ru: 'ИНТЕРФЕЙС ЗАБЛОКИРОВАН: Локальное управление отключено. Разблокируйте с помощью PIN-кода супервизора для сохранения изменений.',
        ja: 'インターフェースがロックされています：ローカルコントロールは無効です。変更を保存するには、スーパーバイザーのPINでロックを解除してください。',
        uk: 'ІНТЕРФЕЙС ЗАБЛОКОВАНО: Локальне керування вимкнено. Розблокуйте за допомогою PIN-коду супервізора для збереження змін.',
        zh: '接口已锁定：本地控制已禁用。使用管理员 PIN 解锁以保存更改。'
      })}</span>
    </div>
  );

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {/* Context Header & Licensing */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <p className="font-mono-data text-mono-data text-on-surface-variant mb-1 uppercase tracking-widest text-[10px] opacity-70">
            {t({ es: 'Ubicación Activa', en: 'Active Location', de: 'Aktiver Standort', ru: 'Активная локация', ja: 'アクティブな場所', uk: 'Активна локація', zh: '激活的位置' })}
          </p>
          <div className="flex items-center gap-3">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-light tracking-tight">Lux Boutique - Madrid</h2>
            <span className="material-symbols-outlined text-on-surface-variant text-sm hover:text-primary-fixed transition-colors cursor-pointer notranslate" translate="no">expand_more</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-surface-container-low/50 backdrop-blur-md shadow-sm">
          <div className="w-2 h-2 rounded-full bg-primary-fixed pulse-dot"></div>
          <span className="font-mono-data text-mono-data text-[11px] text-on-background opacity-90 uppercase tracking-wider">
            {t({
              es: 'Licencia Comercial',
              en: 'Commercial License',
              de: 'Gewerbliche Lizenz',
              ru: 'Коммерческая лицензия',
              ja: '商業ライセンス',
              uk: 'Комерційна ліцензія',
              zh: '商业许可'
            })}: <span className="text-primary-fixed">{t({
              es: 'Activa / Segura',
              en: 'Active / Safe',
              de: 'Aktiv / Sicher',
              ru: 'Активна / Безопасна',
              ja: 'アクティブ / 安全',
              uk: 'Активна / Безпечна',
              zh: '激活 / 安全'
            })}</span>
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
          
          {isLocked && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
              <ShieldAlert className="w-12 h-12 text-error mb-4" />
              <h3 className="text-xl text-on-background font-medium mb-2">
                {t({ es: 'Control Bloqueado', en: 'Control Locked', de: 'Steuerung Gesperrt', ru: 'Управление заблокировано', ja: 'コントロールロック中', uk: 'Керування заблоковано', zh: '控制锁定' })}
              </h3>
              <p className="text-on-surface-variant text-sm mb-6">
                {t({ es: 'Gestionado remotamente por central', en: 'Managed remotely by headquarters', de: 'Fernsteuerung durch Zentrale', ru: 'Управляется удаленно из центра', ja: '本部によるリモート管理中', uk: 'Керується віддалено з центру', zh: '由总部远程管理' })}
              </p>
              <button onClick={() => setShowPinModal(true)} className="bg-error hover:bg-error/80 text-background px-6 py-2 rounded-full font-medium transition-colors">
                {t({ es: 'Desbloquear', en: 'Unlock', de: 'Entsperren', ru: 'Разблокировать', ja: 'ロック解除', uk: 'Розблокувати', zh: '解锁' })}
              </button>
            </div>
          )}

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full bg-surface-container-high/40 border border-white/5 font-mono-data text-mono-data text-[10px] text-primary-fixed uppercase tracking-widest flex items-center gap-2 backdrop-blur-md">
                  <span className="material-symbols-outlined text-[14px] notranslate" style={{fontVariationSettings: "'FILL' 1"}} translate="no">graphic_eq</span>
                  {t({ es: 'Deep House', en: 'Deep House', de: 'Deep House', ru: 'Дип-хаус', ja: 'ディープハウス', uk: 'Діп-хаус', zh: '深沉浩室' })}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-surface-container-high/30 border border-white/5 font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest backdrop-blur-md">
                  {t({ es: 'Flujo Matutino', en: 'Morning Flow', de: 'Morgen-Flow', ru: 'Утренний поток', ja: '朝のフロー', uk: 'Ранковий потік', zh: '早晨流' })}
                </span>
                {iotModulation && (
                  <span className="px-4 py-1.5 rounded-full bg-primary-fixed/10 border border-primary-fixed/20 font-mono-data text-[10px] text-primary-fixed uppercase tracking-widest backdrop-blur-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] notranslate" translate="no">cloud</span> IoT Sync
                  </span>
                )}
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
                  <button className="text-on-background hover:text-primary-fixed btn-minimal"><span className="material-symbols-outlined text-[28px] notranslate" style={{fontVariationSettings: "'FILL' 1"}} translate="no">skip_previous</span></button>
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-surface-container-high/80 border border-white/10 text-on-background flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-primary-fixed/50 hover:text-primary-fixed active:scale-95 transition-all backdrop-blur-xl">
                    <span className="material-symbols-outlined text-[28px] notranslate" style={{fontVariationSettings: "'FILL' 1"}} translate="no">{isPlaying ? 'pause' : 'play_arrow'}</span>
                  </button>
                  <button className="text-on-background hover:text-primary-fixed btn-minimal"><span className="material-symbols-outlined text-[28px] notranslate" style={{fontVariationSettings: "'FILL' 1"}} translate="no">skip_next</span></button>
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
                {t({ es: 'Arquitectura Sónica', en: 'Sonic Architecture', de: 'Schallarchitektur', ru: 'Звуковая архитектура', ja: '音響アーキテクチャ', uk: 'Звукова архітектура', zh: '声音架构' })}
              </h4>
              <span className="material-symbols-outlined text-primary-fixed/40 text-[18px] notranslate" translate="no">waves</span>
            </div>
            <div className="h-32 flex items-end justify-between gap-[2px] w-full mt-auto relative z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
              {[0.1,0.3,0.2,0.5,0.4,0.6,0.2,0.7,0.3,0.1,0.5,0.8,0.4,0.2].map((delay, i) => (
                <div key={i} className="w-full bg-primary-fixed/60 rounded-t-sm wave-bar" style={{animationDelay: `${delay}s`}}></div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-primary-fixed/10 to-transparent pointer-events-none z-0"></div>
          </div>

          <div className="glass-panel rounded-2xl p-6 flex-1 glass-card-inner relative overflow-hidden">
            <div className="grain-overlay"></div>
            <h4 className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-[0.2em] font-medium mb-8 relative z-10">
              {t({ es: 'Métricas en Tiempo Real', en: 'Real-time Metrics', de: 'Echtzeit-Metriken', ru: 'Метрики в реальном времени', ja: 'リアルタイムメトリクス', uk: 'Метрики в реальному часі', zh: '实时指标' })}
            </h4>
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-end">
                  <span className="font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">
                    {t({ es: 'Energía', en: 'Energy', de: 'Energie', ru: 'Энергия', ja: 'エネルギー', uk: 'Енергія', zh: '能量' })} {iotModulation && '(IoT Auto)'}
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
                    {t({ es: 'Memoria RAM (Libre / Total)', en: 'Memory RAM (Free / Total)', de: 'Arbeitsspeicher RAM (Frei / Gesamt)', ru: 'Оперативная память RAM (Свободно / Всего)', ja: 'メモリ RAM (空き / 合計)', uk: 'Оперативна пам\'ять RAM (Вільна / Всього)', zh: '内存 RAM (空闲 / 总共)' })}
                  </span>
                  <span className="font-mono-data text-mono-data text-[11px] font-medium text-on-background">{telemetry.memory}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between items-end">
                  <span className="font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">
                    {t({ es: 'Latencia de Red (8.8.8.8)', en: 'Network Latency (8.8.8.8)', de: 'Netzwerklatenz (8.8.8.8)', ru: 'Задержка сети (8.8.8.8)', ja: 'ネットワーク遅延 (8.8.8.8)', uk: 'Затримка мережі (8.8.8.8)', zh: '网络延迟 (8.8.8.8)' })}
                  </span>
                  <span className="font-mono-data text-mono-data text-[11px] font-medium text-on-background">{telemetry.network_latency_ms} ms</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between items-end">
                  <span className="font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">
                    {t({ es: 'Estado de Hardware', en: 'Hardware Status', de: 'Hardware-Status', ru: 'Состояние оборудования', ja: 'ハードウェアステータス', uk: 'Стан обладнання', zh: '硬件状态' })}
                  </span>
                  <span className="font-mono-data text-mono-data text-[11px] font-medium text-primary-fixed">
                    {telemetry.hardware_status === 'Healthy' ? t({
                      es: 'Saludable',
                      en: 'Healthy',
                      de: 'Gesund',
                      ru: 'В норме',
                      ja: '正常',
                      uk: 'В нормі',
                      zh: '健康'
                    }) : telemetry.hardware_status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  const renderGroupsZones = () => (
    <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {isLocked && renderLockedWarning()}
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-headline-lg text-3xl font-light text-on-background">🏢 {t({ es: 'Grupos y Zonas', en: 'Groups & Zones', de: 'Gruppen & Zonen', ru: 'Группы и зоны', ja: 'グループとゾーン', uk: 'Групи та зони', zh: '组和区域' })}</h2>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder={t({ es: 'Nuevo nombre de grupo...', en: 'New Group Name...', de: 'Neuer Gruppenname...', ru: 'Новое имя группы...', ja: '新規グループ名...', uk: 'Нова назва групи...', zh: '新组名...' })} 
            value={newGroupName} 
            onChange={(e) => setNewGroupName(e.target.value)}
            disabled={isLocked}
            className="bg-surface-container-high/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-on-background focus:border-primary-fixed focus:outline-none" 
          />
          <button onClick={handleAddGroup} disabled={isLocked} className="bg-primary-fixed/10 hover:bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30 px-6 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
            {t({ es: '+ Añadir Grupo', en: '+ Add Group', de: '+ Gruppe hinzufügen', ru: '+ Добавить группу', ja: '+ グループを追加', uk: '+ Додати групу', zh: '+ 添加组' })}
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.id} className="glass-panel rounded-2xl overflow-hidden">
            <div className="p-6 bg-surface-container-high/30 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-medium text-on-background">{group.name}</h3>
              <span className="text-sm text-on-surface-variant">
                {group.zones.length} {t({ es: 'Ubicaciones', en: 'Locations', de: 'Standorte', ru: 'Локации', ja: '拠点', uk: 'Локації', zh: '位置' })}
              </span>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest/50 text-xs uppercase tracking-widest text-on-surface-variant font-mono-data border-b border-white/5">
                    <th className="p-4 font-normal">{t({ es: 'Ubicación', en: 'Location', de: 'Standort', ru: 'Локация', ja: '場所', uk: 'Локація', zh: '位置' })}</th>
                    <th className="p-4 font-normal">{t({ es: 'Nombre de Zona', en: 'Zone Name', de: 'Zonenname', ru: 'Имя зоны', ja: 'ゾーン名', uk: 'Назва зони', zh: '区域名称' })}</th>
                    <th className="p-4 font-normal">{t({ es: 'ID de Hardware', en: 'Hardware ID', de: 'Hardware-ID', ru: 'ID оборудования', ja: 'ハードウェアID', uk: 'ID обладнання', zh: '硬件 ID' })}</th>
                    <th className="p-4 font-normal">{t({ es: 'Estado', en: 'Status', de: 'Status', ru: 'Статус', ja: 'ステータス', uk: 'Статус', zh: '状态' })}</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {group.zones.map(z => (
                    <tr key={z.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-on-background">{z.location}</td>
                      <td className="p-4 text-primary-fixed font-medium">{z.name}</td>
                      <td className="p-4 font-mono text-on-surface-variant opacity-70">{z.hwid}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border ${z.status?.includes('Online') ? 'bg-primary-fixed/10 text-primary-fixed border-primary-fixed/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${z.status?.includes('Online') ? 'bg-primary-fixed' : 'bg-orange-500'}`}></div>
                          {z.status?.includes('Online') ? t({ es: 'En línea', en: 'Online', de: 'Online', ru: 'В сети', ja: 'オンライン', uk: 'В мережі', zh: '在线' }) : t({ es: 'Fuera de línea', en: 'Offline', de: 'Offline', ru: 'Не в сети', ja: 'オフライン', uk: 'Поза мережею', zh: '离线' })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMixes = () => (
    <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {isLocked && renderLockedWarning()}
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-headline-lg text-3xl font-light text-on-background">🎛️ {t({ es: 'Gestor de Mezclas', en: 'Mixes Manager', de: 'Mix-Manager', ru: 'Менеджер миксов', ja: 'ミックスマネージャー', uk: 'Менеджер міксів', zh: '混音管理器' })}</h2>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowBrandPrompt(!showBrandPrompt)} 
            disabled={isLocked} 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-primary-fixed/20 hover:from-purple-500/30 hover:to-primary-fixed/30 text-white border border-primary-fixed/30 px-6 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px] text-primary-fixed notranslate" translate="no">auto_awesome</span>
            {t({ es: 'AI Prompt de Marca', en: 'AI Brand Prompt', de: 'AI Marken-Prompt', ru: 'AI Подсказка бренда', ja: 'AIブランドプロンプト', uk: 'AI Підказка бренду', zh: 'AI 品牌提示词' })}
          </button>
          <div className="w-px h-6 bg-white/10 self-center mx-2"></div>
          <input 
            type="text" 
            placeholder={t({ es: 'Nuevo nombre de mix...', en: 'New Mix Name...', de: 'Neuer Mix-Name...', ru: 'Новое имя микса...', ja: '新規ミックス名...', uk: 'Нова назва міксу...', zh: '新混音名称...' })} 
            value={newMixName} 
            onChange={(e) => setNewMixName(e.target.value)}
            disabled={isLocked}
            className="bg-surface-container-high/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-on-background focus:border-primary-fixed focus:outline-none" 
          />
          <button onClick={handleAddMix} disabled={isLocked} className="bg-primary-fixed/10 hover:bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30 px-6 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
            {t({ es: '+ Crear Mix', en: '+ Create Mix', de: '+ Mix erstellen', ru: '+ Создать микс', ja: '+ ミックス作成', uk: '+ Створити мікс', zh: '+ 创建混音' })}
          </button>
        </div>
      </div>

      {showBrandPrompt && (
        <div className="glass-panel rounded-2xl p-6 mb-8 border border-primary-fixed/30 shadow-[0_0_30px_rgba(195,244,0,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/5 blur-[100px] rounded-full pointer-events-none"></div>
          <h3 className="text-lg font-medium text-on-background mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed notranslate" translate="no">auto_awesome</span>
            {t({ es: 'AI Prompt-a-Playlist', en: 'AI Prompt-to-Playlist', de: 'AI Prompt-zu-Wiedergabeliste', ru: 'AI Подсказка в плейлист', ja: 'AIプロンプトからプレイリスト', uk: 'AI Підказка в плейлист', zh: 'AI 提示到播放列表' })}
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">{t({ es: 'Describe el tipo de negocio, la vibra que buscas, la hora del día o tu target de cliente y nuestro LLM generará la estructura musical perfecta.', en: 'Describe the type of business, the vibe you are looking for, the time of day or your target customer and our LLM will generate the perfect musical structure.', de: 'Beschreiben Sie die Art des Geschäfts, die Atmosphäre, die Sie suchen, die Tageszeit oder Ihren Zielkunden, und unser LLM wird die perfekte Musikstruktur erstellen.', ru: 'Опишите тип бизнеса, атмосферу, которую вы ищете, время суток или вашу целевую аудиторию, и наш LLM создаст идеальную музыкальную структуру.', ja: 'ビジネスの種類、求めている雰囲気、时间帯、またはターゲットとする顾客を説明すると、LLMが完璧な音楽構成を生成します。', uk: 'Опишіть тип бізнесу, атмосферу, яку ви шукаєте, час доби або вашу цільову аудиторію, и наш LLM створить ідеальну музичну структуру.', zh: '描述业务类型、您正在寻找的氛围、一天中的时间或目标客户，我们的 LLM 将生成完美的音乐结构。' })}</p>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder={t({ es: "Ej: 'Música relajada para una cafetería hipster en el centro, público joven, mañanas lluviosas'", en: "E.g.: 'Relaxing music for a hipster cafe downtown, young audience, rainy mornings'", de: "Z.B.: 'Entspannende Musik für ein Hipster-Café in der Innenstadt, junges Publikum, regnerische Morgen'", ru: "Пример: 'Расслабляющая музыка для хипстерского кафе в центре, молодая аудитория, дождливое утро'", ja: "例：「ダウンタウンのヒップスターカフェ向けのリラックス音楽、若い客層、雨の朝」", uk: "Приклад: 'Розслаблююча музика для хіпстерського кафе в центрі, молода аудиторія, дощовий ранок'", zh: "例如：“市中心文青咖啡馆的放松音乐，年轻受众，下雨的早晨”" })}
              value={brandPromptText}
              onChange={(e) => setBrandPromptText(e.target.value)}
              className="flex-1 bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-sm text-on-background focus:border-primary-fixed focus:outline-none"
            />
            <button 
              onClick={handleGenerateBrandMix} 
              disabled={!brandPromptText.trim() || isGeneratingMix}
              className="bg-primary-fixed text-background px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isGeneratingMix ? (
                <><span className="material-symbols-outlined animate-spin text-[18px] notranslate" translate="no">sync</span> {t({ es: 'Procesando...', en: 'Processing...', de: 'Verarbeitung...', ru: 'Обработка...', ja: '処理中...', uk: 'Обробка...', zh: '处理中...' })}</>
              ) : (
                <><span className="material-symbols-outlined text-[18px] notranslate" translate="no">magic_button</span> {t({ es: 'Generar Mix', en: 'Generate Mix', de: 'Mix generieren', ru: 'Создать микс', ja: 'ミックス生成', uk: 'Створити мікс', zh: '生成混音' })}</>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mixes.map((mix, idx) => (
          <div key={mix.id} className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-on-background truncate pr-4">{mix.name}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 block font-mono-data">{t({ es: 'Estilo A (Base)', en: 'Style A (Base)', de: 'Stil A (Basis)', ru: 'Стиль А (Основа)', ja: 'スタイルA（ベース）', uk: 'Стиль А (Основа)', zh: '风格 A（基础）' })}</label>
                <select 
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-sm text-on-background focus:border-primary-fixed focus:outline-none disabled:opacity-50 appearance-none" 
                  value={mix.genre_a} 
                  disabled={isLocked}
                  onChange={(e) => { const nm = [...mixes]; nm[idx].genre_a = e.target.value; setMixes(nm); }}
                >
                  {AVAILABLE_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 block font-mono-data">{t({ es: 'Estilo B', en: 'Style B', de: 'Stil B', ru: 'Стиль B', ja: 'スタイルB', uk: 'Стиль B', zh: '风格 B' })}</label>
                <select 
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-sm text-on-background focus:border-primary-fixed focus:outline-none disabled:opacity-50 appearance-none" 
                  value={mix.genre_b} 
                  disabled={isLocked}
                  onChange={(e) => { const nm = [...mixes]; nm[idx].genre_b = e.target.value; setMixes(nm); }}
                >
                  {AVAILABLE_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono-data text-primary-fixed mb-2 tracking-wider">
                <span>{mix.genre_a}: {mix.ratio}%</span>
                <span>{mix.genre_b}: {100 - mix.ratio}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none accent-primary-fixed disabled:opacity-50"
                value={mix.ratio} 
                disabled={isLocked}
                onChange={(e) => { const nm = [...mixes]; nm[idx].ratio = parseInt(e.target.value); setMixes(nm); }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 block font-mono-data">{t({ es: 'Energía / Tempo', en: 'Energy / Tempo', de: 'Energie / Tempo', ru: 'Энергия / Темп', ja: 'エネルギー / テンポ', uk: 'Енергія / Темп', zh: '能量 / 节奏' })}</label>
                <select className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-sm text-on-background focus:border-primary-fixed disabled:opacity-50 appearance-none" value={mix.energy_level} disabled={isLocked} onChange={(e) => { const nm = [...mixes]; nm[idx].energy_level = e.target.value; setMixes(nm); }}>
                  {ENERGY_LEVELS.map(el => <option key={el} value={el}>{t({ es: el === 'Low' ? 'Bajo' : el === 'Medium' ? 'Medio' : 'Alto', en: el, de: el === 'Low' ? 'Niedrig' : el === 'Medium' ? 'Mittel' : 'Hoch', ru: el === 'Low' ? 'Низкий' : el === 'Medium' ? 'Средний' : 'Высокий', ja: el === 'Low' ? '低' : el === 'Medium' ? '中' : '高', uk: el === 'Low' ? 'Низький' : el === 'Medium' ? 'Середній' : 'Високий', zh: el === 'Low' ? '低' : el === 'Medium' ? '中' : '高' })}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 block font-mono-data">{t({ es: 'Cuñas / Anuncios', en: 'Cuñas / Ads', de: 'Werbespots', ru: 'Реклама', ja: 'CM / 广告', uk: 'Реклама / Оголошення', zh: '广告插播' })}</label>
                <select className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-sm text-on-background focus:border-primary-fixed disabled:opacity-50 appearance-none" value={mix.ad_frequency} disabled={isLocked} onChange={(e) => { const nm = [...mixes]; nm[idx].ad_frequency = parseInt(e.target.value); setMixes(nm); }}>
                  <option value={15}>{t({ es: 'Cada 15m', en: 'Every 15m', de: 'Alle 15m', ru: 'Каждые 15 мин', ja: '15分ごと', uk: 'Кожні 15 хв', zh: '每 15 分钟' })}</option>
                  <option value={30}>{t({ es: 'Cada 30m', en: 'Every 30m', de: 'Alle 30m', ru: 'Каждые 30 мин', ja: '30分ごと', uk: 'Кожні 30 хв', zh: '每 30 分钟' })}</option>
                  <option value={45}>{t({ es: 'Cada 45m', en: 'Every 45m', de: 'Alle 45m', ru: 'Каждые 45 мин', ja: '45分ごと', uk: 'Кожні 45 хв', zh: '每 45 分钟' })}</option>
                  <option value={60}>{t({ es: 'Cada 60m', en: 'Every 60m', de: 'Alle 60m', ru: 'Каждые 60 min', ja: '60分ごと', uk: 'Кожні 60 хв', zh: '每 60 分钟' })}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-3 text-sm text-on-surface-variant cursor-pointer hover:text-on-background transition-colors">
                <input type="checkbox" className="rounded border-white/20 bg-surface-container-highest text-primary-fixed focus:ring-primary-fixed/50 disabled:opacity-50" checked={mix.blockExplicit} disabled={isLocked} onChange={() => { const nm = [...mixes]; nm[idx].blockExplicit = !nm[idx].blockExplicit; setMixes(nm); }} />
                {t({ es: 'Bloquear letras explícitas', en: 'Block Explicit Lyrics', de: 'Explizite Texte blockieren', ru: 'Блокировать ненормативную лексику', ja: '不適切な歌詞をブロック', uk: 'Блокувати ненормативну лексику', zh: '屏蔽不良歌词' })}
              </label>
              <label className="flex items-center gap-3 text-sm text-on-surface-variant cursor-pointer hover:text-on-background transition-colors">
                <input type="checkbox" className="rounded border-white/20 bg-surface-container-highest text-primary-fixed focus:ring-primary-fixed/50 disabled:opacity-50" checked={mix.blockUrban} disabled={isLocked} onChange={() => { const nm = [...mixes]; nm[idx].blockUrban = !nm[idx].blockUrban; setMixes(nm); }} />
                {t({ es: 'Bloquear Reggaeton/Urbano', en: 'Block Reggaeton/Urban', de: 'Reggaeton/Urban blockieren', ru: 'Блокировать реггетон/урбан', ja: 'レゲトン/アーバンをブロック', uk: 'Блокувати реггетон/урбан', zh: '屏蔽雷鬼动/城市音乐' })}
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5 mt-2">
              <button disabled={isLocked} onClick={() => handleSaveMix(mix)} className="flex-1 bg-surface-container-high hover:bg-surface-bright text-on-background px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
                {t({ es: 'Guardar', en: 'Save', de: 'Speichern', ru: 'Сохранить', ja: '保存', uk: 'Зберегти', zh: '保存' })}
              </button>
              <button disabled={isLocked} onClick={() => handleDeleteMix(mix.id)} className="flex-1 bg-error/10 hover:bg-error/20 text-error border border-error/20 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
                {t({ es: 'Eliminar', en: 'Delete', de: 'Löschen', ru: 'Удалить', ja: '削除', uk: 'Видалити', zh: '删除' })}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAds = () => (
    <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {isLocked && renderLockedWarning()}
      <h2 className="font-headline-lg text-3xl font-light text-on-background mb-2">🎙️ {t({ es: 'Generador de Cuñas (TTS)', en: 'Ad Generator (Text-to-Speech)', de: 'Werbespot-Generator (TTS)', ru: 'Генератор объявлений (TTS)', ja: '音声広告ジェネレーター (TTS)', uk: 'Генератор оголошень (TTS)', zh: '语音广告生成器 (TTS)' })}</h2>
      <p className="text-on-surface-variant mb-8 text-sm">{t({ es: 'Escribe tu promoción y nuestra IA generará una cuña publicitaria hiperrealista lista para sonar en tus locales.', en: 'Write your promotion and our AI will generate a hyper-realistic commercial slice ready to play in your stores.', de: 'Schreiben Sie Ihre Promotion und unsere KI erstellt einen hyperrealistischen Werbespot, der in Ihren Geschäften abgespielt werden kann.', ru: 'Напишите свою промо-акцию, и наш искусственный интеллект создаст гиперреалистичное объявление, готовое к воспроизведению в ваших магазинах.', ja: 'プロモーションテキストを入力すると、AIが店舗で再生可能な超リアルな音声広告を生成します。', uk: 'Напишіть свою промо-акцію, і наш ШІ створить гіперреалістичне оголошення, готове до відтворення у ваших магазинах.', zh: '写下您的促销内容，我们的 AI 将生成一个超逼真的广告片，随时可以在您的店面播放。' })}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl p-8">
          <h3 className="font-medium text-on-background mb-4">{t({ es: 'Crear nueva campaña', en: 'Create New Campaign', de: 'Neue Kampagne erstellen', ru: 'Создать новую кампанию', ja: '新規キャンペーン作成', uk: 'Створити нову кампанію', zh: '创建新活动' })}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-on-surface-variant mb-2 block">{t({ es: 'Texto de la Cuña', en: 'Ad Copy Text', de: 'Werbespot-Text', ru: 'Текст объявления', ja: '広告原稿テキスト', uk: 'Текст оголошення', zh: '广告片文本' })}</label>
              <textarea 
                className="w-full bg-surface-container-highest border border-white/10 rounded-xl p-4 text-sm text-on-background focus:border-primary-fixed focus:outline-none resize-none h-32"
                placeholder={t({ es: 'Ej: Atención clientes, aprovechen nuestro descuento del 20% en la sección de accesorios de verano...', en: 'E.g.: Attention customers, take advantage of our 20% discount in the summer accessories section...', de: 'Z.B.: Achtung Kunden, nutzen Sie unseren Rabatt von 20 % in der Rubrik Sommerzubehör...', ru: 'Пример: Уважаемые клиенты, воспользуйтесь нашей скидкой 20% в отделе летних аксессуаров...', ja: '例：お客様にお知らせいたします。ただいまサマーアクセサリーコーナーにて20%OFFキャンペーンを実施中です...', uk: 'Приклад: Шановні клієнти, скористайтеся нашою знижкою 20% у відділі літніх аксесуарів...', zh: '例如：各位顾客请注意，夏季配饰区现正推出8折优惠，欢迎选购...' })}
                value={adCopy}
                onChange={(e) => setAdCopy(e.target.value)}
                disabled={isLocked}
              />
            </div>
            
            <div>
              <label className="text-xs text-on-surface-variant mb-2 block">{t({ es: 'Voz Sintética IA', en: 'AI Synthetic Voice', de: 'KI-Synthetische Stimme', ru: 'Синтетический голос ИИ', ja: 'AI合成音声', uk: 'Синтетичний голос ШІ', zh: 'AI 合成语音' })}</label>
              <select 
                className="w-full bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-sm text-on-background focus:border-primary-fixed focus:outline-none appearance-none disabled:opacity-50"
                value={adVoice}
                onChange={(e) => setAdVoice(e.target.value)}
                disabled={isLocked}
              >
                <option value="Elena (ES - Mujer)">{t({ es: 'Elena (España - Mujer, Joven)', en: 'Elena (Spain - Female, Young)', de: 'Elena (Spanien - Weiblich, Jung)', ru: 'Елена (Испания - Женский, Молодой)', ja: 'エレナ (スペイン - 女性、若い)', uk: 'Олена (Іспанія - Жіночий, Молодий)', zh: '埃琳娜 (西班牙 - 女性，年轻)' })}</option>
                <option value="Marcos (ES - Hombre)">{t({ es: 'Marcos (España - Hombre, Grave)', en: 'Marcos (Spain - Male, Deep)', de: 'Marcos (Spanien - Männlich, Tief)', ru: 'Маркос (Испания - Мужской, Глубокий)', ja: 'マルコス (スペイン - 男性、低い)', uk: 'Маркос (Іспанія - Чоловічий, Глибокий)', zh: '马科斯 (西班牙 - 男性，深沉)' })}</option>
                <option value="Sofia (MX - Mujer)">{t({ es: 'Sofia (México - Mujer, Amigable)', en: 'Sofia (Mexico - Female, Friendly)', de: 'Sofia (Mexiko - Weiblich, Freundlich)', ru: 'София (Мексика - Женский, Дружелюбный)', ja: 'ソフィア (メキシコ - 女性、フレンドリー)', uk: 'Софія (Мексика - Жіночий, Приязний)', zh: '索菲亚 (墨西哥 - 女性，友好)' })}</option>
                <option value="Diego (AR - Hombre)">{t({ es: 'Diego (Argentina - Hombre, Dinámico)', en: 'Diego (Argentina - Male, Dynamic)', de: 'Diego (Argentinien - Männlich, Dynamisch)', ru: 'Диего (Аргентина - Мужской, Динамичный)', ja: 'ディエゴ (アルゼンチン - 男性、ダイナミック)', uk: 'Дієго (Аргентина - Чоловічий, Динамічний)', zh: '迭戈 (阿根廷 - 男性，活力)' })}</option>
              </select>
            </div>
 
            <button 
              onClick={handleGenerateAd}
              disabled={!adCopy.trim() || isGeneratingAd || isLocked}
              className="w-full bg-primary-fixed text-background py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary-fixed/90 transition-colors disabled:opacity-50 mt-4 shadow-[0_0_15px_rgba(195,244,0,0.3)]"
            >
              {isGeneratingAd ? (
                <><span className="material-symbols-outlined animate-spin text-[18px] notranslate" translate="no">sync</span> {t({ es: 'Renderizando Audio...', en: 'Rendering Audio...', de: 'Audio wird gerendert...', ru: 'Рендеринг аудио...', ja: 'オーディオレンダリング中...', uk: 'Рендеринг аудіо...', zh: '正在渲染音频...' })}</>
              ) : (
                <><span className="material-symbols-outlined text-[18px] notranslate" translate="no">mic</span> {t({ es: 'Generar y Guardar Cuña', en: 'Generate and Save Ad', de: 'Werbespot generieren & speichern', ru: 'Создать и сохранить объявление', ja: '音声広告を生成して保存', uk: 'Створити та зберегти оголошення', zh: '生成并保存广告' })}</>
              )}
            </button>
          </div>
        </div>
 
        <div className="space-y-4">
          <h3 className="font-medium text-on-background mb-4">{t({ es: 'Campañas Activas', en: 'Active Campaigns', de: 'Aktive Kampagnen', ru: 'Активные кампании', ja: '有効なキャンペーン', uk: 'Активні кампанії', zh: '活动中的推广' })}</h3>
          {ads.map(ad => (
            <div key={ad.id} className="glass-panel rounded-xl p-4 flex gap-4 items-center border-l-4 border-l-primary-fixed">
              <button className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-fixed shrink-0 hover:bg-primary-fixed/20 transition-colors">
                <span className="material-symbols-outlined notranslate" style={{fontVariationSettings: "'FILL' 1"}} translate="no">play_arrow</span>
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
            </div>
          ))}
          {ads.length === 0 && (
            <div className="text-center p-8 text-on-surface-variant border border-dashed border-white/10 rounded-xl">
              {t({ es: 'No hay campañas activas', en: 'No active campaigns', de: 'Keine aktiven Kampagnen', ru: 'Нет активных кампаний', ja: '有効なキャンペーンはありません', uk: 'Немає активних кампаній', zh: '暂无活动中的推广' })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {isLocked && renderLockedWarning()}
      <h2 className="font-headline-lg text-3xl font-light text-on-background mb-2">📅 {t({ es: 'Visual Dayparting', en: 'Visual Dayparting', de: 'Visuelles Dayparting', ru: 'Визуальное разделение дня', ja: 'ビジュアルデイパーティング', uk: 'Візуальний розподіл дня', zh: '视觉时段划分' })}</h2>
      <p className="text-on-surface-variant mb-8 text-sm">{t({ es: 'Defina qué mezcla suena en cada franja horaria. Los cambios se guardan de forma persistente.', en: 'Define which mix plays in each time slot. Changes are saved persistently.', de: 'Definieren Sie, welcher Mix in jedem Zeitfenster abgespielt wird. Änderungen werden dauerhaft gespeichert.', ru: 'Определите, какой микс воспроизводится в каждом временном интервале. Изменения сохраняются постоянно.', ja: '各時間帯に再生するミックスを定義します。変更は永続的に保存されます。', uk: 'Визначте, який мікс відтворюється в кожному часовому інтервалі. Зміни зберігаються постійно.', zh: '定义每个时间段播放的混音。更改将被持久保存。' })}</p>
      
      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-surface-container-highest/30 border-b border-white/5">
              <th className="p-4 text-xs font-mono-data uppercase tracking-widest text-on-surface-variant w-40">{t({ es: 'Franja Horaria', en: 'Time Slot', de: 'Zeitfenster', ru: 'Временной интервал', ja: '時間帯', uk: 'Часовий інтервал', zh: '时间段' })}</th>
              {DAYS.map(day => <th key={day} className="p-4 text-xs font-mono-data uppercase tracking-widest text-on-background text-center">{t(DAY_TRANSLATIONS[day])}</th>)}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map(slot => (
              <tr key={slot} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 border-r border-white/5">
                  <div className="text-primary-fixed font-medium text-sm mb-1">{t(SLOT_TRANSLATIONS[slot])}</div>
                  <div className="text-[10px] text-on-surface-variant font-mono-data">{SLOT_TIMES[slot]}</div>
                </td>
                {DAYS.map(day => {
                  const mixId = getMixIdForSlot(day, slot);
                  return (
                    <td key={day} className="p-3">
                      <select 
                        className="w-full bg-surface-container-high/50 border border-white/5 rounded-lg px-2 py-2 text-[11px] text-on-background focus:border-primary-fixed focus:outline-none appearance-none cursor-pointer hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                        value={mixId || ''} 
                        disabled={isLocked}
                        onChange={(e) => handleUpdateSchedule(day, slot, e.target.value)}
                      >
                        <option value="">-- {t({ es: 'Vacío', en: 'Empty', de: 'Leer', ru: 'Пусто', ja: '空欄', uk: 'Порожньо', zh: '留空' })} --</option>
                        {mixes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl glass-panel rounded-2xl p-8 max-w-4xl mt-6">
      {isLocked && renderLockedWarning()}
      <h2 className="font-headline-lg text-3xl font-light text-on-background mb-2">⚙️ {t({ es: 'Configuración y Lógica', en: 'Settings & Logic', de: 'Einstellungen & Logik', ru: 'Настройки и логика', ja: '設定とロジック', uk: 'Налаштування та логіка', zh: '设置与逻辑' })}</h2>
      <p className="text-on-surface-variant mb-10 text-sm">{t({ es: 'Gestiona la infraestructura de los sensores y el disco local.', en: 'Manage the sensor infrastructure and local disk storage.', de: 'Verwalten Sie die Sensorinfrastruktur und den lokalen Speicher.', ru: 'Управление инфраструктурой датчиков и локальным хранилищем диска.', ja: 'センサーインフラストラクチャとローカルディスクストレージを管理します。', uk: 'Керуйте інфраструктурою датчиків та локальним сховищем диска.', zh: '管理传感器基础设施和本地磁盘存储。' })}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-primary-fixed font-mono-data uppercase tracking-widest text-[11px] border-b border-white/10 pb-4">{t({ es: 'Arquitectura Fuera de Línea (Freebox)', en: 'Offline Architecture (Freebox)', de: 'Offline-Architektur (Freebox)', ru: 'Автономная архитектура (Freebox)', ja: 'オフラインアーキテクチャ (Freebox)', uk: 'Автономна архітектура (Freebox)', zh: '离线架构 (Freebox)' })}</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-background">{t({ es: 'Límite de Pre-Caché (GB)', en: 'Pre-Caching Limit (GB)', de: 'Pre-Caching Limit (GB)', ru: 'Лимит предварительного кэширования (ГБ)', ja: 'プリキャッシュ制限 (GB)', uk: 'Ліміт попереднього кешування (ГБ)', zh: '预缓存限制 (GB)' })}</span>
            <input type="number" value={cacheLimit} disabled={isLocked} onChange={(e) => setCacheLimit(e.target.value)} className="w-20 bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-center text-on-background focus:border-primary-fixed focus:outline-none disabled:opacity-50" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-background">{t({ es: 'Forzar descarga de caché', en: 'Force Cache Download', de: 'Cache-Download erzwingen', ru: 'Принудительная загрузка кэша', ja: 'キャッシュダウンロードを強制', uk: 'Примусове завантаження кешу', zh: '强制缓存下载' })}</span>
            <button className="text-xs bg-surface-container-high hover:bg-surface-bright text-on-background px-4 py-2 rounded-lg transition-colors border border-white/10 flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] notranslate" translate="no">download</span> {t({ es: 'Sincronizar 14 días', en: 'Sync 14-days', de: '14 Tage synchronisieren', ru: 'Синхронизировать 14 дней', ja: '14日間同期', uk: 'Синхронізувати 14 днів', zh: '同步 14 天' })}
            </button>
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-primary-fixed font-mono-data uppercase tracking-widest text-[11px] border-b border-white/10 pb-4">{t({ es: 'Motor de IA y IoT (Tringbox)', en: 'Tringbox AI Engine & IoT', de: 'Tringbox KI-Engine & IoT', ru: 'ИИ-движок Tringbox и IoT', ja: 'Tringbox AIエンジンとIoT', uk: 'ШІ-движок Tringbox та IoT', zh: 'Tringbox AI 引擎与 IoT' })}</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-background">{t({ es: 'Modulación Neuro-IoT', en: 'Neuro-IoT Modulation', de: 'Neuro-IoT-Modulation', ru: 'Модуляция Neuro-IoT', ja: 'Neuro-IoTモジュレーション', uk: 'Модуляція Neuro-IoT', zh: 'Neuro-IoT 调制' })}</span>
            <button 
              disabled={isLocked} 
              onClick={() => setNeuroActive(!neuroActive)}
              className={`px-4 py-2 rounded-full text-xs font-mono-data uppercase tracking-widest transition-all ${neuroActive ? 'bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30 shadow-[0_0_15px_rgba(195,244,0,0.2)]' : 'bg-surface-container-high text-on-surface-variant border border-white/5'}`}
            >
              {neuroActive ? t({ es: 'ACTIVO', en: 'ACTIVE', de: 'AKTIV', ru: 'АКТИВНО', ja: '有効', uk: 'АКТИВНО', zh: '开启' }) : t({ es: 'DESACTIVADO', en: 'DISABLED', de: 'DEAKTIVIERT', ru: 'ОТКЛЮЧЕНО', ja: '無効', uk: 'ВІДКЛЮЧЕНО', zh: '禁用' })}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm text-on-background">{t({ es: 'Smart IoT Auto-Modulación', en: 'Smart IoT Auto-Modulation', de: 'Smart IoT Auto-Modulation', ru: 'Умная авто-модуляция IoT', ja: 'スマートIoT自動モジュレーション', uk: 'Розумна авто-модуляція IoT', zh: '智能 IoT 自动调制' })}</span>
              <span className="text-[10px] text-on-surface-variant">{t({ es: 'Sincronización con clima y tráfico', en: 'Sync with Weather & Foot Traffic', de: 'Sync mit Wetter & Kundenfrequenz', ru: 'Синхронизация с погодой и потоком клиентов', ja: '天気と人流との同期', uk: 'Синхронізація з погодою та потоком людей', zh: '与天气和人流量同步' })}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" checked={iotModulation} onChange={() => setIotModulation(!iotModulation)} disabled={isLocked}/>
              <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-fixed"></div>
            </label>
          </div>
        </div>
      </div>
 
      <div className="mt-12 flex justify-end">
        <button onClick={handleSaveSettings} disabled={isLocked} className="bg-primary-fixed text-background px-8 py-3 rounded-xl font-medium hover:bg-primary-fixed/90 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(195,244,0,0.3)] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] notranslate" translate="no">save</span> {t({ es: 'Guardar Proyecto', en: 'Save Project', de: 'Projekt speichern', ru: 'Сохранить проект', ja: 'プロジェクトを保存', uk: 'Зберегти проект', zh: '保存项目' })}
        </button>
      </div>
    </div>
  );

  const renderSgaeShield = () => (
    <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl glass-panel rounded-2xl p-10 max-w-4xl relative overflow-hidden border-error/30 mt-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-error/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="flex items-center gap-4 mb-4">
        <ShieldAlert className="w-10 h-10 text-error" />
        <h2 className="font-headline-lg text-3xl font-light text-on-background">{t({ es: 'SGAE Shield (Auditoría Legal)', en: 'SGAE Shield (Legal Audit)', de: 'SGAE-Schild (Rechtsprüfung)', ru: 'SGAE Shield (Юридический аудит)', ja: 'SGAEシールド (法的監査)', uk: 'SGAE Shield (Юридичний аудит)', zh: 'SGAE 盾牌 (法律审计)' })}</h2>
      </div>
      <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed mb-10">
        {t({
          es: 'El escudo protege al establecimiento frente a inspecciones. Mantiene un registro inmutable de reproducciones y fuerza el uso exclusivo de Mixes Royalty-Free en caso de emergencia.',
          en: 'The shield protects the establishment against inspections. It maintains an immutable log of playbacks and forces the exclusive use of Royalty-Free Mixes in case of emergency.',
          de: 'Das Schild schützt den Betrieb vor Kontrollen. Es führt ein unveränderliches Protokoll der Wiedergaben und erzwingt im Notfall die ausschließliche Verwendung lizenzfreier Mixes.',
          ru: 'Щит защищает заведение от проверок. Он ведет неизменяемый журнал воспроизведений и принудительно запускает только Royalty-Free миксы в случае чрезвычайной ситуации.',
          ja: 'このシールドは、立ち入り検査から店舗を保護します。再生ログを不変のまま維持し、緊急時には著作権フリーのミックスのみを強制的に使用します。',
          uk: 'Щит захищає заклад від перевірок. Він веде незмінний журнал відтворень та примусово запускає лише Royalty-Free мікси у випадку надзвичайної ситуації.',
          zh: '该盾牌可以保护店面免受检查。它保留了不可更改的播放日志，并在紧急情况下强制仅使用免版税的混音。'
        })}
      </p>
      
      <button onClick={handlePanicButton} className="w-full md:w-auto bg-error hover:bg-error/80 text-background px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_30px_rgba(255,180,171,0.4)] active:scale-95 flex flex-col items-center gap-2">
        <span>{t({ es: 'ACTIVAR MODO PÁNICO', en: 'ACTIVATE PANIC MODE', de: 'PANIKMODUS AKTIVIEREN', ru: 'АКТИВИРОВАТЬ РЕЖИМ ПАНИКИ', ja: 'パニックモード起動', uk: 'АКТИВУВАТИ РЕЖИМ ПАНІКИ', zh: '激活恐慌模式' })}</span>
        <span className="text-[9px] opacity-80 font-mono-data">{t({ es: 'FORZAR CATÁLOGO LIBRE DE DERECHOS', en: 'FORCE ROYALTY-FREE CATALOG', de: 'LIZENZFREIEN KATALOG ERZWINGEN', ru: 'ПРИНУДИТЕЛЬНЫЙ БЕСПЛАТНЫЙ КАТАЛОГ', ja: 'ロイヤリティフリーカタログ強制', uk: 'ПРИМУСОВИЙ БЕЗКОШТОВНИЙ КАТАЛОГ', zh: '强制免版税音乐目录' })}</span>
      </button>
 
      <div className="mt-12 pt-8 border-t border-white/5">
        <h3 className="text-on-surface-variant font-mono-data uppercase tracking-widest text-[11px] mb-6">{t({ es: 'Registro de Auditoría (Prueba Blockchain Inmutable)', en: 'Audit Log (Immutable Blockchain Proof)', de: 'Audit-Protokoll (Unveränderlicher Blockchain-Nachweis)', ru: 'Журнал аудита (Неизменяемое доказательство блокчейна)', ja: '監査ログ (不変のブロックチェーン証明)', uk: 'Журнал аудиту (Незмінний доказ блокчейну)', zh: '审计日志 (不可篡改的区块链证明)' })}</h3>
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
    </div>
  );

  return (
    <div className="bg-background text-on-background min-h-screen overflow-x-hidden pt-16 md:pt-24 font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col justify-between">
      {/* PIN entry modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-8 text-center border-primary-fixed/20 shadow-[0_0_40px_rgba(195,244,0,0.1)]">
            <ShieldAlert className="w-12 h-12 text-primary-fixed mx-auto mb-4" />
            <h3 className="text-xl text-on-background font-medium mb-2">{t({ es: 'Desbloquear Interfaz', en: 'Unlock Interface', de: 'Schnittstelle entsperren', ru: 'Разблокировать интерфейс', ja: 'インターフェースのロックを解除', uk: 'Розблокувати інтерфейс', zh: '解锁界面' })}</h3>
            <p className="text-on-surface-variant text-sm mb-6">{t({ es: 'Introduce el PIN del supervisor.', en: 'Enter the supervisor PIN.', de: 'Geben Sie die Supervisor-PIN ein.', ru: 'Введите PIN-код супервизора.', ja: 'スーパーバイザーのPINを入力してください。', uk: 'Введіть PIN-код супервізора.', zh: '输入主管的 PIN。' })}<br/><span className="text-[10px] opacity-50 mt-1 block">(PIN: 1234)</span></p>
            <input 
              type="password" 
              maxLength="4" 
              value={enteredPin} 
              onChange={(e) => setEnteredPin(e.target.value)} 
              placeholder="••••"
              className="w-full text-center text-3xl tracking-[1em] bg-surface-container-highest border border-white/10 rounded-xl p-4 text-on-background focus:border-primary-fixed focus:outline-none mb-6"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowPinModal(false);
                  setEnteredPin('');
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface-variant transition-colors text-sm font-medium"
              >
                {t({ es: 'Cancelar', en: 'Cancel', de: 'Abbrechen', ru: 'Отмена', ja: 'キャンセル', uk: 'Скасувати', zh: '取消' })}
              </button>
              <button 
                onClick={() => {
                  if (enteredPin === '1234') {
                    setIsLocked(false);
                    setShowPinModal(false);
                    setEnteredPin('');
                  } else {
                    console.log("❌ PIN Supervisor Incorrecto");
                    setEnteredPin('');
                  }
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-primary-fixed hover:bg-primary-fixed/90 text-background transition-colors text-sm font-medium"
              >
                {t({ es: 'Validar', en: 'Validate', de: 'Validieren', ru: 'Подтвердить', ja: '検証', uk: 'Підтвердити', zh: '验证' })}
              </button>
            </div>
          </div>
        </div>
      )}

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
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent border-none text-[9px] text-white hover:text-emerald-400 focus:outline-none cursor-pointer appearance-none font-mono text-right"
              >
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
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
            <span className="material-symbols-outlined text-[18px] notranslate" translate="no">dashboard</span> {t({ es: 'Dashboard', en: 'Dashboard', de: 'Dashboard', ru: 'Панель', ja: 'ダッシュボード', uk: 'Панель', zh: '仪表板' })}
          </button>
          <button onClick={() => setActiveTab('zones')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === 'zones' ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
            <span className="material-symbols-outlined text-[18px] notranslate" translate="no">map</span> {t({ es: 'Mapa Espacial', en: 'Spatial Map', de: 'Raumkarte', ru: 'Пространственная карта', ja: '空間マップ', uk: 'Просторова карта', zh: '空间地图' })}
          </button>
          <button onClick={() => setActiveTab('mixes')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === 'mixes' ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
            <span className="material-symbols-outlined text-[18px] notranslate" translate="no">graphic_eq</span> {t({ es: 'Mixes', en: 'Mixes', de: 'Mixes', ru: 'Миксы', ja: 'ミックス', uk: 'Мікси', zh: '混音' })}
          </button>
          <button onClick={() => setActiveTab('ads')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === 'ads' ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
            <span className="material-symbols-outlined text-[18px] notranslate" translate="no">campaign</span> {t({ es: 'Anuncios TTS', en: 'Ads TTS', de: 'Werbung TTS', ru: 'Объявления TTS', ja: '音声広告 TTS', uk: 'Оголошення TTS', zh: '语音广告 TTS' })}
          </button>
          <button onClick={() => setActiveTab('schedule')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === 'schedule' ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
            <span className="material-symbols-outlined text-[18px] notranslate" translate="no">calendar_today</span> {t({ es: 'Planificador', en: 'Scheduler', de: 'Planer', ru: 'Планировщик', ja: 'スケジューラー', uk: 'Планувальник', zh: '排程器' })}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === 'settings' ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
            <span className="material-symbols-outlined text-[18px] notranslate" translate="no">settings</span> {t({ es: 'Configuración', en: 'Settings', de: 'Einstellungen', ru: 'Настройки', ja: '設定', uk: 'Налаштування', zh: '设置' })}
          </button>
          <button onClick={() => setActiveTab('sgae')} className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center transition-colors border shrink-0 ${activeTab === 'sgae' ? 'border-error text-error bg-error/10' : 'text-error/70 hover:text-error hover:bg-error/10 border-error/20'}`}>
            <span className="material-symbols-outlined text-[18px] notranslate" translate="no">gpp_bad</span>
          </button>
          <button 
            onClick={() => { if (isLocked) { setShowPinModal(true); } else { setIsLocked(true); } }}
            className={`ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors border shrink-0 ${isLocked ? 'border-error text-error bg-error/10' : 'border-white/10 text-on-surface-variant hover:text-on-background hover:bg-white/5 hover:text-primary-fixed'}`}
          >
            <span className="material-symbols-outlined notranslate" style={{fontVariationSettings: "'FILL' 1"}} translate="no">{isLocked ? 'lock' : 'lock_open'}</span>
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
      <footer className="w-full text-center shrink-0 border-t border-white/5 mt-12" style={{ padding: '16px', fontSize: '0.8rem', color: '#888' }}>
        <p className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
          <span>{t({ es: 'Creado por', en: 'Created by', de: 'Erstellt von', ru: 'Создано', ja: '作成者', uk: 'Створено', zh: '由...创建' })} <a href="https://github.com/produktes-code" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-primary-fixed transition-colors font-semibold">produktes-code</a></span>
          <span className="hidden sm:inline opacity-30">•</span>
          <a href="https://github.com/produktes-code/brand-music-curator" target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-primary-fixed transition-colors font-semibold">GitHub</a>
        </p>
      </footer>
    </div>
  );
}
