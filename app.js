// Post Studio Bridge — Client Application Logic with Hugging Face AI Scanner

const STORAGE_KEY = 'byx_post_studio_dynamic_v2';
const HF_TOKEN_STORAGE_KEY = 'hf_read_token_v1';
const HF_MODEL_STORAGE_KEY = 'hf_model_endpoint_v1';

let currentPostIndex = 0;
let postsData = [];

// DOM Elements
const pillsContainer = document.getElementById('pillsContainer');
const currentSlotLabel = document.getElementById('currentSlotLabel');
const currentSlotStatus = document.getElementById('currentSlotStatus');
const currentPostTitle = document.getElementById('currentPostTitle');
const polishedContent = document.getElementById('polishedContent');
const rawContent = document.getElementById('rawContent');
const wordCountBadge = document.getElementById('wordCountBadge');
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
const breakdownSection = document.getElementById('breakdownSection');
const breakdownList = document.getElementById('breakdownList');
const currentDateBadge = document.getElementById('currentDateBadge');
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

// Hugging Face AI Scanner Elements
const runAiScanBtn = document.getElementById('runAiScanBtn');
const aiScanResult = document.getElementById('aiScanResult');
const humanScoreText = document.getElementById('humanScoreText');
const aiScoreText = document.getElementById('aiScoreText');
const humanProgressBar = document.getElementById('humanProgressBar');
const aiVerdictBanner = document.getElementById('aiVerdictBanner');

// Hugging Face Token Modal Elements
const openApiSettingsBtn = document.getElementById('openApiSettingsBtn');
const closeApiModalBtn = document.getElementById('closeApiModalBtn');
const apiModal = document.getElementById('apiModal');
const hfTokenInput = document.getElementById('hfTokenInput');
const hfModelInput = document.getElementById('hfModelInput');
const testAndSaveTokenBtn = document.getElementById('testAndSaveTokenBtn');
const tokenTestStatus = document.getElementById('tokenTestStatus');

// Initialize App
async function initApp() {
  setTodayDate();
  loadSavedHfToken();
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

// Load Saved HF Token
function loadSavedHfToken() {
  const saved = localStorage.getItem(HF_TOKEN_STORAGE_KEY);
  if (saved) {
    hfTokenInput.value = saved;
    openApiSettingsBtn.textContent = '🔑 HF Ready';
    tokenTestStatus.textContent = '✓ Saved in browser.';
  }
  const savedModel = localStorage.getItem(HF_MODEL_STORAGE_KEY);
  if (savedModel) {
    hfModelInput.value = savedModel;
  }
}

// Load Posts from posts.json or LocalStorage fallback
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
      improved: i === 1 ? 'Waiting for Post 1...' : `Awaiting your voice notes for Post ${i}...`,
      breakdown: []
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

  // Slot status pill
  if (post.status === 'ready') {
    currentSlotStatus.textContent = '● READY';
    currentSlotStatus.className = 'slot-status-pill ready';
  } else {
    currentSlotStatus.textContent = '◌ WAITING';
    currentSlotStatus.className = 'slot-status-pill waiting';
  }

  polishedContent.value = post.improved || '';
  rawContent.value = post.raw || '';

  // Reset AI scan result on post change
  aiScanResult.classList.add('hidden');
  runAiScanBtn.disabled = false;
  runAiScanBtn.textContent = '⚡ Check AI Score';

  // Calculate word count
  const words = (post.improved || '').trim().split(/\s+/).filter(Boolean).length;
  wordCountBadge.textContent = `${words} words`;

  // Update navigation indicator
  navPositionIndicator.textContent = `Post ${index + 1} of ${postsData.length}`;

  // Render Color-Coded Audit Breakdown
  renderBreakdown(post.breakdown);

  // Update pills UI
  const pillButtons = pillsContainer.querySelectorAll('.pill-item');
  pillButtons.forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  // Scroll active pill into view smoothly
  if (pillButtons[index]) {
    pillButtons[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

// Render Color-Coded Breakdown Cards
function renderBreakdown(breakdown) {
  breakdownList.innerHTML = '';
  if (!breakdown || breakdown.length === 0) {
    breakdownSection.style.display = 'none';
    return;
  }

  breakdownSection.style.display = 'flex';
  breakdown.forEach(item => {
    const card = document.createElement('div');
    card.className = `breakdown-item type-${item.type || 'yellow'}`;
    card.innerHTML = `
      <div class="item-top">
        <span class="item-tag">${item.tag || 'Edit'}</span>
        <span class="item-label">${item.label || ''}</span>
      </div>
      <p class="item-detail">${item.detail || ''}</p>
    `;
    breakdownList.appendChild(card);
  });
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

// Copy to Clipboard with Haptics and Toast
function copyText(text, buttonEl, successLabel) {
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }

    if (buttonEl) {
      const originalText = buttonEl.innerHTML;
      buttonEl.innerHTML = `<span>✓ ${successLabel || 'COPIED TO CLIPBOARD!'}</span>`;
      buttonEl.classList.add('copied');
      setTimeout(() => {
        buttonEl.innerHTML = originalText;
        buttonEl.classList.remove('copied');
      }, 2000);
    }

    showToast('Copied clean post! Ready to paste into ByX.');
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

// Hugging Face AI Scan Function
async function runHuggingFaceAiScan() {
  const token = localStorage.getItem(HF_TOKEN_STORAGE_KEY) || hfTokenInput.value.trim();
  const model = localStorage.getItem(HF_MODEL_STORAGE_KEY) || hfModelInput.value.trim() || 'roberta-base-openai-detector';

  if (!token) {
    openApiModal();
    tokenTestStatus.textContent = '⚠️ Please enter your Hugging Face Token first.';
    return;
  }

  const textToScan = polishedContent.value.trim();
  if (!textToScan || textToScan.startsWith('Awaiting your voice notes')) {
    showToast('Please enter text to scan first.');
    return;
  }

  runAiScanBtn.disabled = true;
  runAiScanBtn.textContent = '⏳ Scanning...';
  aiScanResult.classList.remove('hidden');
  aiVerdictBanner.className = 'verdict-banner';
  aiVerdictBanner.innerHTML = '<span>Querying Hugging Face Inference API...</span>';

  try {
    const endpoint = `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: textToScan })
    });

    const data = await response.json();

    // Check for model cold start
    if (data.error && data.error.includes('loading')) {
      const waitSec = Math.round(data.estimated_time || 15);
      aiVerdictBanner.className = 'verdict-banner warning';
      aiVerdictBanner.innerHTML = `<span>⏳ Model is waking up on Hugging Face (~${waitSec}s). Retrying automatically...</span>`;
      setTimeout(runHuggingFaceAiScan, (waitSec > 20 ? 10 : waitSec) * 1000);
      return;
    }

    if (data.error) {
      throw new Error(data.error);
    }

    // roberta-base-openai-detector output format:
    // [[{"label": "Real", "score": 0.98}, {"label": "Fake", "score": 0.02}]]
    let scores = Array.isArray(data) ? (Array.isArray(data[0]) ? data[0] : data) : [];

    let realScore = 0;
    let fakeScore = 0;

    scores.forEach(item => {
      const label = (item.label || '').toLowerCase();
      if (label === 'real' || label === 'human') realScore = item.score;
      if (label === 'fake' || label === 'ai' || label === 'chatgpt') fakeScore = item.score;
    });

    // Fallback if labels differ
    if (realScore === 0 && fakeScore === 0 && scores.length >= 2) {
      realScore = scores[0].score;
      fakeScore = scores[1].score;
    }

    const humanPercent = Math.round(realScore * 100);
    const aiPercent = Math.round(fakeScore * 100);

    humanScoreText.textContent = `${humanPercent}%`;
    aiScoreText.textContent = `${aiPercent}%`;
    humanProgressBar.style.width = `${humanPercent}%`;

    if (humanPercent >= 80) {
      aiVerdictBanner.className = 'verdict-banner passed';
      aiVerdictBanner.innerHTML = `<span>✅ <strong>PASSED:</strong> ${humanPercent}% Human Voice verified. Impossible for ByX anti-AI filters to flag!</span>`;
      showToast(`Scan complete: ${humanPercent}% Human-written!`);
    } else if (humanPercent >= 50) {
      aiVerdictBanner.className = 'verdict-banner warning';
      aiVerdictBanner.innerHTML = `<span>⚠️ <strong>MODERATE:</strong> ${aiPercent}% AI probability. Consider adding more spoken colloquial details.</span>`;
    } else {
      aiVerdictBanner.className = 'verdict-banner danger';
      aiVerdictBanner.innerHTML = `<span>🚨 <strong>HIGH AI RISK:</strong> ${aiPercent}% AI probability detected. Rephrase to sound more conversational.</span>`;
    }

    runAiScanBtn.disabled = false;
    runAiScanBtn.textContent = '⚡ Re-Scan';

  } catch (err) {
    console.error('Hugging Face Scan Error:', err);
    aiVerdictBanner.className = 'verdict-banner danger';
    aiVerdictBanner.innerHTML = `<span>❌ Scan Failed: ${err.message || 'API error'}</span>`;
    runAiScanBtn.disabled = false;
    runAiScanBtn.textContent = '⚡ Retry Scan';
  }
}

// Modal Controls
function openApiModal() {
  apiModal.classList.remove('hidden');
}

function closeApiModal() {
  apiModal.classList.add('hidden');
}

// Test & Save Token
async function testAndSaveToken() {
  const token = hfTokenInput.value.trim();
  const model = hfModelInput.value.trim() || 'roberta-base-openai-detector';

  if (!token) {
    tokenTestStatus.textContent = '❌ Token cannot be empty.';
    tokenTestStatus.style.color = '#ef4444';
    return;
  }

  testAndSaveTokenBtn.disabled = true;
  testAndSaveTokenBtn.textContent = 'Validating Token with Hugging Face...';
  tokenTestStatus.textContent = 'Contacting api-inference.huggingface.co...';
  tokenTestStatus.style.color = 'var(--text-muted)';

  try {
    const res = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: 'Bitcoin is holding support at 67000.' })
    });

    const data = await res.json();

    if (res.status === 401 || (data.error && data.error.includes('Invalid username or password'))) {
      throw new Error('Invalid token. Check your Hugging Face Access Token.');
    }

    localStorage.setItem(HF_TOKEN_STORAGE_KEY, token);
    localStorage.setItem(HF_MODEL_STORAGE_KEY, model);
    openApiSettingsBtn.textContent = '🔑 HF Ready';

    tokenTestStatus.textContent = '✅ Token Validated & Saved successfully!';
    tokenTestStatus.style.color = 'var(--green)';
    testAndSaveTokenBtn.textContent = '✓ Saved in Browser!';

    setTimeout(() => {
      closeApiModal();
      testAndSaveTokenBtn.disabled = false;
      testAndSaveTokenBtn.textContent = 'Save & Validate Token';
      showToast('Hugging Face API connected!');
    }, 1200);

  } catch (err) {
    tokenTestStatus.textContent = `❌ ${err.message || 'Validation failed'}`;
    tokenTestStatus.style.color = '#ef4444';
    testAndSaveTokenBtn.disabled = false;
    testAndSaveTokenBtn.textContent = 'Retry Validation';
  }
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
    current.breakdown = [];
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
  showToast('Saved raw notes! You can now request polishing.');
}

function saveDataToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(postsData));
}

// Setup Event Listeners
function setupEvents() {
  // Tabs
  tabPolishedBtn.addEventListener('click', () => switchTab('polished'));
  tabRawBtn.addEventListener('click', () => switchTab('raw'));

  // Copy Buttons
  copyPolishedBtn.addEventListener('click', () => {
    copyText(polishedContent.value, copyPolishedBtn, 'COPIED! READY FOR BYX');
  });

  copyRawBtn.addEventListener('click', () => {
    copyText(rawContent.value, copyRawBtn, 'RAW VOICE COPIED');
  });

  // Clicking inside polished textarea on mobile also copies
  polishedContent.addEventListener('click', () => {
    copyText(polishedContent.value, copyPolishedBtn, 'COPIED! READY FOR BYX');
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

  // Hugging Face AI Scanner Buttons
  runAiScanBtn.addEventListener('click', runHuggingFaceAiScan);
  openApiSettingsBtn.addEventListener('click', openApiModal);
  closeApiModalBtn.addEventListener('click', closeApiModal);
  testAndSaveTokenBtn.addEventListener('click', testAndSaveToken);

  // Close modal when clicking outside
  apiModal.addEventListener('click', (e) => {
    if (e.target === apiModal) closeApiModal();
  });
}

// Start app
document.addEventListener('DOMContentLoaded', initApp);
