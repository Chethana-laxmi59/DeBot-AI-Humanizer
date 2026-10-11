import { X, Trash2, RotateCcw, Clock } from 'lucide-react';
import type { RevisionItem } from '../types';
import { type UiLanguage, t } from '../utils/i18n';

interface HistoryModalProps {
  uiLanguage: UiLanguage;
  isOpen: boolean;
  onClose: () => void;
  revisions: RevisionItem[];
  onRestore: (rev: RevisionItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  uiLanguage,
  isOpen,
  onClose,
  revisions,
  onRestore,
  onDelete,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl glass-panel-elevated p-5 sm:p-6 flex flex-col shadow-2xl overflow-hidden border border-white/10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 id="history-modal-title" className="font-bold text-base sm:text-lg text-white">
              {t('history.title', uiLanguage)}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {revisions.length} {t('history.saved', uiLanguage)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {revisions.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg border border-rose-500/20 transition flex items-center space-x-1"
                title={t('history.clearAll', uiLanguage)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('history.clearAll', uiLanguage)}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close history modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1">
          {revisions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <Clock className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p>{t('history.empty', uiLanguage)}</p>
            </div>
          ) : (
            revisions.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-white/5 hover:border-white/15 transition space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-semibold uppercase text-[10px]">
                      {t(`modes.${rev.mode}.label`, uiLanguage) || rev.mode}
                    </span>
                    {rev.is_sample && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px]">
                        {t('history.demo', uiLanguage)}
                      </span>
                    )}
                    <span className="text-slate-400 font-mono text-[11px]">
                      {new Date(rev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-medium text-[11px]">
                      {rev.preservation_score}% {t('verification.scoreLabel', uiLanguage)}
                    </span>
                    <button
                      onClick={() => onRestore(rev)}
                      className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center space-x-1 transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t('history.restore', uiLanguage)}</span>
                    </button>
                    <button
                      onClick={() => onDelete(rev.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition"
                      title={t('history.delete', uiLanguage)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-sans line-clamp-2 italic bg-slate-950/50 p-2 rounded-lg border border-white/5">
                  &ldquo;{rev.rewritten_text}&rdquo;
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition font-medium"
          >
            {t('privacy.close', uiLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
};

