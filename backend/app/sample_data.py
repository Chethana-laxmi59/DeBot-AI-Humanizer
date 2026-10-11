from typing import List, Dict, Any
from .schemas import WritingMode, SamplePreset, ModeInfo

MODES_METADATA: List[ModeInfo] = [
    ModeInfo(
        id=WritingMode.STANDARD.value,
        label="Standard",
        tagline="Balanced & Fluent",
        description="Refines grammar, cadence, and clarity while keeping your personal voice.",
        tone_characteristics=["Natural vocabulary", "Smooth flow", "Balanced formality"],
        sample_preview="Polishes clunky phrasing into effortless prose."
    ),
    ModeInfo(
        id=WritingMode.ACADEMIC.value,
        label="Academic",
        tagline="Scholarly & Rigorous",
        description="Elevates discourse for peer reviews, dissertations, and research papers.",
        tone_characteristics=["Objective tone", "Formal syntax", "Methodological precision"],
        sample_preview="Transforms informal assertions into measured scholarly analysis."
    ),
    ModeInfo(
        id=WritingMode.CASUAL.value,
        label="Casual",
        tagline="Warm & Conversational",
        description="Softens stiff phrasing into an approachable, friendly, human tone.",
        tone_characteristics=["Natural contractions", "Warm empathy", "Engaging pace"],
        sample_preview="Turns dry technical jargon into engaging coffee-chat dialogue."
    ),
    ModeInfo(
        id=WritingMode.PROFESSIONAL.value,
        label="Professional",
        tagline="Crisp & Executive",
        description="Crafts high-impact business communication that demands action.",
        tone_characteristics=["Decisive clarity", "Action-oriented", "Diplomatic tact"],
        sample_preview="Streamlines rambling emails into sharp executive summaries."
    ),
    ModeInfo(
        id=WritingMode.CREATIVE.value,
        label="Creative",
        tagline="Vivid & Expressive",
        description="Infuses evocative sensory imagery, lively rhythm, and literary style.",
        tone_characteristics=["Sensory descriptors", "Dynamic cadence", "Lyrical resonance"],
        sample_preview="Breathes atmospheric color into plain narrative text."
    ),
    ModeInfo(
        id=WritingMode.SIMPLE.value,
        label="Simple",
        tagline="Plain Language",
        description="Strips complexity so your message is instantly understood by anyone.",
        tone_characteristics=["Short sentences", "Jargon-free", "Effortless comprehension"],
        sample_preview="Demystifies dense explanations into crisp 6th-grade clarity."
    ),
]

SAMPLE_PRESETS: Dict[WritingMode, SamplePreset] = {
    WritingMode.STANDARD: SamplePreset(
        id="sample-standard-1",
        title="Product Launch Memo",
        mode=WritingMode.STANDARD,
        original_text=(
            "On October 14, 2026, Dr. Aris Thorne announced that Project Apex achieved a 42.8% boost "
            "in latency efficiency across 12,000 edge nodes. 'We proved that distributed consensus "
            "is feasible at under $0.003 per query,' said Thorne in Geneva. Nevertheless, there exist "
            "some architectural bottlenecks in the secondary replication pipeline that must be addressed."
        ),
        rewritten_text=(
            "On October 14, 2026, Dr. Aris Thorne announced that Project Apex delivered a 42.8% latency "
            "efficiency gain across 12,000 edge nodes. 'We proved that distributed consensus is feasible "
            "at under $0.003 per query,' Thorne stated in Geneva. However, the engineering team must still "
            "resolve several architectural bottlenecks within the secondary replication pipeline."
        ),
        change_summary="Eliminated passive constructions and smoothed the concluding transition while strictly preserving metrics and quotation.",
        preserved_details=[
            "Date: October 14, 2026",
            "Person: Dr. Aris Thorne",
            "Project name: Project Apex",
            "Metrics: 42.8%, 12,000 edge nodes, $0.003 per query",
            "Location: Geneva",
            "Exact quotation: 'We proved that distributed consensus is feasible at under $0.003 per query'"
        ],
        potential_meaning_changes=[],
        unsupported_additions=["Added 'the engineering team' as an active subject for sentence clarity."],
        review_warnings=[]
    ),
    WritingMode.ACADEMIC: SamplePreset(
        id="sample-academic-1",
        title="Genomic Sequencing Study",
        mode=WritingMode.ACADEMIC,
        original_text=(
            "In our tests on May 3, 2025, we looked at 450 BRCA1 samples and saw that 88% showed "
            "significant downregulation. Dr. Elena Rostova said 'this is really big news for RNA "
            "therapy.' We think the CRISPR-Cas12 assay worked way better than older Illumina runs."
        ),
        rewritten_text=(
            "During empirical evaluations conducted on May 3, 2025, analysis of 450 BRCA1 specimens "
            "revealed significant downregulation in 88% of cases. As Dr. Elena Rostova observed, "
            "'this is really big news for RNA therapy.' The empirical data suggests that the "
            "CRISPR-Cas12 assay demonstrates superior sensitivity compared to conventional Illumina platforms."
        ),
        change_summary="Elevated informal language ('looked at', 'way better') into rigorous academic terminology with measured epistemic framing.",
        preserved_details=[
            "Date: May 3, 2025",
            "Gene: BRCA1",
            "Sample size & metric: 450 samples, 88%",
            "Scientist: Dr. Elena Rostova",
            "Assay: CRISPR-Cas12, Illumina",
            "Quotation: 'this is really big news for RNA therapy'"
        ],
        potential_meaning_changes=["Softened 'worked way better' to 'demonstrates superior sensitivity' to reflect formal experimental nuance."],
        unsupported_additions=[],
        review_warnings=[]
    ),
    WritingMode.CASUAL: SamplePreset(
        id="sample-casual-1",
        title="Developer Community Update",
        mode=WritingMode.CASUAL,
        original_text=(
            "It is hereby communicated that on November 20, 2026, the DEBOT team finished migrating "
            "75 microservices to Kubernetes. Lead architect Marcus Vance mentioned that 'reliability "
            "improved by 35%.' Users experiencing 504 errors should refresh their browsers."
        ),
        rewritten_text=(
            "Quick update for everyone! On November 20, 2026, our DEBOT crew wrapped up migrating 75 "
            "microservices over to Kubernetes. Our lead architect Marcus Vance noted that 'reliability "
            "improved by 35%.' If you run into any 504 errors today, just give your browser a quick refresh."
        ),
        change_summary="Replaced bureaucratic phrasing with warm, energetic team speak and approachable action items.",
        preserved_details=[
            "Date: November 20, 2026",
            "System name: DEBOT, Kubernetes",
            "Metrics: 75 microservices, 35%, 504 errors",
            "Name: Marcus Vance",
            "Quotation: 'reliability improved by 35%'"
        ],
        potential_meaning_changes=[],
        unsupported_additions=["Added friendly opener 'Quick update for everyone!'"],
        review_warnings=[]
    ),
    WritingMode.PROFESSIONAL: SamplePreset(
        id="sample-professional-1",
        title="Q3 Quarterly Board Briefing",
        mode=WritingMode.PROFESSIONAL,
        original_text=(
            "Hey board, just wanted to let you know that in Q3 2025 our net ARR grew to $14.2M, "
            "beating targets by 18%. CFO Sarah Jenkins told everyone that 'our churn dropped to 1.2% "
            "in Europe.' We also closed 3 Enterprise deals with Siemens, SAP, and BMW."
        ),
        rewritten_text=(
            "Executive Briefing: During Q3 2025, Net ARR reached $14.2M, outperforming projected targets "
            "by 18%. CFO Sarah Jenkins reported that 'our churn dropped to 1.2% in Europe.' Furthermore, "
            "the sales division successfully finalized three strategic enterprise agreements with Siemens, SAP, and BMW."
        ),
        change_summary="Transformed casual tone into high-caliber executive correspondence suited for corporate governance.",
        preserved_details=[
            "Timeline: Q3 2025",
            "Financials: Net ARR $14.2M, 18% beat, 1.2% churn",
            "Executive: CFO Sarah Jenkins",
            "Enterprise clients: Siemens, SAP, BMW",
            "Quotation: 'our churn dropped to 1.2% in Europe'"
        ],
        potential_meaning_changes=[],
        unsupported_additions=["Added structured heading 'Executive Briefing:' for presentation hygiene."],
        review_warnings=[]
    ),
    WritingMode.CREATIVE: SamplePreset(
        id="sample-creative-1",
        title="Midnight Observational Log",
        mode=WritingMode.CREATIVE,
        original_text=(
            "At 02:45 AM on December 12, 2026, the Atacama telescope saw Supernova SN-2026X explode. "
            "Astronomer Mateo Silva wrote in the log: 'the sky burned blue for 4 seconds.' "
            "The event gave off 10^44 joules of cosmic radiation."
        ),
        rewritten_text=(
            "At 02:45 AM on December 12, 2026, the Atacama telescope caught sight of Supernova SN-2026X "
            "shattering the celestial quiet. In the observation ledger, astronomer Mateo Silva penned: "
            "'the sky burned blue for 4 seconds.' The titanic burst unleashed 10^44 joules of blinding "
            "cosmic radiance into the void."
        ),
        change_summary="Infused evocative narrative cadence, sensory weight ('celestial quiet', 'titanic burst'), while safeguarding astronomical data.",
        preserved_details=[
            "Timestamp: 02:45 AM on December 12, 2026",
            "Object & location: Supernova SN-2026X, Atacama telescope",
            "Scientist: Mateo Silva",
            "Physical metric: 10^44 joules",
            "Quotation: 'the sky burned blue for 4 seconds'"
        ],
        potential_meaning_changes=["Amplified poetic tone; check if scientific precision requires strictly neutral phrasing."],
        unsupported_additions=["Added literary descriptors ('shattering the celestial quiet', 'blinding cosmic radiance into the void')."],
        review_warnings=["Creative mode intentionally utilizes metaphoric adjectives; verify appropriateness for formal reporting."]
    ),
    WritingMode.SIMPLE: SamplePreset(
        id="sample-simple-1",
        title="Public Health Advisory",
        mode=WritingMode.SIMPLE,
        original_text=(
            "Individuals presenting with symptomatic manifestations of viral gastroenteritis pursuant "
            "to contaminated hydration sources on August 15, 2025, must immediately ingest 500ml of "
            "oral rehydration salts every 4 hours. Dr. Maya Lin stated: 'hydration prevents 95% of complications.'"
        ),
        rewritten_text=(
            "If you felt sick after drinking the water on August 15, 2025, drink 500ml of rehydration salts "
            "every 4 hours. As Dr. Maya Lin explained: 'hydration prevents 95% of complications.' "
            "Drinking fluids will keep you safe."
        ),
        change_summary="Converted dense medical terminology into clear, accessible everyday language with short sentences.",
        preserved_details=[
            "Date: August 15, 2025",
            "Dosage & schedule: 500ml, every 4 hours",
            "Physician: Dr. Maya Lin",
            "Metric: 95%",
            "Quotation: 'hydration prevents 95% of complications'"
        ],
        potential_meaning_changes=[],
        unsupported_additions=["Added summary reinforcement 'Drinking fluids will keep you safe.'"],
        review_warnings=[]
    )
}

SAMPLE_TRANSLATIONS: Dict[str, Dict[WritingMode, Dict[str, Any]]] = {
    "en": {
        mode: {
            "rewritten_text": preset.rewritten_text,
            "change_summary": preset.change_summary,
            "preserved_details": preset.preserved_details,
            "potential_meaning_changes": preset.potential_meaning_changes,
            "unsupported_additions": preset.unsupported_additions,
            "review_warnings": preset.review_warnings,
        }
        for mode, preset in SAMPLE_PRESETS.items()
    },
    "te": {
        WritingMode.STANDARD: {
            "rewritten_text": (
                "అక్టోబర్ 14, 2026న (October 14, 2026), Dr. Aris Thorne 12,000 ఎడ్జ్ నోడ్స్‌లో Project Apex "
                "42.8% లేటెన్సీ సామర్థ్య లాభాన్ని అందించినట్లు ప్రకటించారు. 'We proved that distributed consensus "
                "is feasible at under $0.003 per query' అని Geneva లో Thorne పేర్కొన్నారు. అయితే, ఇంజనీరింగ్ "
                "బృందం ద్వితీయ రెప్లికేషన్ పైప్‌లైన్‌లోని ఆర్కిటెక్చరల్ అడ్డంకులను ఇంకా పరిష్కరించాల్సి ఉంది."
            ),
            "change_summary": "సహజమైన సమతుల్య ప్రామాణిక శైలిలో తెలుగులోకి అనువదించబడింది; ప్యాసివ్ వాక్యాలను తొలగించి, మెట్రిక్స్ మరియు కొటేషన్‌లను ఖచ్చితంగా సంరక్షించింది.",
            "preserved_details": [
                "తేదీ: October 14, 2026",
                "వ్యక్తి: Dr. Aris Thorne",
                "ప్రాజెక్ట్: Project Apex",
                "కొలమానాలు: 42.8%, 12,000 edge nodes, $0.003",
                "ప్రదేశం: Geneva",
                "కొటేషన్: 'We proved that distributed consensus is feasible at under $0.003 per query'"
            ],
            "potential_meaning_changes": [],
            "unsupported_additions": ["వాక్య స్పష్టత కోసం 'ఇంజనీరింగ్ బృందం' జోడించబడింది."],
            "review_warnings": []
        },
        WritingMode.ACADEMIC: {
            "rewritten_text": (
                "మే 3, 2025న (May 3, 2025) నిర్వహించిన ప్రయోగ పరిశీలనలలో, 450 BRCA1 నమూనాల విశ్లేషణ "
                "88% కేసులలో గణనీయమైన డౌన్‌రెగ్యులేషన్‌ను వెల్లడించింది. Dr. Elena Rostova పేర్కొన్నట్లు, "
                "'this is really big news for RNA therapy.' సంప్రదాయ Illumina ప్లాట్‌ఫారమ్‌లతో పోలిస్తే "
                "CRISPR-Cas12 పరీక్ష విశిష్ట సున్నితత్వాన్ని ప్రదర్శిస్తుందని పరిశోధనా సమాచారం రుజువు చేస్తోంది."
            ),
            "change_summary": "అకడమిక్ మరియు శాస్త్రీయ పద్ధతిలో తెలుగులోకి అనువదించబడింది; జన్యు పదజాలం మరియు కొటేషన్‌లు సంరక్షించబడ్డాయి.",
            "preserved_details": [
                "తేదీ: May 3, 2025",
                "నమూనాలు: 450 BRCA1, 88%",
                "శాస్త్రవేత్త: Dr. Elena Rostova",
                "పరీక్ష: CRISPR-Cas12, Illumina",
                "కొటేషన్: 'this is really big news for RNA therapy'"
            ],
            "potential_meaning_changes": ["వైజ్ఞానిక ఖచ్చితత్వం కోసం 'చాలా మెరుగ్గా పనిచేసింది' అనే భావనను శాస్త్రీయంగా వ్యక్తీకరించబడింది."],
            "unsupported_additions": [],
            "review_warnings": []
        },
        WritingMode.CASUAL: {
            "rewritten_text": (
                "అందరికీ చిన్న అప్‌డేట్! నవంబర్ 20, 2026న (November 20, 2026), మన DEBOT బృందం 75 "
                "మైక్రోసర్వీసులను Kubernetes లోకి మైగ్రేట్ చేయడం పూర్తి చేసింది. మా లీడ్ ఆర్కిటెక్ట్ Marcus Vance "
                "చెబుతూ, 'reliability improved by 35%' అని పేర్కొన్నారు. ఈరోజు ఎవరికైనా 504 errors వస్తే, "
                "మీ బ్రౌజర్‌ను ఒక్కసారి రీఫ్రెష్ చేయండి."
            ),
            "change_summary": "స్నేహపూర్వక, సహజమైన సంభాషణా శైలిలో తేలికైన పదాలతో తెలుగు అనువాదం.",
            "preserved_details": [
                "తేదీ: November 20, 2026",
                "వ్యవస్థ: DEBOT, Kubernetes",
                "మెట్రిక్స్: 75 microservices, 35%, 504 errors",
                "పేరు: Marcus Vance",
                "కొటేషన్: 'reliability improved by 35%'"
            ],
            "potential_meaning_changes": [],
            "unsupported_additions": ["ఆత్మీయ ఆరంభం 'అందరికీ చిన్న అప్‌డేట్!' జోడించబడింది."],
            "review_warnings": []
        },
        WritingMode.PROFESSIONAL: {
            "rewritten_text": (
                "ఎగ్జిక్యూటివ్ బ్రీఫింగ్: Q3 2025 త్రైమాసికంలో, నికర ARR $14.2M కు చేరుకుంది, ఇది అంచనా లక్ష్యాల "
                "కంటే 18% ఎక్కువ. CFO Sarah Jenkins నివేదిస్తూ, 'our churn dropped to 1.2% in Europe' అని ధృవీకరించారు. "
                "అదనంగా, సేల్స్ విభాగం Siemens, SAP, మరియు BMW లతో మూడు వ్యూహాత్మక ఎంటర్‌ప్రైజ్ ఒప్పందాలను విజయవంతంగా ఖరారు చేసింది."
            ),
            "change_summary": "ఉన్నత స్థాయి కార్పొరేట్ మరియు నిర్ణయాత్మక శైలిలో తెలుగు ఎగ్జిక్యూటివ్ అనువాదం.",
            "preserved_details": [
                "కాలక్రమం: Q3 2025",
                "ఆర్థిక వివరాలు: Net ARR $14.2M, 18%, 1.2% churn",
                "అధికారి: CFO Sarah Jenkins",
                "క్లయింట్లు: Siemens, SAP, BMW",
                "కొటేషన్: 'our churn dropped to 1.2% in Europe'"
            ],
            "potential_meaning_changes": [],
            "unsupported_additions": ["నిర్మాణాత్మక శీర్షిక 'ఎగ్జిక్యూటివ్ బ్రీఫింగ్:' జోడించబడింది."],
            "review_warnings": []
        },
        WritingMode.CREATIVE: {
            "rewritten_text": (
                "డిసెంబర్ 12, 2026న తెల్లవారుజామున 02:45 AM వద్ద (02:45 AM on December 12, 2026), Atacama టెలిస్కోప్ "
                "ఆకాశ నిశ్శబ్దాన్ని చీల్చుతూ పేలిన Supernova SN-2026X దృశ్యాన్ని వీక్షించింది. పరిశీలనా చిట్టాలో "
                "ఖగోళ పరిశోధకుడు Mateo Silva రాస్తూ: 'the sky burned blue for 4 seconds' అని నమోదు చేశారు. "
                "ఆ మహా విస్ఫోటనం 10^44 joules విశ్వ వికిరణాన్ని నిశ్శబ్ద శూన్యంలోకి విడుదల చేసింది."
            ),
            "change_summary": "భావోద్వేగ మరియు వర్ణనాత్మక సాహిత్య శైలిలో తెలుగు అనువాదం; ఖగోళ సమాచారం చెక్కుచెదరకుండా ఉంచబడింది.",
            "preserved_details": [
                "సమయం: 02:45 AM on December 12, 2026",
                "వస్తువు & ప్రదేశం: Supernova SN-2026X, Atacama telescope",
                "శాస్త్రవేత్త: Mateo Silva",
                "భౌతిక కొలమానం: 10^44 joules",
                "కొటేషన్: 'the sky burned blue for 4 seconds'"
            ],
            "potential_meaning_changes": ["సాహిత్య శైలి కోసం భావావేశ వర్ణనలను ఉపయోగించడం జరిగింది."],
            "unsupported_additions": ["సాహిత్య విశేషణాలు ('ఆకాశ నిశ్శబ్దాన్ని చీల్చుతూ', 'మహా విస్ఫోటనం') జోడించబడ్డాయి."],
            "review_warnings": []
        },
        WritingMode.SIMPLE: {
            "rewritten_text": (
                "ఆగస్టు 15, 2025న (August 15, 2025) కలుషిత నీరు త్రాగిన తర్వాత మీరు అస్వస్థతకు గురైతే, ప్రతి 4 hours కు "
                "500ml ఓరల్ రీహైడ్రేషన్ సాల్ట్స్ త్రాగండి. Dr. Maya Lin వివరించినట్లుగా: 'hydration prevents 95% of complications.' "
                "ద్రవాలు తీసుకోవడం మిమ్మల్ని సురక్షితంగా ఉంచుతుంది."
            ),
            "change_summary": "సులభమైన, స్పష్టమైన మరియు సూటి భాషలో సరళమైన తెలుగు వాక్యాలు.",
            "preserved_details": [
                "తేదీ: August 15, 2025",
                "మోతాదు: 500ml, every 4 hours",
                "వైద్యురాలు: Dr. Maya Lin",
                "మెట్రిక్: 95%",
                "కొటేషన్: 'hydration prevents 95% of complications'"
            ],
            "potential_meaning_changes": [],
            "unsupported_additions": ["భద్రతా సలహా 'ద్రవాలు తీసుకోవడం మిమ్మల్ని సురక్షితంగా ఉంచుతుంది' జోడించబడింది."],
            "review_warnings": []
        }
    },
    "hi": {
        WritingMode.STANDARD: {
            "rewritten_text": (
                "14 अक्टूबर, 2026 (October 14, 2026) को Dr. Aris Thorne ने घोषणा की कि Project Apex ने "
                "12,000 एज नोड्स में 42.8% लेटेंसी दक्षता लाभ प्रदान किया। Geneva में Thorne ने कहा, "
                "'We proved that distributed consensus is feasible at under $0.003 per query'। हालांकि, "
                "इंजीनियरिंग टीम को अभी भी सेकेंडरी रेप्लिकेशन पाइपलाइन में कई ढांचागत बाधाओं को दूर करना होगा।"
            ),
            "change_summary": "संतुलित और स्पष्ट प्रवाह के साथ हिंदी में परिष्कृत अनुवाद; सभी मेट्रिक्स, नाम और उद्धरण पूरी तरह सुरक्षित।",
            "preserved_details": [
                "दिनांक: October 14, 2026",
                "व्यक्ति: Dr. Aris Thorne",
                "परियोजना: Project Apex",
                "माप: 42.8%, 12,000 edge nodes, $0.003",
                "स्थान: Geneva",
                "उद्धरण: 'We proved that distributed consensus is feasible at under $0.003 per query'"
            ],
            "potential_meaning_changes": [],
            "unsupported_additions": ["वाक्य स्पष्टता के लिए 'इंजीनियरिंग टीम' जोड़ा गया।"],
            "review_warnings": []
        },
        WritingMode.ACADEMIC: {
            "rewritten_text": (
                "3 मई, 2025 (May 3, 2025) को आयोजित प्रयोगमूलक मूल्यांकनों के दौरान, 450 BRCA1 नमूनों के "
                "विश्लेषण में 88% मामलों में महत्वपूर्ण डाउनरेगुलेशन का पता चला। जैसा कि Dr. Elena Rostova ने "
                "टिप्पणी की, 'this is really big news for RNA therapy'। शोध आंकड़े दर्शाते हैं कि CRISPR-Cas12 "
                "परख पारंपरिक Illumina प्लेटफॉर्म की तुलना में बेहतर संवेदनशीलता प्रदर्शित करती है।"
            ),
            "change_summary": "अकादमिक एवं औपचारिक वैज्ञानिक भाषा में हिंदी परिष्कार; सभी शोध संदर्भ और उद्धरण सुरक्षित।",
            "preserved_details": [
                "दिनांक: May 3, 2025",
                "नमूने: 450 BRCA1, 88%",
                "वैज्ञानिक: Dr. Elena Rostova",
                "तकनीक: CRISPR-Cas12, Illumina",
                "उद्धरण: 'this is really big news for RNA therapy'"
            ],
            "potential_meaning_changes": ["औपचारिक शोध शैली के लिए भाषा को संयमित और अकादमिक बनाया गया।"],
            "unsupported_additions": [],
            "review_warnings": []
        },
        WritingMode.CASUAL: {
            "rewritten_text": (
                "सबके लिए एक त्वरित अपडेट! 20 नवंबर, 2026 (November 20, 2026) को हमारी DEBOT टीम ने "
                "Kubernetes पर 75 माइक्रोसर्विस का माइग्रेशन पूरा कर लिया। हमारे लीड आर्किटेक्ट Marcus Vance "
                "ने बताया कि 'reliability improved by 35%'। यदि आज आपको 504 errors का सामना करना पड़े, "
                "तो बस अपने ब्राउज़र को एक बार रिफ्रेश कर लें।"
            ),
            "change_summary": "सहज, आत्मीय और संवादात्मक शैली में हिंदी परिष्कार।",
            "preserved_details": [
                "दिनांक: November 20, 2026",
                "सिस्टम: DEBOT, Kubernetes",
                "मेट्रिक्स: 75 microservices, 35%, 504 errors",
                "नाम: Marcus Vance",
                "उद्धरण: 'reliability improved by 35%'"
            ],
            "potential_meaning_changes": [],
            "unsupported_additions": ["अनौपचारिक शुरुआत 'सबके लिए एक त्वरित अपडेट!' जोड़ी गई।"],
            "review_warnings": []
        },
        WritingMode.PROFESSIONAL: {
            "rewritten_text": (
                "कार्यकारी सारांश: Q3 2025 के दौरान, शुद्ध ARR $14.2M तक पहुंच गया, जो अनुमानित लक्ष्यों से 18% "
                "अधिक है। CFO Sarah Jenkins ने पुष्टि की कि 'our churn dropped to 1.2% in Europe'। इसके अतिरिक्त, "
                "बिक्री प्रभाग ने Siemens, SAP और BMW के साथ तीन रणनीतिक अनुबंध सफलतापूर्वक संपन्न किए।"
            ),
            "change_summary": "सटीक, आधिकारिक और कॉर्पोरेट शैली में व्यावसायिक हिंदी परिष्कार।",
            "preserved_details": [
                "समय: Q3 2025",
                "वित्तीय आंकड़े: Net ARR $14.2M, 18%, 1.2% churn",
                "अधिकारी: CFO Sarah Jenkins",
                "क्लाइंट: Siemens, SAP, BMW",
                "उद्धरण: 'our churn dropped to 1.2% in Europe'"
            ],
            "potential_meaning_changes": [],
            "unsupported_additions": ["संरचित शीर्षक 'कार्यकारी सारांश:' जोड़ा गया।"],
            "review_warnings": []
        },
        WritingMode.CREATIVE: {
            "rewritten_text": (
                "12 दिसंबर, 2026 को भोर के 02:45 AM बजे (02:45 AM on December 12, 2026), Atacama टेलीस्कोप "
                "ने ब्रह्मांडीय नीरवता को चीरते हुए Supernova SN-2026X के विस्फोट को देखा। अवलोकन पंजिका में "
                "खगोलशास्त्री Mateo Silva ने दर्ज किया: 'the sky burned blue for 4 seconds'। इस भीषण विस्फोट "
                "ने अंतरिक्ष के शून्य में 10^44 joules का चमकदार ब्रह्मांडीय विकिरण छोड़ दिया।"
            ),
            "change_summary": "भावपूर्ण और साहित्यिक शैली में हिंदी परिष्कार; खगोलीय तथ्य पूरी तरह संरक्षित।",
            "preserved_details": [
                "समय: 02:45 AM on December 12, 2026",
                "स्थान और तारा: Supernova SN-2026X, Atacama telescope",
                "खगोलशास्त्री: Mateo Silva",
                "माप: 10^44 joules",
                "उद्धरण: 'the sky burned blue for 4 seconds'"
            ],
            "potential_meaning_changes": ["काव्यात्मक प्रभाव के लिए आलंकारिक भाषा का प्रयोग किया गया।"],
            "unsupported_additions": ["साहित्यिक विशेषण ('ब्रह्मांडीय नीरवता को चीरते हुए', 'भीषण विस्फोट') जोड़े गए।"],
            "review_warnings": []
        },
        WritingMode.SIMPLE: {
            "rewritten_text": (
                "यदि 15 अगस्त, 2025 (August 15, 2025) को दूषित पानी पीने के बाद आपकी तबीयत खराब हुई है, "
                "तो हर 4 hours में 500ml रिहाइड्रेशन घोल पिएं। जैसा कि Dr. Maya Lin ने समझाया: "
                "'hydration prevents 95% of complications'। तरल पदार्थ पीने से आप स्वस्थ रहेंगे।"
            ),
            "change_summary": "अत्यंत सरल, स्पष्ट और सुगम हिंदी में आमजन के लिए स्वास्थ्य संदेश।",
            "preserved_details": [
                "दिनांक: August 15, 2025",
                "मात्रा: 500ml, every 4 hours",
                "चिकित्सक: Dr. Maya Lin",
                "प्रतिशत: 95%",
                "उद्धरण: 'hydration prevents 95% of complications'"
            ],
            "potential_meaning_changes": [],
            "unsupported_additions": ["अंतिम सुरक्षा संदेश 'तरल पदार्थ पीने से आप स्वस्थ रहेंगे' जोड़ा गया।"],
            "review_warnings": []
        }
    }
}

def get_sample_output(mode: WritingMode, language: str = "en") -> Dict[str, Any]:
    """Retrieve mode and language specific verified demo benchmark."""
    lang_key = language.lower() if language else "en"
    
    if lang_key in SAMPLE_TRANSLATIONS and mode in SAMPLE_TRANSLATIONS[lang_key]:
        return SAMPLE_TRANSLATIONS[lang_key][mode]
    
    # Fallback to English sample if available
    if mode in SAMPLE_PRESETS:
        preset = SAMPLE_PRESETS[mode]
        if lang_key == "en":
            return {
                "rewritten_text": preset.rewritten_text,
                "change_summary": preset.change_summary,
                "preserved_details": preset.preserved_details,
                "potential_meaning_changes": preset.potential_meaning_changes,
                "unsupported_additions": preset.unsupported_additions,
                "review_warnings": preset.review_warnings,
            }
        
        # For other supported languages without static translation table
        from .prompts import LANGUAGE_DISPLAY_NAMES
        lang_name = LANGUAGE_DISPLAY_NAMES.get(lang_key, lang_key.upper())
        return {
            "rewritten_text": f"[{lang_name} Demo Benchmark — {mode.value.title()} Mode]\n{preset.rewritten_text}",
            "change_summary": f"Demo benchmark preview for {mode.value.title()} mode in {lang_name}. (Configure GEMINI_API_KEY in server .env for dynamic live translation).",
            "preserved_details": preset.preserved_details,
            "potential_meaning_changes": [f"Demonstrating {mode.value} mode output format for target language {lang_name}."],
            "unsupported_additions": [],
            "review_warnings": [f"Demo benchmark mode: Dynamic multilingual synthesis into {lang_name} requires a configured GEMINI_API_KEY."],
        }
    
    return {
        "rewritten_text": "Sample refinement output.",
        "change_summary": "Editorial refinement applied.",
        "preserved_details": [],
        "potential_meaning_changes": [],
        "unsupported_additions": [],
        "review_warnings": [],
    }

