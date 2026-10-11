import React from 'react';
import type { ModeInfo, WritingMode } from '../types';
import { type UiLanguage, t } from '../utils/i18n';
import { 
  Sparkles, 
  GraduationCap, 
  Coffee, 
  Briefcase, 
  Palette, 
  CheckCircle,
  BookOpen,
  Zap
} from 'lucide-react';
import { Card3DTilt } from './Card3DTilt';

interface ModeSelectorProps {
  uiLanguage: UiLanguage;
  modes: ModeInfo[];
  selectedMode: WritingMode;
  onSelectMode: (mode: WritingMode) => void;
  onLoadPresetForMode?: (mode: WritingMode) => void;
}

const MODE_CONFIG: Record<WritingMode, { icon: React.ReactNode; glowColor: string; accentBorder: string; activeBadge: string }> = {
  standard: {
    icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
    glowColor: 'rgba(6, 182, 212, 0.25)',
    accentBorder: 'border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    activeBadge: 'bg-cyan-400',
  },
  academic: {
    icon: <GraduationCap className="w-4 h-4 text-purple-400" />,
    glowColor: 'rgba(168, 85, 247, 0.25)',
    accentBorder: 'border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.25)]',
    activeBadge: 'bg-purple-400',
  },
  casual: {
    icon: <Coffee className="w-4 h-4 text-amber-400" />,
    glowColor: 'rgba(245, 158, 11, 0.25)',
    accentBorder: 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    activeBadge: 'bg-amber-400',
  },
  professional: {
    icon: <Briefcase className="w-4 h-4 text-emerald-400" />,
    glowColor: 'rgba(16, 185, 129, 0.25)',
    accentBorder: 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    activeBadge: 'bg-emerald-400',
  },
  creative: {
    icon: <Palette className="w-4 h-4 text-pink-400" />,
    glowColor: 'rgba(236, 72, 153, 0.25)',
    accentBorder: 'border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.25)]',
    activeBadge: 'bg-pink-400',
  },
  simple: {
    icon: <CheckCircle className="w-4 h-4 text-sky-400" />,
    glowColor: 'rgba(56, 189, 248, 0.25)',
    accentBorder: 'border-sky-500/60 shadow-[0_0_20px_rgba(56,189,248,0.25)]',
    activeBadge: 'bg-sky-400',
  },
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  uiLanguage,
  modes,
  selectedMode,
  onSelectMode,
  onLoadPresetForMode,
}) => {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('modes.title', uiLanguage)}</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400 font-mono capitalize">
            {t(`modes.${selectedMode}.label`, uiLanguage) || selectedMode}
          </span>
        </label>
        
        {onLoadPresetForMode && (
          <button
            onClick={() => onLoadPresetForMode(selectedMode)}
            className="text-xs text-slate-400 hover:text-cyan-300 transition flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 group"
            title={t('modes.loadModeSample', uiLanguage)}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>{t('modes.loadModeSample', uiLanguage)}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const config = MODE_CONFIG[mode.id] || MODE_CONFIG.standard;
          const label = t(`modes.${mode.id}.label`, uiLanguage) || mode.label;
          const tagline = t(`modes.${mode.id}.tagline`, uiLanguage) || mode.tagline;
          const description = t(`modes.${mode.id}.desc`, uiLanguage) || mode.description;

          return (
            <Card3DTilt
              key={mode.id}
              maxTilt={10}
              glowColor={config.glowColor}
              className="h-full"
            >
              <button
                type="button"
                onClick={() => onSelectMode(mode.id)}
                className={`text-left p-3.5 rounded-2xl transition-all duration-300 border relative flex flex-col justify-between w-full h-full cursor-pointer ${
                  isSelected
                    ? `bg-slate-900/95 ${config.accentBorder}`
                    : 'bg-slate-950/70 hover:bg-slate-900/80 border-white/5 hover:border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-1.5 rounded-xl bg-slate-950/90 border border-white/10 shadow-sm">
                      {config.icon}
                    </div>
                    {isSelected && (
                      <span className={`w-2.5 h-2.5 rounded-full ${config.activeBadge} shadow-[0_0_10px_currentColor] animate-pulse`}></span>
                    )}
                  </div>
                  <div className="font-semibold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition">
                    {label}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {tagline}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/5 hidden sm:block">
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {description}
                  </p>
                </div>
              </button>
            </Card3DTilt>
          );
        })}
      </div>
    </div>
  );
};
