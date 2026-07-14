import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { ShieldAlert } from 'lucide-react';
import MusicUpload from '../MusicUpload';

export default function DashboardTab({ t }) {
  const {
    activeZoneId, setActiveZoneId, groups, isLocked, setShowPinModal,
    activeTrack, setActiveTrack, isPanicMode, iotModulation, playerProgress, setPlayerProgress,
    isPlaying, setIsPlaying, telemetry
  } = useStore();

  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const dataArrayRef = useRef(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }

    const setupAudio = () => {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 128;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    };

    const playAudio = () => {
      setupAudio();
      if (audioRef.current.src) {
        audioRef.current.play().catch(e => console.error('Audio play error:', e));
      }
    };

    if (isPlaying) {
      playAudio();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (activeTrack && activeTrack.url) {
      audioRef.current.src = activeTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error('Audio play error:', e));
      }
    }
  }, [activeTrack]);

  // Player Progress
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        if (audioRef.current && audioRef.current.duration) {
          setPlayerProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setPlayerProgress]);

  // Audio Visualizer Animation
  useEffect(() => {
    if (canvasRef.current) {
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
        
        let freqData = 0;
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          freqData = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
        }

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
            let noise;
            if (isPlaying) {
              noise = Math.sin(angle * (3 + j) + time * 2) * (15 + j * 5) + Math.cos(angle * (2 - j) + time * 3) * 10;
              noise += (freqData / 255) * 50; // React to actual audio
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
  }, [isPlaying]);

  const handleUploadSuccess = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      const url = `http://localhost:4000/uploads/${file.filename}`;
      setActiveTrack({
        id: file.filename,
        title: file.originalname,
        artist: 'Uploaded File',
        duration: 'Unknown',
        source: 'Server',
        album: 'Uploads',
        url: url
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 container mx-auto px-container-margin py-6 max-w-7xl">
      {/* Context Header & Licensing */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <p className="font-mono-data text-mono-data text-on-surface-variant mb-1 uppercase tracking-widest text-[10px] opacity-70">
            {t("location.active")}
          </p>
          <div className="flex items-center gap-3">
            <select 
              className="bg-transparent font-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-light tracking-tight focus:outline-none cursor-pointer appearance-none"
              value={activeZoneId}
              onChange={(e) => setActiveZoneId(e.target.value)}
              disabled={isLocked}
            >
              {groups.length > 0 && groups.flatMap(g => g.zones).map(z => (
                <option key={z.hwid || Math.random()} value={z.location} className="text-base text-black">{z.location}</option>
              ))}
              {(!groups || groups.length === 0 || groups.flatMap(g => g.zones).length === 0) && <option value="Lux Boutique - Madrid" className="text-base text-black">Lux Boutique - Madrid</option>}
            </select>
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
                  <span className="material-symbols-outlined text-[14px] notranslate" style={{ fontVariationSettings: "'FILL' 1" }} translate="no">graphic_eq</span>
                  {activeTrack.album || t("auto.deep_house")}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-surface-container-high/30 border border-white/5 font-mono-data text-mono-data text-[10px] text-on-surface-variant uppercase tracking-widest backdrop-blur-md">
                  {isPanicMode ? 'SGAE SHIELD' : 'ACTIVE MIX'}
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
                    <span>{`0${Math.floor(playerProgress * 3 * 60 / 100 / 60)}:${Math.floor(playerProgress * 3 * 60 / 100 % 60).toString().padStart(2, '0')}`}</span>
                    <span>-{activeTrack.duration}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-highest/50 rounded-full overflow-hidden relative cursor-pointer backdrop-blur-sm border border-white/5" onClick={(e) => {
                    if (isLocked) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setPlayerProgress(Math.max(0, Math.min(100, (clickX / rect.width) * 100)));
                  }}>
                    <div className="absolute top-0 left-0 h-full bg-primary-fixed/80 rounded-full shadow-[0_0_15px_rgba(195,244,0,0.5)]" style={{ width: `${playerProgress}%` }}></div>
                  </div>
                  <div className="absolute top-[26px] bg-primary-fixed rounded-full shadow-[0_0_10px_rgba(195,244,0,0.8)] -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer pointer-events-none" style={{ left: `${playerProgress}%`, width: '12px', height: '12px' }}></div>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <button className="text-on-surface-variant hover:text-on-background btn-minimal"><span className="material-symbols-outlined text-[20px] notranslate" translate="no">shuffle</span></button>
                  <button className="text-on-background hover:text-primary-fixed btn-minimal"><span className="material-symbols-outlined text-[28px] notranslate" style={{ fontVariationSettings: "'FILL' 1" }} translate="no">skip_previous</span></button>
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-16 h-16 rounded-full bg-surface-container-high/80 border border-white/10 text-on-background flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-primary-fixed/50 hover:text-primary-fixed active:scale-95 transition-all backdrop-blur-xl">
                    <span className="material-symbols-outlined text-[28px] notranslate" style={{ fontVariationSettings: "'FILL' 1" }} translate="no">{isPlaying ? 'pause' : 'play_arrow'}</span>
                  </button>
                  <button className="text-on-background hover:text-primary-fixed btn-minimal"><span className="material-symbols-outlined text-[28px] notranslate" style={{ fontVariationSettings: "'FILL' 1" }} translate="no">skip_next</span></button>
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
            <div className={`h-32 flex items-end justify-between gap-[2px] w-full mt-auto relative z-10 ${isPlaying ? 'opacity-70 group-hover:opacity-100' : 'opacity-20'} transition-opacity duration-500`}>
              {[0.1, 0.3, 0.2, 0.5, 0.4, 0.6, 0.2, 0.7, 0.3, 0.1, 0.5, 0.8, 0.4, 0.2].map((delay, i) => <div key={i} className={`w-full bg-primary-fixed/60 rounded-t-sm ${isPlaying ? 'wave-bar' : ''}`} style={{ animationDelay: `${delay}s`, height: isPlaying ? '100%' : '10%' }}></div>)}
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
    </div>
  );
}
