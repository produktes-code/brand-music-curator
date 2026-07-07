import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:4000';

export function useCuratorAPI() {
  const [telemetry, setTelemetry] = useState({
    hardware_status: 'Healthy',
    memory: 'Loading...',
    network_latency_ms: '...',
    is_fallback_mode: false
  });

  const [groups, setGroups] = useState([]);
  const [mixes, setMixes] = useState([]);
  const [scheduleMatrix, setScheduleMatrix] = useState([]);
  const [ads, setAds] = useState([]);
  const [activeZoneId, setActiveZoneId] = useState('');

  const fetchTelemetry = async () => {
    try {
      const res = await fetch(`${API_URL}/api/telemetry`);
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchData = async () => {
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
        setGroups(formattedGroups.length > 0 ? formattedGroups : [{
          id: 1,
          name: '📍 Default Group',
          zones: []
        }]);
        
        // Set default active zone if none selected
        if (!activeZoneId && zonesData.length > 0) {
          setActiveZoneId(zonesData[0].location);
        }
      }

      // 2. Fetch Mixes
      const mixesRes = await fetch(`${API_URL}/api/mixes`, { cache: 'no-store' });
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
      const scheduleRes = await fetch(`${API_URL}/api/schedule`, { cache: 'no-store' });
      if (scheduleRes.ok) {
        const scheduleData = await scheduleRes.json();
        setScheduleMatrix(scheduleData);
      }

      // 4. Fetch Ads
      const adsRes = await fetch(`${API_URL}/api/ads`, { cache: 'no-store' });
      if (adsRes.ok) {
        const adsData = await adsRes.json();
        setAds(adsData.map(a => ({
          id: a.id,
          text: a.text,
          voice: a.voice,
          status: a.status
        })));
      }

      // 5. Fetch Telemetry
      await fetchTelemetry();
    } catch (e) {
      console.error("Error loading data from API:", e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    telemetry,
    groups,
    setGroups,
    mixes,
    setMixes,
    scheduleMatrix,
    setScheduleMatrix,
    ads,
    setAds,
    activeZoneId,
    setActiveZoneId,
    fetchData,
    API_URL
  };
}
