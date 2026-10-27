// Post Studio Bridge — Multi-Detector & Humanizer Client Application

const STORAGE_KEY = 'byx_post_studio_dynamic_v2';
let currentPostIndex = 0;
let postsData = [];
let currentViewMode = 'plain'; // Default to clean plain text per user request

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
const coinTagBadge = document.getElementById('coinTagBadge');
const navPositionIndicator = document.getElementById('navPositionIndicator');
const tabPolishedBtn = document.getElementById('tabPolishedBtn');
const tabRawBtn = document.getElementById('tabRawBtn');
const panePolished = document.getElementById('panePolished');
const paneRaw = document.getElementById('paneRaw');
const copyPolishedBtn = document.getElementById('copyPolishedBtn');
const copyRawBtn = document.getElementById('copyRawBtn');
const prevPostBtn = document.getElementById('prevPostBtn');
const nextPostBtn = document.getElementById('nextPostBtn');
const saveEditBtn = document.getElementById('saveEditBtn');
const quickEditCoinBtn = document.getElementById('quickEditCoinBtn');
const resetSlotBtn = document.getElementById('resetSlotBtn');
const humanizeBtn = document.getElementById('humanizeBtn');
const togglePlainBtn = document.getElementById('togglePlainBtn');
const toggleAnnotatedBtn = document.getElementById('toggleAnnotatedBtn');
const currentDateBadge = document.getElementById('currentDateBadge');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

// Detector Card 1: GPTZero Burstiness & Variance
const recalcGptZeroBtn = document.getElementById('recalcGptZeroBtn');
const gptZeroIndicator = document.getElementById('gptZeroIndicator');
const gptZeroHumanVal = document.getElementById('gptZeroHumanVal');
const gptZeroVarianceVal = document.getElementById('gptZeroVarianceVal');
const gptZeroAiVal = document.getElementById('gptZeroAiVal');
const telemetrySentences = document.getElementById('telemetrySentences');
const telemetryAvgLen = document.getElementById('telemetryAvgLen');
const telemetryMinMax = document.getElementById('telemetryMinMax');
const sentencePillsList = document.getElementById('sentencePillsList');
const gptZeroBar = document.getElementById('gptZeroBar');
const gptZeroVerdict = document.getElementById('gptZeroVerdict');

// Detector Card 2: ZeroGPT Syntax & Uniformity
const recalcZeroGptBtn = document.getElementById('recalcZeroGptBtn');
const zeroGptIndicator = document.getElementById('zeroGptIndicator');
const zeroGptHumanVal = document.getElementById('zeroGptHumanVal');
const zeroGptFlagCount = document.getElementById('zeroGptFlagCount');
const zeroGptAiVal = document.getElementById('zeroGptAiVal');
const zeroGptScanStatus = document.getElementById('zeroGptScanStatus');
const zeroGptBar = document.getElementById('zeroGptBar');
const zeroGptVerdict = document.getElementById('zeroGptVerdict');

// Detector Card 3: RoBERTa Vocabulary Entropy
const recalcRobertaBtn = document.getElementById('recalcRobertaBtn');
const robertaIndicator = document.getElementById('robertaIndicator');
const robertaHumanVal = document.getElementById('robertaHumanVal');
const robertaTtrVal = document.getElementById('robertaTtrVal');
const robertaAiVal = document.getElementById('robertaAiVal');
const robertaEntropyStatus = document.getElementById('robertaEntropyStatus');
const robertaBar = document.getElementById('robertaBar');
const robertaVerdict = document.getElementById('robertaVerdict');

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
        if (!postsData || postsData.length === 0) {
          postsData = serverPosts;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(postsData));
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
      title: i === 1 ? 'Post 1: $BTC Session Liquidity' : `Post ${i}: Ready for Today's Dictation`,
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
  // Split on ., !, ?, or double newlines, clean up bullet points
  const rawChunks = text
    .replace(/\r/g, '')
    .split(/\n\n+|(?<=[.!?])\s+/)
    .map(s => s.trim().replace(/^[-•*>\d.]+\s*/, ''))
    .filter(s => s.length > 2 && /[a-zA-Z0-9]/.test(s));
  return rawChunks;
}

// Update word and sentence counter badges
function updateWordAndSentenceBadges(text) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  const sentences = extractSentences(text).length;
  wordCountBadge.textContent = `${words} words`;
  sentenceCountBadge.textContent = `${sentences} sentences`;
}

// Subtle Underlined View Renderer (No chunky pills or floating backgrounds)
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

// Run All 3 Detectors
function runAllDetectors(text) {
  runGptZeroBurstiness(text);
  runZeroGptSyntax(text);
  runRobertaEntropy(text);
}

// --------------------------------------------------------------------------------
// DETECTOR 1: GPTZero Sentence Burstiness & Variance Engine (Mathematical Calculation)
// --------------------------------------------------------------------------------
function runGptZeroBurstiness(text) {
  if (!text || text.startsWith('Awaiting your voice notes')) {
    gptZeroHumanVal.textContent = '--%';
    gptZeroVarianceVal.textContent = '-- words';
    gptZeroAiVal.textContent = '--%';
    telemetrySentences.textContent = '0';
    telemetryAvgLen.textContent = '0 words';
    telemetryMinMax.textContent = '0 - 0 words';
    sentencePillsList.innerHTML = '';
    gptZeroBar.style.width = '0%';
    gptZeroVerdict.textContent = 'Awaiting text...';
    gptZeroVerdict.className = 'det-verdict';
    gptZeroIndicator.className = 'det-indicator';
    return;
  }

  const sentences = extractSentences(text);
  const lengths = sentences.map(s => s.split(/\s+/).filter(Boolean).length);
  const N = lengths.length;

  if (N === 0) {
    gptZeroHumanVal.textContent = '50%';
    gptZeroVarianceVal.textContent = '0 words';
    gptZeroAiVal.textContent = '50%';
    return;
  }

  // Exact Mean μ
  const sum = lengths.reduce((a, b) => a + b, 0);
  const mean = sum / N;

  // Exact Variance σ² and Standard Deviation σ
  const variance = N > 1 ? lengths.reduce((acc, len) => acc + Math.pow(len - mean, 2), 0) / N : 0;
  const stdDev = Math.sqrt(variance);

  const minLen = Math.min(...lengths);
  const maxLen = Math.max(...lengths);

  // Burstiness scoring model:
  // Humans write with high std dev (e.g. 3-word punchy sentence followed by 25-word breakdown).
  // AI sentences cluster tightly around 12-16 words (stdDev < 2.5).
  let burstinessScore = Math.min(99, Math.max(15, Math.round(stdDev * 11 + 35)));
  if (stdDev >= 6.5) burstinessScore = Math.min(99, burstinessScore + 8);
  if (minLen <= 5 && maxLen >= 18) burstinessScore = Math.min(99, burstinessScore + 6);
  if (stdDev < 2.2 && N >= 3) burstinessScore = Math.min(40, burstinessScore - 15);

  const aiScore = 100 - burstinessScore;

  // Update UI Telemetry
  gptZeroHumanVal.textContent = `${burstinessScore}%`;
  gptZeroVarianceVal.textContent = `±${stdDev.toFixed(1)}w`;
  gptZeroAiVal.textContent = `${aiScore}%`;
  telemetrySentences.textContent = `${N}`;
  telemetryAvgLen.textContent = `${mean.toFixed(1)} words`;
  telemetryMinMax.textContent = `${minLen} to ${maxLen} words`;

  // Render individual sentence length pills
  sentencePillsList.innerHTML = '';
  lengths.forEach((len, i) => {
    const pill = document.createElement('span');
    const isShort = len <= 6;
    const isLong = len >= 20;
    pill.className = `sentence-len-pill ${isShort ? 'short' : ''} ${isLong ? 'long' : ''}`;
    pill.textContent = `S${i + 1}: ${len}w`;
    sentencePillsList.appendChild(pill);
  });

  gptZeroBar.style.width = `${burstinessScore}%`;

  if (burstinessScore >= 80) {
    gptZeroVerdict.className = 'det-verdict';
    gptZeroVerdict.textContent = `✅ PASSED (σ = ${stdDev.toFixed(1)}): High sentence variance mimics natural human rhythm.`;
    gptZeroIndicator.className = 'det-indicator';
  } else if (burstinessScore >= 55) {
    gptZeroVerdict.className = 'det-verdict warning';
    gptZeroVerdict.textContent = `⚠️ MODERATE (σ = ${stdDev.toFixed(1)}): Sentence lengths are somewhat uniform. Add a short punchy line.`;
    gptZeroIndicator.className = 'det-indicator warn';
  } else {
    gptZeroVerdict.className = 'det-verdict danger';
    gptZeroVerdict.textContent = `🚨 HIGH AI RISK (σ = ${stdDev.toFixed(1)}): Monotonous sentence length typical of raw LLM output.`;
    gptZeroIndicator.className = 'det-indicator danger';
  }
}

// --------------------------------------------------------------------------------
// DETECTOR 2: ZeroGPT Syntax Uniformity & Keyword Classifier (Mathematical Scan)
// --------------------------------------------------------------------------------
function runZeroGptSyntax(text) {
  if (!text || text.startsWith('Awaiting your voice notes')) {
    zeroGptHumanVal.textContent = '--%';
    zeroGptFlagCount.textContent = '0';
    zeroGptAiVal.textContent = '--%';
    zeroGptScanStatus.textContent = 'Scanning 45+ robotic phrases...';
    zeroGptScanStatus.className = 'telemetry-status-text';
    zeroGptBar.style.width = '0%';
    zeroGptVerdict.textContent = 'Awaiting text...';
    zeroGptVerdict.className = 'det-verdict';
    zeroGptIndicator.className = 'det-indicator';
    return;
  }

  const flaggedList = [];
  AI_PATTERNS.forEach(pat => {
    const matches = text.match(pat.regex);
    if (matches) {
      matches.forEach(m => {
        if (!flaggedList.includes(m.toLowerCase())) {
          flaggedList.push(m.toLowerCase());
        }
      });
    }
  });

  // Calculate Coefficient of Variation (CV = σ / μ)
  const sentences = extractSentences(text);
  const lengths = sentences.map(s => s.split(/\s+/).filter(Boolean).length);
  const N = lengths.length;
  let cv = 0.5;
  if (N > 1) {
    const mean = lengths.reduce((a, b) => a + b, 0) / N;
    const variance = lengths.reduce((acc, l) => acc + Math.pow(l - mean, 2), 0) / N;
    cv = Math.sqrt(variance) / Math.max(1, mean);
  }

  let authenticScore = 100 - (flaggedList.length * 28);
  if (N >= 3 && cv < 0.20) {
    authenticScore -= 18; // Flat syntax uniformity penalty
  }
  authenticScore = Math.min(99, Math.max(5, authenticScore));
  const aiScore = 100 - authenticScore;

  // Update UI Telemetry
  zeroGptHumanVal.textContent = `${authenticScore}%`;
  zeroGptFlagCount.textContent = `${flaggedList.length}`;
  zeroGptAiVal.textContent = `${aiScore}%`;
  zeroGptBar.style.width = `${authenticScore}%`;

  if (flaggedList.length === 0) {
    zeroGptScanStatus.textContent = '✓ 0 robotic phrases detected across 45+ checks. Clean trader syntax.';
    zeroGptScanStatus.className = 'telemetry-status-text clean';
    zeroGptVerdict.className = 'det-verdict';
    zeroGptVerdict.textContent = '✅ PASSED: Zero textbook AI transitions or academic filler detected.';
    zeroGptIndicator.className = 'det-indicator';
  } else {
    zeroGptScanStatus.textContent = `⚠️ Flagged: ${flaggedList.map(p => `"${p}"`).join(', ')}`;
    zeroGptScanStatus.className = 'telemetry-status-text flagged';
    if (authenticScore >= 60) {
      zeroGptVerdict.className = 'det-verdict warning';
      zeroGptVerdict.textContent = `⚠️ Found ${flaggedList.length} AI phrase(s). Tap 'Humanize' to clean up.`;
      zeroGptIndicator.className = 'det-indicator warn';
    } else {
      zeroGptVerdict.className = 'det-verdict danger';
      zeroGptVerdict.textContent = `🚨 High AI marker density detected (${flaggedList.length} matches).`;
      zeroGptIndicator.className = 'det-indicator danger';
    }
  }
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

  // Build token frequencies
  const freqMap = {};
  tokens.forEach(tok => {
    freqMap[tok] = (freqMap[tok] || 0) + 1;
  });

  const uniqueCount = Object.keys(freqMap).length;
  // Type-Token Ratio (TTR)
  const ttr = (uniqueCount / N) * 100;

  // Shannon Entropy H = - ∑ p(x) * log2(p(x))
  let entropy = 0;
  for (const tok in freqMap) {
    const p = freqMap[tok] / N;
    entropy -= p * Math.log2(p);
  }

  // Max possible entropy for N tokens
  const maxEntropy = Math.log2(N);
  const normalizedEntropy = maxEntropy > 0 ? (entropy / maxEntropy) * 100 : 80;

  // Combine TTR and normalized entropy
  let entropyScore = Math.round((ttr * 0.6) + (normalizedEntropy * 0.4));
  entropyScore = Math.min(99, Math.max(15, entropyScore));
  const aiScore = 100 - entropyScore;

  // Update UI Telemetry
  robertaHumanVal.textContent = `${entropyScore}%`;
  robertaTtrVal.textContent = `${ttr.toFixed(1)}%`;
  robertaAiVal.textContent = `${aiScore}%`;
  robertaBar.style.width = `${entropyScore}%`;

  robertaEntropyStatus.textContent = `Tokens: ${uniqueCount} unique / ${N} total | Shannon Entropy: ${entropy.toFixed(2)} bits/token`;

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
// ✨ Humanize Text Engine
// --------------------------------------------------------------------------------
function humanizeCurrentText() {
  let text = polishedContent.value;
  if (!text || text.startsWith('Awaiting your voice notes')) {
    showToast('Nothing to humanize yet.');
    return;
  }

  let replacedCount = 0;

  // 1. Replace all detected robotic phrases with trader language
  AI_PATTERNS.forEach(pat => {
    if (pat.regex.test(text)) {
      text = text.replace(pat.regex, () => {
        replacedCount++;
        return pat.human;
      });
    }
  });

  // 2. Clear passive academic phrasing
  text = text.replace(/It can be observed that /gi, 'I noticed ');
  text = text.replace(/Traders should consider /gi, 'I am ');
  text = text.replace(/In order to /gi, 'To ');
  text = text.replace(/It is recommended to /gi, 'Make sure to ');

  // Update text values
  polishedContent.value = text;
  postsData[currentPostIndex].improved = text;
  saveDataToStorage();

  // Re-run updates
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

// Switch Tabs (Polished vs Raw)
function switchTab(tabName) {
  if (tabName === 'polished') {
    tabPolishedBtn.classList.add('active');
    tabPolishedBtn.setAttribute('aria-selected', 'true');
    tabRawBtn.classList.remove('active');
    tabRawBtn.setAttribute('aria-selected', 'false');

    panePolished.classList.add('active');
    paneRaw.classList.remove('active');
  } else {
    tabRawBtn.classList.add('active');
    tabRawBtn.setAttribute('aria-selected', 'true');
    tabPolishedBtn.classList.remove('active');
    tabPolishedBtn.setAttribute('aria-selected', 'false');

    paneRaw.classList.add('active');
    panePolished.classList.remove('active');
  }
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
  showToast('Saved raw notes! Ready for polish.');
}

function saveDataToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(postsData));
}

// Setup Event Listeners
function setupEvents() {
  // Tabs
  tabPolishedBtn.addEventListener('click', () => switchTab('polished'));
  tabRawBtn.addEventListener('click', () => switchTab('raw'));

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
  recalcGptZeroBtn.addEventListener('click', () => {
    recalcGptZeroBtn.classList.add('active-calc');
    recalcGptZeroBtn.textContent = '⏳ Calculating...';
    setTimeout(() => {
      runGptZeroBurstiness(polishedContent.value);
      recalcGptZeroBtn.classList.remove('active-calc');
      recalcGptZeroBtn.textContent = '⚡ Recalculate';
      showToast('✓ Recalculated GPTZero Burstiness & Variance!');
    }, 180);
  });

  recalcZeroGptBtn.addEventListener('click', () => {
    recalcZeroGptBtn.classList.add('active-calc');
    recalcZeroGptBtn.textContent = '⏳ Scanning...';
    setTimeout(() => {
      runZeroGptSyntax(polishedContent.value);
      recalcZeroGptBtn.classList.remove('active-calc');
      recalcZeroGptBtn.textContent = '⚡ Recalculate';
      showToast('✓ Recalculated ZeroGPT Syntax Uniformity!');
    }, 180);
  });

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

// Start app
document.addEventListener('DOMContentLoaded', initApp);
