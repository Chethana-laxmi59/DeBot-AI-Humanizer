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
  BookOpen
} from 'lucide-react';

interface ModeSelectorProps {
  uiLanguage: UiLanguage;
  modes: ModeInfo[];
  selectedMode: WritingMode;
  onSelectMode: (mode: WritingMode) => void;
  onLoadPresetForMode?: (mode: WritingMode) => void;
}

const MODE_ICONS: Record<WritingMode, React.ReactNode> = {
  standard: <Sparkles className="w-4 h-4 text-blue-400" />,
  academic: <GraduationCap className="w-4 h-4 text-purple-400" />,
  casual: <Coffee className="w-4 h-4 text-amber-400" />,
  professional: <Briefcase className="w-4 h-4 text-emerald-400" />,
  creative: <Palette className="w-4 h-4 text-pink-400" />,
  simple: <CheckCircle className="w-4 h-4 text-cyan-400" />,
};

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  uiLanguage,
  modes,
  selectedMode,
  onSelectMode,
  onLoadPresetForMode,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <span>{t('modes.title', uiLanguage)}</span>
          <span className="text-slate-600">•</span>
          <span className="text-blue-400 capitalize">
            {t(`modes.${selectedMode}.label`, uiLanguage) || selectedMode}
          </span>
        </label>
        
        {onLoadPresetForMode && (
          <button
            onClick={() => onLoadPresetForMode(selectedMode)}
            className="text-xs text-slate-400 hover:text-cyan-300 transition flex items-center space-x-1"
            title={t('modes.loadModeSample', uiLanguage)}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('modes.loadModeSample', uiLanguage)}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          const label = t(`modes.${mode.id}.label`, uiLanguage) || mode.label;
          const tagline = t(`modes.${mode.id}.tagline`, uiLanguage) || mode.tagline;
          const description = t(`modes.${mode.id}.desc`, uiLanguage) || mode.description;

          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={`text-left p-3 rounded-xl transition-all border relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500/60 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/60 hover:bg-slate-800/60 border-white/5 hover:border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1 rounded-lg bg-slate-950/80 border border-white/5">
                    {MODE_ICONS[mode.id]}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
                  )}
                </div>
                <div className="font-semibold text-xs sm:text-sm text-white">
                  {label}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {tagline}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-white/5 hidden sm:block">
                <p className="text-[10px] text-slate-400 line-clamp-2">
                  {description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

