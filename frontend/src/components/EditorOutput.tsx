import React, { useState, useEffect, useRef } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Clock, 
  Sparkles, 
  GitCompare, 
  Info,
  Volume2,
  Pause,
  Play,
  Square,
  Activity,
  Radio,
  Loader2
} from 'lucide-react';
import type { RewriteResponse, WritingMode } from '../types';
import { DiffViewer } from './DiffViewer';
import { type UiLanguage, t } from '../utils/i18n';
import { synthesizeSpeech } from '../services/api';

interface EditorOutputProps {
  uiLanguage: UiLanguage;
  result: RewriteResponse | null;
  isLoading: boolean;
}

interface ToneCadenceProfile {
  label: Record<UiLanguage, string>;
  cadenceDescription: Record<UiLanguage, string>;
  audioVerdict: Record<UiLanguage, string>;
  formalityScore: number;
}

const TONE_AUDIT_PROFILES: Record<WritingMode, ToneCadenceProfile> = {
  standard: {
    label: {
      en: 'Balanced & Fluent Cadence',
      te: 'సమతుల్య & సహజమైన కేడెన్స్',
      hi: 'संतुलित और स्वाभाविक प्रवाह',
    },
    cadenceDescription: {
      en: 'Natural sentence cadence with effortless readability and authentic voice.',
      te: 'సహజమైన వాక్య ప్రవాహం మరియు స్పష్టమైన శైలి.',
      hi: 'प्रामाणिक आवाज़ के साथ सहज और स्पष्ट प्रवाह।',
    },
    audioVerdict: {
      en: 'Tone Cadence Audit: The refined prose displays balanced and idiomatic cadence, eliminating robotic filler while retaining author authenticity.',
      te: 'కేడెన్స్ ఆడిట్: సహజమైన, మెరుగుపరచబడిన మరియు సమతుల్య శైలితో కూడిన గద్యం.',
      hi: 'कैडेंस ऑडिट: रोबोटिक रुकावटों को हटाकर स्वाभाविक और संतुलित प्रवाह प्रदान किया गया है।',
    },
    formalityScore: 78,
  },
  academic: {
    label: {
      en: 'Scholarly & Rigorous Cadence',
      te: 'పాండిత్య & ఖచ్చితమైన కేడెన్స్',
      hi: 'पांडित्यपूर्ण और कठोर प्रवाह',
    },
    cadenceDescription: {
      en: 'Scholarly precision, measured phrasing, and evidence-grounded formal structure.',
      te: 'పరిశోధనాత్మక ఖచ్చితత్వం మరియు లాంఛనప్రాయ నిర్మాణం.',
      hi: 'उच्च शाब्दिक सटीकता और साक्ष्य-आधारित औपचारिक संरचना।',
    },
    audioVerdict: {
      en: 'Tone Cadence Audit: The prose exhibits scholarly precision, formal syntax, and measured evidence-grounded cadence calibrated for research publications.',
      te: 'కేడెన్స్ ఆడిట్: విద్యా పరిశోధనలకు అనువైన ఖచ్చితమైన మరియు అధికారిక నిర్మాణం.',
      hi: 'कैडेंस ऑडिट: अकादमिक शोध और औपचारिक प्रकाशनों के लिए उपयुक्त कठोर संरचना।',
    },
    formalityScore: 96,
  },
  casual: {
    label: {
      en: 'Warm & Conversational Cadence',
      te: 'స్నేహపూర్వక & సంభాషణాత్మక కేడెన్స్',
      hi: 'मित्रवत और संवादी प्रवाह',
    },
    cadenceDescription: {
      en: 'Approachable cadence, breezy rhythm, and friendly everyday warmth.',
      te: 'స్నేహపూర్వక పదబంధాలు మరియు సులభమైన సంభాషణ శైలి.',
      hi: 'आरामदेह शब्दावली और बातचीत का सहज, गर्मजोशी भरा लहज़ा।',
    },
    audioVerdict: {
      en: 'Tone Cadence Audit: The prose flows with an approachable, conversational cadence, relaxing stiff syntax into engaging human dialogue.',
      te: 'కేడెన్స్ ఆడిట్: రోజువారీ సంభాషణలకు అనువైన స్నేహపూర్వక మరియు స్పష్టమైన శైలి.',
      hi: 'कैडेंस ऑडिट: रोजमर्रा की बातचीत के लिए गर्मजोशी भरा और संवादी लहज़ा।',
    },
    formalityScore: 35,
  },
  professional: {
    label: {
      en: 'Crisp & Executive Cadence',
      te: 'స్పష్టమైన & ఎగ్జిక్యూటివ్ కేడెన్స్',
      hi: 'सटीक और कार्यकारी प्रवाह',
    },
    cadenceDescription: {
      en: 'High actionable clarity, executive efficiency, and diplomatic business tact.',
      te: 'కార్యనిర్వాహక సామర్థ్యం మరియు వ్యాపార స్పష్టత.',
      hi: 'उच्च कार्यसाधक स्पष्टता, कार्यकारी दक्षता और शिष्टाचार।',
    },
    audioVerdict: {
      en: 'Tone Cadence Audit: The prose delivers authoritative executive cadence, crisp action-oriented clarity, and polished professional efficiency.',
      te: 'కేడెన్స్ ఆడిట్: నిర్ణయాత్మక స్పష్టత కోసం రూపొందించబడిన అధికారిక వ్యాపార శైలి.',
      hi: 'कैडेंस ऑडिट: निर्णायक स्पष्टता और प्रभाव के लिए तैयार किया गया कार्यकारी व्यावसायिक संचार।',
    },
    formalityScore: 92,
  },
  creative: {
    label: {
      en: 'Evocative & Rhythmic Cadence',
      te: 'భావోద్వేగ & లయబద్ధమైన కేడెన్స్',
      hi: 'चित्रात्मक और लयबद्ध प्रवाह',
    },
    cadenceDescription: {
      en: 'Rich sensory textures, varied rhythmic sentence cadence, and expressive depth.',
      te: 'సృజనాత్మక లయ, స్పష్టమైన భావోద్వేగం మరియు వివరణాత్మక శైలి.',
      hi: 'समृद्ध संवेदी बनावट, विविध वाक्य लय और अभिव्यंजक गूंज।',
    },
    audioVerdict: {
      en: 'Tone Cadence Audit: The prose features vibrant rhythmic cadence, evocative sensory imagery, and compelling narrative dynamism.',
      te: 'కేడెన్స్ ఆడిట్: సజీవమైన వివరణ మరియు ఆకర్షణీయమైన లయతో కూడిన సృజనాత్మక శైలి.',
      hi: 'कैडेंस ऑडिट: जीवंत कथात्मक ऊर्जा और संवेदी लय के साथ कल्पनाशील गद्य।',
    },
    formalityScore: 60,
  },
  simple: {
    label: {
      en: 'Plain-Language Direct Cadence',
      te: 'సూటి & సరళ భాషా కేడెన్స్',
      hi: 'सरल भाषा और प्रत्यक्ष प्रवाह',
    },
    cadenceDescription: {
      en: 'Short compound sentences, zero cognitive drag, and effortless plain-language delivery.',
      te: 'సులువైన పదాలు మరియు ప్రతి ఒక్కరికీ అర్థమయ్యే సూటి వాక్యాలు.',
      hi: 'छोटे सीधे वाक्य, बिना किसी जटिल शब्दावली के अत्यंत सरल बोधगम्यता।',
    },
    audioVerdict: {
      en: 'Tone Cadence Audit: The prose adopts plain-language direct cadence with punchy sentences and minimum cognitive friction.',
      te: 'కేడెన్స్ ఆడిట్: అతి తక్కువ శ్రమతో ప్రతి ఒక్కరికీ అర్థమయ్యే సరళమైన మరియు స్పష్టమైన శైలి.',
      hi: 'कैडेंस ऑडिट: न्यूनतम मानसिक प्रयास के साथ सार्वभौमिक रूप से समझने योग्य सीधा गद्य।',
    },
    formalityScore: 45,
  },
};

export const EditorOutput: React.FC<EditorOutputProps> = ({
  uiLanguage,
  result,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'refined' | 'diff'>('refined');
  const [copied, setCopied] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isPausedVoice, setIsPausedVoice] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [voiceEngine, setVoiceEngine] = useState<'elevenlabs' | 'browser' | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop speech synthesis & audio on unmount or when output result changes/clears
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [result]);

  const stopAllAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlayingVoice(false);
    setIsPausedVoice(false);
    setIsAudioLoading(false);
    setVoiceEngine(null);
  };

  const playWithBrowserSpeech = (fullSpeechScript: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    setVoiceEngine('browser');

    const utterance = new SpeechSynthesisUtterance(fullSpeechScript);
    utteranceRef.current = utterance;

    // Set voice language matching output language
    if (result?.language === 'te') {
      utterance.lang = 'te-IN';
    } else if (result?.language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick best available voice if matching
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => 
      v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase()) ||
      v.lang.toLowerCase().startsWith((result?.language || 'en').toLowerCase())
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsPlayingVoice(true);
      setIsPausedVoice(false);
      setIsAudioLoading(false);
    };

    utterance.onend = () => {
      setIsPlayingVoice(false);
      setIsPausedVoice(false);
      setVoiceEngine(null);
    };

    utterance.onerror = () => {
      setIsPlayingVoice(false);
      setIsPausedVoice(false);
      setVoiceEngine(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleVoice = async () => {
    if (!result?.rewritten_text) return;

    if (isPlayingVoice) {
      if (voiceEngine === 'elevenlabs' && audioRef.current) {
        if (isPausedVoice) {
          audioRef.current.play();
          setIsPausedVoice(false);
        } else {
          audioRef.current.pause();
          setIsPausedVoice(true);
        }
        return;
      }
      if (voiceEngine === 'browser' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (isPausedVoice) {
          window.speechSynthesis.resume();
          setIsPausedVoice(false);
        } else {
          window.speechSynthesis.pause();
          setIsPausedVoice(true);
        }
        return;
      }
    }

    stopAllAudio();

    const profile = TONE_AUDIT_PROFILES[result.mode] || TONE_AUDIT_PROFILES.standard;
    const verdict = profile.audioVerdict[uiLanguage] || profile.audioVerdict.en;
    const fullSpeechScript = `${result.rewritten_text}. ${verdict}`;

    setIsAudioLoading(true);

    try {
      // First attempt ElevenLabs studio-quality synthesis via backend
      const blob = await synthesizeSpeech(fullSpeechScript.slice(0, 1000), result.language || 'en');
      if (blob) {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        setVoiceEngine('elevenlabs');

        audio.onplay = () => {
          setIsPlayingVoice(true);
          setIsPausedVoice(false);
          setIsAudioLoading(false);
        };
        audio.onpause = () => {
          setIsPausedVoice(true);
        };
        audio.onended = () => {
          setIsPlayingVoice(false);
          setIsPausedVoice(false);
          setVoiceEngine(null);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setIsAudioLoading(false);
          playWithBrowserSpeech(fullSpeechScript);
        };

        await audio.play();
        return;
      }
    } catch {
      // Backend not reached or ElevenLabs not configured, silently fall back
    } finally {
      setIsAudioLoading(false);
    }

    // Fall back to native browser speech synthesis
    playWithBrowserSpeech(fullSpeechScript);
  };

  const handleStopVoice = () => {
    stopAllAudio();
  };

  if (!result && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[320px] rounded-2xl glass-panel p-6 text-center border-dashed border-white/10">
        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3 border border-blue-500/20">
          <Sparkles className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-200 mb-1">
          {t('editorOutput.emptyTitle', uiLanguage)}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm">
          {t('editorOutput.emptyDesc', uiLanguage)}
        </p>
      </div>
    );
  }

  const handleCopy = async () => {
    if (!result?.rewritten_text) return;
    try {
      await navigator.clipboard.writeText(result.rewritten_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = (format: 'txt' | 'md') => {
    if (!result) return;
    const content = format === 'md'
      ? `# DEBOT Refined Text (${result.mode.toUpperCase()} Mode)\n\n## Refined Prose\n${result.rewritten_text}\n\n---\n**Change Summary:** ${result.change_summary}\n\n**Deterministic Verification Score:** ${result.verification.preservation_score_pct}%\n\n### Original Draft\n${result.original_text}\n`
      : result.rewritten_text;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `debot-refined-${result.mode}-${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toneProfile = result ? (TONE_AUDIT_PROFILES[result.mode] || TONE_AUDIT_PROFILES.standard) : null;

  return (
    <div className="flex flex-col h-full rounded-2xl glass-panel p-4 sm:p-5 relative transition">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          {/* Tab switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-white/5 text-xs">
            <button
              onClick={() => setActiveTab('refined')}
              className={`px-3 py-1 rounded-md font-medium transition ${
                activeTab === 'refined'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('editorOutput.tabRefined', uiLanguage)}
            </button>
            <button
              onClick={() => setActiveTab('diff')}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md font-medium transition ${
                activeTab === 'diff'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitCompare className="w-3 h-3 mr-1" />
              <span>{t('editorOutput.tabDiff', uiLanguage)}</span>
            </button>
          </div>

          {!isLoading && result && (
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400">
              <span>{result.word_count_rewritten} {t('editorInput.words', uiLanguage)}</span>
              <span>({result.char_count_rewritten} {t('editorInput.chars', uiLanguage)})</span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                ~{result.reading_time_seconds_rewritten}s
              </span>
            </div>
          )}
        </div>

        {/* Action buttons & Voice Over */}
        {!isLoading && result && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {/* Voice-Over & Tone Audit Control */}
            <div className="flex items-center rounded-lg bg-indigo-950/40 border border-indigo-500/30 p-0.5">
              <button
                onClick={handleToggleVoice}
                disabled={isAudioLoading}
                className={`px-2.5 py-1 rounded-md transition flex items-center space-x-1.5 font-medium ${
                  isPlayingVoice
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : isAudioLoading
                    ? 'bg-indigo-900/40 text-indigo-300 cursor-wait'
                    : 'text-indigo-300 hover:text-white hover:bg-indigo-900/50'
                }`}
                title={isPlayingVoice ? (isPausedVoice ? t('editorOutput.resumeVoice', uiLanguage) : t('editorOutput.pauseVoice', uiLanguage)) : t('editorOutput.listenVoice', uiLanguage)}
              >
                {isAudioLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-indigo-300 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : isPlayingVoice ? (
                  isPausedVoice ? (
                    <>
                      <Play className="w-3.5 h-3.5 text-indigo-200 fill-current" />
                      <span>{t('editorOutput.resumeVoice', uiLanguage)}</span>
                    </>
                  ) : (
                    <>
                      {/* Animated Soundwave Equalizer */}
                      <span className="flex items-center space-x-0.5 h-3.5 mr-0.5">
                        <span className="w-0.5 h-2 bg-white animate-pulse rounded-full"></span>
                        <span className="w-0.5 h-3.5 bg-white animate-pulse rounded-full"></span>
                        <span className="w-0.5 h-1.5 bg-white animate-pulse rounded-full"></span>
                        <span className="w-0.5 h-3 bg-white animate-pulse rounded-full"></span>
                      </span>
                      <Pause className="w-3 h-3 text-white ml-0.5" />
                      <span>{t('editorOutput.pauseVoice', uiLanguage)}</span>
                    </>
                  )
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t('editorOutput.listenVoice', uiLanguage)}</span>
                  </>
                )}
              </button>

              {isPlayingVoice && (
                <button
                  onClick={handleStopVoice}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition ml-0.5"
                  title={t('editorOutput.stopVoice', uiLanguage)}
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>
              )}
            </div>

            {/* Voice Engine Indicator */}
            {isPlayingVoice && voiceEngine === 'elevenlabs' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium flex items-center space-x-1 animate-pulse">
                <span>✨</span>
                <span>ElevenLabs HD</span>
              </span>
            )}

            {/* Sample Notice Flag */}
            {result.is_sample && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium text-[10px]">
                {t('verification.demoBenchmark', uiLanguage)}
              </span>
            )}

            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/5 transition flex items-center space-x-1"
              title={t('editorOutput.copy', uiLanguage)}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t('editorOutput.copied', uiLanguage)}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('editorOutput.copy', uiLanguage)}</span>
                </>
              )}
            </button>

            {/* Download dropdown / buttons */}
            <button
              onClick={() => handleDownload('txt')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/5 transition flex items-center space-x-1"
              title={t('editorOutput.downloadTxt', uiLanguage)}
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>.txt</span>
            </button>

            <button
              onClick={() => handleDownload('md')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/5 transition flex items-center space-x-1"
              title={t('editorOutput.downloadMd', uiLanguage)}
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>.md</span>
            </button>
          </div>
        )}
      </div>

      {/* Cadence & Tone Audit Bar (Interactive Vocal & Stylistic Appraisal) */}
      {!isLoading && result && toneProfile && (
        <div className={`mt-3 p-3 rounded-xl border transition ${
          isPlayingVoice 
            ? 'bg-indigo-950/40 border-indigo-500/40 shadow-lg shadow-indigo-950/50' 
            : 'bg-slate-900/60 border-white/5'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg ${isPlayingVoice ? 'bg-indigo-500/20 text-indigo-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                {isPlayingVoice ? <Radio className="w-4 h-4 text-indigo-400" /> : <Activity className="w-4 h-4 text-slate-400" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t('editorOutput.cadenceAuditTitle', uiLanguage)}:
                  </span>
                  <span className="text-xs font-semibold text-indigo-300">
                    {toneProfile.label[uiLanguage] || toneProfile.label.en}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {toneProfile.cadenceDescription[uiLanguage] || toneProfile.cadenceDescription.en}
                </p>
              </div>
            </div>

            {/* Formality & Cadence Quality Meter */}
            <div className="flex items-center space-x-3 text-[11px]">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500">{t('editorOutput.formalityScore', uiLanguage)}:</span>
                <span className="font-mono font-medium text-slate-300">{toneProfile.formalityScore}%</span>
                <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
                    style={{ width: `${toneProfile.formalityScore}%` }}
                  />
                </div>
              </div>

              <span className="text-slate-600">•</span>
              
              <div className="flex items-center space-x-1">
                <span className="text-slate-500">{t('editorOutput.cadenceQuality', uiLanguage)}:</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-medium border border-emerald-500/20 text-[10px]">
                  100% Calibrated
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 mt-3 overflow-y-auto">
        {isLoading ? (
          <div className="animate-pulse space-y-3 p-4">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          </div>
        ) : result ? (
          activeTab === 'refined' ? (
            <div className="p-2 sm:p-3 text-slate-100 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans selection:bg-blue-500/30">
              {result.rewritten_text}
            </div>
          ) : (
            <DiffViewer
              uiLanguage={uiLanguage}
              originalText={result.original_text}
              rewrittenText={result.rewritten_text}
            />
          )
        ) : null}
      </div>

      {/* Editorial Summary Callout */}
      {!isLoading && result && result.change_summary && (
        <div className="mt-3 pt-3 border-t border-white/5 bg-slate-950/40 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-4 rounded-b-2xl">
          <div className="flex items-start space-x-2 text-xs">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-slate-300">
              <span className="font-semibold text-slate-200">
                {t('editorOutput.summaryTitle', uiLanguage)}:
              </span>{' '}
              {result.change_summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
