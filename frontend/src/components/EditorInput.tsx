import React, { useState } from 'react';
import { 
  Clipboard, 
  Trash2, 
  Sparkles, 
  SlidersHorizontal, 
  Clock, 
  FileText,
  Loader2
} from 'lucide-react';
import { type UiLanguage, t } from '../utils/i18n';

interface EditorInputProps {
  uiLanguage: UiLanguage;
  text: string;
  onChangeText: (text: string) => void;
  customInstructions: string;
  onChangeCustomInstructions: (inst: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onLoadSample: () => void;
  maxChars?: number;
}

export const EditorInput: React.FC<EditorInputProps> = ({
  uiLanguage,
  text,
  onChangeText,
  customInstructions,
  onChangeCustomInstructions,
  onSubmit,
  isLoading,
  onLoadSample,
  maxChars = 5000,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const readingTimeSec = wordCount > 0 ? Math.ceil((wordCount / 200) * 60) : 0;
  const isOverLimit = charCount > maxChars;
  const isTooShort = charCount < 5;

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        onChangeText(clipText);
      }
    } catch {
      console.warn('Clipboard read permission denied or unavailable');
    }
  };

  const handleClear = () => {
    onChangeText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isTooShort && !isOverLimit && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl glass-panel p-4 sm:p-5 relative transition">
      {/* Editor Header / Stats */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-xs sm:text-sm text-slate-200">
            {t('editorInput.title', uiLanguage)}
          </span>
          <span className="text-slate-600">•</span>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>{wordCount} {t('editorInput.words', uiLanguage)}</span>
            <span>({charCount}/{maxChars})</span>
            {readingTimeSec > 0 && (
              <span className="hidden sm:inline-flex items-center text-slate-400">
                <Clock className="w-3 h-3 mr-1" />
                ~{readingTimeSec}s
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-1.5 text-xs">
          <button
            type="button"
            onClick={onLoadSample}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/20 transition flex items-center space-x-1"
            title={t('editorInput.loadSample', uiLanguage)}
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{t('editorInput.loadSample', uiLanguage)}</span>
          </button>

          <button
            type="button"
            onClick={handlePaste}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/5 transition flex items-center space-x-1"
            title={t('editorInput.paste', uiLanguage)}
          >
            <Clipboard className="w-3 h-3 text-slate-400" />
            <span>{t('editorInput.paste', uiLanguage)}</span>
          </button>

          {text && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-lg bg-slate-800/80 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-white/5 transition"
              title={t('editorInput.clear', uiLanguage)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative flex-1 mt-3">
        <textarea
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('editorInput.placeholder', uiLanguage)}
          className="w-full h-64 sm:h-80 bg-transparent resize-none text-slate-100 placeholder-slate-400/80 focus:outline-none text-sm sm:text-base leading-relaxed font-sans pr-2"
          maxLength={maxChars + 100}
        />
      </div>

      {/* Optional Custom Guidance Collapsible */}
      <div className="pt-2 border-t border-white/5">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-slate-400 hover:text-slate-200 transition flex items-center space-x-1.5 py-1"
        >
          <SlidersHorizontal className="w-3 h-3 text-blue-400" />
          <span>
            {showAdvanced
              ? t('editorInput.customInstructionsToggle', uiLanguage)
              : t('editorInput.customInstructionsToggle', uiLanguage)}
          </span>
        </button>

        {showAdvanced && (
          <div className="mt-2">
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => onChangeCustomInstructions(e.target.value)}
              placeholder={t('editorInput.customInstructionsPlaceholder', uiLanguage)}
              maxLength={300}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>
        )}
      </div>

      {/* Bottom Bar: Action & Limit Bar */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        {/* Progress bar */}
        <div className="w-36 hidden sm:block">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isOverLimit
                  ? 'bg-rose-500'
                  : charCount > maxChars * 0.85
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, (charCount / maxChars) * 100)}%` }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || isTooShort || isOverLimit}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm shadow-lg transition ${
            isLoading || isTooShort || isOverLimit
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-500/20 hover:shadow-blue-500/30'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>{t('editorInput.submitting', uiLanguage)}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t('editorInput.submit', uiLanguage)}</span>
              <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono text-white/70">
                Ctrl+Enter
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

