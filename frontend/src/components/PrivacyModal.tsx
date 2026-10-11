import { X, ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';
import { type UiLanguage, t } from '../utils/i18n';

interface PrivacyModalProps {
  uiLanguage: UiLanguage;
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ uiLanguage, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl rounded-2xl glass-panel-elevated p-5 sm:p-6 shadow-2xl border border-white/10 space-y-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h2 id="privacy-modal-title" className="font-bold text-base sm:text-lg text-white">
              {t('privacy.title', uiLanguage)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close privacy modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-semibold text-slate-100">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>{t('privacy.providerTitle', uiLanguage)}</span>
            </div>
            <p className="text-slate-400">
              {t('privacy.providerDesc', uiLanguage)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-semibold text-slate-100">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              <span>{t('privacy.zeroLogTitle', uiLanguage)}</span>
            </div>
            <p className="text-slate-400">
              {t('privacy.zeroLogDesc', uiLanguage)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-semibold text-slate-100">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>{t('privacy.localStorageTitle', uiLanguage)}</span>
            </div>
            <p className="text-slate-400">
              {t('privacy.localStorageDesc', uiLanguage)}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs text-white font-medium transition"
          >
            {t('privacy.close', uiLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
};

