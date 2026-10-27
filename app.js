// Post Studio Bridge — Dynamic Client Application Logic

const STORAGE_KEY = 'byx_post_studio_dynamic_v2';
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
        // If local storage is empty or server has fresh template, merge/use server
        if (!postsData || postsData.length === 0) {
          postsData = serverPosts;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(postsData));
        }
      }
    }
  } catch (err) {
    console.log('Using local/cached posts:', err);
  }

  // Ensure 10 slots exist
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
}

// Start app
document.addEventListener('DOMContentLoaded', initApp);
