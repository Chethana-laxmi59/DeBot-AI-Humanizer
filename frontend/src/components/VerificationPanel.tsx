import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Scale,
  ShieldCheck
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
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
    : isMedium
    ? 'text-amber-400 bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
    : 'text-rose-400 bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]';

  const badgeColor = isHigh ? 'bg-emerald-400' : isMedium ? 'bg-amber-400' : 'bg-rose-400';

  // Circular gauge calculation
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-2xl glass-panel-3d p-4 sm:p-5 space-y-4 border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
        {/* Panel Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-xs sm:text-sm text-slate-100 flex items-center space-x-1.5">
                <span>{t('verification.title', uiLanguage)}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Deterministic v1
                </span>
              </h3>
            </div>
          </div>

          {/* Radial score gauge */}
          <div className="flex items-center space-x-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="w-11 h-11 transform -rotate-90">
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className={`transition-all duration-700 ${
                    isHigh ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-rose-400'
                  }`}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono text-[11px] font-bold text-white">
                {score}%
              </span>
            </div>

            <div className={`flex flex-col px-3 py-1 rounded-xl border text-xs font-semibold ${scoreColor}`}>
              <div className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${badgeColor} animate-pulse`}></span>
                <span>{t('verification.scoreLabel', uiLanguage)}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal font-mono">
                {verification.exact_entities_preserved}/{verification.exact_entities_detected} tokens matched
              </span>
            </div>
          </div>
        </div>

        {/* Confidence Statement */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-300 flex items-start space-x-2.5 shadow-inner">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans">{verification.confidence_statement}</p>
        </div>

        {/* Review Warnings Banner if any */}
        {verification.review_warnings && verification.review_warnings.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 space-y-1.5 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-fadeIn">
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
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-2 hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('verification.preservedCol', uiLanguage)} ({verification.preserved_entities.length})</span>
              </span>
            </div>

            {verification.preserved_entities.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pt-1">
                {verification.preserved_entities.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono shadow-sm hover:scale-105 transition-transform cursor-default"
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
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-rose-500/20 space-y-2 hover:border-rose-500/40 transition">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center space-x-1.5 text-rose-400">
                <XCircle className="w-4 h-4" />
                <span>{t('verification.missingCol', uiLanguage)} ({verification.missing_entities.length})</span>
              </span>
            </div>

            {verification.missing_entities.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pt-1">
                {verification.missing_entities.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-mono shadow-sm hover:scale-105 transition-transform cursor-default"
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

        {/* Semantic Nuances & Additions */}
        {(verification.potential_meaning_changes.length > 0 || verification.unsupported_additions.length > 0) && (
          <div className="pt-2 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {verification.potential_meaning_changes.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
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
              <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
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

        {/* Methodological Disclaimer */}
        <div className="pt-2 border-t border-white/10 flex items-start space-x-2 text-[11px] text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 shrink-0 text-cyan-400 mt-0.5" />
          <p>
            <strong className="text-slate-300">Methodological Disclosure:</strong> Exact token matches are computed deterministically via rule-based parsing. DEBOT guarantees complete mathematical reporting of every entity without black-box estimation.
          </p>
        </div>
      </div>
  );
};
