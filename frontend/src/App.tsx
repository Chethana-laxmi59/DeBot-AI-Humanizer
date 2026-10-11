import { useState, useEffect, useRef } from 'react';
import { 
  fetchHealth, 
  fetchModes, 
  fetchLanguages, 
  fetchSamples, 
  requestRewrite, 
  ApiError 
} from './services/api';
import type { 
  HealthResponse, 
  ModeInfo, 
  LanguageOption, 
  SamplePreset, 
  WritingMode, 
  RewriteResponse, 
  RevisionItem 
} from './types';
import { loadRevisions, saveRevision, deleteRevision, clearAllRevisions } from './utils/history';
import { type UiLanguage, getStoredUiLanguage, setStoredUiLanguage, t } from './utils/i18n';

import { Header } from './components/Header';
import { LandingSection } from './components/LandingSection';
import { ModeSelector } from './components/ModeSelector';
import { EditorInput } from './components/EditorInput';
import { EditorOutput } from './components/EditorOutput';
import { VerificationPanel } from './components/VerificationPanel';
import { SetupAlert } from './components/SetupAlert';
import { HistoryModal } from './components/HistoryModal';
import { PrivacyModal } from './components/PrivacyModal';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { useAuth } from './context/AuthContext';

import { AlertCircle, RotateCcw } from 'lucide-react';

export function App() {
  // State
  const [uiLanguage, setUiLanguage] = useState<UiLanguage>(() => getStoredUiLanguage());
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [modes, setModes] = useState<ModeInfo[]>([]);
  const [languages, setLanguages] = useState<LanguageOption[]>([
    { code: 'en', name: 'English' },
    { code: 'te', name: 'Telugu (తెలుగు)' },
    { code: 'hi', name: 'Hindi (हिन्दी)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'de', name: 'German (Deutsch)' },
  ]);
  const [samples, setSamples] = useState<Record<string, SamplePreset>>({});
  
  const [selectedMode, setSelectedMode] = useState<WritingMode>('standard');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  
  const [inputText, setInputText] = useState<string>('');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  
  const [result, setResult] = useState<RewriteResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [revisions, setRevisions] = useState<RevisionItem[]>(() => loadRevisions());
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  const workspaceRef = useRef<HTMLDivElement>(null);

  const handleSelectUiLanguage = (lang: UiLanguage) => {
    setUiLanguage(lang);
    setStoredUiLanguage(lang);
  };

  // Load initial metadata
  useEffect(() => {
    async function initData() {
      try {
        const [hData, mData, lData, sData] = await Promise.all([
          fetchHealth().catch(() => null),
          fetchModes().catch(() => []),
          fetchLanguages().catch(() => [
            { code: 'en', name: 'English' },
            { code: 'te', name: 'Telugu (తెలుగు)' },
            { code: 'hi', name: 'Hindi (हिन्दी)' },
          ]),
          fetchSamples().catch(() => ({} as Record<string, SamplePreset>)),
        ]);

        if (hData) setHealth(hData);
        if (mData && mData.length > 0) setModes(mData);
        if (lData && lData.length > 0) setLanguages(lData);
        if (sData) {
          setSamples(sData);
          // Preload default standard sample text into editor if empty
          if (sData['standard']) {
            setInputText((prev) => prev ? prev : sData['standard'].original_text);
          }
        }
      } catch (err) {
        console.warn('Initial data load error:', err);
      }
    }

    initData();
  }, []);

  const handleLoadSample = (modeToLoad: WritingMode = selectedMode) => {
    const sample = samples[modeToLoad];
    if (sample) {
      setSelectedMode(modeToLoad);
      setInputText(sample.original_text);
      setErrorMessage(null);
    }
  };

  const handleSelectMode = (mode: WritingMode) => {
    setSelectedMode(mode);
    setErrorMessage(null);
    // If input is empty or matches one of the sample presets, automatically load this mode's sample
    const isCurrentInputASample = !inputText.trim() || Object.values(samples).some((s) => s.original_text.trim() === inputText.trim());
    if (isCurrentInputASample && samples[mode]) {
      setInputText(samples[mode].original_text);
    }
  };

  const handleSubmitRewrite = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setResult(null);

    const startTime = Date.now();
    const scanCycleDurationMs = 1800; // Complete scan duration across entire draft box

    try {
      const response = await requestRewrite({
        text: inputText,
        mode: selectedMode,
        language: selectedLanguage,
        custom_instructions: customInstructions,
      });

      // After one complete scan, reveal the refined text
      const elapsed = Date.now() - startTime;
      if (elapsed < scanCycleDurationMs) {
        await new Promise((resolve) => setTimeout(resolve, scanCycleDurationMs - elapsed));
      }

      setResult(response);

      // Save to revision history
      const updatedRevs = saveRevision({
        mode: response.mode,
        original_text: response.original_text,
        rewritten_text: response.rewritten_text,
        change_summary: response.change_summary,
        preservation_score: response.verification.preservation_score_pct,
        is_sample: response.is_sample,
      });
      setRevisions(updatedRevs);

    } catch (err: any) {
      setResult(null);
      if (err instanceof ApiError) {
        setErrorMessage(err.detail);
      } else {
        setErrorMessage(err.message || 'An unexpected error occurred during refinement.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreRevision = (rev: RevisionItem) => {
    setSelectedMode(rev.mode);
    setInputText(rev.original_text);
    setIsHistoryOpen(false);
  };

  const handleDeleteRevision = (id: string) => {
    const updated = deleteRevision(id);
    setRevisions(updated);
  };

  const { isAuthenticated } = useAuth();

  const handleClearHistory = () => {
    clearAllRevisions();
    setRevisions([]);
  };

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Require user authentication before opening the main dashboard
  if (!isAuthenticated) {
    return (
      <LoginPage
        uiLanguage={uiLanguage}
        onSelectUiLanguage={handleSelectUiLanguage}
        health={health}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100">
      {/* Top Navigation */}
      <Header
        health={health}
        uiLanguage={uiLanguage}
        onSelectUiLanguage={handleSelectUiLanguage}
        selectedLanguage={selectedLanguage}
        languages={languages}
        onSelectLanguage={setSelectedLanguage}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        historyCount={revisions.length}
      />

      {/* API Key Missing Setup Alert */}
      {health && !health.has_api_key && (
        <SetupAlert 
          uiLanguage={uiLanguage}
          onLoadSample={() => handleLoadSample(selectedMode)} 
        />
      )}

      {/* Hero Landing */}
      <LandingSection
        uiLanguage={uiLanguage}
        onScrollToWorkspace={scrollToWorkspace}
        onSelectSampleMode={(mode) => {
          handleLoadSample(mode);
          scrollToWorkspace();
        }}
      />

      {/* Main Workspace */}
      <main ref={workspaceRef} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Mode Selector */}
        {modes.length > 0 && (
          <ModeSelector
            uiLanguage={uiLanguage}
            modes={modes}
            selectedMode={selectedMode}
            onSelectMode={handleSelectMode}
            onLoadPresetForMode={(mode) => handleLoadSample(mode)}
          />
        )}

        {/* Error notification with Retry */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
              <button
                onClick={handleSubmitRewrite}
                className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 font-medium text-xs flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('common.retry', uiLanguage)}</span>
              </button>
            </div>
          </div>
        )}

        {/* Dual Editor Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Input */}
          <div className="h-full">
            <EditorInput
              uiLanguage={uiLanguage}
              text={inputText}
              onChangeText={setInputText}
              customInstructions={customInstructions}
              onChangeCustomInstructions={setCustomInstructions}
              onSubmit={handleSubmitRewrite}
              isLoading={isLoading}
              onLoadSample={() => handleLoadSample(selectedMode)}
            />
          </div>

          {/* Right Column: Output */}
          <div className="h-full">
            <EditorOutput
              uiLanguage={uiLanguage}
              result={result}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Verification Panel */}
        {result && (
          <div className="animate-fade-in">
            <VerificationPanel
              uiLanguage={uiLanguage}
              verification={result.verification}
              isSample={result.is_sample}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-4 text-center text-xs text-slate-400 space-y-2">
        <p className="font-mono">
          {t('footer.tagline', uiLanguage)}
        </p>
        <p>
          {t('footer.modelLabel', uiLanguage)}{' '}
          <span className="text-slate-300 font-mono">{health?.model || 'gemini-3.1-flash-lite'}</span> &bull;{' '}
          {t('footer.subtext', uiLanguage)}
        </p>
      </footer>

      {/* History Modal */}
      <HistoryModal
        uiLanguage={uiLanguage}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        revisions={revisions}
        onRestore={handleRestoreRevision}
        onDelete={handleDeleteRevision}
        onClearAll={handleClearHistory}
      />

      {/* Privacy Modal */}
      <PrivacyModal
        uiLanguage={uiLanguage}
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Authentication Modal (Sign In / Register) */}
      <AuthModal uiLanguage={uiLanguage} />
    </div>
  );
}

export default App;
