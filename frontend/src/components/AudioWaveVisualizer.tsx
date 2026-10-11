import React, { useEffect, useState } from 'react';
import { Volume2, Activity, Gauge } from 'lucide-react';

interface AudioWaveVisualizerProps {
  isPlaying: boolean;
  formalityScore?: number; // 0 - 100
  cadenceProfile?: string; // e.g. "Polished Executive", "Dynamic Flow"
  className?: string;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({
  isPlaying,
  formalityScore = 88,
  cadenceProfile = 'Balanced Cadence',
  className = '',
}) => {
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: 28 }, () => 15 + Math.random() * 25)
  );

  useEffect(() => {
    let animId: number;
    let t = 0;

    const updateBars = () => {
      t += isPlaying ? 0.15 : 0.04;
      setBars((prev) =>
        prev.map((_, i) => {
          if (isPlaying) {
            // Dynamic multi-frequency harmonic wave
            const base = Math.sin(t * 2 + i * 0.4) * 35;
            const harmonic = Math.cos(t * 3.5 - i * 0.3) * 20;
            const noise = (Math.random() - 0.5) * 25;
            return Math.max(12, Math.min(95, 45 + base + harmonic + noise));
          } else {
            // Calm breathing wave
            return Math.max(8, 20 + Math.sin(t + i * 0.25) * 12);
          }
        })
      );
      animId = requestAnimationFrame(updateBars);
    };

    animId = requestAnimationFrame(updateBars);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl glass-panel p-4 border border-cyan-500/20 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/90 shadow-xl ${className}`}
    >
      {/* Background ambient aura */}
      <div
        className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
          isPlaying ? 'bg-cyan-500/25 animate-pulse' : 'bg-indigo-500/10'
        }`}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-3.5 relative z-10">
        <div className="flex items-center space-x-2">
          <div
            className={`p-1.5 rounded-lg border transition ${
              isPlaying
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'bg-slate-800/80 border-white/5 text-slate-400'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-white flex items-center space-x-1.5">
              <span>Studio Voice Waveform</span>
              <span
                className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                  isPlaying
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isPlaying ? 'Live Audition' : 'Ready'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              ElevenLabs Multilingual Cadence Synthesizer
            </p>
          </div>
        </div>

        {/* Cadence Metrics Pill */}
        <div className="hidden sm:flex items-center space-x-3 text-right">
          <div>
            <div className="text-[10px] text-slate-400 flex items-center justify-end space-x-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Cadence Profile</span>
            </div>
            <div className="text-xs font-medium text-cyan-300">{cadenceProfile}</div>
          </div>
          <div className="h-7 w-[1px] bg-white/10" />
          <div>
            <div className="text-[10px] text-slate-400 flex items-center justify-end space-x-1">
              <Gauge className="w-3 h-3 text-indigo-400" />
              <span>Formality Index</span>
            </div>
            <div className="text-xs font-semibold text-indigo-300">{formalityScore}/100</div>
          </div>
        </div>
      </div>

      {/* Dynamic Audio Bars Spectrum */}
      <div className="h-16 flex items-end justify-between gap-1 px-1 py-1 rounded-xl bg-slate-950/70 border border-white/5 relative z-10">
        {bars.map((heightPct, idx) => {
          // Dynamic color gradient across bars: Cyan -> Indigo -> Purple
          const colorClass =
            idx < 10
              ? 'from-cyan-400 to-blue-500'
              : idx < 20
              ? 'from-blue-500 to-indigo-500'
              : 'from-indigo-500 to-fuchsia-500';

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col justify-end items-center h-full group"
            >
              <div
                style={{
                  height: `${heightPct}%`,
                  transition: isPlaying ? 'height 0.08s ease-out' : 'height 0.25s ease-out',
                }}
                className={`w-full rounded-t-sm bg-gradient-to-t ${colorClass} ${
                  isPlaying
                    ? 'opacity-90 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                    : 'opacity-40 hover:opacity-80'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Frequency spectrum scale labels */}
      <div className="flex justify-between items-center text-[9px] text-slate-500 mt-1.5 font-mono px-1">
        <span>60 Hz</span>
        <span>250 Hz</span>
        <span>1 kHz</span>
        <span>4 kHz</span>
        <span>16 kHz</span>
      </div>
    </div>
  );
};
