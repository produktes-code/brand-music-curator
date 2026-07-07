import { create } from 'zustand';

const API_URL = 'http://localhost:4000';

export const useStore = create((set, get) => ({
  // --- GLOBAL STATE ---
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Language State
  language: localStorage.getItem('bmc_language') || 'es',
  setLanguage: (lang) => {
    localStorage.setItem('bmc_language', lang);
    set({ language: lang });
  },

  // Player States
  isPlaying: true,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  playerProgress: 0,
  setPlayerProgress: (progress) => {
    const val = typeof progress === 'function' ? progress(get().playerProgress) : progress;
    set({ playerProgress: val });
  },
  activeTrack: {
    id: 1,
    title: 'Ocean Drive',
    artist: 'Tidal Drifters',
    duration: '3:45',
    source: 'Local Cache',
    album: 'The Algorithm EP'
  },
  setActiveTrack: (track) => set({ activeTrack: track }),
  activeZoneId: '',
  setActiveZoneId: (id) => set({ activeZoneId: id }),
  isPanicMode: false,
  setIsPanicMode: (panic) => set({ isPanicMode: panic }),

  // Groups & Zones State
  groups: [],
  setGroups: (groups) => set({ groups }),

  // Mixes State
  mixes: [],
  setMixes: (mixes) => set({ mixes }),

  // Ad-Generator State
  ads: [],
  setAds: (ads) => set({ ads }),

  // Schedule Matrix State
  scheduleMatrix: [],
  setScheduleMatrix: (scheduleMatrix) => set({ scheduleMatrix }),

  // B2B Player Security Locking State
  isLocked: false,
  setIsLocked: (locked) => set({ isLocked: locked }),
  showConfig: false,
  setShowConfig: (show) => set({ showConfig: show }),

  // Settings State
  cacheLimit: 4,
  setCacheLimit: (limit) => set({ cacheLimit: limit }),
  neuroActive: true,
  setNeuroActive: (active) => set({ neuroActive: active }),
  iotModulation: true,
  setIotModulation: (active) => set({ iotModulation: active }),

  telemetry: {
    hardware_status: 'Healthy',
    memory: 'Loading...',
    network_latency_ms: '...',
    is_fallback_mode: false
  },
  setTelemetry: (data) => set({ telemetry: data }),

  fetchTelemetry: async () => {
    try {
      const res = await fetch(`${API_URL}/api/telemetry`);
      if (res.ok) {
        const data = await res.json();
        set({ telemetry: data });
      }
    } catch (e) {
      console.error(e);
    }
  },

  fetchData: async () => {
    try {
      // 1. Fetch Zones
      const zonesRes = await fetch(`${API_URL}/api/zones`, { cache: 'no-store' });
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
        set({ groups: formattedGroups.length > 0 ? formattedGroups : [{ id: 1, name: '📍 Default Group', zones: [] }] });
        
        if (!get().activeZoneId && zonesData.length > 0) {
          set({ activeZoneId: zonesData[0].location });
        }
      }

      // 2. Fetch Mixes
      const mixesRes = await fetch(`${API_URL}/api/mixes`, { cache: 'no-store' });
      if (mixesRes.ok) {
        const mixesData = await mixesRes.json();
        set({ mixes: mixesData.map(m => ({
          id: m.id,
          name: m.name,
          genre_a: m.genre_a || 'Indie Pop',
          genre_b: m.genre_b || 'Deep House',
          ratio: m.playlist_a_ratio !== undefined ? m.playlist_a_ratio : 50,
          energy_level: m.energy_level || 'Medium',
          ad_frequency: m.ad_frequency !== undefined ? m.ad_frequency : 30,
          blockExplicit: m.block_explicit === 1 || m.block_explicit === true,
          blockUrban: m.block_urban === 1 || m.block_urban === true
        })) });
      }

      // 3. Fetch Schedule
      const scheduleRes = await fetch(`${API_URL}/api/schedule`, { cache: 'no-store' });
      if (scheduleRes.ok) {
        const scheduleData = await scheduleRes.json();
        set({ scheduleMatrix: scheduleData });
      }

      // 4. Fetch Ads
      const adsRes = await fetch(`${API_URL}/api/ads`, { cache: 'no-store' });
      if (adsRes.ok) {
        const adsData = await adsRes.json();
        set({ ads: adsData.map(a => ({
          id: a.id,
          text: a.text,
          voice: a.voice,
          status: a.status
        })) });
      }

      // 5. Fetch Telemetry
      await get().fetchTelemetry();
    } catch (e) {
      console.error("Error loading data from API:", e);
    }
  }
}));
