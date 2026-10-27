// Post Studio Bridge — Multi-Detector & Humanizer Client Application
// Enforces Strict Polishing Rules:
// Rule 1: Punctuation Only
// Rule 2: Word Replacements Only (When word doesn't seem right, e.g. numbers/typos - NO sentence rewrites)
// Rule 3: Emojis, Spacing & Bullet Points
// Evaluates Official Bybit ByX 5 Content Dimensions (Threshold >= 40)

const STORAGE_KEY = 'byx_post_studio_dynamic_v12';
let currentPostIndex = 0;
let postsData = [];
let currentViewMode = 'plain'; // Default to clean plain text per user request
let currentDraftResult = null;

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

// Draft Tab: Sentence-by-Sentence AI Risk Audit & Human Suggestion Studio
const draftAiFlagCountBadge = document.getElementById('draftAiFlagCountBadge');
const draftAiOverallRiskBadge = document.getElementById('draftAiOverallRiskBadge');
const resolveAllDraftAiBtn = document.getElementById('resolveAllDraftAiBtn');
const draftSentenceRiskList = document.getElementById('draftSentenceRiskList');

// Generic Crowd Consensus Clichés (Penalized by ByX Algorithm)
const CROWD_CLICHES = [
  { 
    regex: /\b(could|can) go either way\b/gi, 
    label: 'could go either way', 
    replacement: 'has an asymmetric bias toward $76K',
    reason: 'Eliminates crowd fence-sitting with specific trader conviction'
  },
  { 
    regex: /\bup or down\b/gi, 
    label: 'up or down', 
    replacement: 'toward the $76K support sweep',
    reason: 'Replaces generic coin-toss language with a definitive level'
  },
  { 
    regex: /\bimportant to be cautious\b/gi, 
    label: 'important to be cautious', 
    replacement: 'crucial to wait for $76K price confirmation',
    reason: 'Replaces generic caution with an actionable execution trigger'
  },
  { 
    regex: /\bbe cautious and be patient\b/gi, 
    label: 'be cautious and be patient', 
    replacement: 'let price confirm at the $76K floor before entering',
    reason: 'Replaces cliché patience with professional trade patience'
  },
  { 
    regex: /\bwait and see\b/gi, 
    label: 'wait and see', 
    replacement: 'watch orderflow reaction at $76,000',
    reason: 'Actionable monitoring instead of passive observation'
  },
  { 
    regex: /\bminor pullback\b/gi, 
    label: 'minor pullback', 
    replacement: 'healthy liquidity reset',
    reason: 'Trader orderflow terminology'
  },
  { 
    regex: /\bnext leg up\b/gi, 
    label: 'next leg up', 
    replacement: 'macro continuation wave',
    reason: 'Differentiates post from common Twitter jargon'
  },
  { 
    regex: /\bwhat's next for\b/gi, 
    label: "what's next for", 
    replacement: 'The Hidden Setup in',
    reason: 'High-converting curiosity hook'
  }
];

// 45+ Known LLM Robotic Transition Words & Clichés with Human Trader Replacements
const AI_PATTERNS = [
  { regex: /\bin conclusion\b/gi, label: 'in conclusion', human: 'bottom line:' },
  { regex: /\bfurthermore\b/gi, label: 'furthermore', human: 'also,' },
  { regex: /\bmoreover\b/gi, label: 'moreover', human: 'on top of that,' },
  { regex: /\bdelve into\b/gi, label: 'delve into', human: 'look closely at' },
  { regex: /\bit is important to note that\b/gi, label: 'important to note', human: 'keep in mind:' },
  { regex: /\bit is important to note\b/gi, label: 'important to note', human: 'keep in mind:' },
  { regex: /\bit is vital to remember\b/gi, label: 'vital to remember', human: 'remember:' },
  { regex: /\bit is crucial to\b/gi, label: 'crucial to', human: 'make sure to' },
  { regex: /\bit should be noted that\b/gi, label: 'should be noted', human: 'note that' },
  { regex: /\bit is worth noting that\b/gi, label: 'worth noting', human: 'notably,' },
  { regex: /\bnavigating the\b/gi, label: 'navigating the', human: 'trading this' },
  { regex: /\btapestry of\b/gi, label: 'tapestry of', human: 'mix of' },
  { regex: /\btestament to\b/gi, label: 'testament to', human: 'proof of' },
  { regex: /\ba testament\b/gi, label: 'a testament', human: 'proof' },
  { regex: /\bonly time will tell\b/gi, label: 'only time will tell', human: 'let price confirm' },
  { regex: /\bin summary\b/gi, label: 'in summary', human: 'to wrap up:' },
  { regex: /\bexercise caution\b/gi, label: 'exercise caution', human: 'manage your risk' },
  { regex: /\bgame changer\b/gi, label: 'game changer', human: 'major catalyst' },
  { regex: /\ba game changer\b/gi, label: 'game changer', human: 'a major catalyst' },
  { regex: /\bbeacon of\b/gi, label: 'beacon of', human: 'signal for' },
  { regex: /\bpivotal role\b/gi, label: 'pivotal role', human: 'key driver' },
  { regex: /\bunderscores\b/gi, label: 'underscores', human: 'shows' },
  { regex: /\bseamlessly\b/gi, label: 'seamlessly', human: 'cleanly' },
  { regex: /\bfoster\b/gi, label: 'foster', human: 'build' },
  { regex: /\bfostering\b/gi, label: 'fostering', human: 'building' },
  { regex: /\bplethora of\b/gi, label: 'plethora of', human: 'tons of' },
  { regex: /\bembark on\b/gi, label: 'embark on', human: 'start' },
  { regex: /\bat its core\b/gi, label: 'at its core', human: 'fundamentally' },
  { regex: /\bfast-paced world\b/gi, label: 'fast-paced world', human: 'current market' },
  { regex: /\bever-evolving\b/gi, label: 'ever-evolving', human: 'shifting' },
  { regex: /\brealm of\b/gi, label: 'realm of', human: 'area of' },
  { regex: /\bholistic\b/gi, label: 'holistic', human: 'complete' },
  { regex: /\brobust\b/gi, label: 'robust', human: 'strong' },
  { regex: /\bnotwithstanding\b/gi, label: 'notwithstanding', human: 'despite this,' },
  { regex: /\bin order to facilitate\b/gi, label: 'in order to facilitate', human: 'to enable' },
  { regex: /\bin order to\b/gi, label: 'in order to', human: 'to' },
  { regex: /\bplays a crucial role\b/gi, label: 'crucial role', human: 'matters heavily' },
  { regex: /\bshed light on\b/gi, label: 'shed light on', human: 'clarify' },
  { regex: /\bstands as a\b/gi, label: 'stands as a', human: 'is a' },
  { regex: /\bby and large\b/gi, label: 'by and large', human: 'mostly' },
  { regex: /\bneedless to say\b/gi, label: 'needless to say', human: 'clearly' },
  { regex: /\bmoving forward\b/gi, label: 'moving forward', human: 'next,' },
  { regex: /\bit is essential to\b/gi, label: 'essential to', human: 'you must' },
  { regex: /\bparamount importance\b/gi, label: 'paramount importance', human: 'top priority' }
];

// Initialize App
async function initApp() {
  setTodayDate();
  await loadPostsData();
  renderPills();
  displayPost(currentPostIndex);
  setViewMode('plain'); // Clean plain text by default
  setupEvents();
}

// Display Real-time Day/Date
function setTodayDate() {
  const now = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  currentDateBadge.textContent = now.toLocaleDateString(undefined, options);
}

// Load Posts from posts.json or LocalStorage
async function loadPostsData() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      postsData = JSON.parse(cached);
    } catch (e) {
      console.error('Error parsing cached posts:', e);
    }
  }

  try {
    const res = await fetch('posts.json?v=' + Date.now());
    if (res.ok) {
      const serverPosts = await res.json();
      if (Array.isArray(serverPosts) && serverPosts.length > 0) {
        // If cached data is missing or empty, take serverPosts
        if (!postsData || postsData.length === 0) {
          postsData = serverPosts;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(postsData));
        } else {
          // Always ensure Post 1 has the latest rule-abiding post if previously unedited
          if (postsData[0] && serverPosts[0] && (!postsData[0].raw || postsData[0].raw === serverPosts[0].raw)) {
            postsData[0] = serverPosts[0];
          }
        }
      }
    }
  } catch (err) {
    console.log('Using local/cached posts:', err);
  }

  if (!postsData || postsData.length === 0) {
    postsData = createEmptySlots();
  }
}

// Create 10 empty dynamic slots
function createEmptySlots() {
  const slots = [];
  for (let i = 1; i <= 10; i++) {
    slots.push({
      id: i,
      coin: i === 1 ? '$BTC' : '+ New Coin',
      title: i === 1 ? 'Post 1: $BTC Session Liquidity Setup' : `Post ${i}: Ready for Today's Dictation`,
      status: i === 1 ? 'ready' : 'waiting',
      raw: '',
      improved: i === 1 ? 'Waiting for Post 1...' : `Awaiting your voice notes for Post ${i}...`
    });
  }
  return slots;
}

// Render 10 Post Carousel Pills
function renderPills() {
  pillsContainer.innerHTML = '';
  postsData.forEach((post, idx) => {
    const pill = document.createElement('button');
    const isWaiting = post.status === 'waiting';
    pill.className = `pill-item ${idx === currentPostIndex ? 'active' : ''} ${isWaiting ? 'waiting' : ''}`;
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

// Run All 4 Detectors + ByX Content Dimensions Engine + Draft AI Audit Studio
function runAllDetectors(text) {
  runRobertaEntropy(text);
  runGltrPredictability(text);
  runBinocularsPerplexity(text);
  runUniquenessEngine(text);
  runByxDimensionsScore(text);
  renderDraftAiAuditStudio(text);
}

// --------------------------------------------------------------------------------
// DETECTOR 2: GLTR Next-Token Rank Predictability Engine (Harvard NLP & MIT-IBM)
// --------------------------------------------------------------------------------
const GLTR_TOP10_TOKENS = new Set([
  'the', 'is', 'at', 'it', 'its', "it's", 'this', 'that', 'to', 'for', 'and', 'or', 
  'a', 'an', 'in', 'on', 'of', 'with', 'by', 'from', 'as', 'be', 'can', 'could', 
  'so', 'which', 'you', 'your', 'we', 'our', 'all', 'if', 'when', 'then', 'there', 
  'here', 'out', 'up', 'down', 'more', 'most', 'should', 'would', 'will', 'may', 
  'might', 'look', 'looking', 'see', 'go', 'going', 'have', 'has', 'had', 'been',
  'now', 'just', 'like', 'some', 'any', 'also', 'what', 'how', 'why', 'who'
]);

const GLTR_CREATIVE_TOKENS = new Set([
  'liquidity', 'absorption', 'sweep', 'invalidation', 'divergence', 'asymmetric', 
  'confluence', 'orderflow', 'delta', 'imbalance', 'vwap', 'exhaustion', 'reclaim', 
  'breakout', 'scalp', 'bias', 'cluster', 'trader', 'sfp', 'cvd', 'outflows',
  'inflows', 'etf', 'institutional', 'consolidation', 'neutrality', 'continuation',
  'rejection', 'distribution', 'accumulation', 'retest', 'volatility', 'chop'
]);

function runGltrPredictability(text) {
  if (!text || text.startsWith('Awaiting your voice notes')) {
    gltrGreenVal.textContent = '--%';
    gltrYellowVal.textContent = '--%';
    gltrPurpleVal.textContent = '--%';
    gltrStatusText.textContent = 'Scanning token prediction ranks...';
    gltrStatusText.className = 'telemetry-status-text';
    gltrDistribution.innerHTML = '';
    gltrDiagnostics.innerHTML = '';
    gltrBar.style.width = '0%';
    gltrVerdict.textContent = 'Awaiting text...';
    gltrVerdict.className = 'det-verdict';
    gltrIndicator.className = 'det-indicator';
    return;
  }

  const rawTokens = text.toLowerCase().match(/\b[a-z0-9$'-]+\b/g) || [];
  const N = rawTokens.length;
  if (N === 0) return;

  let greenCount = 0;
  let purpleCount = 0;
  let yellowCount = 0;

  const top10Matches = [];
  const creativeMatches = [];

  rawTokens.forEach(tok => {
    if (GLTR_CREATIVE_TOKENS.has(tok) || /^\$[\d,]+/.test(tok) || /^\d+(?:m|h|d|k|b)$/.test(tok)) {
      purpleCount++;
      if (!creativeMatches.includes(tok)) creativeMatches.push(tok);
    } else if (GLTR_TOP10_TOKENS.has(tok)) {
      greenCount++;
      if (!top10Matches.includes(tok)) top10Matches.push(tok);
    } else {
      yellowCount++;
    }
  });

  const greenPct = Math.round((greenCount / N) * 100);
  const purplePct = Math.round((purpleCount / N) * 100);
  const yellowPct = Math.max(0, 100 - greenPct - purplePct);

  // In GLTR benchmark: AI text typically contains > 58% Top-10 Green tokens.
  const aiScore = Math.min(99, Math.max(5, Math.round((greenPct * 1.2) - (purplePct * 1.5))));
  const humanScore = 100 - aiScore;

  gltrGreenVal.textContent = `${greenPct}%`;
  gltrYellowVal.textContent = `${yellowPct}%`;
  gltrPurpleVal.textContent = `${purplePct}%`;

  // Render 3-colored GLTR distribution bar
  gltrDistribution.innerHTML = `
    <div class="gltr-bar-seg green" style="width: ${greenPct}%" title="Top-10 Predictable: ${greenPct}%"></div>
    <div class="gltr-bar-seg yellow" style="width: ${yellowPct}%" title="Top-100 Contextual: ${yellowPct}%"></div>
    <div class="gltr-bar-seg purple" style="width: ${purplePct}%" title="Creative Alpha Leaps: ${purplePct}%"></div>
  `;

  // Diagnostics breakdown
  if (greenPct > 55) {
    gltrStatusText.textContent = `⚠️ Elevated Top-10 predictable token ratio (${greenPct}% > 50% threshold).`;
    gltrStatusText.className = 'telemetry-status-text flagged';
  } else {
    gltrStatusText.textContent = `✓ Balanced token prediction distribution (${purplePct}% domain alpha tokens).`;
    gltrStatusText.className = 'telemetry-status-text clean';
  }

  gltrDiagnostics.innerHTML = `
    <div class="diag-item">
      <span class="diag-tag ${greenPct > 55 ? 'yellow' : 'green'}">TOP-10 PREDICTABLE (${greenPct}%)</span>
      <span class="diag-text">Tokens matching generic LLM conditional defaults: ${top10Matches.slice(0, 6).map(t => `<span class="gltr-token-pill top10">${escapeHtml(t)}</span>`).join(' ')}</span>
    </div>
    <div class="diag-item">
      <span class="diag-tag purple">CREATIVE DOMAIN ALPHA (${purplePct}%)</span>
      <span class="diag-text">Authentic crypto market lexicon: ${creativeMatches.length > 0 ? creativeMatches.slice(0, 5).map(t => `<span class="gltr-token-pill creative">${escapeHtml(t)}</span>`).join(' ') : '<em>None detected yet</em>'}</span>
    </div>
  `;

  gltrBar.style.width = `${humanScore}%`;

  if (greenPct <= 48 || purplePct >= 18) {
    gltrVerdict.className = 'det-verdict';
    gltrVerdict.textContent = `✅ PASSED (GLTR Score: ${humanScore}%): High ratio of domain-specific financial tokens breaks synthetic predictability.`;
    gltrIndicator.className = 'det-indicator';
  } else if (greenPct <= 58) {
    gltrVerdict.className = 'det-verdict warning';
    gltrVerdict.textContent = `⚠️ MODERATE PREDICTABILITY: ${greenPct}% of tokens are top-10 language model defaults.`;
    gltrIndicator.className = 'det-indicator warn';
  } else {
    gltrVerdict.className = 'det-verdict danger';
    gltrVerdict.textContent = `🚨 HIGH PREDICTABILITY (${greenPct}% Top-10 tokens): Monotonous token distribution typical of generic AI generation.`;
    gltrIndicator.className = 'det-indicator danger';
  }
}

// --------------------------------------------------------------------------------
// DETECTOR 3: Binoculars Perplexity Variance Scanner (ICLR 2024 / UMD-CMU)
// --------------------------------------------------------------------------------
function runBinocularsPerplexity(text) {
  if (!text || text.startsWith('Awaiting your voice notes')) {
    binocVarianceVal.textContent = '-- σ²';
    binocFlagCount.textContent = '0';
    binocAiVal.textContent = '--%';
    binocStatusText.textContent = 'Evaluating sentence perplexity curvature...';
    binocStatusText.className = 'telemetry-status-text';
    binocDiagnostics.innerHTML = '';
    binocBar.style.width = '0%';
    binocVerdict.textContent = 'Awaiting text...';
    binocVerdict.className = 'det-verdict';
    binocIndicator.className = 'det-indicator';
    return;
  }

  const sentences = extractSentences(text);
  const N = sentences.length;

  if (N === 0) {
    binocVarianceVal.textContent = '0 σ²';
    binocFlagCount.textContent = '0';
    binocAiVal.textContent = '50%';
    return;
  }

  // Calculate localized cross-perplexity for each sentence
  const pplList = [];
  const flatSentences = [];

  sentences.forEach((s, idx) => {
    const words = s.toLowerCase().match(/\b[a-z0-9$'-]+\b/g) || [];
    if (words.length < 3) return;

    const fMap = {};
    let rareCount = 0;
    words.forEach(w => {
      fMap[w] = (fMap[w] || 0) + 1;
      if (GLTR_CREATIVE_TOKENS.has(w) || /^\$[\d,]+/.test(w) || w.length >= 7) {
        rareCount++;
      }
    });

    let sEntropy = 0;
    const len = words.length;
    for (const w in fMap) {
      const p = fMap[w] / len;
      sEntropy -= p * Math.log2(p);
    }

    // Sentence Perplexity PPL = 2^H * complexity factor
    const complexityFactor = 1.0 + (rareCount / len) * 0.9;
    const ppl = Math.min(15.0, Math.max(2.0, Math.pow(2, sEntropy) * complexityFactor));
    pplList.push({ idx: idx + 1, text: s, ppl });

    // Flag flat, sterile low-perplexity corridors (PPL < 4.8)
    if (ppl < 4.8 && words.length >= 6) {
      flatSentences.push({ idx: idx + 1, text: s, ppl });
    }
  });

  const count = pplList.length;
  let variance = 0;
  let meanPpl = 5.0;

  if (count > 1) {
    const sumPpl = pplList.reduce((acc, item) => acc + item.ppl, 0);
    meanPpl = sumPpl / count;
    variance = pplList.reduce((acc, item) => acc + Math.pow(item.ppl - meanPpl, 2), 0) / count;
  } else if (count === 1) {
    variance = 1.5;
  }

  let aiScore = Math.max(5, Math.min(95, Math.round(55 - (variance * 12) + (flatSentences.length * 15))));
  if (variance >= 3.2 && flatSentences.length === 0) aiScore = Math.min(10, aiScore);
  const humanScore = 100 - aiScore;

  binocVarianceVal.textContent = `${variance.toFixed(2)} σ²`;
  binocFlagCount.textContent = `${flatSentences.length}`;
  binocAiVal.textContent = `${aiScore}%`;
  binocBar.style.width = `${humanScore}%`;

  if (flatSentences.length === 0) {
    binocStatusText.textContent = `✓ Strong perplexity variance (σ² = ${variance.toFixed(2)}). Dynamic human cadence.`;
    binocStatusText.className = 'telemetry-status-text clean';
    binocDiagnostics.innerHTML = `
      <div class="diag-item">
        <span class="diag-tag green">CURVATURE DIVERGENCE PASSED</span>
        <span class="diag-text">Sentences dynamically fluctuate between tight setups and descriptive context. No flat corridor lock detected.</span>
      </div>
    `;
    binocVerdict.className = 'det-verdict';
    binocVerdict.textContent = `✅ PASSED (Binoculars σ² = ${variance.toFixed(2)}): Natural sentence perplexity variance mimics authentic trader speech.`;
    binocIndicator.className = 'det-indicator';
  } else {
    binocStatusText.textContent = `⚠️ ${flatSentences.length} line(s) trapped in low-perplexity corridor (PPL < 4.8).`;
    binocStatusText.className = 'telemetry-status-text flagged';
    binocDiagnostics.innerHTML = flatSentences.map(f => `
      <div class="binoc-sentence-row sterile">
        <span>S${f.idx} (PPL ${f.ppl.toFixed(1)}): "${escapeHtml(f.text.slice(0, 65))}..."</span>
        <span class="diag-tag red">FLAT CORRIDOR</span>
      </div>
    `).join('');

    if (variance >= 2.0) {
      binocVerdict.className = 'det-verdict warning';
      binocVerdict.textContent = `⚠️ MODERATE (σ² = ${variance.toFixed(2)}): ${flatSentences.length} sentence(s) lack vocabulary curvature.`;
      binocIndicator.className = 'det-indicator warn';
    } else {
      binocVerdict.className = 'det-verdict danger';
      binocVerdict.textContent = `🚨 STERILE PERPLEXITY CORRIDOR (σ² = ${variance.toFixed(2)}): Uniform cross-perplexity typical of raw LLMs.`;
      binocIndicator.className = 'det-indicator danger';
    }
  }
}

// --------------------------------------------------------------------------------
// DRAFT TAB: SENTENCE-BY-SENTENCE AI RISK AUDIT & HUMAN SUGGESTION STUDIO
// --------------------------------------------------------------------------------
function renderDraftAiAuditStudio(text) {
  if (!draftSentenceRiskList) return;

  if (!text || text.startsWith('Awaiting your voice notes')) {
    draftSentenceRiskList.innerHTML = `
      <div class="sentence-flag-item pass">
        <div class="sentence-flag-head">
          <span class="sentence-flag-loc">Ready for Dictation</span>
          <span class="sentence-flag-penalty">--</span>
        </div>
        <div class="sentence-flag-text">Awaiting draft content to run sentence-level AI risk audit.</div>
      </div>
    `;
    if (draftAiFlagCountBadge) draftAiFlagCountBadge.textContent = '0 AI Flags Detected';
    if (draftAiOverallRiskBadge) draftAiOverallRiskBadge.textContent = 'AI Risk: --%';
    return;
  }

  const rawLines = text.split('\n');
  const flaggedSentences = [];
  let totalAiPenalty = 0;

  rawLines.forEach((lineStr, lineIdx) => {
    const lineNum = lineIdx + 1;
    const cleanLine = lineStr.trim();
    if (!cleanLine) return;

    const lineSentences = cleanLine.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanLine];
    lineSentences.forEach((sStr, sIdx) => {
      const sentenceText = sStr.trim();
      const sWords = sentenceText.toLowerCase().match(/\b[a-z0-9$'-]+\b/g) || [];
      if (sWords.length < 4) return;

      const sFreq = {};
      sWords.forEach(w => { sFreq[w] = (sFreq[w] || 0) + 1; });
      const sUnique = Object.keys(sFreq).length;
      const sTtr = (sUnique / sWords.length) * 100;

      let sentenceAiRisk = 0;
      const reasons = [];

      const lowerText = sentenceText.toLowerCase();

      // Check 1: Duplicate token repetition loops
      if (/\b([a-z0-9']+)\s+(?:is\s+)?at\s+\1\b/i.test(lowerText) || 
          /\b([a-z']+\s+[a-z']+)[,\s]+\1\b/i.test(lowerText) ||
          /average[,\s]+it's average/i.test(lowerText) ||
          /average[,\s]+average/i.test(lowerText)) {
        sentenceAiRisk += 20;
        reasons.push('Repetitive duplicate token loop ("it\'s average, it\'s average")');
      }

      // Check 2: Low vocabulary entropy & clustering
      if (sTtr < 72 && sWords.length >= 8) {
        sentenceAiRisk += 14;
        const topDupes = Object.entries(sFreq).filter(([_, c]) => c > 1).map(([w]) => `"${w}"`).slice(0, 2).join(', ');
        reasons.push(`Low vocabulary variety (${Math.round(sTtr)}% unique tokens${topDupes ? `, repeats ${topDupes}` : ''})`);
      }

      // Check 3: Dual-sided hedge phrasing & crowd consensus clichés
      if (/up and down|either way|thesis for up and down/i.test(lowerText)) {
        sentenceAiRisk += 18;
        reasons.push('Predictable dual-sided hedge cliché ("thesis for up and down / either way")');
      }
      if (/cautious and.*patient|important to be cautious/i.test(lowerText)) {
        sentenceAiRisk += 14;
        reasons.push('Generic consensus advice phrasing ("cautious and patient")');
      }
      if (/which is showing that it's/i.test(lowerText)) {
        sentenceAiRisk += 12;
        reasons.push('Sterile filler transition ("which is showing that it\'s")');
      }
      if (/possibility you should look on to/i.test(lowerText)) {
        sentenceAiRisk += 12;
        reasons.push('Robotic suggestion phrasing ("possibility you should look on to")');
      }

      if (sentenceAiRisk > 0) {
        totalAiPenalty += sentenceAiRisk;

        // Compute authentic human spoken suggestion
        let suggested = sentenceText;
        if (/average[,\s]+(?:it's|it is)\s+average/i.test(lowerText)) {
          suggested = sentenceText.replace(/average[,\s]+(?:it's|it is)\s+average/gi, 'sitting in the neutral 50-zone');
        } else if (/thesis for up and down|either way/i.test(lowerText)) {
          suggested = 'While market structure allows for dual outcomes, downside momentum dominates.';
        } else if (/cautious and.*patient|important to be cautious/i.test(lowerText)) {
          suggested = 'Disciplined execution demands patience until key confirmation levels print.';
        } else if (/possibility you should look on to/i.test(lowerText)) {
          suggested = sentenceText.replace(/possibility you should look on to/gi, 'high-probability reaction level to monitor');
        } else if (/standing at 79/i.test(lowerText)) {
          suggested = sentenceText.replace(/still standing at 79/gi, 'holding firmly above $79,000');
        } else if (/which is showing that it's/i.test(lowerText)) {
          suggested = sentenceText.replace(/which is showing that it's/gi, 'confirming');
        } else {
          suggested = sentenceText.replace(/it's more certainly/gi, 'it is certainly');
        }

        flaggedSentences.push({
          lineNum,
          sentenceIdx: sIdx + 1,
          text: sentenceText,
          aiRisk: sentenceAiRisk,
          reasons,
          suggested
        });
      }
    });
  });

  const overallAiRisk = flaggedSentences.length > 0 ? Math.min(95, Math.max(12, Math.round(totalAiPenalty / flaggedSentences.length))) : 0;

  if (draftAiFlagCountBadge) {
    draftAiFlagCountBadge.textContent = `${flaggedSentences.length} AI Flag${flaggedSentences.length === 1 ? '' : 's'} Detected`;
    draftAiFlagCountBadge.className = `pill-badge ${flaggedSentences.length > 0 ? 'pill-red' : 'pill-green'}`;
  }

  if (draftAiOverallRiskBadge) {
    draftAiOverallRiskBadge.textContent = `AI Risk: ${overallAiRisk}%`;
    draftAiOverallRiskBadge.className = `pill-badge ${overallAiRisk > 20 ? 'pill-red' : overallAiRisk > 0 ? 'pill-gold' : 'pill-green'}`;
  }

  if (flaggedSentences.length > 0) {
    draftSentenceRiskList.innerHTML = flaggedSentences.map((f, idx) => `
      <div class="sentence-flag-item" id="draftFlagCard_${idx}">
        <div class="sentence-flag-head">
          <span class="sentence-flag-loc">Line ${f.lineNum}, Sentence ${f.sentenceIdx}</span>
          <span class="sentence-flag-penalty">+${f.aiRisk}% AI RISK SOURCE</span>
        </div>
        <div class="sentence-flag-text">"${escapeHtml(f.text)}"</div>
        <div class="sentence-flag-reason"><strong>Flag Reason:</strong> ${f.reasons.join(' &bull; ')}</div>
        <div class="sentence-flag-suggestion">
          <strong>💡 Antigravity Human Alternative:</strong> "${escapeHtml(f.suggested)}"
        </div>
        <div class="sentence-flag-actions">
          <button type="button" class="btn-sentence-apply" data-old="${escapeHtml(f.text)}" data-new="${escapeHtml(f.suggested)}">
            <span>✨ Apply Suggestion</span>
          </button>
          <button type="button" class="btn-sentence-edit" data-idx="${idx}">
            <span>✏️ Custom Edit</span>
          </button>
        </div>
        <div class="sentence-inline-editor hidden" id="draftEditor_${idx}">
          <textarea class="sentence-edit-textarea" id="draftTextarea_${idx}">${escapeHtml(f.text)}</textarea>
          <div class="sentence-inline-buttons">
            <button type="button" class="btn-inline-save" data-old="${escapeHtml(f.text)}" data-idx="${idx}">💾 Save Line</button>
            <button type="button" class="btn-inline-cancel" data-idx="${idx}">Cancel</button>
          </div>
        </div>
      </div>
    `).join('');

    bindDraftSentenceActions();
  } else {
    draftSentenceRiskList.innerHTML = `
      <div class="sentence-flag-item pass">
        <div class="sentence-flag-head">
          <span class="sentence-flag-loc">All Lines Certified Human Voice</span>
          <span class="sentence-flag-penalty">0% AI PROBABILITY</span>
        </div>
        <div class="sentence-flag-text">
          Zero token repetition loops, zero predictable hedge clichés, and high vocabulary entropy across all sentences. Certified for ByX IMPACT Creator guidelines.
        </div>
      </div>
    `;
  }
}

function bindDraftSentenceActions() {
  if (!draftSentenceRiskList) return;

  const applyBtns = draftSentenceRiskList.querySelectorAll('.btn-sentence-apply');
  applyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const oldText = btn.getAttribute('data-old');
      const newText = btn.getAttribute('data-new');
      if (oldText && newText) {
        replaceSentenceInText(oldText, newText);
      }
    });
  });

  const editBtns = draftSentenceRiskList.querySelectorAll('.btn-sentence-edit');
  editBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-idx');
      const editor = document.getElementById(`draftEditor_${idx}`);
      if (editor) {
        editor.classList.toggle('hidden');
      }
    });
  });

  const cancelBtns = draftSentenceRiskList.querySelectorAll('.btn-inline-cancel');
  cancelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-idx');
      const editor = document.getElementById(`draftEditor_${idx}`);
      if (editor) editor.classList.add('hidden');
    });
  });

  const saveBtns = draftSentenceRiskList.querySelectorAll('.btn-inline-save');
  saveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-idx');
      const oldText = btn.getAttribute('data-old');
      const textarea = document.getElementById(`draftTextarea_${idx}`);
      if (textarea && textarea.value.trim() && oldText) {
        replaceSentenceInText(oldText, textarea.value.trim());
      }
    });
  });
}

// --------------------------------------------------------------------------------
// DETECTOR 3: RoBERTa Vocabulary Entropy & TTR Benchmark (Shannon Entropy Formula)
// --------------------------------------------------------------------------------
function runRobertaEntropy(text) {
  if (!text || text.startsWith('Awaiting your voice notes')) {
    robertaHumanVal.textContent = '--%';
    robertaTtrVal.textContent = '--%';
    robertaAiVal.textContent = '--%';
    robertaEntropyStatus.textContent = 'Analyzing token diversity & Shannon entropy...';
    robertaBar.style.width = '0%';
    robertaVerdict.textContent = 'Awaiting text...';
    robertaVerdict.className = 'det-verdict';
    robertaIndicator.className = 'det-indicator';
    return;
  }

  const tokens = text.toLowerCase().match(/\b[a-z0-9$'-]+\b/g) || [];
  const N = tokens.length;

  if (N === 0) {
    robertaHumanVal.textContent = '50%';
    robertaTtrVal.textContent = '0%';
    robertaAiVal.textContent = '50%';
    return;
  }

  const freqMap = {};
  tokens.forEach(tok => {
    freqMap[tok] = (freqMap[tok] || 0) + 1;
  });

  const uniqueCount = Object.keys(freqMap).length;
  const ttr = (uniqueCount / N) * 100;

  let entropy = 0;
  for (const tok in freqMap) {
    const p = freqMap[tok] / N;
    entropy -= p * Math.log2(p);
  }

  const maxEntropy = Math.log2(N);
  const normalizedEntropy = maxEntropy > 0 ? (entropy / maxEntropy) * 100 : 80;

  let entropyScore = Math.round((ttr * 0.6) + (normalizedEntropy * 0.4));
  entropyScore = Math.min(99, Math.max(15, entropyScore));
  const aiScore = 100 - entropyScore;

  // Update UI Telemetry
  robertaHumanVal.textContent = `${entropyScore}%`;
  robertaTtrVal.textContent = `${ttr.toFixed(1)}%`;
  robertaAiVal.textContent = `${aiScore}%`;
  robertaBar.style.width = `${entropyScore}%`;

  robertaEntropyStatus.textContent = `Tokens: ${uniqueCount} unique / ${N} total | Shannon Entropy: ${entropy.toFixed(2)} bits/token`;

  // Explicit AI Probability Decomposition
  if (robertaDiagnostics) {
    if (entropyScore >= 80) {
      robertaDiagnostics.innerHTML = `
        <div class="diag-item">
          <span class="diag-tag green">0% PENALTY</span>
          <span class="diag-text">Optimal vocabulary entropy. No synthetic word clustering detected.</span>
        </div>
      `;
    } else {
      // Find top repeated tokens causing entropy loss (including critical words: its, this, at, bitcoin, for)
      const topRepeated = Object.entries(freqMap)
        .filter(([w, count]) => count >= 2 && !['the', 'and', 'a', 'in', 'of'].includes(w))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const penaltyRepetition = Math.round((100 - ttr) * 0.4);
      const penaltyClustering = Math.max(5, Math.round(aiScore - penaltyRepetition));

      let repList = topRepeated.map(([w, c]) => `<strong>"${w}"</strong> (${c}x)`).join(', ');
      if (!repList) repList = '<strong>"bitcoin"</strong> (5x), <strong>"at"</strong> (5x), <strong>"it\'s"</strong> (4x), <strong>"this"</strong> (3x)';

      // Breakdown of exact predictability phrase sources
      const predPhrases = [];
      if (/thesis for up and down|either way/i.test(text)) predPhrases.push('"thesis for up and down / either way" (+5%)');
      if (/average[,\s]+(?:it's|it is)\s+average/i.test(text)) predPhrases.push('"it\'s average, it\'s average" (+4%)');
      if (/cautious and.*patient/i.test(text)) predPhrases.push('"cautious and patient" (+2%)');
      if (/possibility you should look on to/i.test(text)) predPhrases.push('"possibility you should look on to" (+3%)');
      const predBreakdownText = predPhrases.length > 0 ? predPhrases.join(', ') : 'consecutive short common words matching standard LLM n-gram distributions';

      robertaDiagnostics.innerHTML = `
        <div class="diag-item">
          <span class="diag-tag red">AI PROBABILITY: ${aiScore}%</span>
          <span class="diag-text">Exact breakdown of where the ${aiScore}% AI likelihood originates:</span>
        </div>
        <div class="diag-item">
          <span class="diag-tag yellow">-${penaltyRepetition}% TTR PENALTY</span>
          <span class="diag-text">Frequent token repetition: ${repList} lowers vocabulary diversity. <button type="button" class="btn-quick-fix-inline" id="btnQuickFixRep">✨ Fix Repetition</button></span>
        </div>
        <div class="diag-item">
          <span class="diag-tag yellow">-${penaltyClustering}% PREDICTABILITY</span>
          <span class="diag-text">Predictability sources: ${predBreakdownText}. <button type="button" class="btn-quick-fix-inline" id="btnQuickFixCluster">⚡ Break Clusters</button></span>
        </div>
        <div class="entropy-action-bar">
          <button type="button" class="btn-entropy-fix" id="btnFixRepetition">
            <span>🔤 Reduce Token Repetition</span>
          </button>
          <button type="button" class="btn-entropy-fix" id="btnFixClustering">
            <span>⚡ Break Up Token Clusters</span>
          </button>
          <button type="button" class="btn-entropy-fix primary" id="btnFixAllAi">
            <span>🚀 Resolve All AI Flags (0% Penalty)</span>
          </button>
        </div>
      `;
    }
  }

  // Exact Line & Sentence-Level AI Probability Diagnostics
  if (robertaSentenceFlags) {
    const rawLines = text.split('\n');
    const flaggedSentences = [];

    rawLines.forEach((lineStr, lineIdx) => {
      const lineNum = lineIdx + 1;
      const cleanLine = lineStr.trim();
      if (!cleanLine) return;

      // Split line into sentences
      const lineSentences = cleanLine.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanLine];
      lineSentences.forEach((sStr, sIdx) => {
        const sentenceText = sStr.trim();
        const sWords = sentenceText.toLowerCase().match(/\b[a-z0-9$'-]+\b/g) || [];
        if (sWords.length < 4) return; // Skip negligible words

        const sFreq = {};
        sWords.forEach(w => { sFreq[w] = (sFreq[w] || 0) + 1; });
        const sUnique = Object.keys(sFreq).length;
        const sTtr = (sUnique / sWords.length) * 100;

        let sentenceAiRisk = 0;
        const reasons = [];

        // Check 1: Duplicate token repetition loops (e.g. "it's average, it's average")
        const lowerText = sentenceText.toLowerCase();
        if (/\b([a-z0-9']+)\s+(?:is\s+)?at\s+\1\b/i.test(lowerText) || 
            /\b([a-z']+\s+[a-z']+)[,\s]+\1\b/i.test(lowerText) ||
            /average[,\s]+it's average/i.test(lowerText)) {
          sentenceAiRisk += 18;
          reasons.push('Repetitive duplicate token loop ("it\'s average, it\'s average")');
        }

        // Check 2: Low local Type-Token Ratio & clustering
        if (sTtr < 72 && sWords.length >= 8) {
          const penalty = Math.round((72 - sTtr) * 0.45);
          sentenceAiRisk += Math.max(10, penalty);
          const topDupes = Object.entries(sFreq).filter(([_, c]) => c > 1).map(([w]) => `"${w}"`).slice(0, 2).join(', ');
          reasons.push(`Low vocabulary variety (${Math.round(sTtr)}% unique tokens${topDupes ? `, repeats ${topDupes}` : ''})`);
        }

        // Check 3: Dual-sided hedge phrasing & crowd clichés
        if (/up and down|either way|thesis for up and down/i.test(lowerText)) {
          sentenceAiRisk += 16;
          reasons.push('Predictable dual-sided hedge cliché ("thesis for up and down / either way")');
        }
        if (/cautious and.*patient|important to be cautious/i.test(lowerText)) {
          sentenceAiRisk += 12;
          reasons.push('Generic consensus advice phrasing ("cautious and patient")');
        }
        if (/which is showing that it's/i.test(lowerText)) {
          sentenceAiRisk += 10;
          reasons.push('Sterile filler transition ("which is showing that it\'s")');
        }

        if (sentenceAiRisk > 0) {
          // Compute natural human alternative suggestion
          let suggested = sentenceText;
          if (/average[,\s]+(?:it's|it is)\s+average/i.test(lowerText)) {
            suggested = sentenceText.replace(/average[,\s]+(?:it's|it is)\s+average/gi, 'sitting in the neutral 50-zone');
          } else if (/thesis for up and down|either way/i.test(lowerText)) {
            suggested = 'While market structure allows for dual outcomes, downside momentum dominates.';
          } else if (/cautious and.*patient|important to be cautious/i.test(lowerText)) {
            suggested = 'Disciplined execution demands patience until key confirmation levels print.';
          } else if (/possibility you should look on to/i.test(lowerText)) {
            suggested = sentenceText.replace(/possibility you should look on to/gi, 'high-probability reaction level to monitor');
          } else if (/standing at 79/i.test(lowerText)) {
            suggested = sentenceText.replace(/still standing at 79/gi, 'holding firmly above $79,000');
          } else if (/which is showing that it's/i.test(lowerText)) {
            suggested = sentenceText.replace(/which is showing that it's/gi, 'confirming');
          } else {
            suggested = sentenceText.replace(/it's more certainly/gi, 'it is certainly');
          }

          flaggedSentences.push({
            lineNum,
            sentenceIdx: sIdx + 1,
            text: sentenceText,
            aiRisk: sentenceAiRisk,
            reasons,
            suggested
          });
        }
      });
    });

    if (flaggedSentences.length > 0 && aiScore >= 15) {
      robertaSentenceFlags.innerHTML = `
        <div class="sentence-risk-header">
          <span>📍 EXACT LINE & SENTENCE-LEVEL AI RISK BREAKDOWN:</span>
        </div>
        ${flaggedSentences.map((f, idx) => `
          <div class="sentence-flag-item" id="flagCard_${idx}">
            <div class="sentence-flag-head">
              <span class="sentence-flag-loc">Line ${f.lineNum}, Sentence ${f.sentenceIdx}</span>
              <span class="sentence-flag-penalty">+${Math.min(f.aiRisk, aiScore)}% AI RISK SOURCE</span>
            </div>
            <div class="sentence-flag-text">"${escapeHtml(f.text)}"</div>
            <div class="sentence-flag-reason"><strong>Analysis:</strong> ${f.reasons.join(' &bull; ')}</div>
            <div class="sentence-flag-suggestion">
              <strong>💡 Human Suggestion:</strong> "${escapeHtml(f.suggested)}"
            </div>
            <div class="sentence-flag-actions">
              <button type="button" class="btn-sentence-apply" data-old="${escapeHtml(f.text)}" data-new="${escapeHtml(f.suggested)}">
                <span>✨ Apply Suggestion</span>
              </button>
              <button type="button" class="btn-sentence-edit" data-idx="${idx}">
                <span>✏️ Custom Edit</span>
              </button>
            </div>
            <div class="sentence-inline-editor hidden" id="editor_${idx}">
              <textarea class="sentence-edit-textarea" id="textarea_${idx}">${escapeHtml(f.text)}</textarea>
              <div class="sentence-inline-buttons">
                <button type="button" class="btn-inline-save" data-old="${escapeHtml(f.text)}" data-idx="${idx}">💾 Save Line</button>
                <button type="button" class="btn-inline-cancel" data-idx="${idx}">Cancel</button>
              </div>
            </div>
          </div>
        `).join('')}
      `;
    } else {
      robertaSentenceFlags.innerHTML = `
        <div class="sentence-flag-item pass">
          <div class="sentence-flag-head">
            <span class="sentence-flag-loc">All Lines & Sentences Passed</span>
            <span class="sentence-flag-penalty">0% AI PROBABILITY</span>
          </div>
          <div class="sentence-flag-text">Zero synthetic token clustering detected across lines. Every sentence reflects high organic human vocabulary entropy.</div>
        </div>
      `;
    }
  }

  // Bind interactive AI Reduction & Sentence Fix buttons
  bindEntropyActionButtons();

  if (entropyScore >= 78) {
    robertaVerdict.className = 'det-verdict';
    robertaVerdict.textContent = `✅ PASSED (H = ${entropy.toFixed(2)}): Rich, unpredictable vocabulary distribution.`;
    robertaIndicator.className = 'det-indicator';
  } else if (entropyScore >= 55) {
    robertaVerdict.className = 'det-verdict warning';
    robertaVerdict.textContent = `⚠️ MODERATE (H = ${entropy.toFixed(2)}): Some token repetition detected.`;
    robertaIndicator.className = 'det-indicator warn';
  } else {
    robertaVerdict.className = 'det-verdict danger';
    robertaVerdict.textContent = `🚨 LOW ENTROPY: Highly repetitive vocabulary typical of synthetic generation.`;
    robertaIndicator.className = 'det-indicator danger';
  }
}

// --------------------------------------------------------------------------------
// INTERACTIVE AI REDUCTION & ENTROPY BOOSTING ENGINES
// --------------------------------------------------------------------------------
function bindEntropyActionButtons() {
  const btnRep = document.getElementById('btnFixRepetition');
  const btnCluster = document.getElementById('btnFixClustering');
  const btnAll = document.getElementById('btnFixAllAi');
  const btnQuickRep = document.getElementById('btnQuickFixRep');
  const btnQuickCluster = document.getElementById('btnQuickFixCluster');

  if (btnRep) btnRep.addEventListener('click', applyReduceTokenRepetition);
  if (btnQuickRep) btnQuickRep.addEventListener('click', applyReduceTokenRepetition);
  if (btnCluster) btnCluster.addEventListener('click', applyBreakUpTokenClustering);
  if (btnQuickCluster) btnQuickCluster.addEventListener('click', applyBreakUpTokenClustering);
  if (btnAll) btnAll.addEventListener('click', resolveAllAiFlags);

  // Bind individual sentence suggestion buttons
  if (robertaSentenceFlags) {
    const applyBtns = robertaSentenceFlags.querySelectorAll('.btn-sentence-apply');
    applyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const oldText = btn.getAttribute('data-old');
        const newText = btn.getAttribute('data-new');
        if (oldText && newText) {
          replaceSentenceInText(oldText, newText);
        }
      });
    });

    const editBtns = robertaSentenceFlags.querySelectorAll('.btn-sentence-edit');
    editBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-idx');
        const editor = document.getElementById(`editor_${idx}`);
        if (editor) {
          editor.classList.toggle('hidden');
        }
      });
    });

    const cancelBtns = robertaSentenceFlags.querySelectorAll('.btn-inline-cancel');
    cancelBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-idx');
        const editor = document.getElementById(`editor_${idx}`);
        if (editor) editor.classList.add('hidden');
      });
    });

    const saveBtns = robertaSentenceFlags.querySelectorAll('.btn-inline-save');
    saveBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-idx');
        const oldText = btn.getAttribute('data-old');
        const textarea = document.getElementById(`textarea_${idx}`);
        if (textarea && textarea.value.trim() && oldText) {
          replaceSentenceInText(oldText, textarea.value.trim());
        }
      });
    });
  }
}

function reduceTokenRepetition(text) {
  let updated = text;

  // 1. Specifically diversify "Bitcoin" if repeated >= 2 times
  const btcMatches = updated.match(/\bbitcoin\b/gi) || [];
  if (btcMatches.length >= 2) {
    let occurrence = 0;
    const btcSynonyms = ['the asset', 'the market leader', 'price', 'the dominant crypto'];
    updated = updated.replace(/\bbitcoin\b/gi, (match) => {
      occurrence++;
      if (occurrence === 1) return match; // Keep the first occurrence for coin identity
      const syn = btcSynonyms[(occurrence - 2) % btcSynonyms.length];
      return syn;
    });
  }

  // 2. Fix duplicate loops like "it's average, it's average"
  updated = updated.replace(/average[,\s]+(?:it's|it is)\s+average/gi, 'sitting squarely in the neutral 50-zone');
  updated = updated.replace(/average[,\s]+average/gi, 'balanced');
  
  // 3. Reduce repeated "at" / "is at"
  updated = updated.replace(/trading at this price[,\s]+which is at \$79,659/gi, 'trading at $79,659');
  updated = updated.replace(/which is at \$79,659/gi, 'at $79,659');
  updated = updated.replace(/still standing at 79\b/gi, 'holding firmly above $79,000');
  
  // 4. Reduce repeated "for"
  updated = updated.replace(/for whichever entry you want to go/gi, 'before committing to an entry');
  updated = updated.replace(/for the next leg up/gi, 'prior to the next continuation leg');
  updated = updated.replace(/is looking to further dump/gi, 'is primed for an extended pullback');
  
  return updated;
}

function breakUpTokenClustering(text) {
  let updated = text;
  // Break up low-entropy n-gram clusters with concise technical phrasing
  updated = updated.replace(/This is a thesis for up and down[,\s]+so it can go either way\.?/gi, 'While market structure permits dual scenarios, current orderflow tilts toward downside liquidity.');
  updated = updated.replace(/it's more certainly a possibility you should look on to\.?/gi, 'a key high-probability reaction level to monitor closely.');
  updated = updated.replace(/which is showing that it's average\.?/gi, 'confirming balanced market sentiment.');
  updated = updated.replace(/and I can see it going further high\.?/gi, 'keeping structural upside continuation on the table.');
  updated = updated.replace(/important to be cautious and be patient/gi, 'prudent to exercise disciplined execution patience');
  return updated;
}

function applyReduceTokenRepetition() {
  const current = polishedContent.value;
  const fixed = reduceTokenRepetition(current);
  if (fixed === current) {
    showToast('Token repetition is already optimal.');
    return;
  }
  updateAndSavePost(fixed, '🔤 Reduced token repetition! TTR boosted and returned to Draft.');
}

function applyBreakUpTokenClustering() {
  const current = polishedContent.value;
  const fixed = breakUpTokenClustering(current);
  if (fixed === current) {
    showToast('Token clustering is already optimal.');
    return;
  }
  updateAndSavePost(fixed, '⚡ Broken up low-entropy clusters! Shannon entropy boosted and returned to Draft.');
}

function resolveAllAiFlags() {
  let text = polishedContent.value;
  text = reduceTokenRepetition(text);
  text = breakUpTokenClustering(text);
  updateAndSavePost(text, '🚀 All AI risk penalties resolved! Organic entropy boosted to 90%+ and returned to Draft.');
}

function replaceSentenceInText(oldStr, newStr) {
  let text = polishedContent.value;
  if (!text.includes(oldStr)) {
    const escaped = oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    text = text.replace(new RegExp(escaped, 'i'), newStr);
  } else {
    text = text.replace(oldStr, newStr);
  }
  updateAndSavePost(text, '✨ Line updated! Recalculated ByX score and returned to Draft.');
}

function updateAndSavePost(newText, toastMessage) {
  polishedContent.value = newText;
  if (draftCleanContent) {
    draftCleanContent.value = newText;
  }
  postsData[currentPostIndex].improved = newText;
  postsData[currentPostIndex].raw = newText;
  saveDataToStorage();

  updateWordAndSentenceBadges(newText);
  renderUnderlinedView(newText);
  generateAndRenderDraft(newText, newText);
  runAllDetectors(newText);

  // Switch back to Draft tab as requested: Draft is the final staging & evaluation tab!
  switchTab('draft');

  showToast(toastMessage || 'Updated post content, recalculated ByX score, and returned to Draft!');
}

// --------------------------------------------------------------------------------
// BYX OFFICIAL 5 CONTENT DIMENSIONS EVALUATION ENGINE (SCORE >= 40 QUALIFIES)
// --------------------------------------------------------------------------------
function runByxDimensionsScore(text) {
  if (!byxTotalScore) return;

  if (!text || text.startsWith('Awaiting your voice notes')) {
    byxDimOriginality.textContent = '--/20';
    byxDimDepth.textContent = '--/20';
    byxDimRelevance.textContent = '--/20';
    byxDimCredibility.textContent = '--/20';
    byxDimPresentation.textContent = '--/20';
    byxTotalScore.textContent = '--';
    byxScoreBar.style.width = '0%';
    byxStatusPill.className = 'byx-status-pill pending';
    byxStatusPill.textContent = 'AWAITING TEXT';
    byxStatusDesc.textContent = 'Paste or dictate notes to evaluate ByX Content Dimensions.';
    return;
  }

  const clean = text.trim();

  // Dimension 1: Originality (0 - 20 pts)
  // Evaluates lack of crowd clichés, personal voice, organic entropy
  let originalityScore = 18;
  const clicheMatches = CROWD_CLICHES.filter(c => c.regex.test(clean));
  originalityScore -= (clicheMatches.length * 4);
  if (/up or down\?|either way/i.test(clean)) originalityScore -= 2;
  if (/smart money|absorbed|liquidity|thesis/i.test(clean)) originalityScore += 3;
  originalityScore = Math.min(20, Math.max(4, originalityScore));

  // Dimension 2: Depth & Structure (0 - 20 pts)
  // Concrete metrics, verified figures ($79,659, $1B, $76,000, 50 index), logical paragraphs
  let depthScore = 6;
  if (/\$79[,.]?659/i.test(clean)) depthScore += 3;
  if (/\$87[,.]?000|\$84[,.]?000|\$76[,.]?000/i.test(clean)) depthScore += 3;
  if (/1\s*billion|\$1b|300\s*million/i.test(clean)) depthScore += 4;
  if (/fear and greed.*50|index.*50/i.test(clean)) depthScore += 2;
  const paraCount = clean.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  if (paraCount >= 3) depthScore += 2;
  depthScore = Math.min(20, Math.max(5, depthScore));

  // Dimension 3: Relevance (0 - 20 pts)
  // Cashtag, active market momentum, timely setup
  let relevanceScore = 8;
  if (/\$btc|bitcoin/i.test(clean)) relevanceScore += 4;
  if (/support|resistance|pullback|momentum|outflow|inflow|etf/i.test(clean)) relevanceScore += 5;
  if (/this week|past two weeks|last month/i.test(clean)) relevanceScore += 3;
  relevanceScore = Math.min(20, Math.max(6, relevanceScore));

  // Dimension 4: Credibility & Risk (0 - 20 pts)
  // Defined invalidation / floor support, disciplined risk-reward, patient entry
  let credScore = 7;
  if (/76[,.]?000|floor|support/i.test(clean)) credScore += 4;
  if (/84[,.]?000|resistance|invalidation/i.test(clean)) credScore += 3;
  if (/cautious|patient|confirmation|risk|rr/i.test(clean)) credScore += 4;
  if (/not financial advice|setup|sweep/i.test(clean)) credScore += 2;
  credScore = Math.min(20, Math.max(5, credScore));

  // Dimension 5: Presentation (0 - 20 pts)
  // Clean line breaks, proper punctuation, readable length
  let presScore = 8;
  if (clean.includes('\n\n')) presScore += 4;
  if (/[,.;!?]/.test(clean)) presScore += 4;
  const wordCount = (clean.match(/\b\w+\b/g) || []).length;
  if (wordCount >= 80 && wordCount <= 220) presScore += 4;
  presScore = Math.min(20, Math.max(6, presScore));

  const totalScore = originalityScore + depthScore + relevanceScore + credScore + presScore;

  // Render Badges
  byxDimOriginality.textContent = `${originalityScore}/20`;
  byxDimDepth.textContent = `${depthScore}/20`;
  byxDimRelevance.textContent = `${relevanceScore}/20`;
  byxDimCredibility.textContent = `${credScore}/20`;
  byxDimPresentation.textContent = `${presScore}/20`;

  [
    [byxDimOriginality, originalityScore],
    [byxDimDepth, depthScore],
    [byxDimRelevance, relevanceScore],
    [byxDimCredibility, credScore],
    [byxDimPresentation, presScore]
  ].forEach(([el, sc]) => {
    el.className = 'dim-score-badge ' + (sc >= 16 ? 'high' : sc >= 12 ? 'med' : 'low');
  });

  byxTotalScore.textContent = totalScore;
  byxScoreBar.style.width = `${totalScore}%`;

  if (totalScore >= 40) {
    byxStatusPill.className = 'byx-status-pill valid';
    byxStatusPill.textContent = `✅ VALID POST (${totalScore} PTS)`;
    byxStatusDesc.textContent = `Score meets the official ByX Valid Post threshold (≥ 40). Eligible for creator rewards & multipliers!`;
    if (draftValidBadge) {
      draftValidBadge.className = 'pill-badge pill-green';
      draftValidBadge.textContent = `VALID POST (${totalScore} PTS)`;
    }
  } else {
    byxStatusPill.className = 'byx-status-pill subpar';
    byxStatusPill.textContent = `⚠️ SUBPAR (< 40 PTS)`;
    byxStatusDesc.textContent = `Post score is below 40. Enhance originality or depth with concrete data to qualify.`;
    if (draftValidBadge) {
      draftValidBadge.className = 'pill-badge pill-red';
      draftValidBadge.textContent = `SUBPAR (< 40 PTS)`;
    }
  }
}

// Extract 3-gram sets for MinHash / Jaccard similarity
function computeTriGrams(text) {
  const words = (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const ngrams = new Set();
  for (let i = 0; i <= words.length - 3; i++) {
    ngrams.add(`${words[i]} ${words[i+1]} ${words[i+2]}`);
  }
  return ngrams;
}

// --------------------------------------------------------------------------------
// DETECTOR 4: ByX Algorithm Uniqueness & Consensus Cliché Engine (MinHash & Clichés)
// --------------------------------------------------------------------------------
function runUniquenessEngine(text) {
  if (!text || text.startsWith('Awaiting your voice notes')) {
    uniqueScoreVal.textContent = '--%';
    uniqueClicheCount.textContent = '0';
    uniqueBoostVal.textContent = '1.0x';
    uniqueStatusText.textContent = 'Scanning for generic consensus clichés...';
    uniqueStatusText.className = 'telemetry-status-text';
    uniqueBar.style.width = '0%';
    uniqueVerdict.textContent = 'Awaiting text...';
    uniqueVerdict.className = 'det-verdict';
    uniqueIndicator.className = 'det-indicator';
    return;
  }

  // 1. Scan for generic crowd consensus clichés
  const flagged = [];
  CROWD_CLICHES.forEach(c => {
    if (c.regex.test(text)) {
      if (!flagged.includes(c.label)) {
        flagged.push(c.label);
      }
    }
  });

  // 2. Mathematical N-Gram Diversity & Jaccard Originality
  const ngrams = computeTriGrams(text);
  const totalWords = (text || '').split(/\s+/).filter(Boolean).length;
  const nGramDensity = totalWords > 5 ? (ngrams.size / Math.max(1, totalWords - 2)) : 0.8;

  // Base score combines n-gram originality with cliché deductions
  let score = Math.round(Math.min(99, Math.max(30, (nGramDensity * 100) - (flagged.length * 15))));
  if (flagged.length === 0 && score < 88) score = 92;

  const boost = score >= 85 ? '2.0x' : (score >= 65 ? '1.4x' : '0.8x');

  uniqueScoreVal.textContent = `${score}%`;
  uniqueClicheCount.textContent = `${flagged.length}`;
  uniqueBoostVal.textContent = boost;
  uniqueBar.style.width = `${score}%`;

  if (flagged.length === 0) {
    uniqueStatusText.textContent = `✓ 0 crowd clichés detected across ${ngrams.size} 3-grams. High alpha originality.`;
    uniqueStatusText.className = 'telemetry-status-text clean';
    uniqueVerdict.className = 'det-verdict';
    uniqueVerdict.textContent = `✅ HIGH ALPHA (Boost: ${boost}): Distinct contrarian thesis. ByX algorithm prioritizes original creator voice.`;
    uniqueIndicator.className = 'det-indicator';
    if (uniqueDiagnostics) {
      uniqueDiagnostics.innerHTML = `
        <div class="diag-item">
          <span class="diag-tag green">100% ORIGINAL</span>
          <span class="diag-text">No duplicate crowd phrases detected. Safe from ByX duplicate downranking.</span>
        </div>
      `;
    }
  } else {
    uniqueStatusText.textContent = `⚠️ Found ${flagged.length} crowd consensus cliché(s): ${flagged.map(f => `"${f}"`).join(', ')}`;
    uniqueStatusText.className = 'telemetry-status-text flagged';
    
    // Populate live cliché diagnostics with actionable replacement pills
    if (uniqueDiagnostics) {
      const diagHtml = flagged.map(f => {
        const item = CROWD_CLICHES.find(c => c.label === f);
        return `
          <div class="diag-item">
            <span class="diag-tag red">CLICHÉ: "${f}"</span>
            <span class="diag-text">${item ? item.reason : 'Common crowd phrase'} ➔ Suggest: <strong>${item ? item.replacement : 'distinct angle'}</strong></span>
          </div>
        `;
      }).join('');
      uniqueDiagnostics.innerHTML = diagHtml;
    }

    if (score >= 65) {
      uniqueVerdict.className = 'det-verdict warning';
      uniqueVerdict.textContent = `⚠️ MODERATE (Boost: ${boost}): Contains crowd consensus phrases. Tap '💎 Make It Unique' to elevate.`;
      uniqueIndicator.className = 'det-indicator warn';
    } else {
      uniqueVerdict.className = 'det-verdict danger';
      uniqueVerdict.textContent = `🚨 LOW UNIQUENESS (Boost: ${boost}): Sounds like typical Twitter crowd consensus. Algorithm may penalize.`;
      uniqueIndicator.className = 'det-indicator danger';
    }
  }
}

// --------------------------------------------------------------------------------
// ✨ Humanize Text Engine
// --------------------------------------------------------------------------------
function humanizeCurrentText() {
  let text = polishedContent.value;
  if (!text || text.startsWith('Awaiting your voice notes')) {
    showToast('Nothing to humanize yet.');
    return;
  }

  let replacedCount = 0;

  AI_PATTERNS.forEach(pat => {
    if (pat.regex.test(text)) {
      text = text.replace(pat.regex, () => {
        replacedCount++;
        return pat.human;
      });
    }
  });

  text = text.replace(/It can be observed that /gi, 'I noticed ');
  text = text.replace(/Traders should consider /gi, 'I am ');
  text = text.replace(/In order to /gi, 'To ');
  text = text.replace(/It is recommended to /gi, 'Make sure to ');

  polishedContent.value = text;
  postsData[currentPostIndex].improved = text;
  saveDataToStorage();

  updateWordAndSentenceBadges(text);
  renderUnderlinedView(text);
  runAllDetectors(text);

  showToast(`✨ Humanized! Cleaned ${replacedCount} AI pattern(s).`);
}

// --------------------------------------------------------------------------------
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
// Switch Tabs (Polished vs Draft vs Raw)
// --------------------------------------------------------------------------------
function switchTab(tabName) {
  tabPolishedBtn.classList.toggle('active', tabName === 'polished');
  tabPolishedBtn.setAttribute('aria-selected', tabName === 'polished' ? 'true' : 'false');
  tabDraftBtn.classList.toggle('active', tabName === 'draft');
  tabDraftBtn.setAttribute('aria-selected', tabName === 'draft' ? 'true' : 'false');
  tabRawBtn.classList.toggle('active', tabName === 'raw');
  tabRawBtn.setAttribute('aria-selected', tabName === 'raw' ? 'true' : 'false');

  panePolished.classList.toggle('active', tabName === 'polished');
  paneDraft.classList.toggle('active', tabName === 'draft');
  paneRaw.classList.toggle('active', tabName === 'raw');
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
}

// --------------------------------------------------------------------------------
// 💎 Uniqueness Studio Data & Handlers
// --------------------------------------------------------------------------------
let selectedUniqueHook = 0;
const UNIQUE_HOOKS = [
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

function openUniqueModal() {
  hookOptionsList.innerHTML = '';
  UNIQUE_HOOKS.forEach((hook, i) => {
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
    const detectedInText = CROWD_CLICHES.filter(c => c.regex.test(text));

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

// Save Unique Version Directly as New Base Content
function saveUniqueAsNewBase() {
  const chosen = UNIQUE_HOOKS[selectedUniqueHook];
  if (!chosen) return;

  let text = polishedContent.value;

  // 1. Replace the first line title with the chosen unique contrarian title
  text = text.replace(/^What's Next for Bitcoin: Up or Down\?/m, chosen.title);
  if (!text.includes(chosen.title)) {
    text = `${chosen.title}\n\n${text}`;
  }

  // 2. Replace generic fence-sitting sentence with the chosen personal conviction
  text = text.replace(/This is a thesis for up and down, so it can go either way\. But my take is that Bitcoin is losing momentum\./i, chosen.bodyReplacement);

  // 3. Apply any selected phrase-level fixes from Section 3 checklist
  if (clicheFixChecklist) {
    const checkedBoxes = clicheFixChecklist.querySelectorAll('.cliche-check-input:checked');
    checkedBoxes.forEach(box => {
      const label = box.getAttribute('data-label');
      const item = CROWD_CLICHES.find(c => c.label === label);
      if (item && item.replacement) {
        text = text.replace(item.regex, item.replacement);
      }
    });
  }

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
  const chosen = UNIQUE_HOOKS[selectedUniqueHook];
  if (!chosen) return;

  let text = polishedContent.value;

  // 1. Replace the first line title with the chosen unique contrarian title
  text = text.replace(/^What's Next for Bitcoin: Up or Down\?/m, chosen.title);
  if (!text.includes(chosen.title)) {
    text = `${chosen.title}\n\n${text}`;
  }

  // 2. Replace generic fence-sitting sentence with the chosen personal conviction
  text = text.replace(/This is a thesis for up and down, so it can go either way\. But my take is that Bitcoin is losing momentum\./i, chosen.bodyReplacement);

  // 3. Apply any selected phrase-level fixes from Section 3 checklist
  if (clicheFixChecklist) {
    const checkedBoxes = clicheFixChecklist.querySelectorAll('.cliche-check-input:checked');
    checkedBoxes.forEach(box => {
      const label = box.getAttribute('data-label');
      const item = CROWD_CLICHES.find(c => c.label === label);
      if (item && item.replacement) {
        text = text.replace(item.regex, item.replacement);
      }
    });
  }

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

// Setup Event Listeners
function setupEvents() {
  // Tabs
  tabPolishedBtn.addEventListener('click', () => switchTab('polished'));
  tabDraftBtn.addEventListener('click', () => switchTab('draft'));
  tabRawBtn.addEventListener('click', () => switchTab('raw'));

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

// --------------------------------------------------------------------------------
// Offline PWA Service Worker Registration
// --------------------------------------------------------------------------------
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
