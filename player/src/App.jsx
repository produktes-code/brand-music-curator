import { useState, useEffect } from 'react';
import './App.css';

const AVAILABLE_GENRES = ['Indie Pop', 'Deep House', 'Chillout', 'Jazz', 'Rock', 'Pop Comercial', 'Latino/Urbano', 'Clásica', 'Blues', 'Soul'];
const ENERGY_LEVELS = ['Low', 'Medium', 'High'];
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const SLOTS = ['Mañana', 'Mediodía', 'Tarde', 'Noche/Cierre'];
const SLOT_TIMES = {
  'Mañana': '08:00 - 12:00',
  'Mediodía': '12:00 - 16:00',
  'Tarde': '16:00 - 20:00',
  'Noche/Cierre': '20:00 - 00:00'
};

function App() {
  // --- GLOBAL STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  
  // Dashboard State
  const [activeTrack, setActiveTrack] = useState({ id: 1, title: 'Ocean Drive', artist: 'Tidal Drifters', duration: '3:45', source: 'Local Cache' });

  // Groups & Zones State
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');

  // Mixes State
  const [mixes, setMixes] = useState([]);
  const [newMixName, setNewMixName] = useState('');

  // Schedule Matrix State (Dayparting)
  const [scheduleMatrix, setScheduleMatrix] = useState([]);

  // B2B Player Security Locking State
  const [isLocked, setIsLocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');

  // Settings State
  const [cacheLimit, setCacheLimit] = useState(4);
  const [neuroActive, setNeuroActive] = useState(true);

  // Data Fetching
  const fetchData = async () => {
    try {
      const resZones = await fetch('http://localhost:4000/api/zones');
      const dataZones = await resZones.json();
      
      const grouped = dataZones.reduce((acc, zone) => {
        let g = acc.find(x => x.name === zone.group_name);
        if (!g) {
          g = { id: zone.group_name, name: zone.group_name, zones: [] };
          acc.push(g);
        }
        g.zones.push({ id: zone.id, location: zone.location, name: zone.zone_name, hwid: zone.hardware_id, status: zone.status });
        return acc;
      }, []);
      setGroups(grouped.length ? grouped : [{ id: 1, name: '📍 Default Group', zones: [] }]);

      const resMixes = await fetch('http://localhost:4000/api/mixes');
      const dataMixes = await resMixes.json();
      setMixes(dataMixes.map(m => ({ 
        id: m.id, 
        name: m.name, 
        genre_a: m.genre_a || 'Indie Pop', 
        genre_b: m.genre_b || 'Deep House', 
        ratio: m.playlist_a_ratio, 
        energy_level: m.energy_level || 'Medium',
        ad_frequency: m.ad_frequency !== undefined ? m.ad_frequency : 30,
        blockExplicit: !!m.block_explicit, 
        blockUrban: !!m.block_urban 
      })));

      const resSched = await fetch('http://localhost:4000/api/schedule');
      const dataSched = await resSched.json();
      setScheduleMatrix(dataSched);
    } catch (e) {
      console.error("Backend offline. Retrying...", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Network Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedPing = Math.random() * 300;
      if (simulatedPing > 250 && !isOffline) setIsOffline(true);
      else if (simulatedPing <= 250 && isOffline) setIsOffline(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOffline]);

  // --- EVENT HANDLERS ---
  const handleAddGroup = async () => {
    if (!newGroupName.trim() || isLocked) return;
    try {
      await fetch('http://localhost:4000/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_name: `📍 ${newGroupName}`,
          location: 'New Location',
          zone_name: 'Main Zone',
          hardware_id: `FBX-NEW-${Math.floor(Math.random()*1000)}`
        })
      });
      setNewGroupName('');
      fetchData();
    } catch (e) {
      alert("Error connecting to database.");
    }
  };

  const handleAddMix = async () => {
    if (!newMixName.trim() || isLocked) return;
    try {
      await fetch('http://localhost:4000/api/mixes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMixName,
          genre_a: 'Indie Pop',
          genre_b: 'Deep House',
          ratio: 50,
          energy_level: 'Medium',
          ad_frequency: 30,
          block_explicit: false,
          block_urban: false
        })
      });
      setNewMixName('');
      fetchData();
    } catch (e) {
      alert("Error connecting to database.");
    }
  };

  const handleSaveMix = async (mix) => {
    if (isLocked) return;
    try {
      await fetch(`http://localhost:4000/api/mixes/${mix.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: mix.name,
          genre_a: mix.genre_a,
          genre_b: mix.genre_b,
          ratio: mix.ratio,
          energy_level: mix.energy_level,
          ad_frequency: mix.ad_frequency,
          blockExplicit: mix.blockExplicit,
          blockUrban: mix.blockUrban
        })
      });
      alert(`✅ Cambios para el Mix "${mix.name}" guardados exitosamente.`);
      fetchData();
    } catch (e) {
      alert("Error al guardar el Mix.");
    }
  };

  const handleDeleteMix = async (mixId) => {
    if (isLocked) return;
    if (!confirm("¿Estás seguro de que deseas eliminar este Mix?")) return;
    try {
      await fetch(`http://localhost:4000/api/mixes/${mixId}`, {
        method: 'DELETE'
      });
      fetchData();
    } catch (e) {
      alert("Error al eliminar el Mix.");
    }
  };

  const handleUpdateSchedule = async (day, slot, mixId) => {
    if (isLocked) return;
    try {
      await fetch('http://localhost:4000/api/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day_of_week: day,
          time_slot: slot,
          mix_id: mixId ? parseInt(mixId) : null
        })
      });
      fetchData();
    } catch (e) {
      alert("Error al guardar la programación horaria.");
    }
  };

  const handleSaveSettings = () => {
    if (isLocked) return;
    alert("✅ Configuraciones de Ingeniería Guardadas Exitosamente.");
  };

  const handlePanicButton = () => {
    alert("🛡️ SGAE SHIELD ACTIVADO\n\nBloqueando catálogo comercial...\nTransición a 100% Royalty-Free.");
    setActiveTrack({ id: 101, title: 'Corporate Calm', artist: 'Royalty Free Audio', duration: '2:30', source: 'Local - Certified' });
  };

  const getMixIdForSlot = (day, slot) => {
    const match = scheduleMatrix.find(s => s.day_of_week === day && s.time_slot === slot);
    return match ? match.mix_id : '';
  };

  // --- VIEWS ---
  const renderLockedWarning = () => (
    <div style={{ background: 'rgba(255, 42, 42, 0.1)', border: '1px solid #ff2a2a', color: '#ff2a2a', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
      <span>🔒 INTERFAZ BLOQUEADA: Los controles locales en tienda están deshabilitados. Desbloquee con el PIN supervisor para guardar cambios.</span>
    </div>
  );

  const renderDashboard = () => (
    <div className="tab-content" style={{ position: 'relative' }}>
      {isOffline && (
        <div style={{ background: '#ff9900', color: '#000', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px', fontWeight: 'bold' }}>
          ⚠️ Conexión Inestable. Reproduciendo desde la Caché Local Segura (Offline Mode).
        </div>
      )}
      
      <section className="glass-panel now-playing-card" style={{ marginBottom: '30px', position: 'relative' }}>
        {isLocked && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', zIndex: 10, borderRadius: '16px' }}>
            <span style={{ fontSize: '3rem' }}>🔒</span>
            <h3 style={{ margin: '10px 0 5px 0', fontSize: '1.4rem' }}>Control de Reproducción Bloqueado</h3>
            <p style={{ color: '#aaa', margin: 0, fontSize: '0.85rem' }}>Gestionado de forma remota por la central</p>
            <button 
              onClick={() => setShowPinModal(true)}
              style={{ marginTop: '15px', background: '#ff2a2a', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Desbloquear con PIN
            </button>
          </div>
        )}

        <div className="cover-art-large"></div>
        <div className="track-details">
          <p style={{ color: '#ff2a2a', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '2px', margin: '0 0 10px 0' }}>NOW PLAYING</p>
          <h3>{activeTrack.title}</h3>
          <p>{activeTrack.artist}</p>
          <div className="progress-container">
            <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: '500' }}>1:58</span>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: isPlaying ? '50%' : '45%' }}></div>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: '500' }}>{activeTrack.duration}</span>
          </div>
          <div className="controls">
            <button className="ctrl-btn" disabled={isLocked}>🔀</button>
            <button className="ctrl-btn" disabled={isLocked}>⏮</button>
            <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)} disabled={isLocked}>{isPlaying ? '⏸' : '▶'}</button>
            <button className="ctrl-btn" disabled={isLocked}>⏭</button>
            <button className="ctrl-btn" disabled={isLocked}>🔁</button>
          </div>
        </div>
      </section>

      <section className="glass-panel queue-section">
        <h3><span>Current Zones Status</span></h3>
        <table className="queue-table">
          <thead><tr><th>Location</th><th>Zone</th><th>Hardware ID</th><th>Network</th></tr></thead>
          <tbody>
            {groups.flatMap(g => g.zones).map(z => (
              <tr key={z.id}>
                <td>{z.location}</td>
                <td>{z.name}</td>
                <td style={{ color: '#888' }}>{z.hwid}</td>
                <td><span className={`source-badge ${z.status?.includes('Online') ? 'local' : 'network'}`}>{z.status || 'Offline'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );

  const renderGroupsZones = () => (
    <div className="tab-content">
      {isLocked && renderLockedWarning()}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '2rem', margin: 0 }}>🏢 Groups & Zones</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="New Group Name..." 
            value={newGroupName} 
            onChange={(e) => setNewGroupName(e.target.value)}
            disabled={isLocked}
            style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} 
          />
          <button onClick={handleAddGroup} disabled={isLocked} style={{ background: '#ff2a2a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: isLocked ? 'not-allowed' : 'pointer' }}>+ Add Group</button>
        </div>
      </div>
      
      {groups.map((group) => (
        <div key={group.id} className="glass-panel" style={{ padding: '0', marginBottom: '20px' }}>
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>{group.name}</h3>
            <span style={{ color: '#888' }}>{group.zones.length} Locations</span>
          </div>
          <table className="queue-table">
            <thead><tr><th>Location</th><th>Zone Name</th><th>Hardware ID</th><th>Status</th></tr></thead>
            <tbody>
              {group.zones.map(z => (
                <tr key={z.id}>
                  <td>{z.location}</td>
                  <td><strong>{z.name}</strong></td>
                  <td style={{ fontFamily: 'monospace', color: '#888' }}>{z.hwid}</td>
                  <td><span style={{ color: z.status?.includes('Online') ? '#00ff80' : '#ff9900' }}>● {z.status || 'Offline'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );

  const renderMixes = () => (
    <div className="tab-content">
      {isLocked && renderLockedWarning()}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '2rem', margin: 0 }}>🎛️ Mixes Manager (Smart DJ)</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="New Mix Name..." 
            value={newMixName} 
            onChange={(e) => setNewMixName(e.target.value)}
            disabled={isLocked}
            style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} 
          />
          <button onClick={handleAddMix} disabled={isLocked} style={{ background: '#ff2a2a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: isLocked ? 'not-allowed' : 'pointer' }}>+ Create Mix</button>
        </div>
      </div>

      <div className="mixes-grid">
        {mixes.map((mix, idx) => (
          <div key={mix.id} className="glass-panel mix-card">
            <div className="mix-card-header">
              <h3 className="mix-card-name">{mix.name}</h3>
            </div>

            <div className="mix-card-genres">
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '4px' }}>Estilo A (Base)</label>
                <select 
                  className="mix-genre-selector" 
                  value={mix.genre_a} 
                  disabled={isLocked}
                  onChange={(e) => {
                    const nm = [...mixes];
                    nm[idx].genre_a = e.target.value;
                    setMixes(nm);
                  }}
                >
                  {AVAILABLE_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '4px' }}>Estilo B (Contrapunto)</label>
                <select 
                  className="mix-genre-selector" 
                  value={mix.genre_b} 
                  disabled={isLocked}
                  onChange={(e) => {
                    const nm = [...mixes];
                    nm[idx].genre_b = e.target.value;
                    setMixes(nm);
                  }}
                >
                  {AVAILABLE_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="mix-card-ratio">
              <div className="mix-ratio-display">
                <span>{mix.genre_a}: <strong>{mix.ratio}%</strong></span>
                <span>{mix.genre_b}: <strong>{100 - mix.ratio}%</strong></span>
              </div>
              <input 
                type="range" min="0" max="100" 
                className="mix-ratio-slider"
                value={mix.ratio} 
                disabled={isLocked}
                onChange={(e) => {
                  const nm = [...mixes];
                  nm[idx].ratio = parseInt(e.target.value);
                  setMixes(nm);
                }}
              />
            </div>

            <div className="mix-card-meta">
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '4px' }}>Energía/Tempo</label>
                <select 
                  className="mix-meta-select"
                  value={mix.energy_level}
                  disabled={isLocked}
                  onChange={(e) => {
                    const nm = [...mixes];
                    nm[idx].energy_level = e.target.value;
                    setMixes(nm);
                  }}
                >
                  {ENERGY_LEVELS.map(el => <option key={el} value={el}>{el}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: '4px' }}>Frecuencia Cuñas</label>
                <select 
                  className="mix-meta-select"
                  value={mix.ad_frequency}
                  disabled={isLocked}
                  onChange={(e) => {
                    const nm = [...mixes];
                    nm[idx].ad_frequency = parseInt(e.target.value);
                    setMixes(nm);
                  }}
                >
                  <option value={15}>Cada 15m</option>
                  <option value={30}>Cada 30m</option>
                  <option value={45}>Cada 45m</option>
                  <option value={60}>Cada 60m</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '5px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: isLocked ? 'default' : 'pointer', fontSize: '0.85rem', color: '#aaa', marginBottom: '6px' }}>
                <input type="checkbox" checked={mix.blockExplicit} disabled={isLocked} onChange={() => { const nm = [...mixes]; nm[idx].blockExplicit = !nm[idx].blockExplicit; setMixes(nm); }} />
                Block Explicit Lyrics
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: isLocked ? 'default' : 'pointer', fontSize: '0.85rem', color: '#aaa' }}>
                <input type="checkbox" checked={mix.blockUrban} disabled={isLocked} onChange={() => { const nm = [...mixes]; nm[idx].blockUrban = !nm[idx].blockUrban; setMixes(nm); }} />
                Block Reggaeton/Urban
              </label>
            </div>

            <div className="mix-card-actions">
              <button className="btn-save-mix" disabled={isLocked} onClick={() => handleSaveMix(mix)}>💾 Guardar Mix</button>
              <button className="btn-delete-mix" disabled={isLocked} onClick={() => handleDeleteMix(mix.id)}>🗑️ Borrar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="tab-content">
      {isLocked && renderLockedWarning()}
      <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>📅 Visual Dayparting (Matriz Semanal B2B)</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>Defina qué mezcla suena en cada franja horaria. Los cambios se guardan de forma persistente.</p>
      
      <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
        <table className="schedule-grid-table">
          <thead>
            <tr>
              <th style={{ width: '150px' }}>Franja Horaria</th>
              {DAYS.map(day => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map(slot => (
              <tr key={slot}>
                <td style={{ fontWeight: 'bold', textAlign: 'left' }}>
                  <div style={{ color: '#00ccff' }}>{slot}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{SLOT_TIMES[slot]}</div>
                </td>
                {DAYS.map(day => {
                  const mixId = getMixIdForSlot(day, slot);
                  return (
                    <td key={day}>
                      <select 
                        className="mix-genre-selector"
                        value={mixId || ''} 
                        disabled={isLocked}
                        onChange={(e) => handleUpdateSchedule(day, slot, e.target.value)}
                      >
                        <option value="">-- Sin Asignar --</option>
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
    <div className="tab-content glass-panel" style={{ padding: '30px' }}>
      {isLocked && renderLockedWarning()}
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>⚙️ Configuraciones Globales (IA & Hardware)</h2>
      <p style={{ color: '#888', marginBottom: '30px' }}>Gestiona la infraestructura de los sensores y el disco local.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Offline Architecture (Freebox)</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '25px 0' }}>
            <span>Pre-Caching Limit (GB)</span>
            <input type="number" value={cacheLimit} disabled={isLocked} onChange={(e) => setCacheLimit(e.target.value)} style={{ width: '60px', background: '#222', color: '#fff', border: '1px solid #444', textAlign: 'center' }} />
          </div>
        </div>
        <div>
          <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Tringbox AI Engine</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '25px 0', alignItems: 'center' }}>
            <span>Neuro-IoT (Modulación por Tráfico y Clima)</span>
            <label className="switch" style={{ cursor: isLocked ? 'default' : 'pointer', background: neuroActive ? '#00ff80' : '#444', padding: '5px 15px', borderRadius: '20px', color: '#000', fontWeight: 'bold' }}>
              <input type="checkbox" checked={neuroActive} disabled={isLocked} onChange={() => setNeuroActive(!neuroActive)} style={{ display: 'none' }} />
              {neuroActive ? 'ACTIVE' : 'DISABLED'}
            </label>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'right' }}>
        <button onClick={handleSaveSettings} disabled={isLocked} style={{ background: '#ff2a2a', color: '#fff', border: 'none', padding: '15px 30px', borderRadius: '4px', cursor: isLocked ? 'not-allowed' : 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>
          💾 Guardar Proyecto
        </button>
      </div>
    </div>
  );

  const renderSgaeShield = () => (
    <div className="tab-content glass-panel sgae-panel">
      <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🛡️</div>
      <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>SGAE Shield</h2>
      <p style={{ color: '#888', maxWidth: '600px', lineHeight: '1.6', marginBottom: '30px' }}>
        El escudo protege al establecimiento frente a inspecciones. Mantén un registro inmutable de las reproducciones y fuerza el uso de Mixes Royalty-Free.
      </p>
      <button className="panic-button" onClick={handlePanicButton}>
        ACTIVATE PANIC MODE<br/><span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>FORCE ROYALTY-FREE CATALOG</span>
      </button>
      <div style={{ width: '100%', textAlign: 'left', marginTop: '40px' }}>
        <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Audit Log (Immutable Blockchain Proof)</h3>
        <ul style={{ listStyle: 'none', padding: 0, color: '#888', fontFamily: 'monospace' }}>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #222' }}>[2026-06-12 10:15:00] Location: Serrano | Play: Corporate Calm (ID: RF-101) - CERTIFIED</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      {/* PIN entry modal */}
      {showPinModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel" style={{ width: '320px', padding: '30px', textAlign: 'center', border: '1px solid #ff2a2a' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ff2a2a' }}>Desbloquear Interfaz</h3>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '20px' }}>Introduce el PIN del supervisor.<br/>(PIN por defecto: <strong>1234</strong>)</p>
            <input 
              type="password" 
              maxLength="4" 
              value={enteredPin} 
              onChange={(e) => setEnteredPin(e.target.value)} 
              placeholder="••••"
              style={{ display: 'block', width: '80%', margin: '0 auto 20px auto', padding: '10px', fontSize: '1.8rem', textAlign: 'center', letterSpacing: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid #ff2a2a', color: '#fff', borderRadius: '4px' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => {
                  if (enteredPin === '1234') {
                    setIsLocked(false);
                    setShowPinModal(false);
                    setEnteredPin('');
                  } else {
                    alert("❌ PIN Supervisor Incorrecto");
                    setEnteredPin('');
                  }
                }}
                style={{ background: '#00ff80', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Validar
              </button>
              <button 
                onClick={() => {
                  setShowPinModal(false);
                  setEnteredPin('');
                }}
                style={{ background: 'transparent', color: '#888', border: '1px solid #333', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <div className="brand-logo" style={{ fontSize: '1.2rem', lineHeight: '1.2' }}>
            <div className="dot"></div> BRAND MUSIC CURATOR
          </div>
          <ul className="nav-menu">
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</li>
            <li className={activeTab === 'zones' ? 'active' : ''} onClick={() => setActiveTab('zones')}>🏢 Groups & Zones</li>
            <li className={activeTab === 'mixes' ? 'active' : ''} onClick={() => setActiveTab('mixes')}>🎛️ Mixes</li>
            <li className={activeTab === 'schedule' ? 'active' : ''} onClick={() => setActiveTab('schedule')}>📅 Dayparting Schedule</li>
          </ul>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <ul className="nav-menu bottom-nav">
            <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>⚙️ Engine Settings</li>
            <li className={activeTab === 'sgae' ? 'active' : ''} onClick={() => setActiveTab('sgae')}>🛡️ SGAE Shield</li>
          </ul>
          <div style={{ padding: '20px', fontSize: '0.75rem', color: '#666', borderTop: '1px solid #222', textAlign: 'center' }}>
            Powered by Antigravity IA<br/>Created by Jesús Ferrer
          </div>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="top-header">
          <div className="location-selector">
            <strong>Network Status ▾</strong>
            <span style={{ color: isOffline ? '#ff9900' : '#888' }}>{isOffline ? 'FALLBACK: OFFLINE CACHE' : 'ONLINE CLOUD SYNC'}</span>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div 
              onClick={() => {
                if (isLocked) {
                  setShowPinModal(true);
                } else {
                  setIsLocked(true);
                }
              }}
              style={{
                cursor: 'pointer',
                background: isLocked ? 'rgba(255, 42, 42, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isLocked ? '#ff2a2a' : '#333'}`,
                padding: '8px 15px',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: isLocked ? '#ff2a2a' : '#fff',
                transition: 'all 0.2s'
              }}
            >
              <span>{isLocked ? '🔒 Panel Tienda Bloqueado' : '🔓 Bloquear Panel'}</span>
            </div>
            <div className="user-profile">
              <span style={{ fontWeight: '600' }}>Director B2B</span>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #ff2a2a, #800)', borderRadius: '50%' }}></div>
            </div>
          </div>
        </header>
        <div className="content-area">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'zones' && renderGroupsZones()}
          {activeTab === 'mixes' && renderMixes()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'sgae' && renderSgaeShield()}
        </div>
      </main>
    </div>
  );
}

export default App;
