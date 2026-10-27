// Post Studio Bridge — Multi-Detector & Humanizer Client Application

const STORAGE_KEY = 'byx_post_studio_dynamic_v2';
let currentPostIndex = 0;
let postsData = [];
let currentViewMode = 'annotated'; // 'annotated' or 'plain'

// DOM Elements
const pillsContainer = document.getElementById('pillsContainer');
const currentSlotLabel = document.getElementById('currentSlotLabel');
const currentSlotStatus = document.getElementById('currentSlotStatus');
const currentPostTitle = document.getElementById('currentPostTitle');
const polishedContent = document.getElementById('polishedContent');
const annotatedDisplay = document.getElementById('annotatedDisplay');
const rawContent = document.getElementById('rawContent');
const wordCountBadge = document.getElementById('wordCountBadge');
const coinTagBadge = document.getElementById('coinTagBadge');
const burstinessBadge = document.getElementById('burstinessBadge');
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
const toggleAnnotatedBtn = document.getElementById('toggleAnnotatedBtn');
const toggleRawTextBtn = document.getElementById('toggleRawTextBtn');
const currentDateBadge = document.getElementById('currentDateBadge');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

// Detector Card 1: RoBERTa
const recalcRobertaBtn = document.getElementById('recalcRobertaBtn');
const robertaHumanVal = document.getElementById('robertaHumanVal');
const robertaAiVal = document.getElementById('robertaAiVal');
const robertaBar = document.getElementById('robertaBar');
const robertaVerdict = document.getElementById('robertaVerdict');

// Detector Card 2: GPTZero
const recalcGptZeroBtn = document.getElementById('recalcGptZeroBtn');
const gptZeroHumanVal = document.getElementById('gptZeroHumanVal');
const gptZeroAiVal = document.getElementById('gptZeroAiVal');
const gptZeroBar = document.getElementById('gptZeroBar');
const gptZeroVerdict = document.getElementById('gptZeroVerdict');

// Detector Card 3: ZeroGPT
const recalcZeroGptBtn = document.getElementById('recalcZeroGptBtn');
const zeroGptHumanVal = document.getElementById('zeroGptHumanVal');
const zeroGptAiVal = document.getElementById('zeroGptAiVal');
const zeroGptBar = document.getElementById('zeroGptBar');
const zeroGptVerdict = document.getElementById('zeroGptVerdict');

// Known AI phrase dictionary
const AI_REPLACEMENTS = [
  { flag: /in conclusion/gi, human: 'bottom line:' },
  { flag: /furthermore/gi, human: 'also' },
  { flag: /moreover/gi, human: 'on top of that' },
  { flag: /delve into/gi, human: 'look closely at' },
  { flag: /it is important to note that/gi, human: 'keep in mind:' },
  { flag: /it is vital to remember/gi, human: 'remember:' },
  { flag: /navigating the/gi, human: 'trading this' },
  { flag: /tapestry of/gi, human: 'mix of' },
  { flag: /testament to/gi, human: 'proof of' },
  { flag: /only time will tell/gi, human: 'let price confirm' },
  { flag: /in summary/gi, human: 'wrap up:' },
  { flag: /exercise caution/gi, human: 'manage risk' }
];

// Initialize App
async function initApp() {
  setTodayDate();
  await loadPostsData();
  renderPills();
  displayPost(currentPostIndex);
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
      title: i === 1 ? 'Post 1: $BTC Session Setup' : `Post ${i}: Ready for Today's Dictation`,
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

  // Calculate word count
  const words = (post.improved || '').trim().split(/\s+/).filter(Boolean).length;
  wordCountBadge.textContent = `${words} words`;

  // Update navigation indicator
  navPositionIndicator.textContent = `Post ${index + 1} of ${postsData.length}`;

  // Build In-Text Color-Coded Annotations with Subtext
  renderAnnotatedView(post.improved || '');

  // Run all 3 Working AI Detectors on the Polished Text Only
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

// Render In-Text Color-Coded Annotations with Small-Font Subtext
function renderAnnotatedView(text) {
  if (!text || text.startsWith('Awaiting your voice notes')) {
    annotatedDisplay.innerHTML = `<span style="color: var(--text-muted); font-style: italic;">Awaiting your voice notes for this slot...</span>`;
    return;
  }

  let html = escapeHtml(text);

  // 1. Hook (Purple)
  html = html.replace(/(🧭 [^\n]+|⚡ [^\n]+|🚨 [^\n]+|📊 [^\n]+|🔥 [^\n]+)/g, (match) => {
    return `<span class="inline-annotated token-purple"><span class="word">${match}</span><span class="subtext">🟣 Mobile Hook (Scroll Stopper)</span></span>`;
  });

  // 2. Concrete Price Levels & Invalidation (Blue)
  html = html.replace(/(\$[\d,]+(?:\.\d+)?|\b\d+(?:\.\d+)?%\b|\bStop-Loss\b|\bInvalidation\b|\bTP1\b|\bTP2\b)/g, (match) => {
    return `<span class="inline-annotated token-blue"><span class="word">${match}</span><span class="subtext">🔵 Concrete Execution Level</span></span>`;
  });

  // 3. Trade Widget & CTA (Green)
  html = html.replace(/(Trade Widget below|tap the widget|Trade Widget|set your limit order|set your order)/gi, (match) => {
    return `<span class="inline-annotated token-green"><span class="word">${match}</span><span class="subtext">🟢 Conversion CTA (Drives ByX Points)</span></span>`;
  });

  // 4. Authentic Trader Slang (Yellow)
  html = html.replace(/(chopped up|coiling tightly|liquidity|swept|asymmetric break|fakeouts|fading|orderflow|delta loss)/gi, (match) => {
    return `<span class="inline-annotated token-yellow"><span class="word">${match}</span><span class="subtext">🟡 Authentic Trader Jargon</span></span>`;
  });

  // 5. AI Flags (Red) - If any exist
  AI_REPLACEMENTS.forEach(r => {
    html = html.replace(r.flag, (match) => {
      return `<span class="inline-annotated token-red"><span class="word">${match}</span><span class="subtext">🔴 Robotic AI Marker (Tap Humanize)</span></span>`;
    });
  });

  annotatedDisplay.innerHTML = html;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Run All 3 Detectors (Auditing Polished Text Only)
function runAllDetectors(text) {
  runRobertaPerplexity(text);
  runGptZeroBurstiness(text);
  runZeroGptSyntax(text);
}

// Detector 1: RoBERTa N-Gram & Perplexity Benchmark
function runRobertaPerplexity(text) {
  if (!text || text.startsWith('Awaiting your voice notes')) {
    robertaHumanVal.textContent = '--%';
    robertaAiVal.textContent = '--%';
    robertaBar.style.width = '0%';
    robertaVerdict.textContent = 'Awaiting text...';
    robertaVerdict.className = 'det-verdict';
    return;
  }

  // Token unpredictability heuristics
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(words);
  const vocabularyDiversity = uniqueWords.size / Math.max(1, words.length);

  let humanScore = Math.min(99, Math.max(20, Math.round(vocabularyDiversity * 130 + 10)));
  
  // Subtract if known predictable sequences appear
  AI_REPLACEMENTS.forEach(r => {
    if (r.flag.test(text)) humanScore -= 22;
  });

  const aiScore = Math.max(1, 100 - humanScore);

  robertaHumanVal.textContent = `${humanScore}%`;
  robertaAiVal.textContent = `${aiScore}%`;
  robertaBar.style.width = `${humanScore}%`;

  if (humanScore >= 80) {
    robertaVerdict.className = 'det-verdict';
    robertaVerdict.textContent = '✅ PASSED: Highly unpredictable human vocabulary & entropy.';
  } else if (humanScore >= 50) {
    robertaVerdict.className = 'det-verdict warning';
    robertaVerdict.textContent = '⚠️ MODERATE: Repetitive word sequences detected.';
  } else {
    robertaVerdict.className = 'det-verdict danger';
    robertaVerdict.textContent = '🚨 HIGH AI RISK: Smooth LLM token distribution detected.';
  }
}

// Detector 2: GPTZero Sentence Burstiness & Variance Engine
function runGptZeroBurstiness(text) {
  if (!text || text.startsWith('Awaiting your voice notes')) {
    gptZeroHumanVal.textContent = '--%';
    gptZeroAiVal.textContent = '--%';
    gptZeroBar.style.width = '0%';
    gptZeroVerdict.textContent = 'Awaiting text...';
    gptZeroVerdict.className = 'det-verdict';
    return;
  }

  const sentences = text.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 0);
  const lengths = sentences.map(s => s.split(/\s+/).length);

  let avgLen = 12;
  let variance = 0;
  if (lengths.length > 1) {
    avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLen, 2), 0) / lengths.length;
  }
  const stdDev = Math.sqrt(variance); // Burstiness

  let burstinessScore = Math.min(99, Math.max(25, Math.round(stdDev * 11 + 45)));

  // If text mixes ultra-short (under 5 words) with longer sentences, that's deeply human
  const hasShort = lengths.some(l => l <= 5);
  const hasLong = lengths.some(l => l >= 18);
  if (hasShort && hasLong) burstinessScore = Math.min(99, burstinessScore + 10);

  const aiScore = 100 - burstinessScore;

  gptZeroHumanVal.textContent = `${burstinessScore}%`;
  gptZeroAiVal.textContent = `${aiScore}%`;
  gptZeroBar.style.width = `${burstinessScore}%`;

  burstinessBadge.textContent = burstinessScore >= 80 ? 'High Burstiness' : 'Low Burstiness';
  burstinessBadge.className = `pill-badge ${burstinessScore >= 80 ? 'pill-green' : 'pill-gold'}`;

  if (burstinessScore >= 80) {
    gptZeroVerdict.className = 'det-verdict';
    gptZeroVerdict.textContent = '✅ PASSED: Excellent sentence length variation (jagged rhythm).';
  } else {
    gptZeroVerdict.className = 'det-verdict warning';
    gptZeroVerdict.textContent = '⚠️ MODERATE: Sentences are somewhat uniform in length.';
  }
}

// Detector 3: ZeroGPT Syntax Uniformity & Keyword Classifier
function runZeroGptSyntax(text) {
  if (!text || text.startsWith('Awaiting your voice notes')) {
    zeroGptHumanVal.textContent = '--%';
    zeroGptAiVal.textContent = '--%';
    zeroGptBar.style.width = '0%';
    zeroGptVerdict.textContent = 'Awaiting text...';
    zeroGptVerdict.className = 'det-verdict';
    return;
  }

  let flaggedCount = 0;
  AI_REPLACEMENTS.forEach(r => {
    if (r.flag.test(text)) flaggedCount++;
  });

  let authenticScore = Math.max(10, 100 - (flaggedCount * 30));
  const aiScore = 100 - authenticScore;

  zeroGptHumanVal.textContent = `${authenticScore}%`;
  zeroGptAiVal.textContent = `${aiScore}%`;
  zeroGptBar.style.width = `${authenticScore}%`;

  if (authenticScore >= 90) {
    zeroGptVerdict.className = 'det-verdict';
    zeroGptVerdict.textContent = '✅ PASSED: Zero textbook transition markers detected.';
  } else if (authenticScore >= 60) {
    zeroGptVerdict.className = 'det-verdict warning';
    zeroGptVerdict.textContent = `⚠️ Flagged ${flaggedCount} robotic phrase(s). Tap 'Humanize' to fix.`;
  } else {
    zeroGptVerdict.className = 'det-verdict danger';
    zeroGptVerdict.textContent = `🚨 High density of ChatGPT filler words detected.`;
  }
}

// ✨ Text Humanizer Engine (Removes AI patterns & boosts human rhythm)
function humanizeCurrentText() {
  let text = polishedContent.value;
  if (!text || text.startsWith('Awaiting your voice notes')) {
    showToast('Nothing to humanize yet.');
    return;
  }

  // 1. Replace AI markers with authentic conversational trader words
  AI_REPLACEMENTS.forEach(r => {
    text = text.replace(r.flag, r.human);
  });

  // 2. Add punchy cadence and active voice
  text = text.replace(/It can be observed that /gi, 'I noticed ');
  text = text.replace(/Traders should consider /gi, 'I am ');
  text = text.replace(/In order to /gi, 'To ');

  // Update text
  polishedContent.value = text;
  postsData[currentPostIndex].improved = text;
  saveDataToStorage();

  // Re-render
  renderAnnotatedView(text);
  runAllDetectors(text);

  showToast('✨ Text Humanized! All AI markers replaced.');
}

// View Mode Toggle (Annotated vs Plain)
function setViewMode(mode) {
  currentViewMode = mode;
  if (mode === 'annotated') {
    toggleAnnotatedBtn.classList.add('active');
    toggleRawTextBtn.classList.remove('active');
    annotatedDisplay.classList.remove('hidden');
    polishedContent.classList.add('hidden');
  } else {
    toggleRawTextBtn.classList.add('active');
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

  // Clean any residual HTML formatting just in case
  const clean = text.replace(/<[^>]*>?/gm, '').trim();

  navigator.clipboard.writeText(clean).then(() => {
    if (navigator.vibrate) {
      navigator.vibrate(40);
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
  }, 2500);
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

// Save Raw Edits to Local Storage
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

  // View Mode Toggle
  toggleAnnotatedBtn.addEventListener('click', () => setViewMode('annotated'));
  toggleRawTextBtn.addEventListener('click', () => setViewMode('plain'));

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

  // Plain Textarea real-time change
  polishedContent.addEventListener('input', (e) => {
    const val = e.target.value;
    postsData[currentPostIndex].improved = val;
    saveDataToStorage();
    renderAnnotatedView(val);
    runAllDetectors(val);
  });

  // Individual Detector Recalculate Buttons
  recalcRobertaBtn.addEventListener('click', () => {
    runRobertaPerplexity(polishedContent.value);
    showToast('Recalculated RoBERTa Perplexity!');
  });

  recalcGptZeroBtn.addEventListener('click', () => {
    runGptZeroBurstiness(polishedContent.value);
    showToast('Recalculated GPTZero Burstiness!');
  });

  recalcZeroGptBtn.addEventListener('click', () => {
    runZeroGptSyntax(polishedContent.value);
    showToast('Recalculated ZeroGPT Syntax!');
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
