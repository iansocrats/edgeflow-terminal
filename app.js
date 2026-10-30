// ================================================================================
// EdgeFlow Terminal: Main Application Orchestrator
// Modular Architecture (OOAD Refactoring):
//   â”œâ”€â”€ js/data/preloadedSlots.js       -> Day 4 preloaded setups & slot templates
//   â”œâ”€â”€ js/detectors/BaseDetector.js    -> Abstract base detector class
//   â”œâ”€â”€ js/detectors/Detectors.js       -> OO Detector subclasses (RoBERTa, GLTR, etc.)
//   â”œâ”€â”€ js/forensics/ForensicVisualizer.js -> OO Mathematical SVG Visualizer engine
//   â”œâ”€â”€ js/forensics/ForensicHub.js     -> Deep forensic audit & academic math deck
//   â””â”€â”€ js/session/SessionManager.js    -> Session lifecycle & scores attribution
// ================================================================================
// Rust WebAssembly Core Integration
let rustCore = null;
let isRustReady = false;

async function initRustWasm() {
  try {
    const wasmModule = await import('./pkg/edgeflow_core.js');
    await wasmModule.default();
    rustCore = wasmModule;
    isRustReady = true;
    console.log('⚡ [EdgeFlow Rust Core] WebAssembly Engine Online & Active!');
    if (document.getElementById('currentDateBadge')) {
      const badge = document.getElementById('currentDateBadge');
      badge.innerHTML = '⚡ Rust WASM Active • ' + badge.textContent;
    }
  } catch (err) {
    console.warn('Rust WASM falling back to native JS engine:', err);
  }
}
initRustWasm();
// Post Studio Bridge — Multi-Detector & Humanizer Client Application
// Enforces Strict Polishing Rules:
// Rule 1: Punctuation Only
// Rule 2: Word Replacements Only (When word doesn't seem right, e.g. numbers/typos - NO sentence rewrites)
// Rule 3: Emojis, Spacing & Bullet Points
// Evaluates Official Bybit ByX 5 Content Dimensions (Threshold >= 40)

const STORAGE_KEY = 'byx_post_studio_day5_fresh_v30';
const SESSION_KEY = 'byx_active_session_id_v30';
let currentSessionId = 'day5';
let currentPostIndex = 0;
let postsData = [];
let currentViewMode = 'plain'; // Default to clean plain text per user request
let currentDraftResult = null;
let serverPosts = [];

// DOM Elements
const pillsContainer = document.getElementById('pillsContainer');
const currentSlotLabel = document.getElementById('currentSlotLabel');
const currentSlotStatus = document.getElementById('currentSlotStatus');
const currentPostTitle = document.getElementById('currentPostTitle');
const polishedContent = document.getElementById('polishedContent');
const annotatedDisplay = document.getElementById('annotatedDisplay');
const rawContent = document.getElementById('rawContent');
const wordCountBadge = document.getElementById('wordCountBadge');
const sentenceCountBadge = document.getElementById('sentenceCountBadge');
const readabilityBadge = document.getElementById('readabilityBadge');
const coinTagBadge = document.getElementById('coinTagBadge');
const navPositionIndicator = document.getElementById('navPositionIndicator');
const currentDateBadge = document.getElementById('currentDateBadge');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

// Diagnostic Element References
const robertaDiagnostics = document.getElementById('robertaDiagnostics');
const robertaSentenceFlags = document.getElementById('robertaSentenceFlags');
const uniqueDiagnostics = document.getElementById('uniqueDiagnostics');
const clicheFixChecklist = document.getElementById('clicheFixChecklist');

// ByX Official Content Dimensions Elements
const byxDimOriginality = document.getElementById('byxDimOriginality');
const byxDimDepth = document.getElementById('byxDimDepth');
const byxDimRelevance = document.getElementById('byxDimRelevance');
const byxDimCredibility = document.getElementById('byxDimCredibility');
const byxDimPresentation = document.getElementById('byxDimPresentation');
const byxTotalScore = document.getElementById('byxTotalScore');
const byxScoreBar = document.getElementById('byxScoreBar');
const byxStatusDesc = document.getElementById('byxStatusDesc');
const byxStatusPill = document.getElementById('byxStatusPill');

// 3 Tabs
const tabPolishedBtn = document.getElementById('tabPolishedBtn');
const tabDraftBtn = document.getElementById('tabDraftBtn');
const tabRawBtn = document.getElementById('tabRawBtn');
const panePolished = document.getElementById('panePolished');
const paneDraft = document.getElementById('paneDraft');
const paneRaw = document.getElementById('paneRaw');
const draftChangeCountBadge = document.getElementById('draftChangeCountBadge');

// Draft Tab Elements (Primary Destination for Audited Post Copying)
const copyDraftMainBtn = document.getElementById('copyDraftMainBtn');
const toggleDraftCleanBtn = document.getElementById('toggleDraftCleanBtn');
const toggleDraftDiffBtn = document.getElementById('toggleDraftDiffBtn');
const draftCleanContent = document.getElementById('draftCleanContent');
const draftViewBadge = document.getElementById('draftViewBadge');
const draftWordCountBadge = document.getElementById('draftWordCountBadge');
const draftValidBadge = document.getElementById('draftValidBadge');

const punctSuggCount = document.getElementById('punctSuggCount');
const wordSuggCount = document.getElementById('wordSuggCount');
const spacingSuggCount = document.getElementById('spacingSuggCount');
const draftSuggestionsDisplay = document.getElementById('draftSuggestionsDisplay');
const applyDraftBtn = document.getElementById('applyDraftBtn');
const copyDraftBtn = document.getElementById('copyDraftBtn');
const generateDraftBtn = document.getElementById('generateDraftBtn');

// Polished Post Action Elements
const copyPolishedBtn = document.getElementById('copyPolishedBtn');
const copyRawBtn = document.getElementById('copyRawBtn');
const prevPostBtn = document.getElementById('prevPostBtn');
const nextPostBtn = document.getElementById('nextPostBtn');
const saveEditBtn = document.getElementById('saveEditBtn');
const saveBaseBtn = document.getElementById('saveBaseBtn');
const quickEditCoinBtn = document.getElementById('quickEditCoinBtn');
const resetSlotBtn = document.getElementById('resetSlotBtn');
const humanizeBtn = document.getElementById('humanizeBtn');
const makeUniqueBtn = document.getElementById('makeUniqueBtn');
const togglePlainBtn = document.getElementById('togglePlainBtn');
const toggleAnnotatedBtn = document.getElementById('toggleAnnotatedBtn');

// Modal Elements
const uniqueModal = document.getElementById('uniqueModal');
const closeUniqueModalBtn = document.getElementById('closeUniqueModalBtn');
const hookOptionsList = document.getElementById('hookOptionsList');
const applyUniqueSignatureBtn = document.getElementById('applyUniqueSignatureBtn');
const saveUniqueAsBaseBtn = document.getElementById('saveUniqueAsBaseBtn');

// Detector Card 1: RoBERTa Vocabulary Entropy & Token Benchmark
const recalcRobertaBtn = document.getElementById('recalcRobertaBtn');
const robertaIndicator = document.getElementById('robertaIndicator');
const robertaHumanVal = document.getElementById('robertaHumanVal');
const robertaTtrVal = document.getElementById('robertaTtrVal');
const robertaAiVal = document.getElementById('robertaAiVal');
const robertaEntropyStatus = document.getElementById('robertaEntropyStatus');
const robertaBar = document.getElementById('robertaBar');
const robertaVerdict = document.getElementById('robertaVerdict');

// Detector Card 2: GLTR Next-Token Rank Predictability Engine (Harvard NLP & MIT-IBM)
const recalcGltrBtn = document.getElementById('recalcGltrBtn');
const gltrIndicator = document.getElementById('gltrIndicator');
const gltrGreenVal = document.getElementById('gltrGreenVal');
const gltrYellowVal = document.getElementById('gltrYellowVal');
const gltrPurpleVal = document.getElementById('gltrPurpleVal');
const gltrStatusText = document.getElementById('gltrStatusText');
const gltrDistribution = document.getElementById('gltrDistribution');
const gltrDiagnostics = document.getElementById('gltrDiagnostics');
const gltrBar = document.getElementById('gltrBar');
const gltrVerdict = document.getElementById('gltrVerdict');

// Detector Card 3: Binoculars Perplexity Variance Scanner (ICLR 2024 / UMD-CMU)
const recalcBinocBtn = document.getElementById('recalcBinocBtn');
const binocIndicator = document.getElementById('binocIndicator');
const binocVarianceVal = document.getElementById('binocVarianceVal');
const binocFlagCount = document.getElementById('binocFlagCount');
const binocAiVal = document.getElementById('binocAiVal');
const binocStatusText = document.getElementById('binocStatusText');
const binocDiagnostics = document.getElementById('binocDiagnostics');
const binocBar = document.getElementById('binocBar');
const binocVerdict = document.getElementById('binocVerdict');

// Detector Card 4: ByX Algorithm Uniqueness & Anti-Plagiarism Engine
const recalcUniqueBtn = document.getElementById('recalcUniqueBtn');
const uniqueIndicator = document.getElementById('uniqueIndicator');
const uniqueScoreVal = document.getElementById('uniqueScoreVal');
const uniqueClicheCount = document.getElementById('uniqueClicheCount');
const uniqueBoostVal = document.getElementById('uniqueBoostVal');
const uniqueStatusText = document.getElementById('uniqueStatusText');
const uniqueBar = document.getElementById('uniqueBar');
const uniqueVerdict = document.getElementById('uniqueVerdict');

// Draft Tab: Sentence-by-Sentence AI Risk Audit & Strategic Next Steps Engine
const draftAiFlagCountBadge = document.getElementById('draftAiFlagCountBadge');
const draftAiOverallRiskBadge = document.getElementById('draftAiOverallRiskBadge');
const resolveAllDraftAiBtn = document.getElementById('resolveAllDraftAiBtn');
const draftSentenceRiskList = document.getElementById('draftSentenceRiskList');
const draftNextActionsCard = document.getElementById('draftNextActionsCard');
const nextActionAiBadge = document.getElementById('nextActionAiBadge');
const btnApplyNextStepHumanization = document.getElementById('btnApplyNextStepHumanization');
const draftNextActionsContent = document.getElementById('draftNextActionsContent');

// Generic Crowd Consensus Clichés (Penalized by ByX Algorithm)
// Initialize App
async function initApp() {
  await loadPostsData();
  initSessionAndPointsHub();
  switchDaySession(currentSessionId, false);
  setViewMode('plain'); // Clean plain text by default
  setupEvents();
}

// Display Real-time Day/Date & Session Status
function setTodayDate() {
  const now = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const dateStr = now.toLocaleDateString(undefined, options);
  if (currentDateBadge) {
    if (typeof currentSessionId !== 'undefined' && currentSessionId === 'day1') {
      currentDateBadge.textContent = 'Day 1 Archive (9.0 pts)';
    } else if (typeof currentSessionId !== 'undefined' && currentSessionId === 'day2') {
      currentDateBadge.textContent = 'Day 2 Archive (11.0 pts)';
    } else if (typeof currentSessionId !== 'undefined' && currentSessionId === 'day3') {
      currentDateBadge.textContent = 'Day 3 Archive (10.0 pts)';
    } else if (typeof currentSessionId !== 'undefined' && currentSessionId === 'day4') {
      currentDateBadge.textContent = 'Day 4 Archive (7.0 pts • 13 Posts)';
    } else {
      currentDateBadge.textContent = 'Day 5 Active Desk (Thu, Oct 30) • Recovery Sprint';
    }
  }
}

// Load Posts from posts.json or LocalStorage
async function loadPostsData() {
  try {
    const res = await fetch('posts.json?v=' + Date.now());
    if (res.ok) {
      serverPosts = await res.json();
      // Guarantee Day 2 archive is permanently saved in its own session archive
      if (Array.isArray(serverPosts) && serverPosts.length >= 10) {
        if (!localStorage.getItem('byx_session_posts_day2')) {
          localStorage.setItem('byx_session_posts_day2', JSON.stringify(serverPosts));
        }
      }
    }
    // Preload quantitative forensics contract if available
    try {
      const fRes = await fetch('contracts/forensics.json?v=' + Date.now());
      if (fRes.ok) {
        window.forensicsContract = await fRes.json();
      }
    } catch (fErr) {
      console.log('Forensics contract fetch bypassed:', fErr);
    }
  } catch (err) {
    console.log('Error fetching serverPosts:', err);
  }

  // Load the posts for the current active session
  let sessionData = localStorage.getItem(getDaySessionStorageKey(currentSessionId));
  if (sessionData) {
    try {
      postsData = JSON.parse(sessionData);
    } catch (e) {
      console.error('Error parsing session data:', e);
      postsData = null;
    }
  }

  // Ensure Day 5 is 100% preloaded with the 8 polymorphic high-conviction recovery setups
  if (currentSessionId === 'day5') {
    const d5Text = (postsData && postsData[0] && postsData[0].improved) ? postsData[0].improved : '';
    if (!postsData || postsData.length < 8 || !d5Text.includes('Asia Open Liquidation Sweep')) {
      postsData = (typeof getDay5PreloadedSlots === 'function') ? getDay5PreloadedSlots() : createEmptySlots();
      localStorage.setItem(getDaySessionStorageKey('day5'), JSON.stringify(postsData));
    }
  }

  // Ensure Day 4 is 100% preloaded with all 13 certified high-conversion setups with trade widget CTAs
  if (currentSessionId === 'day4') {
    const d4Text = (postsData && postsData[0] && postsData[0].improved) ? postsData[0].improved : '';
    if (!postsData || postsData.length < 13 || postsData[0].coin !== '$SOL' || !d4Text.includes('FOMC decision')) {
      postsData = getDay4PreloadedSlots();
      localStorage.setItem(getDaySessionStorageKey('day4'), JSON.stringify(postsData));
    }
  }

  // Ensure Day 3 is 100% fresh with Post 1 ($EVA) and Post 2 ($XAAN) staged
  if (currentSessionId === 'day3' && postsData && postsData.length > 0) {
    const firstText = (postsData[0].improved || '') + (postsData[0].raw || '');
    const firstWordCount = (postsData[0].improved ? postsData[0].improved.match(/\b\w+\b/g) || [] : []).length;
    if (firstText.includes('Absorption Paradox') || 
        firstText.includes('Bitcoin is holding firmly') || 
        firstText.includes('Waiting for Post 1...') || 
        postsData[0].coin !== '$EVA' ||
        firstWordCount > 150 ||
        firstText.includes('?') ||
        firstText.includes('My active spot and perpetual position right now')
    ) {
      postsData = createEmptySlots();
      localStorage.setItem(getDaySessionStorageKey('day3'), JSON.stringify(postsData));
    }
    // Auto-stage Post 2 (XAAN, USDT)
    if (postsData.length > 1 && (!postsData[1].raw || postsData[1].coin === '+ New Coin' || postsData[1].coin !== 'XAAN, USDT')) {
      const freshSlots = createEmptySlots();
      postsData[1] = freshSlots[1];
      localStorage.setItem(getDaySessionStorageKey('day3'), JSON.stringify(postsData));
    }
    // Auto-stage Post 3 ($EVA Follow-Up +56% PnL)
    if (postsData.length > 2 && (!postsData[2].raw || postsData[2].coin === '+ New Coin' || !postsData[2].title.includes('+56%'))) {
      const freshSlots = createEmptySlots();
      postsData[2] = freshSlots[2];
      localStorage.setItem(getDaySessionStorageKey('day3'), JSON.stringify(postsData));
    }
    // Auto-stage Post 4 ($EVA Follow-Up +72% PnL)
    if (postsData.length > 3 && (!postsData[3].raw || postsData[3].coin === '+ New Coin' || !postsData[3].title.includes('+72%'))) {
      const freshSlots = createEmptySlots();
      postsData[3] = freshSlots[3];
      localStorage.setItem(getDaySessionStorageKey('day3'), JSON.stringify(postsData));
    }
    // Auto-stage Post 5 ($PAXG Gold Pre-Fed Setup)
    if (postsData.length > 4 && (!postsData[4].raw || postsData[4].coin === '+ New Coin' || !postsData[4].title.includes('Gold'))) {
      const freshSlots = createEmptySlots();
      postsData[4] = freshSlots[4];
      localStorage.setItem(getDaySessionStorageKey('day3'), JSON.stringify(postsData));
    }
    // Auto-stage Post 6 ($BTC Pre-FOMC Absorption Setup)
    if (postsData.length > 5 && (!postsData[5].raw || postsData[5].coin === '+ New Coin' || !postsData[5].title.includes('BTC'))) {
      const freshSlots = createEmptySlots();
      postsData[5] = freshSlots[5];
      localStorage.setItem(getDaySessionStorageKey('day3'), JSON.stringify(postsData));
    }
    // Auto-stage Post 7 ($EVA Trade Update +87% PnL)
    if (postsData.length > 6 && (!postsData[6].raw || postsData[6].coin === '+ New Coin' || !postsData[6].title.includes('+87%'))) {
      const freshSlots = createEmptySlots();
      postsData[6] = freshSlots[6];
      localStorage.setItem(getDaySessionStorageKey('day3'), JSON.stringify(postsData));
    }
    // Auto-stage Post 8 ($PEPE Pre-FOMC Whale Beta Setup)
    if (postsData.length > 7 && (!postsData[7].raw || postsData[7].coin === '+ New Coin' || !postsData[7].title.includes('PEPE'))) {
      const freshSlots = createEmptySlots();
      postsData[7] = freshSlots[7];
      localStorage.setItem(getDaySessionStorageKey('day3'), JSON.stringify(postsData));
    }
    // Auto-stage Post 9 ($EVA Daily Close Recap & $2.00–$2.70 Roadmap)
    if (postsData.length > 8 && (!postsData[8].raw || postsData[8].coin === '+ New Coin' || !postsData[8].title.includes('Recap'))) {
      const freshSlots = createEmptySlots();
      postsData[8] = freshSlots[8];
      localStorage.setItem(getDaySessionStorageKey('day3'), JSON.stringify(postsData));
    }
  }

  if (!postsData || postsData.length === 0) {
    if (currentSessionId === 'day2') {
      postsData = serverPosts && serverPosts.length === 10 ? JSON.parse(JSON.stringify(serverPosts)) : createEmptySlots();
    } else if (currentSessionId === 'day1') {
      postsData = createEmptySlots();
      if (serverPosts && serverPosts.length >= 5) {
        for (let i = 0; i < 5; i++) {
          postsData[i] = JSON.parse(JSON.stringify(serverPosts[i]));
        }
      }
    } else {
      // Day 3 starts completely fresh and zeroed out
      postsData = createEmptySlots();
    }
    localStorage.setItem(getDaySessionStorageKey(currentSessionId), JSON.stringify(postsData));
  }
}

// Create 10 empty dynamic slots (Day 3 with Post 1 $EVA and Post 2 $XAAN ready)
// 10 Brand New Fact-Checked Coin Setups for Day 4 (Oct 29, 2026)
function renderPills() {
  pillsContainer.innerHTML = '';
  postsData.forEach((post, idx) => {
    const pill = document.createElement('button');
    const isWaiting = post.status === 'waiting';
    const isActive = idx === currentPostIndex && currentDeskView === 'posts';
    pill.className = `pill-item ${isActive ? 'active' : ''} ${isWaiting ? 'waiting' : ''}`;
    pill.innerHTML = `
      <span>Post ${idx + 1}</span>
      <span class="pill-coin">${post.coin || ''}</span>
    `;
    pill.addEventListener('click', () => {
      displayPost(idx);
    });
    pillsContainer.appendChild(pill);
  });
}

// Display Post by Index
function displayPost(index) {
  if (index < 0 || index >= postsData.length) return;
  setDeskView('posts');
  currentPostIndex = index;

  const post = postsData[index];
  currentSlotLabel.textContent = `POST ${index + 1} OF ${postsData.length}`;
  currentPostTitle.textContent = post.title || `Post ${index + 1}`;
  coinTagBadge.textContent = post.coin || `Post ${index + 1}`;

  if (post.status === 'ready') {
    currentSlotStatus.textContent = '● READY';
    currentSlotStatus.className = 'slot-status-pill ready';
  } else {
    currentSlotStatus.textContent = '◌ WAITING';
    currentSlotStatus.className = 'slot-status-pill waiting';
  }

  polishedContent.value = post.improved || '';
  rawContent.value = post.raw || '';

  // Calculate word and sentence count
  updateWordAndSentenceBadges(post.improved || '');

  // Update navigation indicator
  navPositionIndicator.textContent = `Post ${index + 1} of ${postsData.length}`;

  // Build Underlined View
  renderUnderlinedView(post.improved || '');

  // Build Draft Suggestions based on strict rules
  generateAndRenderDraft(post.raw || '', post.improved || '');

  // Run all 3 live mathematical detectors on polished text
  runAllDetectors(post.improved || '');

  // Update pills UI
  const pillButtons = pillsContainer.querySelectorAll('.pill-item');
  pillButtons.forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  if (pillButtons[index]) {
    pillButtons[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  if (typeof renderAttributionMatrix === 'function') {
    renderAttributionMatrix();
  }
}

// Extract clean sentences from text
function extractSentences(text) {
  if (!text) return [];
  const rawChunks = text
    .replace(/\r/g, '')
    .split(/\n\n+|(?<=[.!?])\s+/)
    .map(s => s.trim().replace(/^[-•*>\d.]+\s*/, ''))
    .filter(s => s.length > 2 && /[a-zA-Z0-9]/.test(s));
  return rawChunks;
}

// Calculate Syllables in a word (for Flesch-Kincaid)
function countWordSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length <= 3) return 1;
  const cleaned = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const syllables = cleaned.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

// Calculate Flesch-Kincaid Grade Level
function calculateReadabilityGrade(text) {
  if (!text || text.trim().length < 15) return 'Grade 7';
  const sentences = extractSentences(text);
  const words = text.toLowerCase().match(/\b[a-z0-9'-]+\b/g) || [];
  const totalSentences = Math.max(1, sentences.length);
  const totalWords = Math.max(1, words.length);
  
  let totalSyllables = 0;
  words.forEach(w => {
    totalSyllables += countWordSyllables(w);
  });

  // Flesch-Kincaid Grade Level formula:
  // 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
  const grade = 0.39 * (totalWords / totalSentences) + 11.8 * (totalSyllables / totalWords) - 15.59;
  const clamped = Math.min(14, Math.max(3, Math.round(grade)));
  return `Grade ${clamped}`;
}

// Update word and sentence counter badges
function updateWordAndSentenceBadges(text) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  const sentences = extractSentences(text).length;
  const grade = calculateReadabilityGrade(text || '');
  wordCountBadge.textContent = `${words} words`;
  sentenceCountBadge.textContent = `${sentences} sentences`;
  if (readabilityBadge) {
    readabilityBadge.textContent = grade;
    readabilityBadge.title = `Flesch-Kincaid: ${grade} (Target: Grade 6-8 for maximum ByX mobile engagement)`;
  }
}

// --------------------------------------------------------------------------------
// STRICT RULES ENGINE: Generate Suggestions & Draft (No Sentence Rewriting!)
// --------------------------------------------------------------------------------
function generateAndRenderDraft(rawText, existingImproved) {
  if (!rawText || rawText.trim() === '') {
    if (existingImproved && !existingImproved.startsWith('Awaiting your voice notes')) {
      // Analyze existing improved
      renderDraftFromText(existingImproved, 0, 0, 0);
    } else {
      draftSuggestionsDisplay.innerHTML = `<span style="color: var(--text-muted); font-style: italic;">Awaiting raw dictation. Speak or type in '🎙️ What I Wrote' and tap '⚡ Generate Suggestions Draft'.</span>`;
      punctSuggCount.textContent = '0';
      wordSuggCount.textContent = '0';
      spacingSuggCount.textContent = '0';
      draftChangeCountBadge.textContent = 'Waiting';
    }
    return;
  }

  // Follow the 3 Mandatory Rules:
  // 1. Punctuation only
  // 2. Word replacements only (when word doesn't seem right - numbers/typos - NO sentence rewrites)
  // 3. Emojis, spacing & bullet points

  let pCount = 0;
  let wCount = 0;
  let sCount = 0;

  let text = rawText.trim();
  let diffHtml = '';
  let cleanPolished = '';

  // Rule 3: Suggest header emoji
  const startEmoji = '📊 ';
  sCount++;

  // Rule 2: Word replacements (Numbers to standard financial format)
  // Detect spoken coin tickers (e.g. bitcoin -> Bitcoin, btc -> $BTC)
  const coin = (postsData[currentPostIndex].coin || '$BTC').replace('+', '').trim();
  
  // Format spoken price numbers (e.g. 67800 -> $67,800, 67400 -> $67,400)
  const words = text.split(/\s+/);
  const formattedWords = [];
  const diffTokens = [];

  diffTokens.push(`<span class="sugg-token token-spacing">${startEmoji}<span class="sugg-sub">emoji</span></span>`);

  for (let i = 0; i < words.length; i++) {
    let w = words[i];
    let original = w;

    // Rule 1: Capitalize first word
    if (i === 0) {
      const capitalized = w.charAt(0).toUpperCase() + w.slice(1);
      if (capitalized !== w) {
        pCount++;
        w = capitalized;
        diffTokens.push(`<span class="sugg-token token-punct">${escapeHtml(w)}<span class="sugg-sub">punct</span></span> `);
        formattedWords.push(w);
        continue;
      }
    }

    // Rule 2: Word replacement for 4-6 digit prices without $ (e.g. 67800 -> $67,800)
    if (/^\d{4,6}$/.test(w)) {
      wCount++;
      const num = parseInt(w, 10).toLocaleString();
      const rep = `$${num}`;
      diffTokens.push(`<span class="sugg-token token-word"><del>${escapeHtml(original)}</del> <ins>${rep}</ins><span class="sugg-sub">word</span></span> `);
      formattedWords.push(rep);
      continue;
    }

    // Rule 2: Word replacement for timeframe (e.g. "15 minute" -> "15m")
    if (w.toLowerCase() === '15' && words[i + 1] && words[i + 1].toLowerCase().startsWith('minute')) {
      wCount++;
      i++; // skip 'minute'
      diffTokens.push(`<span class="sugg-token token-word"><del>15 minute</del> <ins>15m</ins><span class="sugg-sub">word</span></span> `);
      formattedWords.push('15m');
      continue;
    }

    // Rule 1 & 3: Sentence punctuation & bullet spacing detection
    if (w.toLowerCase() === 'liquidity' && words[i + 1] && words[i + 1].toLowerCase() === 'looking') {
      pCount++;
      sCount++;
      diffTokens.push(`${escapeHtml(w)}<span class="sugg-token token-punct">.<span class="sugg-sub">punct</span></span>\n\n<span class="sugg-token token-spacing">Looking for:<span class="sugg-sub">spacing</span></span>\n`);
      formattedWords.push(`${w}.\n\nLooking for:\n`);
      continue;
    }

    if (w.toLowerCase() === 'looking' && words[i + 1] && words[i + 1].toLowerCase() === 'for') {
      // Handled above
      continue;
    }

    if (w.toLowerCase() === 'for' && words[i - 1] && words[i - 1].toLowerCase() === 'looking') {
      // Handled above
      continue;
    }

    if (w.toLowerCase() === 'a' && words[i + 1] && words[i + 1].toLowerCase() === 'scalp') {
      sCount++;
      diffTokens.push(`<span class="sugg-token token-spacing">• <span class="sugg-sub">bullet</span></span>a `);
      formattedWords.push('• a ');
      continue;
    }

    if (w.toLowerCase() === 'support' && words[i + 1] && words[i + 1].toLowerCase() === 'or') {
      pCount++;
      diffTokens.push(`${escapeHtml(w)}<span class="sugg-token token-punct">,<span class="sugg-sub">punct</span></span> `);
      formattedWords.push(`${w}, `);
      continue;
    }

    if (w.toLowerCase() === 'or' && words[i + 1] && words[i + 1].toLowerCase() === 'a') {
      sCount++;
      diffTokens.push(`or\n<span class="sugg-token token-spacing">• <span class="sugg-sub">bullet</span></span>`);
      formattedWords.push('or\n• ');
      continue;
    }

    if (w.toLowerCase() === 'breaks' && words[i + 1] && words[i + 1].toLowerCase() === 'with') {
      pCount++;
      diffTokens.push(`${escapeHtml(w)}<span class="sugg-token token-punct">,<span class="sugg-sub">punct</span></span> `);
      formattedWords.push(`${w}, `);
      continue;
    }

    // Default regular word
    diffTokens.push(`${escapeHtml(w)} `);
    formattedWords.push(w);
  }

  // Add final period (Rule 1)
  pCount++;
  diffTokens.push(`<span class="sugg-token token-punct">.<span class="sugg-sub">punct</span></span>`);

  // Build final clean string
  cleanPolished = startEmoji + formattedWords.join(' ').replace(/\s+([.,;:])/g, '$1').replace(/\n\s+/g, '\n').trim() + '.';

  // Update UI
  punctSuggCount.textContent = `${pCount}`;
  wordSuggCount.textContent = `${wCount}`;
  spacingSuggCount.textContent = `${sCount}`;
  draftChangeCountBadge.textContent = `${pCount + wCount + sCount} suggestions`;

  draftSuggestionsDisplay.innerHTML = diffTokens.join('').replace(/\n/g, '<br>');

  currentDraftResult = {
    clean: cleanPolished,
    punct: pCount,
    word: wCount,
    spacing: sCount
  };
}

function renderDraftFromText(text, p, w, s) {
  if (!text) return;
  
  let pCount = 0;
  let wCount = 0;
  let sCount = 0;

  const paras = text.split(/\n\s*\n/).filter(Boolean);
  const formattedParas = paras.map((para, pIdx) => {
    sCount++; // Paragraph spacing
    let line = escapeHtml(para.trim());
    
    // Highlight numbers/prices (Rule 2: financial format)
    line = line.replace(/(\$[\d,]+(?:\.\d+)?|\b\d+(?:\.\d+)?%\b|\b\$1B\b|\b1\s*billion\b|\b300\s*million\b)/gi, (m) => {
      wCount++;
      return `<span class="sugg-token token-word">${m}<span class="sugg-sub">number</span></span>`;
    });
    
    // Highlight punctuation pauses (Rule 1)
    line = line.replace(/([.,;:?!—])/g, (m) => {
      pCount++;
      return `<span class="sugg-token token-punct">${m}<span class="sugg-sub">punct</span></span>`;
    });
    
    if (pIdx === 0) {
      return `<strong>${line}</strong>`;
    }
    return line;
  });

  punctSuggCount.textContent = `${pCount}`;
  wordSuggCount.textContent = `${wCount}`;
  spacingSuggCount.textContent = `${sCount}`;
  draftChangeCountBadge.textContent = `Draft Ready (${pCount + wCount + sCount})`;

  draftSuggestionsDisplay.innerHTML = formattedParas.join('<br><br>');
  if (draftCleanContent) {
    draftCleanContent.value = text;
  }
  if (draftWordCountBadge) {
    const wc = (text.match(/\b[a-z0-9$'-]+\b/gi) || []).length;
    draftWordCountBadge.textContent = `${wc} words`;
  }

  currentDraftResult = {
    clean: text,
    punct: pCount,
    word: wCount,
    spacing: sCount
  };
}

// Subtle Underlined View Renderer
function renderUnderlinedView(text) {
  if (!text || text.startsWith('Awaiting your voice notes')) {
    annotatedDisplay.innerHTML = `<span style="color: var(--text-muted); font-style: italic;">Awaiting your voice notes for this slot...</span>`;
    return;
  }

  let html = escapeHtml(text);

  // 1. Robotic AI Markers (Red dashed underline with small 9px label)
  AI_PATTERNS.forEach(pat => {
    html = html.replace(pat.regex, (match) => {
      return `<span class="issue-underlined issue-ai">${match}<span class="issue-label-sub">AI phrase</span></span>`;
    });
  });

  // 2. Passive Voice / Clichés (Yellow dotted underline)
  html = html.replace(/\b(it can be seen that|it is believed that|there is a possibility)\b/gi, (match) => {
    return `<span class="issue-underlined issue-passive">${match}<span class="issue-label-sub">passive</span></span>`;
  });

  // 3. Conversion CTA (Green dashed underline)
  html = html.replace(/(Trade Widget below|tap the widget|Trade Widget|set your limit order|set your order)/gi, (match) => {
    return `<span class="issue-underlined issue-cta">${match}<span class="issue-label-sub">CTA</span></span>`;
  });

  // 4. Mobile Hook (Purple dashed underline)
  html = html.replace(/(🧭 [^\n]+|⚡ [^\n]+|🚨 [^\n]+|📊 [^\n]+|🔥 [^\n]+)/g, (match) => {
    return `<span class="issue-underlined issue-hook">${match}<span class="issue-label-sub">hook</span></span>`;
  });

  // 5. Price Levels & Invalidation (Blue dotted underline)
  html = html.replace(/(\$[\d,]+(?:\.\d+)?|\b\d+(?:\.\d+)?%\b|\bStop-Loss\b|\bInvalidation\b|\bTP1\b|\bTP2\b)/g, (match) => {
    return `<span class="issue-underlined issue-level">${match}<span class="issue-label-sub">level</span></span>`;
  });

  annotatedDisplay.innerHTML = html;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// View Mode Toggle (Clean Plain Text vs Subtle Underlined Issues)
// --------------------------------------------------------------------------------
function setViewMode(mode) {
  currentViewMode = mode;
  if (mode === 'annotated') {
    toggleAnnotatedBtn.classList.add('active');
    togglePlainBtn.classList.remove('active');
    annotatedDisplay.classList.remove('hidden');
    polishedContent.classList.add('hidden');
    renderUnderlinedView(polishedContent.value);
  } else {
    togglePlainBtn.classList.add('active');
    toggleAnnotatedBtn.classList.remove('active');
    polishedContent.classList.remove('hidden');
    annotatedDisplay.classList.add('hidden');
  }
}

// --------------------------------------------------------------------------------
// Two Independent Engine Desk Views: 'posts' | 'scores'
// --------------------------------------------------------------------------------
let currentDeskView = 'posts';

function setDeskView(viewMode) {
  currentDeskView = viewMode;
  const postWorkspace = document.getElementById('postWorkspaceWrapper');
  const viewScoresHub = document.getElementById('viewScoresHub');
  const viewAnalysisHub = document.getElementById('viewForensicAnalysisHub');
  const appFooter = document.querySelector('.app-footer');

  const pillBarScoresBtn = document.getElementById('pillBarScoresBtn');
  const btnOpenScoresModal = document.getElementById('btnOpenScoresModal');
  const pillBarAnalysisBtn = document.getElementById('pillBarAnalysisBtn');
  const btnOpenAnalysisModal = document.getElementById('btnOpenAnalysisModal');

  // Reset active classes on all nav buttons
  [pillBarScoresBtn, btnOpenScoresModal, pillBarAnalysisBtn, btnOpenAnalysisModal].forEach(b => {
    if (b) b.classList.remove('active');
  });

  if (viewMode === 'posts') {
    if (postWorkspace) postWorkspace.classList.remove('hidden');
    if (viewScoresHub) viewScoresHub.classList.add('hidden');
    if (viewAnalysisHub) viewAnalysisHub.classList.add('hidden');
    if (appFooter) appFooter.classList.remove('hidden');

    // Highlight active post pill in carousel
    const pills = document.querySelectorAll('.pill-item');
    pills.forEach((p, idx) => {
      p.classList.toggle('active', idx === currentPostIndex);
    });
  } else if (viewMode === 'scores') {
    if (postWorkspace) postWorkspace.classList.add('hidden');
    if (viewScoresHub) viewScoresHub.classList.remove('hidden');
    if (viewAnalysisHub) viewAnalysisHub.classList.add('hidden');
    if (appFooter) appFooter.classList.add('hidden');

    if (pillBarScoresBtn) pillBarScoresBtn.classList.add('active');
    if (btnOpenScoresModal) btnOpenScoresModal.classList.add('active');

    const pills = document.querySelectorAll('.pill-item');
    pills.forEach(p => p.classList.remove('active'));

    if (typeof renderAttributionMatrix === 'function') renderAttributionMatrix();
    if (typeof updateWeeklyProgress === 'function') updateWeeklyProgress();
    if (typeof renderDynamicDayAudit === 'function') renderDynamicDayAudit();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (viewMode === 'analysis') {
    if (postWorkspace) postWorkspace.classList.add('hidden');
    if (viewScoresHub) viewScoresHub.classList.add('hidden');
    if (viewAnalysisHub) viewAnalysisHub.classList.remove('hidden');
    if (appFooter) appFooter.classList.add('hidden');

    if (pillBarAnalysisBtn) pillBarAnalysisBtn.classList.add('active');
    if (btnOpenAnalysisModal) btnOpenAnalysisModal.classList.add('active');

    const pills = document.querySelectorAll('.pill-item');
    pills.forEach(p => p.classList.remove('active'));

    if (typeof renderForensicAnalysisHub === 'function') renderForensicAnalysisHub();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// --------------------------------------------------------------------------------
// Switch Tabs inside Posts Workspace (Polished vs Draft vs Raw)
// --------------------------------------------------------------------------------
function switchTab(tabName) {
  if (tabName === 'scores' || tabName === 'analysis') {
    setDeskView('scores');
    return;
  }

  // Ensure Posts Workspace is active
  setDeskView('posts');

  if (tabPolishedBtn) { tabPolishedBtn.classList.toggle('active', tabName === 'polished'); tabPolishedBtn.setAttribute('aria-selected', tabName === 'polished' ? 'true' : 'false'); }
  if (tabDraftBtn) { tabDraftBtn.classList.toggle('active', tabName === 'draft'); tabDraftBtn.setAttribute('aria-selected', tabName === 'draft' ? 'true' : 'false'); }
  if (tabRawBtn) { tabRawBtn.classList.toggle('active', tabName === 'raw'); tabRawBtn.setAttribute('aria-selected', tabName === 'raw' ? 'true' : 'false'); }

  if (panePolished) panePolished.classList.toggle('active', tabName === 'polished');
  if (paneDraft) paneDraft.classList.toggle('active', tabName === 'draft');
  if (paneRaw) paneRaw.classList.toggle('active', tabName === 'raw');
}

// Copy Clean Plain Text to Clipboard
function copyCleanText(text, buttonEl) {
  if (!text) return;

  const clean = text.replace(/<[^>]*>?/gm, '').trim();

  navigator.clipboard.writeText(clean).then(() => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    if (buttonEl) {
      const originalText = buttonEl.innerHTML;
      buttonEl.innerHTML = `<span>✓ COPIED CLEAN TEXT FOR BYX!</span>`;
      buttonEl.classList.add('copied');
      setTimeout(() => {
        buttonEl.innerHTML = originalText;
        buttonEl.classList.remove('copied');
      }, 2000);
    }

    showToast('Copied clean text! Ready to paste into ByX.');
  }).catch(err => {
    console.error('Clipboard copy failed:', err);
    showToast('Select text to copy manually');
  });
}

// Toast Popup
let toastTimeout;
function showToast(msg) {
  clearTimeout(toastTimeout);
  toastMsg.textContent = msg;
  toast.classList.remove('hidden');
  toastTimeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2200);
}

// Change Coin for Current Slot
function quickEditCoin() {
  const current = postsData[currentPostIndex];
  const newCoin = prompt(`Enter coin ticker for Post ${currentPostIndex + 1}:`, current.coin.replace('+', '').trim());
  if (newCoin) {
    const formatted = newCoin.startsWith('$') ? newCoin.toUpperCase() : `$${newCoin.toUpperCase()}`;
    current.coin = formatted;
    current.title = `Post ${currentPostIndex + 1}: ${formatted} Setup`;
    current.status = 'ready';
    saveDataToStorage();
    renderPills();
    displayPost(currentPostIndex);
    showToast(`Updated Post ${currentPostIndex + 1} to ${formatted}`);
  }
}

// Reset / Clear Current Slot
function resetCurrentSlot() {
  if (confirm(`Clear Post ${currentPostIndex + 1} for a fresh setup?`)) {
    const current = postsData[currentPostIndex];
    current.coin = '+ New Coin';
    current.title = `Post ${currentPostIndex + 1}: Ready for Today's Dictation`;
    current.status = 'waiting';
    current.raw = '';
    current.improved = `Awaiting your voice notes for Post ${currentPostIndex + 1}...`;
    saveDataToStorage();
    renderPills();
    displayPost(currentPostIndex);
    showToast(`Cleared Slot ${currentPostIndex + 1}`);
  }
}

// Save Raw Edits
function saveCurrentPostEdits() {
  if (!postsData[currentPostIndex]) return;
  postsData[currentPostIndex].raw = rawContent.value;
  postsData[currentPostIndex].status = 'ready';
  saveDataToStorage();
  renderPills();
  displayPost(currentPostIndex);
  showToast('Saved raw notes!');
}

function saveDataToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(postsData));
  if (typeof currentSessionId !== 'undefined') {
    localStorage.setItem(getDaySessionStorageKey(currentSessionId), JSON.stringify(postsData));
  }
}

// --------------------------------------------------------------------------------
// 💎 Uniqueness Studio Data & Handlers
// --------------------------------------------------------------------------------
let selectedUniqueHook = 0;

const BTC_UNIQUE_HOOKS = [
  {
    title: "The $1B Absorption Paradox: Why Bitcoin Isn't Crashing Below $79K",
    desc: "Contrarian angle: Emphasizes that $1B left in 14 days, yet price held firm.",
    bodyReplacement: "The crowd thinks this could go either way, but over $1B in absorbed ETF outflows tells me smart money is quietly holding the line before a $76K sweep."
  },
  {
    title: "Why I'm Watching the $76K Liquidity Flush (While the Crowd Panics)",
    desc: "Tactical angle: Frames $76K as intentional liquidity accumulation before expansion.",
    bodyReplacement: "While the crowd debates up or down, my playbook is focused on the $76K support floor—that is where the real institutional liquidity will be swept."
  },
  {
    title: "The 50 Neutrality Trap: What Bitcoin's Stalled Price Is Hiding",
    desc: "Sentiment angle: Exposes how dead-center sentiment hides impending asymmetric volatility.",
    bodyReplacement: "The Fear & Greed Index sitting dead center at 50 is a trap. Despite $1B in spot outflows, Bitcoin refusing to break down shows hidden absorption."
  }
];

const GOLD_UNIQUE_HOOKS = [
  {
    title: "🥇 Gold Sub-$4,000: The $30T Safe-Haven Trap Before Tomorrow's 4% Fed Catalyst",
    desc: "Macro rate catalyst: Contrasts the 5% weekly drop below $4K with tomorrow's pivotal Fed decision.",
    bodyReplacement: "While retail panics over gold losing $4,000, smart money is pricing in tomorrow's 4% Federal Reserve decision. A retest of July's $3,998 floor before a macro push toward $4,200 is classic pre-catalyst positioning."
  },
  {
    title: "🥇 From $4,700 Peak to July Support: Why Gold's 5% Flush Below $4K Is a Prime Reversal Zone",
    desc: "Structural retest angle: Frames the pullback from $4,700 as a necessary liquidity sweep of the July base.",
    bodyReplacement: "Retesting the July base after an August high near $4,700 isn't a breakdown—it is an institutional liquidity reset. Sitting at $3,998 ahead of the Fed rate decision creates an asymmetric reaction setup toward $4,200."
  },
  {
    title: "🥇 The $30 Trillion Sovereign Anchor: Why Gold Sub-$4K Is Institutional Absorption",
    desc: "Global reserve asset angle: Leverages gold's $30T sovereign dominance over short-term CFD paper fluctuations.",
    bodyReplacement: "Short-term paper traders focus on a 5% weekly CFD dip below $4,000, but with a $30 trillion sovereign market cap, institutional hands are quietly absorbing supply ahead of high-impact macro rate volatility."
  }
];

const ETH_UNIQUE_HOOKS = [
  {
    title: "🔷 The $2,850 ETH/BTC Capitulation Floor: Why Ethereum Is Primed for an Asymmetric Short Squeeze",
    desc: "Contrarian derivatives angle: Highlights cycle-low 0.036 ETH/BTC ratio vs deeply negative Bybit funding rates.",
    bodyReplacement: "While the timeline calls Ethereum dead at the 0.036 ETH/BTC ratio, Bybit derivatives reveal deeply negative funding rates paying shorts to hold. With spot orderflow defending the $2,850 shelf, an asymmetric short squeeze toward $3,150 is loading."
  },
  {
    title: "🔷 Beyond the FUD: Why Smart Money Is Quietly Absorbing $ETH Below $2,900",
    desc: "Orderflow absorption angle: Shows institutional limit bids absorbing sell walls at key $2,850 support.",
    bodyReplacement: "Retail traders are aggressively shorting Ethereum into structural support, but spot orderflow delta tells a completely different story: large limit bids are systematically filling at $2,850 while retail pays negative funding fees."
  },
  {
    title: "🔷 The Negative Funding Squeeze: Ethereum's High-Beta Mean Reversion Play",
    desc: "Volatility & execution angle: Trades the explosive mean-reversion setup with a defined $2,780 risk boundary.",
    bodyReplacement: "When retail sentiment turns this overwhelmingly one-sided, negative funding creates a high-probability short squeeze setup. With Bitcoin holding its $79,000 foundation, Ethereum at $2,874 provides an asymmetric risk-reward mean reversion toward $3,150."
  }
];

const ETH_CLICHES = [
  {
    regex: /\b(could|can) go either way|up or down\b/gi,
    label: 'could go either way',
    replacement: 'presents an asymmetric long setup toward $3,150',
    reason: 'Replaces indecisive phrasing with high-conviction orderflow target'
  },
  {
    regex: /\beth is dead|ratio is dead\b/gi,
    label: 'ratio is dead',
    replacement: 'ETH/BTC ratio is testing historic cycle capitulation support',
    reason: 'Replaces retail hysteria with institutional macro framing'
  },
  {
    regex: /\bblindly chasing green candles\b/gi,
    label: 'blindly chasing',
    replacement: 'waiting for confirmed orderflow delta on the 15m chart',
    reason: 'Professional trade execution trigger'
  },
  {
    regex: /\bcompletely bearish\b/gi,
    label: 'completely bearish',
    replacement: 'crowded in negative funding on Bybit derivatives',
    reason: 'Exact market positioning data'
  }
];

const SOL_UNIQUE_HOOKS = [
  {
    title: "⚡ The $172 Liquidation Sweep: Why Solana's DEX Volume Surge Hints at a Breakout to $208",
    desc: "DEX liquidity absorption angle: Highlights the 24% surge in Bybit spot pairs and $450M volume clearing the $172 cascade.",
    bodyReplacement: "While retail debates market chop, on-chain DEX volume on Bybit spot pairs surged 24% over the past 48 hours to clear $450 million. Institutional limit bids are actively absorbing the $172 flush, priming an asymmetric expansion toward $208."
  },
  {
    title: "⚡ The $168 Invalidation Line: Why Solana's Leverage Flush Created a Prime High-Beta Setup",
    desc: "Leverage wash-out angle: Shows how open interest cleansing paved the way for continuation with a strict $168 floor.",
    bodyReplacement: "Washing out excess perpetual leverage down to $172 wasn't a trend reversal—it was a necessary liquidity reset. With structural support anchored firmly at $168, the risk-reward ratio into the $208 resistance block is heavily skewed toward buyers."
  },
  {
    title: "⚡ Beyond the Noise: Why 15m CVD Absorption Signals Solana Smart Money Is Loading",
    desc: "Orderflow delta angle: Guides traders on confirmed CVD divergence rather than blindly chasing breakout wicks.",
    bodyReplacement: "Smart money isn't chasing breakouts in mid-range chop; they are waiting for 15m CVD absorption confirmation around $178. With retail shorts trapped below $182, disciplined execution favors an aggressive upside squeeze toward $208."
  }
];

const SOL_CLICHES = [
  {
    regex: /\b(could|can) go either way|up or down\b/gi,
    label: 'could go either way',
    replacement: 'presents an asymmetric expansion setup toward $208',
    reason: 'Replaces indecisive guessing with clear structural target'
  },
  {
    regex: /\bchasing mid-range candles|chasing breakouts\b/gi,
    label: 'chasing mid-range candles',
    replacement: 'waiting for 15m CVD orderflow confirmation near $178',
    reason: 'Professional trade execution trigger'
  },
  {
    regex: /\bworried about market chop\b/gi,
    label: 'worried about market chop',
    replacement: 'monitoring DEX volume absorption above the $172 reaction floor',
    reason: 'Replaces emotional worry with volume-backed thesis'
  }
];

const MINER_UNIQUE_HOOKS = [
  {
    title: "🔥 The $70B Compute Pivot: Why Bitcoin Miners Are Converting Facilities Into AI Data Centers",
    desc: "Infrastructure migration angle: Analyzes the $70B shift in compute contracts and fiber capacity toward AI workloads.",
    bodyReplacement: "While retail fears hashpower loss, publicly listed Bitcoin miners are actively converting excess infrastructure into high-performance computing centers, signing over $70B in AI enterprise contracts."
  },
  {
    title: "🔥 The Hashrate Divergence: Why Some Bitcoin Miners Are Pivoting to AI While Others Expand 50%",
    desc: "Strategic contrast angle: Compares compute diversification vs aggressive pure-play hashrate expansion to 190 coins/mo.",
    bodyReplacement: "The mining sector is splitting in two: while some operators monetize fiber lines for AI data centers, aggressive Nasdaq players are expanding pure hashrate by 50% to capture 190 coins a month."
  },
  {
    title: "🔥 Computing Power as a Commodity: Why the Bitcoin-to-AI Pivot Doesn't Suppress BTC Price",
    desc: "Macro market reality: Explains why diverted electricity and compute contracts create higher enterprise margins without hurting spot prices.",
    bodyReplacement: "Trading computing power directly with AI tech giants doesn't suppress Bitcoin spot prices. It simply turns high-density energy and infrastructure into a dual-revenue commodity with superior cash-flow payoffs."
  }
];

const MINER_CLICHES = [
  {
    regex: /\b(could|can) go either way|not clear where the payoffs are\b/gi,
    label: 'not clear where the payoffs are',
    replacement: 'creates an asymmetric revenue buffer across power cycles',
    reason: 'Replaces uncertainty with enterprise valuation reality'
  },
  {
    regex: /\blosing a big chunk of miners\b/gi,
    label: 'losing a big chunk of miners',
    replacement: 'reallocating marginal power to higher-margin AI compute contracts',
    reason: 'Reframes infrastructure rotation into financial margin expansion'
  },
  {
    regex: /\breally doesn't affect the bitcoin price but it's good to still know\b/gi,
    label: "doesn't affect the price",
    replacement: "doesn't directly suppress Bitcoin's spot price, but confirms energy demand",
    reason: 'Sharpens fundamental macro insight'
  }
];

const GOOGLE_UNIQUE_HOOKS = [
  {
    title: "🌐 The $3.92T Pre-Earnings Floor: Why Google at $319 Faces a $340 Breakout Test Tomorrow",
    desc: "Earnings breakout angle: Frames the $319 floor and AI cloud surge against the $340 overhead resistance.",
    bodyReplacement: "While the market holds its breath into tomorrow's earnings print, Google holding the $319 baseline sets up an asymmetric test toward $340 resistance, especially with the Fed's 4% decision compounding volatility."
  },
  {
    title: "🌐 Closing the $1.2T Gap: Can Google Cloud AI Monetization Catch Apple & Nvidia?",
    desc: "Valuation parity angle: Highlights Google's $3.92T market cap trailing Apple and Nvidia by $1.2T ahead of cloud infrastructure results.",
    bodyReplacement: "At a $3.92 trillion valuation, Google trails Apple and Nvidia by roughly $1.2 trillion. Tomorrow's cloud infrastructure numbers are the key test of whether Alphabet can close that mega-cap valuation gap."
  },
  {
    title: "🌐 The Asymmetric Pre-Fed Long: Trading Google at $319 with Strict $300 Invalidation",
    desc: "Tactical trade setup angle: Focuses on disciplined risk management, non-overleveraged positioning, and a defined 1:1.1 risk-reward.",
    bodyReplacement: "Trading earnings without overleverage is the only disciplined play when the Fed announces rates on the same day. Longing the $319 shelf with invalidation at $300 provides protected upside toward $340."
  }
];

const GOOGLE_CLICHES = [
  {
    regex: /\b(could|can) go either way|see what happens\b/gi,
    label: 'can go either way',
    replacement: 'creates a high-conviction asymmetric setup into resistance',
    reason: 'Replaces indecision with structured risk parameters'
  },
  {
    regex: /\blooking to gain from longing\b/gi,
    label: 'looking to gain from longing',
    replacement: 'positioning for asymmetric upside expansion toward $340',
    reason: 'Elevates colloquial trading phrasing into professional execution'
  },
  {
    regex: /\bwhat do you think about this\b/gi,
    label: 'what do you think about this',
    replacement: 'maintaining strict execution discipline into the release',
    reason: 'Removes conversational check-in and reinforces conviction'
  }
];

const HYPE_UNIQUE_HOOKS = [
  {
    title: "⚡ $HYPE (Hyperliquid) at $80: Why the Payward/Kraken CFTC Deal Primes a Breakout to $86",
    desc: "Regulatory catalyst angle: Frames HIP-3 permissioned allowlists and Bitnomial clearing against the $86 breakout.",
    bodyReplacement: "While retail focuses on short-term net outflows, Kraken parent Payward deploying the first CFTC-regulated perpetual markets via HIP-3 creates massive institutional L1 validation toward $86."
  },
  {
    title: "⚡ The $75 Invalidation Shelf: Why Hyperliquid's $80 Compression Is an Asymmetric Long",
    desc: "Risk-reward execution angle: Leverages the tight $5 risk at $75 against an $86 take-profit and $100 macro target.",
    bodyReplacement: "Trading Hyperliquid at $80 with a defined $75 stop-loss gives a high-probability asymmetric setup. Risking $5 to capture an $86 initial target and $100 macro expansion is textbook execution."
  },
  {
    title: "⚡ Regulated US Perpetuals on DEX: How Hyperliquid's HIP-3 Changes the L1 Game",
    desc: "Structural protocol angle: Analyzes on-chain allowlists bringing US institutional volume directly to Hyperliquid L1.",
    bodyReplacement: "Bringing CFTC-regulated futures to Hyperliquid via HIP-3 bridges CeFi compliance with DeFi infrastructure, turning protocol fee capture into a multi-cycle revenue engine."
  }
];

const HYPE_CLICHES = [
  {
    regex: /\b(could|can) go higher|wonderful coin\b/gi,
    label: 'wonderful coin / could go higher',
    replacement: 'positions for asymmetric upside expansion toward $86',
    reason: 'Replaces emotional cheerleading with structured upside parameters'
  },
  {
    regex: /\bnot sure about the flows\b/gi,
    label: 'not sure about the flows',
    replacement: 'analyzing on-chain net outflow absorption at the $75 shelf',
    reason: 'Sharpens orderflow interpretation'
  },
  {
    regex: /\bsee if it works\b/gi,
    label: 'see if it works',
    replacement: 'monitoring daily close confirmation above $82',
    reason: 'Replaces passivity with objective technical trigger'
  }
];

const NVDA_UNIQUE_HOOKS = [
  {
    title: "⚡ $NVDA Pre-Fed Trade Setup: Longing the $216 Baseline Ahead of Tomorrow's 4% Rate Decision",
    desc: "Macro rate sensitivity angle: Connects lower Treasury yields to reduced borrowing costs for hyperscale AI capex.",
    bodyReplacement: "While retail hesitates ahead of the Fed's 4% interest rate announcement, lower Treasury yields directly ease borrowing costs for hyperscalers, priming Nvidia for an immediate multiple expansion toward $225."
  },
  {
    title: "⚡ The $208 Invalidation Line: Why Nvidia at $216 Offers Asymmetric Risk Ahead of the Fed",
    desc: "Defined risk-reward execution: Focuses on the $8 risk parameter below Fibonacci swing support versus a $225 target.",
    bodyReplacement: "Trading mega-cap tech into macro rate decisions requires disciplined boundaries. Longing $216 with a strict $208 stop-loss provides a defined asymmetric trade into the $220–$225 resistance band."
  },
  {
    title: "⚡ The $5.25T Valuation Pivot: Can Dovish Fed Guidance Propel Nvidia Back to All-Time Highs?",
    desc: "Valuation multiple expansion angle: Highlights Nvidia capturing the lion's share of billions in enterprise data center capex.",
    bodyReplacement: "At a historic $5.25 trillion valuation, Nvidia isn't just an equity—it is the financial engine of global AI capex. Dovish Fed guidance tomorrow directly lowers debt hurdles for its biggest enterprise clients."
  }
];

const NVDA_CLICHES = [
  {
    regex: /\b(could|can) make good of that|good leverage\b/gi,
    label: 'good leverage',
    replacement: 'captures asymmetric upside expansion toward $225',
    reason: 'Elevates casual leverage talk to structured risk parameters'
  },
  {
    regex: /\bdepends on the federal decisions tomorrow\b/gi,
    label: 'depends on the federal decisions',
    replacement: 'trades dynamically with Treasury yield sensitivity ahead of the Fed',
    reason: 'Sharpens fundamental macro insight'
  },
  {
    regex: /\bso we know that\b/gi,
    label: 'so we know that',
    replacement: 'reinforcing long-term institutional demand across power and compute cycles',
    reason: 'Removes conversational filler and strengthens conviction'
  }
];

const META_UNIQUE_HOOKS = [
  {
    title: "🌐 $META & $NVDA: Why Nvidia's $3B Investment Anchors a Long at the $625 Floor",
    desc: "Cross-equity alliance angle: Connects Nvidia's direct equity injection to a verified price floor at the $625 offering level.",
    bodyReplacement: "While short-term traders digest dilution from the equity offering, Nvidia investing $3 billion directly into Meta validates the $625 baseline as an institutional accumulation floor."
  },
  {
    title: "🌐 The $600 Invalidation Shelf: Longing Meta's Post-Offering Rebound to $670",
    desc: "Defined risk-reward execution: Focuses on entering at $623 with an invalidation at $600 into the $670 gap-fill target.",
    bodyReplacement: "Entering Meta at $623 with a defined $600 stop-loss gives an asymmetric 1:1.9 risk-reward setup to capture the $670 overhead resistance zone."
  },
  {
    title: "🌐 Hardware Lock-In & Balance Sheets: How the Meta-Nvidia Alliance Reshapes Big Tech Capex",
    desc: "Multi-year ecosystem moat: Analyzes Vera Rubin and Spectrum-X deployments locking in multi-year AI dominance.",
    bodyReplacement: "Co-financing customer capex represents a structural paradigm shift: Nvidia is guaranteeing multi-year hardware deployment for Vera Rubin and Spectrum-X while supporting Meta's balance sheet."
  }
];

const META_CLICHES = [
  {
    regex: /\bgood enough for me\b/gi,
    label: 'good enough for me',
    replacement: 'capturing an optimal asymmetric risk-to-reward ratio',
    reason: 'Elevates casual trading phrasing into professional risk parameters'
  },
  {
    regex: /\blooking for a long meta call\b/gi,
    label: 'looking for a long call',
    replacement: 'positioning for a tactical long rebound above the $625 offering floor',
    reason: 'Sharpens structural trade execution'
  },
  {
    regex: /\btechnology would include quid pro quo\b/gi,
    label: 'technology would include quid pro quo',
    replacement: 'strategic infrastructure partnership with cross-equity deployment',
    reason: 'Refines colloquial Latin phrasing into corporate finance reality'
  }
];

const SUI_UNIQUE_HOOKS = [
  {
    title: "🔷 $SUI at $0.92: Why CCTP V2 & the $500M Hashi Rollout Prime a Wedge Breakout to $0.97",
    desc: "Multi-vector ecosystem catalyst: Connects native USDC CCTP V2 and Hashi Bitcoin DeFi to a technical wedge breakout.",
    bodyReplacement: "While broad altcoins chop sideways, Sui integrating Circle's CCTP V2 across 29 chains alongside the $500M Hashi Bitcoin rollout creates massive fundamental momentum to break the $0.92 wedge toward $0.97."
  },
  {
    title: "🔷 The $0.85 Invalidation Line: Trading Sui's Falling Wedge with an Asymmetric 1:3 R:R",
    desc: "Defined risk-reward execution: Focuses on entering at $0.92 with $0.05 risk at $0.85 into $0.97 and $1.00 targets.",
    bodyReplacement: "Risking just $0.05 below the $0.85 structural floor to capture a $0.97 reaction target and $1.00 expansion gives an asymmetric 1:3.0 risk-reward setup in a textbook falling wedge."
  },
  {
    title: "🔷 Institutional Non-EVM Liquidity: How Sui's $500M Hashi Bridge Changes Bitcoin DeFi",
    desc: "Institutional Bitcoin DeFi angle: Focuses on Anchorage Digital and committed capital unlocking Bitcoin collateral on Sui.",
    bodyReplacement: "Unlocking over $500 million in native Bitcoin collateral via Hashi bridges institutional BTC capital directly into Sui DeFi, turning the $0.90 floor into a high-conviction accumulation zone."
  }
];

const SUI_CLICHES = [
  {
    regex: /\bthat's my trade setup now\b/gi,
    label: 'that is my trade setup now',
    replacement: 'providing clear execution parameters into the wedge breakout',
    reason: 'Elevates verbal conclusion to professional trade execution'
  },
  {
    regex: /\breally big commitment\b/gi,
    label: 'really big commitment',
    replacement: 'significant institutional adoption milestone for consumer scale',
    reason: 'Replaces generic colloquial praise with institutional framing'
  },
  {
    regex: /\bwe will also talk about ai\b/gi,
    label: 'we will also talk about ai',
    replacement: 'expanding decentralized AI protocol infrastructure',
    reason: 'Removes conversational transitions'
  }
];

function getUniqueHooksForCurrentPost() {
  const currentPost = postsData[currentPostIndex] || {};
  const coin = (currentPost.coin || '').toUpperCase();
  const text = (polishedContent.value || currentPost.improved || '').toLowerCase();

  if (coin.includes('SUI') || text.includes('sui') || text.includes('0.92') || text.includes('hashi')) {
    return SUI_UNIQUE_HOOKS;
  }
  if (coin.includes('META') || text.includes('meta') || text.includes('625') || text.includes('623')) {
    return META_UNIQUE_HOOKS;
  }
  if (coin.includes('NVDA') || text.includes('nvidia') || text.includes('216') || text.includes('5.25')) {
    return NVDA_UNIQUE_HOOKS;
  }
  if (coin.includes('HYPE') || text.includes('hyperliquid') || text.includes('payward') || text.includes('hip-3')) {
    return HYPE_UNIQUE_HOOKS;
  }
  if (coin.includes('GOOG') || text.includes('google') || text.includes('alphabet') || text.includes('319') || text.includes('340')) {
    return GOOGLE_UNIQUE_HOOKS;
  }
  if (text.includes('miner') || text.includes('luxor') || text.includes('computing power') || text.includes('data centers') || text.includes('70 billion')) {
    return MINER_UNIQUE_HOOKS;
  }
  if (coin.includes('SOL') || text.includes('solana') || text.includes('172') || text.includes('182') || text.includes('208')) {
    return SOL_UNIQUE_HOOKS;
  }
  if (coin.includes('ETH') || text.includes('ethereum') || text.includes('2850') || text.includes('2874') || text.includes('0.036')) {
    return ETH_UNIQUE_HOOKS;
  }
  if (coin.includes('PAXG') || coin.includes('GOLD') || text.includes('gold') || text.includes('ounce') || text.includes('3998') || text.includes('4000')) {
    return GOLD_UNIQUE_HOOKS;
  }
  return BTC_UNIQUE_HOOKS;
}

function getClichesForCurrentPost() {
  const currentPost = postsData[currentPostIndex] || {};
  const coin = (currentPost.coin || '').toUpperCase();
  const text = (polishedContent.value || currentPost.improved || '').toLowerCase();
  const isSui = coin.includes('SUI') || text.includes('sui') || text.includes('0.92') || text.includes('hashi');
  const isMeta = coin.includes('META') || text.includes('meta') || text.includes('625') || text.includes('623');
  const isNvda = coin.includes('NVDA') || text.includes('nvidia') || text.includes('216') || text.includes('5.25');
  const isHype = coin.includes('HYPE') || text.includes('hyperliquid') || text.includes('payward') || text.includes('hip-3');
  const isGoogle = coin.includes('GOOG') || text.includes('google') || text.includes('alphabet') || text.includes('319');
  const isMiner = text.includes('miner') || text.includes('luxor') || text.includes('computing power') || text.includes('data centers') || text.includes('70 billion');
  const isGold = coin.includes('PAXG') || coin.includes('GOLD') || text.includes('gold') || text.includes('3998');
  const isEth = coin.includes('ETH') || text.includes('ethereum') || text.includes('2850') || text.includes('2874');
  const isSol = coin.includes('SOL') || text.includes('solana') || text.includes('172') || text.includes('182');

  if (isSui) {
    return SUI_CLICHES;
  }
  if (isMeta) {
    return META_CLICHES;
  }
  if (isNvda) {
    return NVDA_CLICHES;
  }
  if (isHype) {
    return HYPE_CLICHES;
  }
  if (isGoogle) {
    return GOOGLE_CLICHES;
  }
  if (isMiner) {
    return MINER_CLICHES;
  }
  if (isSol) {
    return SOL_CLICHES;
  }
  if (isEth) {
    return ETH_CLICHES;
  }
  if (isGold) {
    return [
      {
        regex: /\b(could|can) go either way|insane rally,?\s*or\s*(?:are we going to see\s*)?a? further decline\b/gi,
        label: 'insane rally or further decline',
        replacement: 'presents an asymmetric risk-reward setup toward $4,200',
        reason: 'Replaces binary coin-toss language with gold trade conviction'
      },
      {
        regex: /\bwhere does it go from here\b/gi,
        label: 'where does it go from here',
        replacement: 'where smart money is positioning ahead of the Fed',
        reason: 'Elevates retail questioning into institutional macro positioning'
      },
      {
        regex: /\bthat's some crash\b/gi,
        label: "that's some crash",
        replacement: 'that marks an aggressive pre-Fed shakeout',
        reason: 'Replaces emotional panic with technical liquidity framing'
      },
      {
        regex: /\bimportant to be cautious\b/gi,
        label: 'important to be cautious',
        replacement: 'vital to wait for $3,998 reaction confirmation',
        reason: 'Replaces generic caution with gold execution level'
      },
      {
        regex: /\bwait and see\b/gi,
        label: 'wait and see',
        replacement: 'monitor orderflow response to tomorrow’s 4% Fed decision',
        reason: 'Specific macro catalyst monitoring'
      }
    ];
  }

  return CROWD_CLICHES;
}

function openUniqueModal() {
  hookOptionsList.innerHTML = '';
  const hooks = getUniqueHooksForCurrentPost();
  if (selectedUniqueHook >= hooks.length) selectedUniqueHook = 0;

  hooks.forEach((hook, i) => {
    const card = document.createElement('div');
    card.className = `hook-option-card ${i === selectedUniqueHook ? 'selected' : ''}`;
    card.innerHTML = `
      <input type="radio" name="uniqueHookRadio" class="hook-radio" ${i === selectedUniqueHook ? 'checked' : ''} />
      <div class="hook-info">
        <span class="hook-title-text">${hook.title}</span>
        <span class="hook-desc-text">${hook.desc}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      selectedUniqueHook = i;
      const allCards = hookOptionsList.querySelectorAll('.hook-option-card');
      allCards.forEach((c, idx) => {
        c.classList.toggle('selected', idx === i);
        c.querySelector('input').checked = idx === i;
      });
    });
    hookOptionsList.appendChild(card);
  });

  // Populate Section 3: Phrase-level checklist for all detected clichés
  if (clicheFixChecklist) {
    const text = polishedContent.value;
    const cliches = getClichesForCurrentPost();
    const detectedInText = cliches.filter(c => c.regex.test(text));

    if (detectedInText.length === 0) {
      clicheFixChecklist.innerHTML = `
        <div class="diag-item">
          <span class="diag-tag green">CLEAN</span>
          <span class="diag-text">No crowd consensus phrases detected in this text.</span>
        </div>
      `;
    } else {
      clicheFixChecklist.innerHTML = detectedInText.map((item, idx) => `
        <label class="cliche-check-card">
          <input type="checkbox" class="cliche-check-input" checked data-index="${idx}" data-label="${item.label}" />
          <div class="cliche-check-content">
            <span class="cliche-check-old">"${item.label}"</span>
            <span class="cliche-check-new">➔ ${item.replacement}</span>
          </div>
        </label>
      `).join('');
    }
  }

  uniqueModal.classList.remove('hidden');
}

function closeUniqueModal() {
  uniqueModal.classList.add('hidden');
}

// Save Current Text As New Base Content (Allows Iterative Stacking & Refinement)
function saveCurrentAsBase() {
  const text = polishedContent.value;
  if (!text.trim() || text.startsWith('Awaiting your voice notes')) {
    showToast('No active content to save as base.');
    return;
  }
  postsData[currentPostIndex].improved = text;
  postsData[currentPostIndex].raw = text; // Update raw notes so future draft generations build from here
  postsData[currentPostIndex].status = 'ready';
  saveDataToStorage();
  updateWordAndSentenceBadges(text);
  renderUnderlinedView(text);
  runAllDetectors(text);
  showToast('💾 Saved as new base content! You can refine further or make additional edits.');
}

// Apply Selected Unique Angle to Post
function applyUniqueTransformations(chosen) {
  let text = polishedContent.value;

  // 1. Replace the first line title with the chosen unique contrarian title
  const firstLineMatch = text.match(/^(?:[📊🥇🔷💎🧭⚡🔥🚨🌐]\s*)?[^\n]+/);
  if (firstLineMatch) {
    text = text.replace(firstLineMatch[0], chosen.title);
  } else {
    text = `${chosen.title}\n\n${text}`;
  }

  // 2. Replace generic fence-sitting sentence with the chosen personal conviction
  const currentPost = postsData[currentPostIndex] || {};
  const coin = (currentPost.coin || '').toUpperCase();
  const isSui = coin.includes('SUI') || text.toLowerCase().includes('sui') || text.toLowerCase().includes('0.92');
  const isMeta = coin.includes('META') || text.toLowerCase().includes('meta') || text.toLowerCase().includes('625') || text.toLowerCase().includes('623');
  const isNvda = coin.includes('NVDA') || text.toLowerCase().includes('nvidia') || text.toLowerCase().includes('216') || text.toLowerCase().includes('5.25');
  const isHype = coin.includes('HYPE') || text.toLowerCase().includes('hyperliquid') || text.toLowerCase().includes('hip-3') || text.toLowerCase().includes('payward');
  const isGoogle = coin.includes('GOOG') || text.toLowerCase().includes('google') || text.toLowerCase().includes('alphabet') || text.toLowerCase().includes('319');
  const isEth = coin.includes('ETH') || text.toLowerCase().includes('ethereum') || text.toLowerCase().includes('2850');
  const isSol = coin.includes('SOL') || text.toLowerCase().includes('solana') || text.toLowerCase().includes('172') || text.toLowerCase().includes('182');
  const isMiner = text.toLowerCase().includes('miner') || text.toLowerCase().includes('luxor') || text.toLowerCase().includes('computing power') || text.toLowerCase().includes('data centers');

  if (isSui) {
    if (/Sui \(\$SUI\) is compressing[\s\S]*?Samsung Wallets\./i.test(text)) {
      text = text.replace(/Sui \(\$SUI\) is compressing[\s\S]*?Samsung Wallets\./i, chosen.bodyReplacement);
    } else {
      text = text.replace(/Sui \(\$SUI\)[^\n]+/i, chosen.bodyReplacement);
    }
  } else if (isMeta) {
    if (/Nvidia has committed \$3 billion[\s\S]*?Muse AI models\./i.test(text)) {
      text = text.replace(/Nvidia has committed \$3 billion[\s\S]*?Muse AI models\./i, chosen.bodyReplacement);
    } else {
      text = text.replace(/Nvidia has committed[^\n]+/i, chosen.bodyReplacement);
    }
  } else if (isNvda) {
    if (/NVIDIA \(\$NVDA\) commands a massive[\s\S]*?infrastructure multiples\./i.test(text)) {
      text = text.replace(/NVIDIA \(\$NVDA\) commands a massive[\s\S]*?infrastructure multiples\./i, chosen.bodyReplacement);
    } else {
      text = text.replace(/NVIDIA \(\$NVDA\)[^\n]+/i, chosen.bodyReplacement);
    }
  } else if (isHype) {
    if (/Hyperliquid \(\$HYPE\) is consolidating[\s\S]*?psychological milestone\./i.test(text)) {
      text = text.replace(/Hyperliquid \(\$HYPE\) is consolidating[\s\S]*?psychological milestone\./i, chosen.bodyReplacement);
    } else {
      text = text.replace(/Hyperliquid \(\$HYPE\)[^\n]+/i, chosen.bodyReplacement);
    }
  } else if (isGoogle) {
    if (/Alphabet is testing pivotal support[\s\S]*?dual catalyst\./i.test(text)) {
      text = text.replace(/Alphabet is testing pivotal support[\s\S]*?dual catalyst\./i, chosen.bodyReplacement);
    } else {
      text = text.replace(/Alphabet is testing[^\n]+/i, chosen.bodyReplacement);
    }
  } else if (isMiner) {
    if (/While this infrastructure migration[\s\S]*?highest\./i.test(text)) {
      text = text.replace(/While this infrastructure migration[\s\S]*?highest\./i, chosen.bodyReplacement);
    } else {
      text = text.replace(/The scale of this computing power trade[^\n]+/i, chosen.bodyReplacement);
    }
  } else if (isSol) {
    if (/on-chain DEX volume on Bybit spot pairs[\s\S]*?absorb supply\./i.test(text)) {
      text = text.replace(/on-chain DEX volume on Bybit spot pairs[\s\S]*?absorb supply\./i, chosen.bodyReplacement);
    } else {
      text = text.replace(/While the broader market hesitates[^\n]+/i, chosen.bodyReplacement);
    }
  } else if (isEth) {
    if (/beneath the bearish noise[\s\S]*?liquidity shelf\./i.test(text)) {
      text = text.replace(/beneath the bearish noise[\s\S]*?liquidity shelf\./i, chosen.bodyReplacement);
    } else if (/sentiment hitting cycle-low pessimism[\s\S]*?liquidity shelf\./i.test(text)) {
      text = text.replace(/sentiment hitting cycle-low pessimism[\s\S]*?liquidity shelf\./i, chosen.bodyReplacement);
    } else {
      text = text.replace(/Yet beneath the bearish noise[^\n]+/i, chosen.bodyReplacement);
    }
  } else if (/Where does it go from here\?[\s\S]*?(?:we have to look at the macro driver|examine what this means technically)\.?/i.test(text)) {
    text = text.replace(/Where does it go from here\?[\s\S]*?(?:we have to look at the macro driver|examine what this means technically)\.?/i, chosen.bodyReplacement);
  } else if (/are we going to have a(?:n)? insane rally or are we going to see a further decline/i.test(text)) {
    text = text.replace(/are we going to have a(?:n)? insane rally or are we going to see a further decline[\s\S]*?what this means technically\.?/i, chosen.bodyReplacement);
  } else if (/This is a thesis for up and down, so it can go either way\. But my take is that Bitcoin is losing momentum\./i.test(text)) {
    text = text.replace(/This is a thesis for up and down, so it can go either way\. But my take is that Bitcoin is losing momentum\./i, chosen.bodyReplacement);
  } else {
    text = text.replace(/The crowd thinks this has an asymmetric bias[\s\S]*?sweep\./i, chosen.bodyReplacement);
  }

  // 3. Apply any selected phrase-level fixes from Section 3 checklist
  if (clicheFixChecklist) {
    const checkedBoxes = clicheFixChecklist.querySelectorAll('.cliche-check-input:checked');
    const cliches = getClichesForCurrentPost();
    checkedBoxes.forEach(box => {
      const label = box.getAttribute('data-label');
      const item = cliches.find(c => c.label === label);
      if (item && item.replacement) {
        text = text.replace(item.regex, item.replacement);
      }
    });
  }

  return text;
}

// Save Unique Version Directly as New Base Content
function saveUniqueAsNewBase() {
  const hooks = getUniqueHooksForCurrentPost();
  const chosen = hooks[selectedUniqueHook] || hooks[0];
  if (!chosen) return;

  const text = applyUniqueTransformations(chosen);

  // Update text everywhere and lock in as new base content
  polishedContent.value = text;
  postsData[currentPostIndex].improved = text;
  postsData[currentPostIndex].raw = text; // Sync base so further uniqueness iterations stack on top
  postsData[currentPostIndex].title = `Post ${currentPostIndex + 1}: ${chosen.title}`;
  currentPostTitle.textContent = postsData[currentPostIndex].title;
  saveDataToStorage();

  // AUTOMATIC FULL RECALCULATION ACROSS ALL 4 ENGINES + BYX DIMENSIONS
  updateWordAndSentenceBadges(text);
  renderUnderlinedView(text);
  generateAndRenderDraft(text, text);
  runAllDetectors(text);
  closeUniqueModal();

  // SWITCH DIRECTLY TO DRAFT & RULES TAB TO REVIEW BYX SCORE & FORMATTING SUGGESTIONS
  switchTab('draft');
  showToast('💾 Unique Alpha saved as base! Returned to Draft & Rules to review suggestions & ByX Score.');
}

function applySelectedUniqueAngle() {
  const hooks = getUniqueHooksForCurrentPost();
  const chosen = hooks[selectedUniqueHook] || hooks[0];
  if (!chosen) return;

  const text = applyUniqueTransformations(chosen);

  // Update text everywhere
  polishedContent.value = text;
  postsData[currentPostIndex].improved = text;
  postsData[currentPostIndex].raw = text;
  postsData[currentPostIndex].title = `Post ${currentPostIndex + 1}: ${chosen.title}`;
  currentPostTitle.textContent = postsData[currentPostIndex].title;
  saveDataToStorage();

  // AUTOMATIC FULL RECALCULATION ACROSS ALL 4 ENGINES + BYX DIMENSIONS
  updateWordAndSentenceBadges(text);
  renderUnderlinedView(text);
  generateAndRenderDraft(text, text);
  runAllDetectors(text);
  closeUniqueModal();

  // SWITCH DIRECTLY TO DRAFT & RULES TAB TO REVIEW BYX SCORE & FORMATTING SUGGESTIONS
  switchTab('draft');
  showToast('💎 Unique Alpha applied! Returned to Draft & Rules to review suggestions & ByX Score.');
}

function setDraftViewMode(mode) {
  if (mode === 'clean') {
    if (draftCleanContent) draftCleanContent.classList.remove('hidden');
    if (draftSuggestionsDisplay) draftSuggestionsDisplay.classList.add('hidden');
    if (toggleDraftCleanBtn) toggleDraftCleanBtn.classList.add('active');
    if (toggleDraftDiffBtn) toggleDraftDiffBtn.classList.remove('active');
    if (draftViewBadge) draftViewBadge.textContent = '📄 Clean Final Post';
  } else {
    if (draftCleanContent) draftCleanContent.classList.add('hidden');
    if (draftSuggestionsDisplay) draftSuggestionsDisplay.classList.remove('hidden');
    if (toggleDraftCleanBtn) toggleDraftCleanBtn.classList.remove('active');
    if (toggleDraftDiffBtn) toggleDraftDiffBtn.classList.add('active');
    if (draftViewBadge) draftViewBadge.textContent = '🔍 Highlighted Rules & Suggestions';
  }
}

// 🎯 Inject Bybit ByX Cashtag & Real Trading Context (#PAIRUSDT, Setup, Profit Follow-Up)
function injectTradeContext(type) {
  const post = postsData[currentPostIndex] || {};
  let rawCoin = (post.coin && post.coin !== '+ New Coin') ? post.coin.replace(/^\$/, '') : 'BTC';
  const cashtag = `#${rawCoin.toUpperCase()}USDT`;

  let snippet = '';
  if (type === 'setup') {
    snippet = `\n\n📈 Trade Setup & Cashtag: ${cashtag}\n• Direction: Long\n• Entry Zone: Support floor reaction\n• Invalidation (SL): Below structural low\n• Take Profit 1: +5.0% (Book 50% profit)\n• Take Profit 2: +10.0% (Runner target)\n• Risk/Reward Ratio: 1 : 2.5`;
  } else if (type === 'followup') {
    snippet = `\n\n🏆 Trade Update & Cashtag: ${cashtag}\n• Historical Entry: Confirmed support\n• Target 1 Hit: +5.0% profit realized\n• Position Action: 50% profit booked; stop loss trailed to breakeven\n• Runner Target: Next key resistance`;
  }

  const activeText = polishedContent.value || '';
  const updatedText = activeText ? (activeText.trim() + snippet) : snippet.trim();

  polishedContent.value = updatedText;
  if (draftCleanContent) draftCleanContent.value = updatedText;
  post.improved = updatedText;
  post.status = 'ready';

  saveDataToStorage();
  updateWordAndSentenceBadges(updatedText);
  runAllDetectors(updatedText);
  renderPills();
  renderAttributionMatrix();
  updateWeeklyProgress();
  showToast(`🎯 Injected ByX Cashtag (${cashtag}) & ${type === 'setup' ? 'Trade Setup' : 'Realized Profit Follow-Up'}!`);
}

// Setup Event Listeners
function setupEvents() {
  // Wire up Independent Engine Desk Switcher (Posts vs Scores & Post Audit Hub)
  const btnOpenScoresModal = document.getElementById('btnOpenScoresModal');
  const pillBarScoresBtn = document.getElementById('pillBarScoresBtn');
  const returnPostsFromScoresBtn = document.getElementById('returnPostsFromScoresBtn');

  const btnOpenAnalysisModal = document.getElementById('btnOpenAnalysisModal');
  const pillBarAnalysisBtn = document.getElementById('pillBarAnalysisBtn');
  const pillBarCrossAnalysisBtn = document.getElementById('pillBarCrossAnalysisBtn');
  const returnPostsFromAnalysisBtn = document.getElementById('returnPostsFromAnalysisBtn');
  const goToScoresFromAnalysisBtn = document.getElementById('goToScoresFromAnalysisBtn');

  if (btnOpenScoresModal) btnOpenScoresModal.addEventListener('click', () => setDeskView('scores'));
  if (pillBarScoresBtn) pillBarScoresBtn.addEventListener('click', () => setDeskView('scores'));
  if (returnPostsFromScoresBtn) returnPostsFromScoresBtn.addEventListener('click', () => setDeskView('posts'));

  if (btnOpenAnalysisModal) btnOpenAnalysisModal.addEventListener('click', () => setDeskView('analysis'));
  if (pillBarAnalysisBtn) pillBarAnalysisBtn.addEventListener('click', () => setDeskView('analysis'));
  if (pillBarCrossAnalysisBtn) {
    pillBarCrossAnalysisBtn.addEventListener('click', () => {
      if (typeof window.EdgeFlow !== 'undefined' && typeof window.EdgeFlow.setForensicDay === 'function') {
        window.EdgeFlow.setForensicDay('cross');
      } else if (typeof currentForensicDay !== 'undefined') {
        currentForensicDay = 'cross';
      }
      setDeskView('analysis');
    });
  }
  if (returnPostsFromAnalysisBtn) returnPostsFromAnalysisBtn.addEventListener('click', () => setDeskView('posts'));
  if (goToScoresFromAnalysisBtn) goToScoresFromAnalysisBtn.addEventListener('click', () => setDeskView('scores'));

  initForensicAnalysisHub();

  const runBenchmarkBtn = document.getElementById('runBenchmarkBtn');
  if (runBenchmarkBtn) {
    runBenchmarkBtn.addEventListener('click', runRustVsJsBenchmark);
  }
  // Post Workspace Tabs
  if (tabPolishedBtn) tabPolishedBtn.addEventListener('click', () => switchTab('polished'));
  if (tabDraftBtn) tabDraftBtn.addEventListener('click', () => switchTab('draft'));
  if (tabRawBtn) tabRawBtn.addEventListener('click', () => switchTab('raw'));

  // Cashtag & Trade Context Quick Injectors
  const btnInjectTradeSetup = document.getElementById('btnInjectTradeSetup');
  const btnInjectTradeFollowup = document.getElementById('btnInjectTradeFollowup');
  const btnInjectTradeSetupDraft = document.getElementById('btnInjectTradeSetupDraft');
  const btnInjectTradeFollowupDraft = document.getElementById('btnInjectTradeFollowupDraft');

  if (btnInjectTradeSetup) btnInjectTradeSetup.addEventListener('click', () => injectTradeContext('setup'));
  if (btnInjectTradeFollowup) btnInjectTradeFollowup.addEventListener('click', () => injectTradeContext('followup'));
  if (btnInjectTradeSetupDraft) btnInjectTradeSetupDraft.addEventListener('click', () => injectTradeContext('setup'));
  if (btnInjectTradeFollowupDraft) btnInjectTradeFollowupDraft.addEventListener('click', () => injectTradeContext('followup'));

  // Primary Draft Tab Main Copy Button (Ready to Post on ByX)
  if (copyDraftMainBtn) {
    copyDraftMainBtn.addEventListener('click', () => {
      const textToCopy = (draftCleanContent && draftCleanContent.value) ? draftCleanContent.value : polishedContent.value;
      copyCleanText(textToCopy, copyDraftMainBtn);
    });
  }

  // Draft View Mode Switchers
  if (toggleDraftCleanBtn) {
    toggleDraftCleanBtn.addEventListener('click', () => setDraftViewMode('clean'));
  }
  if (toggleDraftDiffBtn) {
    toggleDraftDiffBtn.addEventListener('click', () => setDraftViewMode('diff'));
  }

  if (draftCleanContent) {
    draftCleanContent.addEventListener('input', (e) => {
      const val = e.target.value;
      polishedContent.value = val;
      postsData[currentPostIndex].improved = val;
      saveDataToStorage();
      updateWordAndSentenceBadges(val);
      renderUnderlinedView(val);
      runAllDetectors(val);
    });
  }

  // View Mode Toggles
  togglePlainBtn.addEventListener('click', () => setViewMode('plain'));
  toggleAnnotatedBtn.addEventListener('click', () => setViewMode('annotated'));

  // Humanize Button
  humanizeBtn.addEventListener('click', humanizeCurrentText);

  // Copy Buttons
  copyPolishedBtn.addEventListener('click', () => {
    copyCleanText(polishedContent.value, copyPolishedBtn);
  });

  copyRawBtn.addEventListener('click', () => {
    copyCleanText(rawContent.value, copyRawBtn);
  });

  copyDraftBtn.addEventListener('click', () => {
    const cleanDraft = currentDraftResult ? currentDraftResult.clean : draftSuggestionsDisplay.innerText;
    copyCleanText(cleanDraft, copyDraftBtn);
  });

  // Apply Suggestions Draft Button
  applyDraftBtn.addEventListener('click', () => {
    if (currentDraftResult && currentDraftResult.clean) {
      polishedContent.value = currentDraftResult.clean;
      postsData[currentPostIndex].improved = currentDraftResult.clean;
      saveDataToStorage();
      updateWordAndSentenceBadges(currentDraftResult.clean);
      renderUnderlinedView(currentDraftResult.clean);
      runAllDetectors(currentDraftResult.clean);
      switchTab('polished');
      showToast('✅ Applied suggestions! Clean post ready to copy.');
    } else {
      showToast('No active draft suggestions to apply.');
    }
  });

  // Generate Draft from Raw Dictation
  generateDraftBtn.addEventListener('click', () => {
    const raw = rawContent.value;
    if (!raw.trim()) {
      showToast('Please type or speak notes first.');
      return;
    }
    postsData[currentPostIndex].raw = raw;
    postsData[currentPostIndex].status = 'ready';
    saveDataToStorage();
    generateAndRenderDraft(raw, '');
    switchTab('draft');
    showToast('⚡ Draft generated under strict polishing rules!');
  });

  // Clicking inside annotated text on mobile also copies clean text
  annotatedDisplay.addEventListener('click', () => {
    copyCleanText(polishedContent.value, copyPolishedBtn);
  });

  // Real-time Textarea Typing (Live recalculation)
  polishedContent.addEventListener('input', (e) => {
    const val = e.target.value;
    postsData[currentPostIndex].improved = val;
    saveDataToStorage();
    updateWordAndSentenceBadges(val);
    renderUnderlinedView(val);
    runAllDetectors(val);
  });

  // Dedicated Recalculate Buttons with visual calculation feedback
  if (recalcRobertaBtn) {
    recalcRobertaBtn.addEventListener('click', () => {
      recalcRobertaBtn.classList.add('active-calc');
      recalcRobertaBtn.textContent = '⏳ Computing...';
      setTimeout(() => {
        runRobertaEntropy(polishedContent.value);
        recalcRobertaBtn.classList.remove('active-calc');
        recalcRobertaBtn.textContent = '⚡ Recalculate';
        showToast('✓ Recalculated RoBERTa Vocabulary Entropy!');
      }, 180);
    });
  }

  if (recalcGltrBtn) {
    recalcGltrBtn.addEventListener('click', () => {
      recalcGltrBtn.classList.add('active-calc');
      recalcGltrBtn.textContent = '⏳ Scanning...';
      setTimeout(() => {
        runGltrPredictability(polishedContent.value);
        recalcGltrBtn.classList.remove('active-calc');
        recalcGltrBtn.textContent = '⚡ Recalculate';
        showToast('✓ Recalculated GLTR Next-Token Predictability!');
      }, 180);
    });
  }

  if (recalcBinocBtn) {
    recalcBinocBtn.addEventListener('click', () => {
      recalcBinocBtn.classList.add('active-calc');
      recalcBinocBtn.textContent = '⏳ Scanning...';
      setTimeout(() => {
        runBinocularsPerplexity(polishedContent.value);
        recalcBinocBtn.classList.remove('active-calc');
        recalcBinocBtn.textContent = '⚡ Recalculate';
        showToast('✓ Recalculated Binoculars Perplexity Variance!');
      }, 180);
    });
  }

  if (recalcUniqueBtn) {
    recalcUniqueBtn.addEventListener('click', () => {
      recalcUniqueBtn.classList.add('active-calc');
      recalcUniqueBtn.textContent = '⏳ Scanning...';
      setTimeout(() => {
        runUniquenessEngine(polishedContent.value);
        recalcUniqueBtn.classList.remove('active-calc');
        recalcUniqueBtn.textContent = '⚡ Recalculate';
        showToast('✓ Recalculated Uniqueness & Consensus Cliché Score!');
      }, 180);
    });
  }

  // Master AI Resolution Button in Draft Tab
  if (resolveAllDraftAiBtn) {
    resolveAllDraftAiBtn.addEventListener('click', resolveAllAiFlags);
  }

  // Next Steps Recommendation Studio Action Button
  if (btnApplyNextStepHumanization) {
    btnApplyNextStepHumanization.addEventListener('click', applyHighEntropyHumanization);
  }

  // Make It Unique Modal Listeners
  makeUniqueBtn.addEventListener('click', openUniqueModal);
  closeUniqueModalBtn.addEventListener('click', closeUniqueModal);
  applyUniqueSignatureBtn.addEventListener('click', applySelectedUniqueAngle);
  if (saveUniqueAsBaseBtn) {
    saveUniqueAsBaseBtn.addEventListener('click', saveUniqueAsNewBase);
  }

  // Save As Base Button in Main Action Bar
  if (saveBaseBtn) {
    saveBaseBtn.addEventListener('click', saveCurrentAsBase);
  }

  // Prev & Next Buttons
  prevPostBtn.addEventListener('click', () => {
    if (currentPostIndex > 0) {
      displayPost(currentPostIndex - 1);
    } else {
      displayPost(postsData.length - 1);
    }
  });

  nextPostBtn.addEventListener('click', () => {
    if (currentPostIndex < postsData.length - 1) {
      displayPost(currentPostIndex + 1);
    } else {
      displayPost(0);
    }
  });

  // Save Raw Edit
  saveEditBtn.addEventListener('click', saveCurrentPostEdits);

  // Quick Action Buttons
  quickEditCoinBtn.addEventListener('click', quickEditCoin);
  resetSlotBtn.addEventListener('click', resetCurrentSlot);
}

// ================================================================================
// Real-time Benchmark Engine: Rust WebAssembly vs JavaScript Engine
// ==============================================================================
function runRustVsJsBenchmark() {
  const sampleText = (polishedContent && polishedContent.value && polishedContent.value.length > 20) 
    ? polishedContent.value 
    : "⚡ #SOLUSDT: Post-FOMC Floor Retest & Asymmetric Long Setup\n\nSolana is demonstrating spot resilience at $101.50, absorbing selling volume following yesterday's Federal Reserve interest rate decision. While macro sentiment remains mixed, on-chain DEX volume and institutional staking keep the higher-timeframe bullish trend intact above psychological support.\n\nHere is my intraday execution playbook & scenario analysis:\n• Structural Levels: Demand floor anchored at $98.00; overhead resistance sits at $106.50 and $112.00.\n• Tactical Trade Setup: Long entry in the $100.50–$101.50 zone; invalidation stop-loss at $97.20 with disciplined 3x to 5x leverage.\n• Profit Targets: Scale TP1 at $106.50 (+5%), letting runners target TP2 at $112.00 (+10.5%) for a 1:2.8 risk-to-reward ratio.\n• Risk Disclosure: A 4-hour close beneath $97.20 invalidates our thesis.\n\nProtect banked capital by trailing stop-loss orders. Are you bidding this $100 retest or waiting for morning confirmation?";

  const iterations = 500;

  // 1. JavaScript Engine Benchmark
  const jsStart = performance.now();
  let jsLastScore = 0;
  for (let i = 0; i < iterations; i++) {
    jsLastScore = runJsScorerInternal(sampleText);
  }
  const jsTotalTime = performance.now() - jsStart;
  const jsAvgTime = (jsTotalTime / iterations).toFixed(4);

  // 2. Rust WebAssembly Benchmark
  let rustAvgTime = '--';
  let rustSpeedup = '--';
  let rustScore = 0;
  let burstiness = 0;

  if (isRustReady && rustCore && typeof rustCore.score_post === 'function') {
    const rustStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      const res = rustCore.score_post(sampleText);
      if (i === 0) {
        const parsed = JSON.parse(res);
        rustScore = parsed.total;
        burstiness = parsed.burstiness_score;
      }
    }
    const rustTotalTime = performance.now() - rustStart;
    rustAvgTime = (rustTotalTime / iterations).toFixed(4);
    const speedupMult = (parseFloat(jsTotalTime) / Math.max(0.001, parseFloat(rustTotalTime))).toFixed(1);
    rustSpeedup = `${speedupMult}x Faster`;
  }

  // Render to DOM
  updateBenchmarkDisplay({
    iterations,
    jsTotal: jsTotalTime.toFixed(2),
    jsAvg: jsAvgTime,
    rustTotal: (parseFloat(rustAvgTime) * iterations).toFixed(2),
    rustAvg: rustAvgTime,
    speedup: rustSpeedup,
    scoreMatch: `${jsLastScore}/100 (JS) vs ${rustScore}/100 (Rust)`,
    burstiness: burstiness
  });

  if (typeof showToast === 'function') {
    showToast(`⚡ Benchmark Finished: Rust is ${rustSpeedup}!`);
  }
}

function runJsScorerInternal(clean) {
  let originality = 18;
  if (/up or down\?|either way/i.test(clean)) originality -= 2;
  if (/smart money|absorbed|liquidity|thesis|short squeeze|asymmetric|surge/i.test(clean)) originality += 2;
  originality = Math.min(20, Math.max(4, originality));

  let depth = 6;
  if (/\$[\d,]+(?:\.\d+)?|\b0\.\d{3,4}\b/i.test(clean)) depth += 3;
  if (/\$1b|billion|trillion|million|funding|open interest/i.test(clean)) depth += 4;
  if (/federal interest|fed.*decision|cycle|mean reversion/i.test(clean)) depth += 2;
  const paras = clean.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  if (paras >= 3) depth += 2;
  depth = Math.min(20, Math.max(5, depth));

  let relevance = 8;
  if (/\$btc|bitcoin|\$sol|solana/i.test(clean)) relevance += 4;
  if (/support|resistance|pullback|momentum/i.test(clean)) relevance += 5;
  if (/today|this morning|session|4-hour|daily/i.test(clean)) relevance += 3;
  if (/#?[A-Z0-9]{2,10}USDT|trade setup|tp1/i.test(clean)) relevance += 3;
  relevance = Math.min(20, Math.max(6, relevance));

  let cred = 7;
  if (/support|floor|shelf|invalidation|stop-loss/i.test(clean)) cred += 4;
  if (/target|resistance|retest|tp1/i.test(clean)) cred += 3;
  if (/cautious|patient|confirmation|risk|execution/i.test(clean)) cred += 4;
  if (/setup|asymmetric|orderflow/i.test(clean)) cred += 2;
  if (/profit/i.test(clean)) cred += 3;
  cred = Math.min(20, Math.max(5, cred));

  let pres = 6;
  if (clean.includes('\n\n')) pres += 3;
  if (/[,.;!?]/.test(clean)) pres += 3;
  if (clean.includes('•') || clean.includes('-')) pres += 3;
  if (clean.includes('⚡') || clean.includes('#')) pres += 2;
  const words = (clean.match(/\b\w+\b/g) || []).length;
  if (words >= 70 && words <= 270) pres += 3;
  pres = Math.min(20, Math.max(8, pres));

  return originality + depth + relevance + cred + pres;
}

function updateBenchmarkDisplay(data) {
  const container = document.getElementById('benchmarkResultContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="benchmark-grid">
      <div class="bench-col js-card">
        <div class="bench-tag">JavaScript JIT Engine</div>
        <div class="bench-metric"><strong>${data.jsAvg} ms</strong> <span class="bench-sub">/ audit</span></div>
        <div class="bench-detail">${data.iterations} loops in ${data.jsTotal} ms</div>
        <div class="bench-feature">⚠️ Dynamic regex & Garbage Collection pauses</div>
      </div>
      <div class="bench-col wasm-card">
        <div class="bench-tag wasm">Rust WebAssembly (WASM)</div>
        <div class="bench-metric wasm"><strong>${data.rustAvg} ms</strong> <span class="bench-sub">/ audit</span></div>
        <div class="bench-detail">${data.iterations} loops in ${data.rustTotal} ms</div>
        <div class="bench-feature wasm">⚡ Zero-GC • ${data.speedup} • Sub-millisecond</div>
      </div>
    </div>
    <div class="benchmark-footer-stat">
      <span>🎯 <strong>Score Parity:</strong> ${data.scoreMatch}</span>
      <span>📊 <strong>Rust Burstiness σ:</strong> ${data.burstiness} (Sentence variance & anti-AI proof)</span>
    </div>
  `;
}

// ================================================================================
// Application Bootstrapping & Service Worker Registration
// ================================================================================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('EdgeFlow PWA Service Worker Active:', reg.scope))
      .catch((err) => console.log('SW registration error:', err));
  }
}

// Start app
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  registerServiceWorker();
});
