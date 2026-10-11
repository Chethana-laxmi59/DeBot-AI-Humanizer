import { useMemo } from 'react';
import { computeWordDiff } from '../utils/diff';
import type { DiffPart } from '../utils/diff';
import { type UiLanguage, t } from '../utils/i18n';

interface DiffViewerProps {
  uiLanguage: UiLanguage;
  originalText: string;
  rewrittenText: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  uiLanguage,
  originalText,
  rewrittenText,
}) => {
  const diffParts = useMemo(() => {
    return computeWordDiff(originalText, rewrittenText);
  }, [originalText, rewrittenText]);

  const insertions = diffParts.filter((p) => p.type === 'insert').length;
  const deletions = diffParts.filter((p) => p.type === 'delete').length;

  return (
    <div className="space-y-3">
      {/* Diff Legend */}
      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500"></span>
            <span>{insertions} {t('diff.insertions', uiLanguage)}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-500/30 border border-rose-500"></span>
            <span>{deletions} {t('diff.deletions', uiLanguage)}</span>
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {t('editorOutput.tabDiff', uiLanguage)}
        </span>
      </div>

      {/* Rendered Diff */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 font-sans text-sm sm:text-base leading-relaxed text-slate-200 overflow-y-auto max-h-96 whitespace-pre-wrap">
        {diffParts.map((part: DiffPart, idx: number) => {
          if (part.type === 'insert') {
            return (
              <ins key={idx} className="diff-ins no-underline">
                {part.value}
              </ins>
            );
          }
          if (part.type === 'delete') {
            return (
              <del key={idx} className="diff-del">
                {part.value}
              </del>
            );
          }
          return <span key={idx}>{part.value}</span>;
        })}
      </div>
    </div>
  );
};

