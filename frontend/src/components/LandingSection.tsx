import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowDown, Sparkles, Sliders, Zap } from 'lucide-react';
import { type UiLanguage, t } from '../utils/i18n';
import { Interactive3DCanvas } from './Interactive3DCanvas';
import { Card3DTilt } from './Card3DTilt';

interface LandingSectionProps {
  uiLanguage: UiLanguage;
  onScrollToWorkspace: () => void;
  onSelectSampleMode?: (mode: any) => void;
}

export const LandingSection: React.FC<LandingSectionProps> = ({
  uiLanguage,
  onScrollToWorkspace,
}) => {
  return (
    <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden cyber-grid">
      {/* Interactive 3D constellation field in the hero */}
      <div className="absolute inset-0 pointer-events-none opacity-45">
        <Interactive3DCanvas variant="cosmic" particleCount={60} />
      </div>

      {/* Atmospheric radial glowing lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
        {/* Kinetic Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md animate-float">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="tracking-wide font-mono">{t('landing.badge', uiLanguage)}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        {/* 3D Kinetic Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          {t('landing.titlePrefix', uiLanguage)}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 animate-gradient">
            {t('landing.titleHighlight', uiLanguage)}
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal">
          {t('landing.description', uiLanguage)}
        </p>

        {/* Interactive 3D Tilt Feature Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
          <Card3DTilt maxTilt={12} glowColor="rgba(52, 211, 153, 0.25)">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md shadow-lg hover:border-emerald-500/50 transition">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-medium text-slate-200">{t('landing.pill1', uiLanguage)}</span>
            </div>
          </Card3DTilt>

          <Card3DTilt maxTilt={12} glowColor="rgba(6, 182, 212, 0.25)">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md shadow-lg hover:border-cyan-500/50 transition">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="font-medium text-slate-200">{t('landing.pill2', uiLanguage)}</span>
            </div>
          </Card3DTilt>

          <Card3DTilt maxTilt={12} glowColor="rgba(129, 140, 248, 0.25)">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-md shadow-lg hover:border-indigo-500/50 transition">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="font-medium text-slate-200">{t('landing.pill3', uiLanguage)}</span>
            </div>
          </Card3DTilt>
        </div>

        {/* Interactive Action Button */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={onScrollToWorkspace}
            className="group relative inline-flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 glow-cyan cursor-pointer"
          >
            <Zap className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
            <span>{t('landing.openWorkspace', uiLanguage)}</span>
            <ArrowDown className="w-4 h-4 text-cyan-200 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
