import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Database, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Languages, 
  ShieldCheck, 
  Cpu, 
  Volume2, 
  ArrowRight,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { type UiLanguage, UI_LANGUAGES, t } from '../utils/i18n';
import type { HealthResponse } from '../types';

interface LoginPageProps {
  uiLanguage: UiLanguage;
  onSelectUiLanguage: (lang: UiLanguage) => void;
  health: HealthResponse | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  uiLanguage,
  onSelectUiLanguage,
  health,
}) => {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [emailOrUser, setEmailOrUser] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      if (mode === 'login') {
        if (!emailOrUser.trim() || !password) {
          setErrorMsg(t('login.errEmptyFields', uiLanguage));
          return;
        }
        await login(emailOrUser.trim(), password);
      } else {
        if (!email.trim() || !username.trim() || !password) {
          setErrorMsg(t('login.errReqFields', uiLanguage));
          return;
        }
        if (password.length < 6) {
          setErrorMsg(t('login.errShortPass', uiLanguage));
          return;
        }
        await register(email.trim(), username.trim(), password, fullName.trim() || undefined);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickDemoFill = () => {
    setEmailOrUser('chethana');
    setPassword('chethana123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between relative overflow-hidden text-slate-100">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-mono">DEBOT</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                v1.0.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t('nav.brandSubtitle', uiLanguage)}
            </p>
          </div>
        </div>

        {/* Language selector & DB badge */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-emerald-300 font-medium">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {health?.database_type === 'mysql' 
                ? t('login.dbActive', uiLanguage) 
                : (uiLanguage === 'te' ? 'డేటాబేస్ సిద్ధంగా ఉంది' : uiLanguage === 'hi' ? 'डेटाबेस तैयार है' : 'Database Ready')}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Languages className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={uiLanguage}
              onChange={(e) => onSelectUiLanguage(e.target.value as UiLanguage)}
              className="bg-transparent text-xs text-slate-200 outline-none cursor-pointer pr-1"
            >
              {UI_LANGUAGES.map((item) => (
                <option key={item.code} value={item.code} className="bg-slate-900 text-slate-200">
                  {item.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Login / Register Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-center justify-center gap-12 relative z-10 w-full">
        {/* Left column: Product introduction */}
        <div className="flex-1 max-w-xl text-center lg:text-left space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('login.tagline', uiLanguage)}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t('login.heroTitle', uiLanguage)}{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              {t('login.heroHighlight', uiLanguage)}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
            {t('login.heroDesc', uiLanguage)}
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
            <div className="p-3 rounded-2xl glass-panel border border-white/5 space-y-1 bg-slate-900/40">
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-slate-200">{t('login.featModesTitle', uiLanguage)}</h4>
              <p className="text-[11px] text-slate-400">{t('login.featModesDesc', uiLanguage)}</p>
            </div>

            <div className="p-3 rounded-2xl glass-panel border border-white/5 space-y-1 bg-slate-900/40">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-slate-200">{t('login.featVerifierTitle', uiLanguage)}</h4>
              <p className="text-[11px] text-slate-400">{t('login.featVerifierDesc', uiLanguage)}</p>
            </div>

            <div className="p-3 rounded-2xl glass-panel border border-white/5 space-y-1 bg-slate-900/40">
              <div className="h-7 w-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-slate-200">{t('login.featVoiceTitle', uiLanguage)}</h4>
              <p className="text-[11px] text-slate-400">{t('login.featVoiceDesc', uiLanguage)}</p>
            </div>
          </div>
        </div>

        {/* Right column: Auth Card */}
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/10 shadow-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 p-6 sm:p-8">
            {/* Header Tabs */}
            <div className="flex p-1 rounded-2xl bg-slate-950/80 border border-white/5 text-xs font-medium mb-6">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className={`flex-1 py-2.5 rounded-xl transition ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('login.tabSignIn', uiLanguage)}
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(null); }}
                className={`flex-1 py-2.5 rounded-xl transition ${
                  mode === 'register'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('login.tabCreateAccount', uiLanguage)}
              </button>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start space-x-2 text-xs text-rose-300 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t('login.labelFullName', uiLanguage)}
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t('login.placeholderFullName', uiLanguage)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t('login.labelUsername', uiLanguage)} <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={t('login.placeholderUsername', uiLanguage)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {t('login.labelEmail', uiLanguage)} <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('login.placeholderEmail', uiLanguage)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>
                </>
              )}

              {mode === 'login' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t('login.labelEmailOrUser', uiLanguage)} <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      placeholder={t('login.placeholderEmailOrUser', uiLanguage)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t('login.labelPassword', uiLanguage)} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'register' && (
                  <p className="text-[11px] text-slate-500 mt-1">{t('login.passwordHint', uiLanguage)}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? t('login.btnSignIn', uiLanguage) : t('login.btnCreateAccount', uiLanguage)}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Pre-fill for Sir/Judge Evaluation */}
            {mode === 'login' && (
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="inline-flex items-center space-x-1.5 text-[11px] text-blue-400 hover:text-blue-300 font-medium transition"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>{t('login.quickDemoFill', uiLanguage)}</span>
                </button>
                <span className="text-[10px] text-slate-500 font-mono">chethana / chethana123</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 relative z-10 gap-2">
        <p>&copy; {new Date().getFullYear()} DEBOT. {t('footer.tagline', uiLanguage)}</p>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-slate-400">{t('login.dbSubtitle', uiLanguage)}</span>
        </div>
      </footer>
    </div>
  );
};
