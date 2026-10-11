import React, { useState } from 'react';
import { 
  Clipboard, 
  Trash2, 
  Sparkles, 
  SlidersHorizontal, 
  Clock, 
  FileText,
  Cpu
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
  const [isFocused, setIsFocused] = useState(false);

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

  // Radial progress calculations
  const progressPct = Math.min(100, (charCount / maxChars) * 100);
  const circumference = 2 * Math.PI * 9;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <div
      className={`flex flex-col h-full rounded-2xl glass-panel-3d p-4 sm:p-5 relative transition-all duration-300 overflow-hidden ${
        isFocused ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-white/10'
      }`}
    >
      {/* Animated AI Scanning Laser Beam across the ENTIRE source draft box */}
      {isLoading && (
        <>
          {/* Luminous high-precision scanning laser */}
          <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#22d3ee,0_0_8px_#38bdf8] animate-scanbeam pointer-events-none z-30" />
          {/* Soft trailing holographic light sweep */}
          <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-cyan-500/10 via-cyan-400/5 to-transparent pointer-events-none z-20 animate-scanglow" />
        </>
      )}

      {/* Editor Header / Stats */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-semibold text-xs sm:text-sm text-slate-100">
            {t('editorInput.title', uiLanguage)}
          </span>
          <span className="text-slate-600">•</span>
          
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>{wordCount} {t('editorInput.words', uiLanguage)}</span>
            <span>({charCount}/{maxChars})</span>
            {readingTimeSec > 0 && (
              <span className="hidden sm:inline-flex items-center text-slate-400">
                <Clock className="w-3 h-3 mr-1 text-cyan-400" />
                ~{readingTimeSec}s
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions with hover glows */}
        <div className="flex items-center space-x-1.5 text-xs">
          <button
            type="button"
            onClick={onLoadSample}
            className="px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 transition flex items-center space-x-1 shadow-sm hover:shadow-[0_0_10px_rgba(6,182,212,0.25)] group cursor-pointer"
            title={t('editorInput.loadSample', uiLanguage)}
          >
            <Sparkles className="w-3 h-3 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>{t('editorInput.loadSample', uiLanguage)}</span>
          </button>

          <button
            type="button"
            onClick={handlePaste}
            className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition flex items-center space-x-1 cursor-pointer"
            title={t('editorInput.paste', uiLanguage)}
          >
            <Clipboard className="w-3 h-3 text-slate-400" />
            <span>{t('editorInput.paste', uiLanguage)}</span>
          </button>

          {text && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-xl bg-slate-900/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition cursor-pointer"
              title={t('editorInput.clear', uiLanguage)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea Container */}
      <div className="relative flex-1 mt-3.5 rounded-xl overflow-hidden p-2.5 bg-slate-950/40 border border-white/5 focus-within:border-cyan-500/30 transition">
        <textarea
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={t('editorInput.placeholder', uiLanguage)}
          className="w-full h-64 sm:h-80 bg-transparent resize-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm sm:text-base leading-relaxed font-sans pr-2 relative z-10"
          maxLength={maxChars + 100}
        />
      </div>

      {/* Optional Custom Guidance Collapsible */}
      <div className="pt-2.5 border-t border-white/10">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-slate-400 hover:text-cyan-300 transition flex items-center space-x-1.5 py-1 cursor-pointer"
        >
          <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
          <span className="font-medium">
            {t('editorInput.customInstructionsToggle', uiLanguage)}
          </span>
        </button>

        {showAdvanced && (
          <div className="mt-2 animate-fadeIn">
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => onChangeCustomInstructions(e.target.value)}
              placeholder={t('editorInput.customInstructionsPlaceholder', uiLanguage)}
              maxLength={300}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-white/15 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition"
            />
          </div>
        )}
      </div>

      {/* Bottom Bar: Action & Progress Gauge */}
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
        {/* Circular Progress Gauge */}
        <div className="flex items-center space-x-2.5">
          <div className="relative w-6 h-6 flex items-center justify-center">
            <svg className="w-6 h-6 transform -rotate-90">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-all duration-300 ${
                  isOverLimit
                    ? 'text-rose-500'
                    : charCount > maxChars * 0.85
                    ? 'text-amber-400'
                    : 'text-cyan-400'
                }`}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            {charCount}/{maxChars}
          </span>
        </div>

        {/* Submit Button with Gradient Shimmer */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || isTooShort || isOverLimit}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
            isLoading || isTooShort || isOverLimit
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5 shadow-none'
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25 glow-cyan'
          }`}
        >
          {isLoading ? (
            <>
              <Cpu className="w-4 h-4 animate-spin text-cyan-300" />
              <span>{t('editorInput.submitting', uiLanguage)}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>{t('editorInput.submit', uiLanguage)}</span>
              <kbd className="hidden md:inline-block ml-1 px-1.5 py-0.5 rounded-md bg-black/30 text-[10px] font-mono text-cyan-200 border border-white/10">
                Ctrl+Enter
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
