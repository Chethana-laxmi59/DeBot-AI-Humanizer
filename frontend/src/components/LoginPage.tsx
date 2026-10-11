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
import { Interactive3DCanvas } from './Interactive3DCanvas';
import { Card3DTilt } from './Card3DTilt';

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

  // Dynamic Password Strength Meter
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9!@#$%^&*]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-400' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-cyan-400' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400' };
  };

  const pwdStrength = getPasswordStrength(password);

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
    <div className="min-h-screen w-full bg-[#070A10] flex flex-col justify-between relative overflow-hidden text-slate-100 cyber-grid">
      {/* Interactive 3D Particle Constellation Canvas */}
      <Interactive3DCanvas variant="neural" particleCount={110} />

      {/* Atmospheric ambient glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-float" />
      <div className="absolute bottom-0 right-1/4 w-[650px] h-[650px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none animate-float" style={{ animationDelay: '2.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-cyan-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between relative z-20">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tight text-white font-mono bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                DEBOT
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                v1.0.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
              {t('nav.brandSubtitle', uiLanguage)}
            </p>
          </div>
        </div>

        {/* Language selector & DB badge */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs text-emerald-300 font-medium shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Database className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>
              {health?.database_type === 'mysql' 
                ? t('login.dbActive', uiLanguage) 
                : (uiLanguage === 'te' ? 'డేటాబేస్ సిద్ధంగా ఉంది' : uiLanguage === 'hi' ? 'डेटाबेस तैयार है' : 'Database Ready')}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md hover:border-cyan-500/40 transition">
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
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row items-center justify-center gap-12 relative z-20 w-full">
        {/* Left column: Product introduction with 3D tilt cards */}
        <div className="flex-1 max-w-xl text-center lg:text-left space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 font-medium shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <ShieldCheck className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{t('login.tagline', uiLanguage)}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t('login.heroTitle', uiLanguage)}{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent animate-gradient">
              {t('login.heroHighlight', uiLanguage)}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
            {t('login.heroDesc', uiLanguage)}
          </p>

          {/* Interactive 3D Tilt Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 text-left">
            <Card3DTilt maxTilt={10} glowColor="rgba(59, 130, 246, 0.2)">
              <div className="p-3.5 rounded-2xl glass-panel-elevated border border-blue-500/20 space-y-1.5 bg-slate-900/60 h-full hover:border-blue-500/50 transition">
                <div className="h-8 w-8 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-slate-100">{t('login.featModesTitle', uiLanguage)}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{t('login.featModesDesc', uiLanguage)}</p>
              </div>
            </Card3DTilt>

            <Card3DTilt maxTilt={10} glowColor="rgba(16, 185, 129, 0.2)">
              <div className="p-3.5 rounded-2xl glass-panel-elevated border border-emerald-500/20 space-y-1.5 bg-slate-900/60 h-full hover:border-emerald-500/50 transition">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-slate-100">{t('login.featVerifierTitle', uiLanguage)}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{t('login.featVerifierDesc', uiLanguage)}</p>
              </div>
            </Card3DTilt>

            <Card3DTilt maxTilt={10} glowColor="rgba(129, 140, 248, 0.2)">
              <div className="p-3.5 rounded-2xl glass-panel-elevated border border-indigo-500/20 space-y-1.5 bg-slate-900/60 h-full hover:border-indigo-500/50 transition">
                <div className="h-8 w-8 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                  <Volume2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-slate-100">{t('login.featVoiceTitle', uiLanguage)}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{t('login.featVoiceDesc', uiLanguage)}</p>
              </div>
            </Card3DTilt>
          </div>
        </div>

        {/* Right column: 3D Interactive Tilt Auth Card */}
        <div className="w-full max-w-md">
          <Card3DTilt maxTilt={8} glowColor="rgba(6, 182, 212, 0.25)">
            <div className="relative overflow-hidden rounded-3xl glass-panel-3d border border-white/15 p-6 sm:p-8 backdrop-blur-2xl">
              {/* Header Tabs */}
              <div className="flex p-1 rounded-2xl bg-slate-950/80 border border-white/10 text-xs font-medium mb-6 shadow-inner">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(null); }}
                  className={`flex-1 py-2.5 rounded-xl transition duration-200 ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('login.tabSignIn', uiLanguage)}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(null); }}
                  className={`flex-1 py-2.5 rounded-xl transition duration-200 ${
                    mode === 'register'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('login.tabCreateAccount', uiLanguage)}
                </button>
              </div>

              {/* Error banner */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2 text-xs text-rose-300 animate-fadeIn shadow-[0_0_15px_rgba(244,63,94,0.15)]">
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
                      <div className="relative group">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 group-focus-within:text-cyan-400 transition" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={t('login.placeholderFullName', uiLanguage)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {t('login.labelUsername', uiLanguage)} <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative group">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 group-focus-within:text-cyan-400 transition" />
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder={t('login.placeholderUsername', uiLanguage)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        {t('login.labelEmail', uiLanguage)} <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative group">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 group-focus-within:text-cyan-400 transition" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('login.placeholderEmail', uiLanguage)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition"
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
                    <div className="relative group">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 group-focus-within:text-cyan-400 transition" />
                      <input
                        type="text"
                        required
                        value={emailOrUser}
                        onChange={(e) => setEmailOrUser(e.target.value)}
                        placeholder={t('login.placeholderEmailOrUser', uiLanguage)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {t('login.labelPassword', uiLanguage)} <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative group">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 group-focus-within:text-cyan-400 transition" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Interactive Password Strength Indicator */}
                  {mode === 'register' && password && (
                    <div className="mt-2 space-y-1 animate-fadeIn">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Password Strength:</span>
                        <span className={`font-semibold ${
                          pwdStrength.score >= 3 ? 'text-emerald-400' : pwdStrength.score === 2 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {pwdStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex gap-1">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`flex-1 transition-all duration-300 ${
                              step <= pwdStrength.score ? pwdStrength.color : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {mode === 'register' && !password && (
                    <p className="text-[11px] text-slate-500 mt-1">{t('login.passwordHint', uiLanguage)}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-xl shadow-cyan-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group glow-cyan"
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
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleQuickDemoFill}
                    className="inline-flex items-center space-x-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition hover:underline group"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                    <span>{t('login.quickDemoFill', uiLanguage)}</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-white/5">
                    chethana / chethana123
                  </span>
                </div>
              )}
            </div>
          </Card3DTilt>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 relative z-20 gap-2">
        <p>&copy; {new Date().getFullYear()} DEBOT. {t('footer.tagline', uiLanguage)}</p>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          <span className="text-slate-300">{t('login.dbSubtitle', uiLanguage)}</span>
        </div>
      </footer>
    </div>
  );
};
