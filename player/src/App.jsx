import { useState, useEffect, useRef } from 'react';
import './App.css';
import { LayoutDashboard, Map, Calendar, Settings, ShieldAlert, MoreVertical, Play, Pause, Shuffle, Repeat, SkipBack, SkipForward, Mic2, Globe, BrainCircuit } from 'lucide-react';

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

  const t = (en, es) => language === 'es' ? es : en;
  
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

  // Data Fetching - Local Mock Data
  const fetchData = async () => {
    setGroups([
      { id: 1, name: '📍 Default Group', zones: [
        { id: 1, location: 'Lux Boutique', name: 'Main Zone', hwid: 'FBX-001', status: 'Online' }
      ]}
    ]);
    setMixes([
      { id: 1, name: 'Morning Flow', genre_a: 'Deep House', genre_b: 'Indie Pop', ratio: 70, energy_level: 'Medium', ad_frequency: 30, blockExplicit: true, blockUrban: true }
    ]);
    setAds([
      { id: 1, text: 'Recuerda que con tu tarjeta de socio tienes un 10% de descuento.', voice: 'Marcos (ES - Hombre)', status: 'Active' }
    ]);
    setScheduleMatrix([]);
  };

  useEffect(() => {
    fetchData();
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
    setGroups(prev => [...prev, { id: Date.now(), name: `📍 ${newGroupName}`, zones: [] }]);
    setNewGroupName('');
  };

  const handleAddMix = async () => {
    if (!newMixName.trim() || isLocked) return;
    setMixes(prev => [...prev, { id: Date.now(), name: newMixName, genre_a: 'Indie Pop', genre_b: 'Deep House', ratio: 50, energy_level: 'Medium', ad_frequency: 30, blockExplicit: false, blockUrban: false }]);
    setNewMixName('');
  };

  const handleGenerateBrandMix = async () => {
    if (!brandPromptText.trim() || isLocked) return;
    setIsGeneratingMix(true);
    // Simular llamada al LLM
    setTimeout(() => {
      const isRelax = brandPromptText.toLowerCase().includes('relax') || brandPromptText.toLowerCase().includes('tranquilo') || brandPromptText.toLowerCase().includes('café');
      const isUrban = brandPromptText.toLowerCase().includes('urbano') || brandPromptText.toLowerCase().includes('joven') || brandPromptText.toLowerCase().includes('calle');
      
      const newMix = {
        id: Date.now(),
        name: `✨ AI Mix: ${brandPromptText.substring(0, 15)}...`,
        genre_a: isRelax ? 'Lo-Fi Hip Hop' : (isUrban ? 'Trap' : 'Nu-Disco'),
        genre_b: isRelax ? 'Acoustic Folk' : (isUrban ? 'Afrobeat' : 'Tech House'),
        ratio: 65,
        energy_level: isRelax ? 'Low' : 'Medium',
        ad_frequency: 30,
        blockExplicit: !isUrban,
        blockUrban: isRelax
      };
      setMixes(prev => [newMix, ...prev]);
      setIsGeneratingMix(false);
      setShowBrandPrompt(false);
      setBrandPromptText('');
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
    console.log(`✅ Cambios para el Mix "${mix.name}" guardados localmente.`);
  };

  const handleDeleteMix = async (mixId) => {
    if (isLocked) return;
    setMixes(prev => prev.filter(m => m.id !== mixId));
  };

  const handleUpdateSchedule = async (day, slot, mixId) => {
    if (isLocked) return;
    setScheduleMatrix(prev => {
      const filtered = prev.filter(s => !(s.day_of_week === day && s.time_slot === slot));
      if (mixId) {
        filtered.push({ day_of_week: day, time_slot: slot, mix_id: parseInt(mixId) });
      }
      return filtered;
    });
  };

  const handleSaveSettings = () => {
    if (isLocked) return;
    console.log("✅ Configuraciones de Ingeniería Guardadas Exitosamente.");
  };

  const handlePanicButton = () => {
    console.log("🛡️ SGAE SHIELD ACTIVADO");
    setActiveTrack({ id: 101, title: 'Corporate Calm', artist: 'Royalty Free Audio', duration: '2:30', source: 'Local - Certified', album: 'RF Library' });
  };

  const getMixIdForSlot = (day, slot) => {
    const match = scheduleMatrix.find(s => s.day_of_week === day && s.time_slot === slot);
    return match ? match.mix_id : '';
  };

  // --- VIEWS ---
  const renderLockedWarning = () => (
    <div className="bg-error-container/20 border border-error text-error px-5 py-3 rounded-xl mb-6 font-medium flex items-center gap-3 text-sm backdrop-blur-md">
      <ShieldAlert className="w-5 h-5"/>
      <span>INTERFAZ BLOQUEADA: Controles locales deshabilitados. Desbloquee con el PIN supervisor para guardar cambios.</span>
    </div>
  );

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {/* Context Header & Licensing */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <p className="font-mono-data text-mono-data text-on-surface-variant mb-1 uppercase tracking-widest text-[10px] opacity-70">Active Location</p>
          <div className="flex items-center gap-3">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-light tracking-tight">Lux Boutique - Madrid</h2>
            <span className="material-symbols-outlined text-on-surface-variant text-sm hover:text-primary-fixed transition-colors cursor-pointer">expand_more</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-surface-container-low/50 backdrop-blur-md shadow-sm">
          <div className="w-2 h-2 rounded-full bg-primary-fixed pulse-dot"></div>
          <span className="font-mono-data text-mono-data text-[11px] text-on-background opacity-90 uppercase tracking-wider">Commercial License: <span className="text-primary-fixed">Active / Safe</span></span>
          <span className="material-symbols-outlined text-primary-fixed text-[14px] ml-1 opacity-80">verified_user</span>
        </div>
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
              <h3 className="text-xl text-on-background font-medium mb-2">Control Bloqueado</h3>
              <p className="text-on-surface-variant text-sm mb-6">Gestionado remotamente por central</p>
              <button onClick={() => setShowPinModal(true)} className="bg-error hover:bg-error/80 text-background px-6 py-2 rounded-full font-medium transition-colors">
                Desbloquear
              </button>
            </div>
          )}

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-3">
                <span className="px-4 py-1.5 rounded-full bg-surface-container-high/40 border border-white/5 font-mono-data text-mono-data text-[10px] text-primary-fixed uppercase tracking-widest flex items-center gap-2 backdrop-blur-md">
                  <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>graphic_eq</span>
                  Deep House
                </span>
                <span className="px-4 py-1.5 rounded-full bg-surface-container-high/30 border border-white/5 font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest backdrop-blur-md">
                  Morning Flow
                </span>
                {iotModulation && (
                  <span className="px-4 py-1.5 rounded-full bg-primary-fixed/10 border border-primary-fixed/20 font-mono-data text-[10px] text-primary-fixed uppercase tracking-widest backdrop-blur-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">cloud</span> IoT Sync
                  </span>
                )}
              </div>
              <button className="w-10 h-10 rounded-full bg-surface-container-low/50 border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary-fixed transition-colors backdrop-blur-md">
                <span className="material-symbols-outlined text-sm">more_vert</span>
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
                  <button className="text-on-surface-variant hover:text-on-background btn-minimal"><span className="material-symbols-outlined text-[20px]">shuffle</span></button>
                  <button className="text-on-background hover:text-primary-fixed btn-minimal"><span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>skip_previous</span></button>
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-surface-container-high/80 border border-white/10 text-on-background flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-primary-fixed/50 hover:text-primary-fixed active:scale-95 transition-all backdrop-blur-xl">
                    <span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>{isPlaying ? 'pause' : 'play_arrow'}</span>
                  </button>
                  <button className="text-on-background hover:text-primary-fixed btn-minimal"><span className="material-symbols-outlined text-[28px]" style={{fontVariationSettings: "'FILL' 1"}}>skip_next</span></button>
                  <button className="text-on-surface-variant hover:text-on-background btn-minimal"><span className="material-symbols-outlined text-[20px]">repeat</span></button>
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
              <h4 className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-[0.2em] font-medium">Sonic Architecture</h4>
              <span className="material-symbols-outlined text-primary-fixed/40 text-[18px]">waves</span>
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
            <h4 className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-[0.2em] font-medium mb-8 relative z-10">Real-time Metrics</h4>
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">Energy {iotModulation && '(IoT Auto)'}</span>
                  <span className="font-mono-data text-mono-data text-[12px] font-medium text-on-background">85%</span>
                </div>
                <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary-fixed/80 rounded-full w-[85%] shadow-[0_0_10px_rgba(195,244,0,0.5)]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">Sophistication</span>
                  <span className="font-mono-data text-mono-data text-[12px] font-medium text-on-background">60%</span>
                </div>
                <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-on-background/70 rounded-full w-[60%]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <span className="font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest">BPM</span>
                  <span className="font-mono-data text-mono-data text-[12px] font-medium text-on-background">118</span>
                </div>
                <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary-fixed/40 rounded-full w-[72%]"></div>
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
        <h2 className="font-headline-lg text-3xl font-light text-on-background">🏢 Groups & Zones</h2>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="New Group Name..." 
            value={newGroupName} 
            onChange={(e) => setNewGroupName(e.target.value)}
            disabled={isLocked}
            className="bg-surface-container-high/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-on-background focus:border-primary-fixed focus:outline-none" 
          />
          <button onClick={handleAddGroup} disabled={isLocked} className="bg-primary-fixed/10 hover:bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30 px-6 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
            + Add Group
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.id} className="glass-panel rounded-2xl overflow-hidden">
            <div className="p-6 bg-surface-container-high/30 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-medium text-on-background">{group.name}</h3>
              <span className="text-sm text-on-surface-variant">{group.zones.length} Locations</span>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest/50 text-xs uppercase tracking-widest text-on-surface-variant font-mono-data border-b border-white/5">
                    <th className="p-4 font-normal">Location</th>
                    <th className="p-4 font-normal">Zone Name</th>
                    <th className="p-4 font-normal">Hardware ID</th>
                    <th className="p-4 font-normal">Status</th>
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
                          {z.status || 'Offline'}
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
        <h2 className="font-headline-lg text-3xl font-light text-on-background">🎛️ Mixes Manager</h2>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowBrandPrompt(!showBrandPrompt)} 
            disabled={isLocked} 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-primary-fixed/20 hover:from-purple-500/30 hover:to-primary-fixed/30 text-white border border-primary-fixed/30 px-6 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px] text-primary-fixed">auto_awesome</span>
            AI Brand Prompt
          </button>
          <div className="w-px h-6 bg-white/10 self-center mx-2"></div>
          <input 
            type="text" 
            placeholder="New Mix Name..." 
            value={newMixName} 
            onChange={(e) => setNewMixName(e.target.value)}
            disabled={isLocked}
            className="bg-surface-container-high/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-on-background focus:border-primary-fixed focus:outline-none" 
          />
          <button onClick={handleAddMix} disabled={isLocked} className="bg-primary-fixed/10 hover:bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30 px-6 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
            + Create Mix
          </button>
        </div>
      </div>

      {showBrandPrompt && (
        <div className="glass-panel rounded-2xl p-6 mb-8 border border-primary-fixed/30 shadow-[0_0_30px_rgba(195,244,0,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/5 blur-[100px] rounded-full pointer-events-none"></div>
          <h3 className="text-lg font-medium text-on-background mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed">auto_awesome</span>
            AI Prompt-to-Playlist
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">Describe el tipo de negocio, la vibra que buscas, la hora del día o tu target de cliente y nuestro LLM generará la estructura musical perfecta.</p>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Ej: 'Música relajada para una cafetería hipster en el centro, público joven, mañanas lluviosas'"
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
                <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Procesando...</>
              ) : (
                <><span className="material-symbols-outlined text-[18px]">magic_button</span> Generar Mix</>
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
                <label className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 block font-mono-data">Estilo A (Base)</label>
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
                <label className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 block font-mono-data">Estilo B</label>
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
                <label className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 block font-mono-data">Energía/Tempo</label>
                <select className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-sm text-on-background focus:border-primary-fixed disabled:opacity-50 appearance-none" value={mix.energy_level} disabled={isLocked} onChange={(e) => { const nm = [...mixes]; nm[idx].energy_level = e.target.value; setMixes(nm); }}>
                  {ENERGY_LEVELS.map(el => <option key={el} value={el}>{el}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-2 block font-mono-data">Cuñas / Ads</label>
                <select className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-sm text-on-background focus:border-primary-fixed disabled:opacity-50 appearance-none" value={mix.ad_frequency} disabled={isLocked} onChange={(e) => { const nm = [...mixes]; nm[idx].ad_frequency = parseInt(e.target.value); setMixes(nm); }}>
                  <option value={15}>Cada 15m</option>
                  <option value={30}>Cada 30m</option>
                  <option value={45}>Cada 45m</option>
                  <option value={60}>Cada 60m</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-3 text-sm text-on-surface-variant cursor-pointer hover:text-on-background transition-colors">
                <input type="checkbox" className="rounded border-white/20 bg-surface-container-highest text-primary-fixed focus:ring-primary-fixed/50 disabled:opacity-50" checked={mix.blockExplicit} disabled={isLocked} onChange={() => { const nm = [...mixes]; nm[idx].blockExplicit = !nm[idx].blockExplicit; setMixes(nm); }} />
                Block Explicit Lyrics
              </label>
              <label className="flex items-center gap-3 text-sm text-on-surface-variant cursor-pointer hover:text-on-background transition-colors">
                <input type="checkbox" className="rounded border-white/20 bg-surface-container-highest text-primary-fixed focus:ring-primary-fixed/50 disabled:opacity-50" checked={mix.blockUrban} disabled={isLocked} onChange={() => { const nm = [...mixes]; nm[idx].blockUrban = !nm[idx].blockUrban; setMixes(nm); }} />
                Block Reggaeton/Urban
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/5 mt-2">
              <button disabled={isLocked} onClick={() => handleSaveMix(mix)} className="flex-1 bg-surface-container-high hover:bg-surface-bright text-on-background px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">Guardar</button>
              <button disabled={isLocked} onClick={() => handleDeleteMix(mix.id)} className="flex-1 bg-error/10 hover:bg-error/20 text-error border border-error/20 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAds = () => (
    <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {isLocked && renderLockedWarning()}
      <h2 className="font-headline-lg text-3xl font-light text-on-background mb-2">🎙️ Ad Generator (Text-to-Speech)</h2>
      <p className="text-on-surface-variant mb-8 text-sm">Escribe tu promoción y nuestra IA generará una cuña publicitaria hiperrealista lista para sonar en tus locales.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl p-8">
          <h3 className="font-medium text-on-background mb-4">Crear nueva campaña</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-on-surface-variant mb-2 block">Texto de la Cuña</label>
              <textarea 
                className="w-full bg-surface-container-highest border border-white/10 rounded-xl p-4 text-sm text-on-background focus:border-primary-fixed focus:outline-none resize-none h-32"
                placeholder="Ej: Atención clientes, aprovechen nuestro descuento del 20% en la sección de accesorios de verano..."
                value={adCopy}
                onChange={(e) => setAdCopy(e.target.value)}
                disabled={isLocked}
              />
            </div>
            
            <div>
              <label className="text-xs text-on-surface-variant mb-2 block">Voz Sintética IA</label>
              <select 
                className="w-full bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-sm text-on-background focus:border-primary-fixed focus:outline-none appearance-none disabled:opacity-50"
                value={adVoice}
                onChange={(e) => setAdVoice(e.target.value)}
                disabled={isLocked}
              >
                <option value="Elena (ES - Mujer)">Elena (España - Mujer, Joven)</option>
                <option value="Marcos (ES - Hombre)">Marcos (España - Hombre, Grave)</option>
                <option value="Sofia (MX - Mujer)">Sofia (México - Mujer, Amigable)</option>
                <option value="Diego (AR - Hombre)">Diego (Argentina - Hombre, Dinámico)</option>
              </select>
            </div>

            <button 
              onClick={handleGenerateAd}
              disabled={!adCopy.trim() || isGeneratingAd || isLocked}
              className="w-full bg-primary-fixed text-background py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary-fixed/90 transition-colors disabled:opacity-50 mt-4 shadow-[0_0_15px_rgba(195,244,0,0.3)]"
            >
              {isGeneratingAd ? (
                <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Renderizando Audio...</>
              ) : (
                <><span className="material-symbols-outlined text-[18px]">mic</span> Generar y Guardar Cuña</>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-on-background mb-4">Campañas Activas</h3>
          {ads.map(ad => (
            <div key={ad.id} className="glass-panel rounded-xl p-4 flex gap-4 items-center border-l-4 border-l-primary-fixed">
              <button className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-fixed shrink-0 hover:bg-primary-fixed/20 transition-colors">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
              </button>
              <div className="flex-1">
                <p className="text-sm text-on-background line-clamp-2 italic">"{ad.text}"</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">record_voice_over</span> {ad.voice}</span>
                  <span className="px-2 py-1 bg-primary-fixed/10 text-primary-fixed rounded text-[10px] uppercase tracking-widest">{ad.status}</span>
                </div>
              </div>
              <button className="text-on-surface-variant hover:text-error transition-colors p-2" disabled={isLocked} onClick={() => setAds(prev => prev.filter(a => a.id !== ad.id))}>
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          ))}
          {ads.length === 0 && (
            <div className="text-center p-8 text-on-surface-variant border border-dashed border-white/10 rounded-xl">
              No hay campañas activas
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {isLocked && renderLockedWarning()}
      <h2 className="font-headline-lg text-3xl font-light text-on-background mb-2">📅 Visual Dayparting</h2>
      <p className="text-on-surface-variant mb-8 text-sm">Defina qué mezcla suena en cada franja horaria. Los cambios se guardan de forma persistente.</p>
      
      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-surface-container-highest/30 border-b border-white/5">
              <th className="p-4 text-xs font-mono-data uppercase tracking-widest text-on-surface-variant w-40">Franja Horaria</th>
              {DAYS.map(day => <th key={day} className="p-4 text-xs font-mono-data uppercase tracking-widest text-on-background text-center">{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map(slot => (
              <tr key={slot} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="p-4 border-r border-white/5">
                  <div className="text-primary-fixed font-medium text-sm mb-1">{slot}</div>
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
                        <option value="">-- Vacío --</option>
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
      <h2 className="font-headline-lg text-3xl font-light text-on-background mb-2">⚙️ Settings & Logic</h2>
      <p className="text-on-surface-variant mb-10 text-sm">Gestiona la infraestructura de los sensores y el disco local.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-primary-fixed font-mono-data uppercase tracking-widest text-[11px] border-b border-white/10 pb-4">Offline Architecture (Freebox)</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-background">Pre-Caching Limit (GB)</span>
            <input type="number" value={cacheLimit} disabled={isLocked} onChange={(e) => setCacheLimit(e.target.value)} className="w-20 bg-surface-container-highest border border-white/10 rounded-lg px-3 py-2 text-center text-on-background focus:border-primary-fixed focus:outline-none disabled:opacity-50" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-background">Force Cache Download</span>
            <button className="text-xs bg-surface-container-high hover:bg-surface-bright text-on-background px-4 py-2 rounded-lg transition-colors border border-white/10 flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">download</span> Sync 14-days
            </button>
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-primary-fixed font-mono-data uppercase tracking-widest text-[11px] border-b border-white/10 pb-4">Tringbox AI Engine & IoT</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-background">Neuro-IoT Modulación</span>
            <button 
              disabled={isLocked} 
              onClick={() => setNeuroActive(!neuroActive)}
              className={`px-4 py-2 rounded-full text-xs font-mono-data uppercase tracking-widest transition-all ${neuroActive ? 'bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/30 shadow-[0_0_15px_rgba(195,244,0,0.2)]' : 'bg-surface-container-high text-on-surface-variant border border-white/5'}`}
            >
              {neuroActive ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm text-on-background">Smart IoT Auto-Modulation</span>
              <span className="text-[10px] text-on-surface-variant">Sync with Weather & Foot Traffic</span>
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
          <span className="material-symbols-outlined text-[18px]">save</span> Guardar Proyecto
        </button>
      </div>
    </div>
  );

  const renderSgaeShield = () => (
    <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl glass-panel rounded-2xl p-10 max-w-4xl relative overflow-hidden border-error/30 mt-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-error/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="flex items-center gap-4 mb-4">
        <ShieldAlert className="w-10 h-10 text-error" />
        <h2 className="font-headline-lg text-3xl font-light text-on-background">SGAE Shield</h2>
      </div>
      <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed mb-10">
        El escudo protege al establecimiento frente a inspecciones. Mantiene un registro inmutable de reproducciones y fuerza el uso exclusivo de Mixes Royalty-Free en caso de emergencia.
      </p>
      
      <button onClick={handlePanicButton} className="w-full md:w-auto bg-error hover:bg-error/80 text-background px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_30px_rgba(255,180,171,0.4)] active:scale-95 flex flex-col items-center gap-2">
        <span>ACTIVATE PANIC MODE</span>
        <span className="text-[9px] opacity-80 font-mono-data">FORCE ROYALTY-FREE CATALOG</span>
      </button>

      <div className="mt-12 pt-8 border-t border-white/5">
        <h3 className="text-on-surface-variant font-mono-data uppercase tracking-widest text-[11px] mb-6">Audit Log (Immutable Blockchain Proof)</h3>
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
    <div className="bg-background text-on-background min-h-screen overflow-x-hidden pt-16 md:pt-24 font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* PIN entry modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-8 text-center border-primary-fixed/20 shadow-[0_0_40px_rgba(195,244,0,0.1)]">
            <ShieldAlert className="w-12 h-12 text-primary-fixed mx-auto mb-4" />
            <h3 className="text-xl text-on-background font-medium mb-2">Desbloquear Interfaz</h3>
            <p className="text-on-surface-variant text-sm mb-6">Introduce el PIN del supervisor.<br/><span className="text-[10px] opacity-50 mt-1 block">(PIN: 1234)</span></p>
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
                Cancelar
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
                Validar
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
                <span className="material-symbols-outlined text-white">graphic_eq</span>
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
          <div className="w-10 h-10 rounded-xl bg-surface-container-high/50 overflow-hidden border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(195,244,0,0.1)] backdrop-blur-md">
            <span className="material-symbols-outlined text-primary-fixed text-lg">storefront</span>
          </div>
          <h1 className="font-headline-lg text-[24px] font-semibold text-on-background tracking-tight">Sonic <span className="text-primary-fixed">Curator</span></h1>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
            <span className="material-symbols-outlined text-[18px]">dashboard</span> Dashboard
          </button>
          <button onClick={() => setActiveTab('zones')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === 'zones' ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
            <span className="material-symbols-outlined text-[18px]">map</span> Spatial Map
          </button>
          <button onClick={() => setActiveTab('mixes')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === 'mixes' ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
            <span className="material-symbols-outlined text-[18px]">graphic_eq</span> Mixes
          </button>
          <button onClick={() => setActiveTab('ads')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === 'ads' ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
            <span className="material-symbols-outlined text-[18px]">campaign</span> Ads TTS
          </button>
          <button onClick={() => setActiveTab('schedule')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === 'schedule' ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
            <span className="material-symbols-outlined text-[18px]">calendar_today</span> Scheduler
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${activeTab === 'settings' ? 'text-primary-fixed bg-primary-fixed/10 shadow-[0_0_10px_rgba(195,244,0,0.05)] border border-primary-fixed/20' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-background'}`}>
            <span className="material-symbols-outlined text-[18px]">settings</span> Settings
          </button>
          <button onClick={() => setActiveTab('sgae')} className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center transition-colors border shrink-0 ${activeTab === 'sgae' ? 'border-error text-error bg-error/10' : 'text-error/70 hover:text-error hover:bg-error/10 border-error/20'}`}>
            <span className="material-symbols-outlined text-[18px]">gpp_bad</span>
          </button>
          <button 
            onClick={() => { if (isLocked) { setShowPinModal(true); } else { setIsLocked(true); } }}
            className={`ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors border shrink-0 ${isLocked ? 'border-error text-error bg-error/10' : 'border-white/10 text-on-surface-variant hover:text-on-background hover:bg-white/5 hover:text-primary-fixed'}`}
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>{isLocked ? 'lock' : 'lock_open'}</span>
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
      
    </div>
  );
}
