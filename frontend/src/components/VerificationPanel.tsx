import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Info,
  Scale
} from 'lucide-react';
import type { VerificationResult } from '../types';
import { type UiLanguage, t } from '../utils/i18n';

interface VerificationPanelProps {
  uiLanguage: UiLanguage;
  verification: VerificationResult | null;
  isSample?: boolean;
}

export const VerificationPanel: React.FC<VerificationPanelProps> = ({
  uiLanguage,
  verification,
}) => {
  if (!verification) return null;

  const score = verification.preservation_score_pct;
  const isHigh = score >= 90;
  const isMedium = score >= 70 && score < 90;

  const scoreColor = isHigh
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : isMedium
    ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

  const badgeColor = isHigh ? 'bg-emerald-500' : isMedium ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="rounded-2xl glass-panel p-4 sm:p-5 space-y-4">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-cyan-400" />
          <h3 className="font-semibold text-xs sm:text-sm text-slate-200">
            {t('verification.title', uiLanguage)}
          </h3>
        </div>

        {/* Score indicator */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-semibold ${scoreColor}`}>
          <span className={`w-2 h-2 rounded-full ${badgeColor}`}></span>
          <span>{score}% {t('verification.scoreLabel', uiLanguage)}</span>
          <span className="text-[10px] text-slate-400 font-normal">
            ({verification.exact_entities_preserved}/{verification.exact_entities_detected})
          </span>
        </div>
      </div>

      {/* Confidence Statement */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 flex items-start space-x-2">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{verification.confidence_statement}</p>
      </div>

      {/* Review Warnings Banner if any */}
      {verification.review_warnings && verification.review_warnings.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 space-y-1.5">
          <div className="font-semibold flex items-center space-x-1.5 text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t('verification.warningsTitle', uiLanguage)}</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-amber-200/90">
            {verification.review_warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Two-Column Entity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Preserved Entities */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span className="flex items-center space-x-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('verification.preservedCol', uiLanguage)} ({verification.preserved_entities.length})</span>
            </span>
          </div>

          {verification.preserved_entities.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {verification.preserved_entities.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              {t('verification.noEntities', uiLanguage)}
            </p>
          )}
        </div>

        {/* Missing / Rephrased Entities */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span className="flex items-center space-x-1 text-rose-400">
              <XCircle className="w-3.5 h-3.5" />
              <span>{t('verification.missingCol', uiLanguage)} ({verification.missing_entities.length})</span>
            </span>
          </div>

          {verification.missing_entities.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {verification.missing_entities.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-mono"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              {t('verification.noEntities', uiLanguage)}
            </p>
          )}
        </div>
      </div>

      {/* Semantic Nuances & Additions (Separated from deterministic checks) */}
      {(verification.potential_meaning_changes.length > 0 || verification.unsupported_additions.length > 0) && (
        <div className="pt-2 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {verification.potential_meaning_changes.length > 0 && (
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-white/5">
              <span className="font-semibold text-slate-300 block mb-1">
                {t('verification.meaningChanges', uiLanguage)}:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                {verification.potential_meaning_changes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {verification.unsupported_additions.length > 0 && (
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-white/5">
              <span className="font-semibold text-slate-300 block mb-1">
                {t('verification.additions', uiLanguage)}:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                {verification.unsupported_additions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Uncertainty Notice / Detector Disclaimer */}
      <div className="pt-2 border-t border-white/5 flex items-start space-x-2 text-[11px] text-slate-400">
        <HelpCircle className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
        <p>
          <strong className="text-slate-300">Methodological Disclosure:</strong> Exact token matches are computed independently via rule-based parsing. Semantic adjustments reflect probabilistic AI self-reflection. DEBOT does not claim 100% semantic equivalence, detector circumvention, or infallible factuality. Always cross-check critical publications manually.
        </p>
      </div>
    </div>
  );
};

