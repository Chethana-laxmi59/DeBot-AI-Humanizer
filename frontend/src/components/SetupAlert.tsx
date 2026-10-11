import { useState } from 'react';
import { Key, X, Sparkles } from 'lucide-react';
import { type UiLanguage, t } from '../utils/i18n';

interface SetupAlertProps {
  uiLanguage: UiLanguage;
  onLoadSample: () => void;
}

export const SetupAlert: React.FC<SetupAlertProps> = ({ uiLanguage, onLoadSample }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-950/40 border-b border-amber-500/20 px-4 py-2.5 transition">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-amber-300">
          <Key className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong className="font-semibold text-amber-200">
              {t('setupAlert.title', uiLanguage)}
            </strong>{' '}
            {t('setupAlert.desc', uiLanguage)}
          </span>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0">
          <button
            onClick={onLoadSample}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-medium border border-amber-500/30 transition text-xs"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{t('setupAlert.loadSample', uiLanguage)}</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="text-amber-400/70 hover:text-amber-200 p-1"
            title={t('setupAlert.dismiss', uiLanguage)}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

