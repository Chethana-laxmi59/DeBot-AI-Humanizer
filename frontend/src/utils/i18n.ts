export type UiLanguage = 'en' | 'te' | 'hi';

export interface UiLanguageOption {
  code: UiLanguage;
  name: string;
  nativeName: string;
}

export const UI_LANGUAGES: UiLanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

export const TRANSLATIONS: Record<UiLanguage, Record<string, string>> = {
  en: {
    // Navigation & Header
    'nav.brandSubtitle': 'Definitive Editorial & Balancing Engine',
    'nav.versionBadge': 'v1.0 Refiner',
    'nav.model': 'Model',
    'nav.liveAi': 'Live AI',
    'nav.demoPresets': 'Demo Presets',
    'nav.uiLanguage': 'Interface Language',
    'nav.outputLanguage': 'Output Language',
    'nav.history': 'History',
    'nav.historyTooltip': 'Local Revision History',
    'nav.privacyTooltip': 'Privacy Notice & Data Processing Policy',

    // Setup Alert Banner
    'setupAlert.title': 'Demo Exploration Mode:',
    'setupAlert.desc': 'Server is running without GEMINI_API_KEY. Interactive sample presets are active with verified benchmarks.',
    'setupAlert.loadSample': 'Load Curated Sample',
    'setupAlert.dismiss': 'Dismiss notice',

    // Landing Section
    'landing.badge': 'Calibrated Natural Language Refinement Engine',
    'landing.titlePrefix': 'Refine your writing with',
    'landing.titleHighlight': 'verifiable integrity',
    'landing.description': 'DEBOT transforms robotic drafts into lucid, context-rich prose across 6 tailored modes. Featuring rule-based entity checks that independently verify every number, date, quotation, and proper noun.',
    'landing.pill1': 'Deterministic Token Verification',
    'landing.pill2': '6 Calibrated Voice Modes',
    'landing.pill3': 'Zero False Detector Claims',
    'landing.openWorkspace': 'Open Writing Workspace',

    // Modes & ModeSelector
    'modes.title': 'Writing Refinement Mode',
    'modes.loadModeSample': 'Load Mode Sample',
    'modes.standard.label': 'Standard',
    'modes.standard.tagline': 'Balanced & Fluent',
    'modes.standard.desc': 'Refines grammar, cadence, and clarity while keeping your personal voice.',
    'modes.academic.label': 'Academic',
    'modes.academic.tagline': 'Scholarly & Rigorous',
    'modes.academic.desc': 'Elevates discourse for peer reviews, dissertations, and research papers.',
    'modes.casual.label': 'Casual',
    'modes.casual.tagline': 'Warm & Conversational',
    'modes.casual.desc': 'Softens stiff phrasing into an approachable, friendly, human tone.',
    'modes.professional.label': 'Professional',
    'modes.professional.tagline': 'Crisp & Executive',
    'modes.professional.desc': 'Crafts high-impact business communication that demands action.',
    'modes.creative.label': 'Creative',
    'modes.creative.tagline': 'Vivid & Expressive',
    'modes.creative.desc': 'Infuses evocative sensory imagery, lively rhythm, and literary style.',
    'modes.simple.label': 'Simple',
    'modes.simple.tagline': 'Plain Language',
    'modes.simple.desc': 'Strips complexity so your message is instantly understood by anyone.',

    // Editor Input
    'editorInput.title': 'Source Draft',
    'editorInput.clear': 'Clear',
    'editorInput.paste': 'Paste',
    'editorInput.loadSample': 'Load Sample',
    'editorInput.placeholder': 'Paste or draft your text here... (minimum 5 characters)',
    'editorInput.words': 'words',
    'editorInput.chars': 'chars',
    'editorInput.estReadTime': 'Est. Read Time',
    'editorInput.customInstructionsToggle': 'Stylistic directives & preservation preferences (optional)',
    'editorInput.customInstructionsPlaceholder': 'e.g., Maintain British spelling, emphasize second paragraph, keep technical acronyms...',
    'editorInput.submit': 'Refine Writing',
    'editorInput.submitting': 'Refining Prose...',
    'editorInput.minChars': 'Minimum 5 characters required',
    'editorInput.maxChars': 'Maximum 5000 characters limit reached',

    // Editor Output
    'editorOutput.title': 'Refined Prose',
    'editorOutput.tabRefined': 'Refined Text',
    'editorOutput.tabDiff': 'Visual Diff (LCS)',
    'editorOutput.copy': 'Copy',
    'editorOutput.copied': 'Copied!',
    'editorOutput.downloadTxt': 'Download TXT',
    'editorOutput.downloadMd': 'Download Markdown (.md)',
    'editorOutput.summaryTitle': 'Editorial Summary',
    'editorOutput.preservedTitle': 'Preserved Key Elements',
    'editorOutput.readTimeOrig': 'Original:',
    'editorOutput.readTimeRef': 'Refined:',
    'editorOutput.emptyTitle': 'Awaiting Your Text',
    'editorOutput.emptyDesc': 'Select a writing mode, paste your draft, or click "Load Sample" to test natural refinement with entity verification.',
    'editorOutput.loadingTitle': 'Calibrating prose cadence & verifying entities...',
    'editorOutput.listenVoice': 'Listen & Tone Audit',
    'editorOutput.listening': 'Auditioning Prose & Tone...',
    'editorOutput.pauseVoice': 'Pause',
    'editorOutput.resumeVoice': 'Resume',
    'editorOutput.stopVoice': 'Stop Voice',
    'editorOutput.cadenceAuditTitle': 'Cadence & Tone Audit',
    'editorOutput.formalityScore': 'Formality Index',
    'editorOutput.cadenceQuality': 'Cadence Profile',

    // Verification Panel
    'verification.title': 'Factual & Entity Verification Panel',
    'verification.scoreLabel': 'Entity Preservation',
    'verification.demoBenchmark': 'Demo Benchmark',
    'verification.warningsTitle': 'Honest Review Warnings:',
    'verification.preservedCol': 'Preserved Exact Entities',
    'verification.missingCol': 'Omitted / Altered Entity Tokens',
    'verification.meaningChanges': 'Potential Nuance Shifts (AI-reported)',
    'verification.additions': 'Rhetorical Additions (AI-reported)',
    'verification.noEntities': 'No specific named entities or numeric tokens detected.',

    // Diff Viewer
    'diff.insertions': 'Additions',
    'diff.deletions': 'Removals',
    'diff.unchanged': 'Unchanged',
    'diff.wordsAdded': 'words added',
    'diff.wordsRemoved': 'words removed',

    // History Modal
    'history.title': 'Local Revision History',
    'history.saved': 'saved',
    'history.clearAll': 'Clear All',
    'history.empty': 'No revisions saved yet. Process a rewrite to save your history.',
    'history.restore': 'Restore',
    'history.delete': 'Delete',
    'history.demo': 'Demo',

    // Privacy Modal
    'privacy.title': 'Privacy & Data Processing Policy',
    'privacy.providerTitle': 'AI Provider Processing',
    'privacy.providerDesc': 'When live rewriting is activated, your text is securely forwarded to the backend DEBOT service, which communicates with the Google Gemini API. Please refrain from submitting confidential passwords or sensitive personal data.',
    'privacy.zeroLogTitle': 'Default Zero-Logging Policy',
    'privacy.zeroLogDesc': 'The DEBOT backend operates with LOG_USER_TEXT=false. Submitted text is never saved to server logs or databases.',
    'privacy.localStorageTitle': 'Client-Side Local Storage',
    'privacy.localStorageDesc': 'Revision history is kept exclusively within your browser\'s localStorage. Nothing is uploaded to cloud servers. You can permanently wipe this data at any time via the "Clear All" control.',
    'privacy.close': 'Close',

    // Footer & Common
    'footer.tagline': 'DEBOT • Definitive Editorial & Balancing Optimization Technology',
    'footer.modelLabel': 'Configured Model:',
    'footer.subtext': 'Autonomous Token & Entity Integrity Verification',
    'common.retry': 'Retry',

    // Authentication & Login Page
    'login.tagline': 'Protected Editorial Workspace',
    'login.heroTitle': 'Humanize Your Writing with',
    'login.heroHighlight': 'Deterministic Precision',
    'login.heroDesc': 'Authenticate to unlock the complete AI writing refinement dashboard, synchronized MySQL draft revision storage, and multilingual studio-grade voice narration.',
    'login.featModesTitle': '6 Refinement Modes',
    'login.featModesDesc': 'Academic, Casual, Professional, Creative, Simple & Standard.',
    'login.featVerifierTitle': 'Entity Verifier',
    'login.featVerifierDesc': 'Independent mathematical token & entity preservation score.',
    'login.featVoiceTitle': 'Voice-Over Studio',
    'login.featVoiceDesc': 'ElevenLabs multilingual cadence narration & tone auditor.',
    'login.tabSignIn': 'Sign In',
    'login.tabCreateAccount': 'Create Account',
    'login.labelFullName': 'Full Name (Optional)',
    'login.placeholderFullName': 'e.g. Chethana Laxmi',
    'login.labelUsername': 'Username',
    'login.placeholderUsername': 'Choose a username',
    'login.labelEmail': 'Email Address',
    'login.placeholderEmail': 'name@example.com',
    'login.labelEmailOrUser': 'Email or Username',
    'login.placeholderEmailOrUser': 'Username or email address',
    'login.labelPassword': 'Password',
    'login.passwordHint': 'Minimum 6 characters, securely hashed with salted bcrypt.',
    'login.btnSignIn': 'Sign In & Launch Workspace',
    'login.btnCreateAccount': 'Create Account & Launch',
    'login.quickDemoFill': 'Fill Demo Account Credentials',
    'login.dbActive': 'MySQL Database Active',
    'login.dbSubtitle': 'MySQL Database Storage Active',
    'login.errEmptyFields': 'Please enter both your email/username and password.',
    'login.errReqFields': 'Please complete all required fields.',
    'login.errShortPass': 'Password must be at least 6 characters long.',
  },

  te: {
    // Navigation & Header
    'nav.brandSubtitle': 'ఖచ్చితమైన సంపాదకీయ & సమతుల్య ఆప్టిమైజేషన్ ఇంజిన్',
    'nav.versionBadge': 'v1.0 రిఫైనర్',
    'nav.model': 'మోడల్',
    'nav.liveAi': 'లైవ్ AI',
    'nav.demoPresets': 'డెమో ప్రీసెట్‌లు',
    'nav.uiLanguage': 'ఇంటర్‌ఫేస్ భాష',
    'nav.outputLanguage': 'అవుట్‌పుట్ భాష',
    'nav.history': 'చరిత్ర',
    'nav.historyTooltip': 'స్థానిక సవరణ చరిత్ర',
    'nav.privacyTooltip': 'గోప్యతా నోటీసు & డేటా విధానం',

    // Setup Alert Banner
    'setupAlert.title': 'డెమో అన్వేషణ మోడ్:',
    'setupAlert.desc': 'సర్వర్ GEMINI_API_KEY లేకుండా నడుస్తోంది. ధృవీకరించబడిన బెంచ్‌మార్క్‌లతో ఇంటరాక్టివ్ నమూనా ప్రీసెట్‌లు సక్రియంగా ఉన్నాయి.',
    'setupAlert.loadSample': 'క్యూరేటెడ్ నమూనాను లోడ్ చేయండి',
    'setupAlert.dismiss': 'నోటీసును తీసివేయండి',

    // Landing Section
    'landing.badge': 'క్యాలిబ్రేటెడ్ సహజ భాషా శుద్ధీకరణ ఇంజిన్',
    'landing.titlePrefix': 'మీ రచనను శుద్ధి చేయండి',
    'landing.titleHighlight': 'ధృవీకరించదగిన సమగ్రతతో',
    'landing.description': 'DEBOT రోబోటిక్ డ్రాఫ్ట్‌లను 6 ప్రత్యేక శైలులలో స్పష్టమైన, సందర్భోచిత గద్యంగా మారుస్తుంది. ప్రతి సంఖ్య, తేదీ, కొటేషన్ మరియు పేరును స్వతంత్రంగా తనిఖీ చేసే నియమ-ఆధారిత ధృవీకరణను కలిగి ఉంటుంది.',
    'landing.pill1': 'నియమిత టోకెన్ ధృవీకరణ',
    'landing.pill2': '6 క్యాలిబ్రేటెడ్ వాయిస్ మోడ్‌లు',
    'landing.pill3': 'తప్పుడు డిటెక్టర్ క్లెయిమ్‌లు లేవు',
    'landing.openWorkspace': 'రచన వర్క్‌స్పేస్‌ను తెరవండి',

    // Modes & ModeSelector
    'modes.title': 'రచన శుద్ధీకరణ మోడ్',
    'modes.loadModeSample': 'మోడ్ నమూనాను లోడ్ చేయండి',
    'modes.standard.label': 'ప్రామాణికం',
    'modes.standard.tagline': 'సమతుల్య & నిష్పాక్షిక',
    'modes.standard.desc': 'మీ వ్యక్తిగత స్వరాన్ని నిలుపుకుంటూనే వ్యాకరణం, లయ మరియు స్పష్టతను మెరుగుపరుస్తుంది.',
    'modes.academic.label': 'విద్యాసంబంధ',
    'modes.academic.tagline': 'పరిశోధనాత్మక & క్రమబద్ధమైన',
    'modes.academic.desc': 'పరిశోధనా పత్రాలు, సమీక్షలు మరియు సిద్ధాంత గ్రంథాల కోసం శాస్త్రీయ శైలిని అందిస్తుంది.',
    'modes.casual.label': 'సాధారణ',
    'modes.casual.tagline': 'ఆత్మీయ & సంభాషణాత్మక',
    'modes.casual.desc': 'కఠినమైన పదాలను స్నేహపూర్వక, సులభమైన సంభాషణ శైలిలోకి మారుస్తుంది.',
    'modes.professional.label': 'వృత్తిపరమైన',
    'modes.professional.tagline': 'స్పష్టమైన & ఎగ్జిక్యూటివ్',
    'modes.professional.desc': 'నిర్ణయాత్మక చర్యలను ప్రేరేపించే ప్రభావవంతమైన వ్యాపార సంభాషణను రూపొందిస్తుంది.',
    'modes.creative.label': 'సృజనాత్మక',
    'modes.creative.tagline': 'భావోద్వేగ & వర్ణనాత్మక',
    'modes.creative.desc': 'సజీవమైన భావచిత్రాలు, విలక్షణమైన లయ మరియు సాహిత్య శైలిని జోడిస్తుంది.',
    'modes.simple.label': 'సరళమైన',
    'modes.simple.tagline': 'సాధారణ భాష',
    'modes.simple.desc': 'ఎవరైనా సులభంగా అర్థం చేసుకునేలా సంక్లిష్టతను తొలగించి సూటిగా తెలియజేస్తుంది.',

    // Editor Input
    'editorInput.title': 'మూల డ్రాఫ్ట్',
    'editorInput.clear': 'క్లియర్',
    'editorInput.paste': 'పేస్ట్',
    'editorInput.loadSample': 'నమూనాను లోడ్ చేయండి',
    'editorInput.placeholder': 'మీ వచనాన్ని ఇక్కడ అతికించండి లేదా వ్రాయండి... (కనీసం 5 అక్షరాలు)',
    'editorInput.words': 'పదాలు',
    'editorInput.chars': 'అక్షరాలు',
    'editorInput.estReadTime': 'అంచనా పఠన సమయం',
    'editorInput.customInstructionsToggle': 'శైలి సూచనలు & సంరక్షణ ప్రాధాన్యతలు (ఐచ్ఛికం)',
    'editorInput.customInstructionsPlaceholder': 'ఉదా., బ్రిటిష్ స్పెల్లింగ్ ఉంచండి, సాంకేతిక పదాలను మార్చవద్దు...',
    'editorInput.submit': 'రచనను శుద్ధి చేయండి',
    'editorInput.submitting': 'గద్యాన్ని శుద్ధి చేస్తోంది...',
    'editorInput.minChars': 'కనీసం 5 అక్షరాలు అవసరం',
    'editorInput.maxChars': 'గరిష్టంగా 5000 అక్షరాల పరిమితి చేరుకుంది',

    // Editor Output
    'editorOutput.title': 'శుద్ధి చేసిన గద్యం',
    'editorOutput.tabRefined': 'శుద్ధి చేసిన వచనం',
    'editorOutput.tabDiff': 'విజువల్ తేడా (LCS)',
    'editorOutput.copy': 'కాపీ చేయండి',
    'editorOutput.copied': 'కాపీ చేయబడింది!',
    'editorOutput.downloadTxt': 'TXT డౌన్‌లోడ్',
    'editorOutput.downloadMd': 'Markdown (.md) డౌన్‌లోడ్',
    'editorOutput.summaryTitle': 'సంపాదకీయ సారాంశం',
    'editorOutput.preservedTitle': 'సంరక్షించబడిన కీలక అంశాలు',
    'editorOutput.readTimeOrig': 'అసలు:',
    'editorOutput.readTimeRef': 'శుద్ధి చేసినది:',
    'editorOutput.emptyTitle': 'మీ వచనం కోసం వేచి ఉంది',
    'editorOutput.emptyDesc': 'రచన మోడ్‌ను ఎంచుకోండి, డ్రాఫ్ట్‌ను అతికించండి లేదా నమూనాను లోడ్ చేయండి.',
    'editorOutput.loadingTitle': 'గద్య ప్రవాహాన్ని సర్దుబాటు చేస్తోంది & అంశాలను ధృవీకరిస్తోంది...',
    'editorOutput.listenVoice': 'వాయిస్ ఓవర్ & టోన్ ఆడిట్',
    'editorOutput.listening': 'వాయిస్ ఓవర్ రన్ అవుతోంది...',
    'editorOutput.pauseVoice': 'పాజ్',
    'editorOutput.resumeVoice': 'కొనసాగించు',
    'editorOutput.stopVoice': 'వాయిస్ ఆపు',
    'editorOutput.cadenceAuditTitle': 'కేడెన్స్ & టోన్ ఆడిట్',
    'editorOutput.formalityScore': 'ఫార్మాలిటీ సూచిక',
    'editorOutput.cadenceQuality': 'కేడెన్స్ ప్రొఫైల్',

    // Verification Panel
    'verification.title': 'వాస్తవ & అంశాల ధృవీకరణ ప్యానెల్',
    'verification.scoreLabel': 'అంశాల సంరక్షణ',
    'verification.demoBenchmark': 'డెమో బెంచ్‌మార్క్',
    'verification.warningsTitle': 'నిజాయితీ సమీక్ష హెచ్చరికలు:',
    'verification.preservedCol': 'సంరక్షించబడిన ఖచ్చితమైన అంశాలు',
    'verification.missingCol': 'వదిలివేయబడిన / మారిన అంశాలు',
    'verification.meaningChanges': 'సూక్ష్మ అర్థ మార్పులు (AI-రిపోర్ట్ చేయబడినది)',
    'verification.additions': 'అలంకారిక జోడింపులు (AI-రిపోర్ట్ చేయబడినది)',
    'verification.noEntities': 'నిర్దిష్ట పేర్లు లేదా సంఖ్యల టోకెన్లు కనుగొనబడలేదు.',

    // Diff Viewer
    'diff.insertions': 'జోడింపులు',
    'diff.deletions': 'తొలగింపులు',
    'diff.unchanged': 'మార్పులేనివి',
    'diff.wordsAdded': 'పదాలు జోడించబడ్డాయి',
    'diff.wordsRemoved': 'పదాలు తొలగించబడ్డాయి',

    // History Modal
    'history.title': 'స్థానిక సవరణ చరిత్ర',
    'history.saved': 'సేవ్ చేయబడ్డాయి',
    'history.clearAll': 'అన్నీ క్లియర్ చేయండి',
    'history.empty': 'ఇంకా ఎటువంటి సవరణలు సేవ్ చేయబడలేదు. మీ చరిత్రను సేవ్ చేయడానికి రీరైట్ చేయండి.',
    'history.restore': 'పునరుద్ధరించు',
    'history.delete': 'తొలగించు',
    'history.demo': 'డెమో',

    // Privacy Modal
    'privacy.title': 'గోప్యత & డేటా ప్రాసెసింగ్ విధానం',
    'privacy.providerTitle': 'AI ప్రొవైడర్ ప్రాసెసింగ్',
    'privacy.providerDesc': 'లైవ్ రీరైటింగ్ సక్రియం చేయబడినప్పుడు, మీ వచనం బ్యాకెండ్ DEBOT సేవకు పంపబడుతుంది, ఇది Google Gemini API తో కమ్యూనికేట్ చేస్తుంది. దయచేసి పాస్‌వర్డ్‌లు లేదా సున్నితమైన సమాచారాన్ని పంపవద్దు.',
    'privacy.zeroLogTitle': 'జీరో-లాగింగ్ విధానం',
    'privacy.zeroLogDesc': 'DEBOT బ్యాకెండ్ LOG_USER_TEXT=false తో పనిచేస్తుంది. సమర్పించిన వచనం సర్వర్ లాగ్‌లు లేదా డేటాబేస్‌లలో సేవ్ చేయబడదు.',
    'privacy.localStorageTitle': 'క్లయింట్-సైడ్ లోకల్ స్టోరేజ్',
    'privacy.localStorageDesc': 'సవరణ చరిత్ర మీ బ్రౌజర్ లోకల్ స్టోరేజ్‌లో మాత్రమే నిల్వ చేయబడుతుంది. క్లౌడ్‌కు ఏదీ అప్‌లోడ్ చేయబడదు.',
    'privacy.close': 'మూసివేయి',

    // Footer & Common
    'footer.tagline': 'DEBOT • ఖచ్చితమైన సంపాదకీయ & సమతుల్య ఆప్టిమైజేషన్ టెక్నాలజీ',
    'footer.modelLabel': 'కాన్ఫిగర్ చేసిన మోడల్:',
    'footer.subtext': 'స్వయంప్రతిపత్త టోకెన్ & అంశాల సమగ్రత ధృవీకరణ',
    'common.retry': 'మళ్లీ ప్రయత్నించండి',

    // Authentication & Login Page
    'login.tagline': 'రక్షిత సంపాదకీయ వర్క్‌స్పేస్',
    'login.heroTitle': 'మీ రచనను మానవీకరించండి',
    'login.heroHighlight': 'ఖచ్చితమైన సమగ్రతతో',
    'login.heroDesc': 'పూర్తి AI రచన శుద్ధీకరణ డ్యాష్‌బోర్డ్, MySQL సమకాలీకరించబడిన డ్రాఫ్ట్ నిల్వ మరియు బహుభాషా వాయిస్-ఓవర్‌ను అన్‌లాక్ చేయడానికి లాగిన్ చేయండి.',
    'login.featModesTitle': '6 శుద్ధీకరణ శైలులు',
    'login.featModesDesc': 'విద్యాసంబంధ, సాధారణ, వృత్తిపరమైన, సృజనాత్మక, సరళమైన మరియు ప్రామాణికం.',
    'login.featVerifierTitle': 'ఎంటిటీ వెరిఫైయర్',
    'login.featVerifierDesc': 'స్వతంత్ర గణిత టోకెన్ మరియు ఎంటిటీ సంరక్షణ స్కోరు.',
    'login.featVoiceTitle': 'వాయిస్-ఓవర్ స్టూడియో',
    'login.featVoiceDesc': 'ElevenLabs బహుభాషా కేడెన్స్ కథనం & టోన్ ఆడిటర్.',
    'login.tabSignIn': 'సైన్ ఇన్',
    'login.tabCreateAccount': 'ఖాతాను సృష్టించండి',
    'login.labelFullName': 'పూర్తి పేరు (ఐచ్ఛికం)',
    'login.placeholderFullName': 'ఉదా. చేతన లక్ష్మి',
    'login.labelUsername': 'యూజర్‌నేమ్',
    'login.placeholderUsername': 'యూజర్‌నేమ్‌ను ఎంచుకోండి',
    'login.labelEmail': 'ఇమెయిల్ చిరునామా',
    'login.placeholderEmail': 'name@example.com',
    'login.labelEmailOrUser': 'ఇమెయిల్ లేదా యూజర్‌నేమ్',
    'login.placeholderEmailOrUser': 'యూజర్‌నేమ్ లేదా ఇమెయిల్',
    'login.labelPassword': 'పాస్‌వర్డ్',
    'login.passwordHint': 'కనీసం 6 అక్షరాలు, సాల్టెడ్ bcrypt తో సురక్షితంగా హ్యాష్ చేయబడింది.',
    'login.btnSignIn': 'సైన్ ఇన్ & వర్క్‌స్పేస్‌ను ప్రారంభించండి',
    'login.btnCreateAccount': 'ఖాతాను సృష్టించి ప్రారంభించండి',
    'login.quickDemoFill': 'డెమో ఖాతా వివరాలను నింపండి',
    'login.dbActive': 'MySQL డేటాబేస్ సక్రియంగా ఉంది',
    'login.dbSubtitle': 'MySQL డేటాబేస్ నిల్వ సక్రియంగా ఉంది',
    'login.errEmptyFields': 'దయచేసి మీ ఇమెయిల్/యూజర్‌నేమ్ మరియు పాస్‌వర్డ్ రెండింటినీ నమోదు చేయండి.',
    'login.errReqFields': 'దయచేసి అవసరమైన అన్ని ఫీల్డ్‌లను పూర్తి చేయండి.',
    'login.errShortPass': 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.',
  },

  hi: {
    // Navigation & Header
    'nav.brandSubtitle': 'सटीक संपादकीय और संतुलन अनुकूलन इंजन',
    'nav.versionBadge': 'v1.0 रिफाइनर',
    'nav.model': 'मॉडल',
    'nav.liveAi': 'लाइव AI',
    'nav.demoPresets': 'डेमो प्रीसेट',
    'nav.uiLanguage': 'इंटरफ़ेस भाषा',
    'nav.outputLanguage': 'आउटपुट भाषा',
    'nav.history': 'इतिहास',
    'nav.historyTooltip': 'स्थानीय संशोधन इतिहास',
    'nav.privacyTooltip': 'गोपनीयता सूचना और नीति',

    // Setup Alert Banner
    'setupAlert.title': 'डेमो अन्वेषण मोड:',
    'setupAlert.desc': 'सर्वर बिना GEMINI_API_KEY के चल रहा है। सत्यापित बेंचमार्क के साथ इंटरैक्टिव नमूना प्रीसेट सक्रिय हैं।',
    'setupAlert.loadSample': 'क्यूरेटेड नमूना लोड करें',
    'setupAlert.dismiss': 'सूचना हटाएं',

    // Landing Section
    'landing.badge': 'कैलिब्रेटेड प्राकृतिक भाषा परिशोधन इंजन',
    'landing.titlePrefix': 'अपने लेखन को परिष्कृत करें',
    'landing.titleHighlight': 'सत्यापनीय सत्यनिष्ठा के साथ',
    'landing.description': 'DEBOT रोबोटिक ड्राफ्ट्स को 6 अनुकूलित शैलियों में स्पष्ट, संदर्भ-समृद्ध गद्य में बदलता है। प्रत्येक संख्या, तिथि, उद्धरण और संज्ञा की स्वतंत्र रूप से जांच करने वाला नियम-आधारित सत्यापन।',
    'landing.pill1': 'नियत टोकन सत्यापन',
    'landing.pill2': '6 कैलिब्रेटेड वॉयस मोड',
    'landing.pill3': 'कोई झूठा डिटेक्टर दावा नहीं',
    'landing.openWorkspace': 'लेखन कार्यक्षेत्र खोलें',

    // Modes & ModeSelector
    'modes.title': 'लेखन परिशोधन मोड',
    'modes.loadModeSample': 'मोड नमूना लोड करें',
    'modes.standard.label': 'मानक',
    'modes.standard.tagline': 'संतुलित और सुप्रवाहित',
    'modes.standard.desc': 'आपकी व्यक्तिगत आवाज़ को बनाए रखते हुए व्याकरण, प्रवाह और स्पष्टता में सुधार करता है।',
    'modes.academic.label': 'अकादमिक',
    'modes.academic.tagline': 'गंभीर और शोधपरक',
    'modes.academic.desc': 'सहकर्मी समीक्षाओं, शोध प्रबंधों और शोध पत्रों के लिए औपचारिक विमर्श तैयार करता है।',
    'modes.casual.label': 'अनौपचारिक',
    'modes.casual.tagline': 'सरल और संवादात्मक',
    'modes.casual.desc': 'कठिन भाषा को सहज, आत्मीय और मित्रवत शैली में परिवर्तित करता है।',
    'modes.professional.label': 'पेशेवर',
    'modes.professional.tagline': 'सटीक और कार्यकारी',
    'modes.professional.desc': 'निर्णायक और प्रभावशाली कॉर्पोरेट संचार का निर्माण करता है।',
    'modes.creative.label': 'रचनात्मक',
    'modes.creative.tagline': 'सजीव और भावपूर्ण',
    'modes.creative.desc': 'दृश्यात्मक कल्पनाशीलता, जीवंत लय और साहित्यिक शैली का संचार करता है।',
    'modes.simple.label': 'सरल',
    'modes.simple.tagline': 'सहज भाषा',
    'modes.simple.desc': 'जटिलता को हटाकर संदेश को सभी के लिए तुरंत समझने योग्य बनाता है।',

    // Editor Input
    'editorInput.title': 'मूल ड्राफ्ट',
    'editorInput.clear': 'साफ़ करें',
    'editorInput.paste': 'पेस्ट करें',
    'editorInput.loadSample': 'नमूना लोड करें',
    'editorInput.placeholder': 'अपना पाठ यहाँ चिपकाएँ या लिखें... (न्यूनतम 5 वर्ण)',
    'editorInput.words': 'शब्द',
    'editorInput.chars': 'वर्ण',
    'editorInput.estReadTime': 'अनुमानित पढ़ने का समय',
    'editorInput.customInstructionsToggle': 'शैली निर्देश और संरक्षण प्राथमिकताएं (वैकल्पिक)',
    'editorInput.customInstructionsPlaceholder': 'उदा., ब्रिटिश वर्तनी बनाए रखें, दूसरे पैराग्राफ पर जोर दें...',
    'editorInput.submit': 'लेखन परिष्कृत करें',
    'editorInput.submitting': 'गद्य को परिष्कृत किया जा रहा है...',
    'editorInput.minChars': 'न्यूनतम 5 वर्ण आवश्यक हैं',
    'editorInput.maxChars': 'अधिकतम 5000 वर्णों की सीमा समाप्त हो गई',

    // Editor Output
    'editorOutput.title': 'परिष्कृत गद्य',
    'editorOutput.tabRefined': 'परिष्कृत पाठ',
    'editorOutput.tabDiff': 'विजुअल अंतर (LCS)',
    'editorOutput.copy': 'कॉपी करें',
    'editorOutput.copied': 'कॉपी हो गया!',
    'editorOutput.downloadTxt': 'TXT डाउनलोड',
    'editorOutput.downloadMd': 'Markdown (.md) डाउनलोड',
    'editorOutput.summaryTitle': 'संपादकीय सारांश',
    'editorOutput.preservedTitle': 'संरक्षित मुख्य तत्व',
    'editorOutput.readTimeOrig': 'मूल:',
    'editorOutput.readTimeRef': 'परिष्कृत:',
    'editorOutput.emptyTitle': 'आपके पाठ की प्रतीक्षा है',
    'editorOutput.emptyDesc': 'लेखन मोड चुनें, अपना ड्राफ्ट चिपकाएँ, या प्राकृतिक परिष्कार देखने के लिए "नमूना लोड करें" पर क्लिक करें।',
    'editorOutput.loadingTitle': 'गद्य प्रवाह का समायोजन और तत्वों का सत्यापन किया जा रहा है...',
    'editorOutput.listenVoice': 'वॉइस-ओवर और टोन ऑडिट',
    'editorOutput.listening': 'ऑडिशन चल रहा है...',
    'editorOutput.pauseVoice': 'विराम',
    'editorOutput.resumeVoice': 'जारी रखें',
    'editorOutput.stopVoice': 'आवाज़ बंद करें',
    'editorOutput.cadenceAuditTitle': 'कैडेंस और टोन ऑडिट',
    'editorOutput.formalityScore': 'औपचारिकता सूचकांक',
    'editorOutput.cadenceQuality': 'कैडेंस प्रोफाइल',

    // Verification Panel
    'verification.title': 'तथ्य और तत्व सत्यापन पैनल',
    'verification.scoreLabel': 'तत्व संरक्षण',
    'verification.demoBenchmark': 'डेमो बेंचमार्क',
    'verification.warningsTitle': 'समीक्षा चेतावनियाँ:',
    'verification.preservedCol': 'संरक्षित सटीक तत्व',
    'verification.missingCol': 'छूटे हुए / बदले गए तत्व',
    'verification.meaningChanges': 'संभावित अर्थ परिवर्तन (AI-रिपोर्टेड)',
    'verification.additions': 'अलंकारिक परिवर्धन (AI-रिपोर्टेड)',
    'verification.noEntities': 'कोई विशिष्ट नाम या संख्यात्मक टोकन नहीं मिले।',

    // Diff Viewer
    'diff.insertions': 'जोड़े गए',
    'diff.deletions': 'हटाए गए',
    'diff.unchanged': 'अपरिवर्तित',
    'diff.wordsAdded': 'शब्द जोड़े गए',
    'diff.wordsRemoved': 'शब्द हटाए गए',

    // History Modal
    'history.title': 'स्थानीय संशोधन इतिहास',
    'history.saved': 'सहेजे गए',
    'history.clearAll': 'सभी साफ़ करें',
    'history.empty': 'अभी तक कोई संशोधन सहेजा नहीं गया है। इतिहास सहेजने के लिए पाठ परिष्कृत करें।',
    'history.restore': 'पुनर्स्थापित करें',
    'history.delete': 'हटाएं',
    'history.demo': 'डेमो',

    // Privacy Modal
    'privacy.title': 'गोपनीयता और डेटा प्रसंस्करण नीति',
    'privacy.providerTitle': 'AI प्रदाता प्रसंस्करण',
    'privacy.providerDesc': 'लाइव रीराइटिंग सक्रिय होने पर, आपका पाठ बैकएंड DEBOT सेवा को सुरक्षित रूप से भेजा जाता है, जो Google Gemini API के साथ संचार करता है। कृपया पासवर्ड या संवेदनशील व्यक्तिगत जानकारी सबमिट न करें।',
    'privacy.zeroLogTitle': 'शून्य-लॉगिंग नीति',
    'privacy.zeroLogDesc': 'DEBOT बैकएंड LOG_USER_TEXT=false के साथ संचालित होता है। सबमिट किया गया पाठ कभी भी सर्वर लॉग या डेटाबेस में सहेजा नहीं जाता है।',
    'privacy.localStorageTitle': 'क्लाइंट-साइड लोकल स्टोरेज',
    'privacy.localStorageDesc': 'संशोधन इतिहास केवल आपके ब्राउज़र के localStorage में सहेजा जाता है। क्लाउड सर्वर पर कुछ भी अपलोड नहीं किया जाता है।',
    'privacy.close': 'बंद करें',

    // Footer & Common
    'footer.tagline': 'DEBOT • सटीक संपादकीय और संतुलन अनुकूलन प्रौद्योगिकी',
    'footer.modelLabel': 'कॉन्फ़िगर किया गया मॉडल:',
    'footer.subtext': 'स्वायत्त टोकन और तत्व सत्यनिष्ठा सत्यापन',
    'common.retry': 'पुनः प्रयास करें',

    // Authentication & Login Page
    'login.tagline': 'सुरक्षित संपादकीय कार्यक्षेत्र',
    'login.heroTitle': 'अपने लेखन को मानवीय बनाएं',
    'login.heroHighlight': 'सटीक और प्रामाणिक परिशोधन',
    'login.heroDesc': 'पूर्ण AI लेखन परिशोधन डैशबोर्ड, MySQL ड्राफ्ट स्टोरेज और बहुभाषी वॉइस-ओवर का उपयोग करने के लिए लॉगिन करें।',
    'login.featModesTitle': '6 परिशोधन शैलियाँ',
    'login.featModesDesc': 'अकादमिक, अनौपचारिक, पेशेवर, रचनात्मक, सरल और मानक।',
    'login.featVerifierTitle': 'सटीक एंटिटी सत्यापन',
    'login.featVerifierDesc': 'स्वतंत्र गणितीय टोकन और एंटिटी संरक्षण स्कोर।',
    'login.featVoiceTitle': 'वॉइस-ओवर स्टूडियो',
    'login.featVoiceDesc': 'ElevenLabs बहुभाषी कैडेंस वाचन एवं टोन परीक्षक।',
    'login.tabSignIn': 'साइन इन करें',
    'login.tabCreateAccount': 'खाता बनाएं',
    'login.labelFullName': 'पूरा नाम (वैकल्पिक)',
    'login.placeholderFullName': 'उदा. चेतना लक्ष्मी',
    'login.labelUsername': 'उपयोगकर्ता नाम (यूज़रनेम)',
    'login.placeholderUsername': 'यूज़रनेम चुनें',
    'login.labelEmail': 'ईमेल पता',
    'login.placeholderEmail': 'name@example.com',
    'login.labelEmailOrUser': 'ईमेल या यूज़रनेम',
    'login.placeholderEmailOrUser': 'यूज़रनेम या ईमेल पता',
    'login.labelPassword': 'पासवर्ड',
    'login.passwordHint': 'न्यूनतम 6 अक्षर, सॉल्टेड bcrypt के साथ सुरक्षित रूप से एन्क्रिप्टेड।',
    'login.btnSignIn': 'साइन इन करें और कार्यक्षेत्र खोलें',
    'login.btnCreateAccount': 'खाता बनाएं और शुरू करें',
    'login.quickDemoFill': 'डेमो खाता क्रेडेंशियल्स भरें',
    'login.dbActive': 'MySQL डेटाबेस सक्रिय है',
    'login.dbSubtitle': 'MySQL डेटाबेस स्टोरेज सक्रिय है',
    'login.errEmptyFields': 'कृपया ईमेल/यूज़रनेम और पासवर्ड दोनों दर्ज करें।',
    'login.errReqFields': 'कृपया सभी आवश्यक फ़ील्ड भरें।',
    'login.errShortPass': 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
  },
};

const UI_STORAGE_KEY = 'debot_ui_language';

export function getStoredUiLanguage(): UiLanguage {
  try {
    const val = localStorage.getItem(UI_STORAGE_KEY);
    if (val === 'te' || val === 'hi' || val === 'en') {
      return val;
    }
  } catch {
    // localStorage may be unavailable
  }
  return 'en';
}

export function setStoredUiLanguage(lang: UiLanguage): void {
  try {
    localStorage.setItem(UI_STORAGE_KEY, lang);
  } catch {
    // localStorage may be unavailable
  }
}

/**
 * Type-safe translation lookup with automatic English fallback.
 */
export function t(key: string, lang: UiLanguage = 'en'): string {
  const currentDict = TRANSLATIONS[lang];
  if (currentDict && currentDict[key]) {
    return currentDict[key];
  }
  // Fallback to English
  const enDict = TRANSLATIONS.en;
  if (enDict && enDict[key]) {
    return enDict[key];
  }
  return key;
}
