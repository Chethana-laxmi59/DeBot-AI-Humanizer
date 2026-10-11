import { Sparkles, ShieldCheck, History, Globe, Cpu, Languages } from 'lucide-react';
import type { LanguageOption, HealthResponse } from '../types';
import { type UiLanguage, UI_LANGUAGES, t } from '../utils/i18n';

interface HeaderProps {
  health: HealthResponse | null;
  uiLanguage: UiLanguage;
  onSelectUiLanguage: (lang: UiLanguage) => void;
  selectedLanguage: string;
  languages: LanguageOption[];
  onSelectLanguage: (code: string) => void;
  onOpenHistory: () => void;
  onOpenPrivacy: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  uiLanguage,
  onSelectUiLanguage,
  selectedLanguage,
  languages,
  onSelectLanguage,
  onOpenHistory,
  onOpenPrivacy,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-mono">DEBOT</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {t('nav.versionBadge', uiLanguage)}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t('nav.brandSubtitle', uiLanguage)}
            </p>
          </div>
        </div>

        {/* Status & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Health & Engine status */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/5 text-xs">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-mono text-[11px]">
              {health?.model || 'gemini-3.1-flash-lite'}
            </span>
            <span className="mx-1 text-slate-600">•</span>
            {health?.has_api_key ? (
              <span className="flex items-center text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                {t('nav.liveAi', uiLanguage)}
              </span>
            ) : (
              <span className="flex items-center text-amber-400 font-medium" title="Configure GEMINI_API_KEY in backend/.env">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span>
                {t('nav.demoPresets', uiLanguage)}
              </span>
            )}
          </div>

          {/* Interface Language (UI Localization) Selector */}
          <div className="relative flex items-center">
            <label htmlFor="ui-language-select" className="sr-only">
              {t('nav.uiLanguage', uiLanguage)}
            </label>
            <div
              className="flex items-center space-x-1.5 bg-slate-900/90 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300"
              title={t('nav.uiLanguage', uiLanguage)}
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                id="ui-language-select"
                aria-label={t('nav.uiLanguage', uiLanguage)}
                value={uiLanguage}
                onChange={(e) => onSelectUiLanguage(e.target.value as UiLanguage)}
                className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer pr-1"
              >
                {UI_LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code} className="bg-slate-900 text-slate-200">
                    UI: {item.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Output / Target Language Selector */}
          <div className="relative flex items-center">
            <label htmlFor="output-language-select" className="sr-only">
              {t('nav.outputLanguage', uiLanguage)}
            </label>
            <div
              className="flex items-center space-x-1.5 bg-slate-900/90 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-slate-300"
              title={t('nav.outputLanguage', uiLanguage)}
            >
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <select
                id="output-language-select"
                aria-label={t('nav.outputLanguage', uiLanguage)}
                value={selectedLanguage}
                onChange={(e) => onSelectLanguage(e.target.value)}
                className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer pr-1"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                    Output: {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Revision History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 hover:text-white transition"
            title={t('nav.historyTooltip', uiLanguage)}
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{t('nav.history', uiLanguage)}</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Privacy Notice Modal Trigger */}
          <button
            onClick={onOpenPrivacy}
            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-slate-200 transition"
            title={t('nav.privacyTooltip', uiLanguage)}
          >
            <ShieldCheck className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
};

