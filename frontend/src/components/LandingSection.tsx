import { CheckCircle2, ShieldCheck, ArrowDown, Sparkles, Sliders } from 'lucide-react';
import { type UiLanguage, t } from '../utils/i18n';

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
    <section className="relative pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-white/5">
      <div className="max-w-5xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('landing.badge', uiLanguage)}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {t('landing.titlePrefix', uiLanguage)}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
            {t('landing.titleHighlight', uiLanguage)}
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
          {t('landing.description', uiLanguage)}
        </p>

        {/* Feature Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('landing.pill1', uiLanguage)}</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('landing.pill2', uiLanguage)}</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('landing.pill3', uiLanguage)}</span>
          </div>
        </div>

        <div className="pt-3 flex justify-center">
          <button
            onClick={onScrollToWorkspace}
            className="group flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-blue-600/25 transition transform hover:-translate-y-0.5"
          >
            <span>{t('landing.openWorkspace', uiLanguage)}</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition" />
          </button>
        </div>
      </div>
    </section>
  );
};

