// Post Studio Bridge — Client Application Logic

const STORAGE_KEY = 'byx_post_studio_posts_v1';
let currentPostIndex = 0;
let postsData = [];

// DOM Elements
const pillsContainer = document.getElementById('pillsContainer');
const currentSlotLabel = document.getElementById('currentSlotLabel');
const currentPostTitle = document.getElementById('currentPostTitle');
const polishedContent = document.getElementById('polishedContent');
const rawContent = document.getElementById('rawContent');
const wordCountBadge = document.getElementById('wordCountBadge');
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
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

// Initialize App
async function initApp() {
  await loadPostsData();
  renderPills();
  displayPost(currentPostIndex);
  setupEvents();
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
        postsData = serverPosts;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(postsData));
      }
    }
  } catch (err) {
    console.log('Using local/cached posts:', err);
  }
}

// Render 10 Post Carousel Pills
function renderPills() {
  pillsContainer.innerHTML = '';
  postsData.forEach((post, idx) => {
    const pill = document.createElement('button');
    pill.className = `pill-item ${idx === currentPostIndex ? 'active' : ''}`;
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

  polishedContent.value = post.improved || '';
  rawContent.value = post.raw || '';

  // Calculate word count
  const words = (post.improved || '').trim().split(/\s+/).filter(Boolean).length;
  wordCountBadge.textContent = `${words} words`;

  // Update navigation indicator
  navPositionIndicator.textContent = `${index + 1} / ${postsData.length}`;

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
    // Haptic feedback on supported mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }

    // Button feedback
    if (buttonEl) {
      const originalText = buttonEl.innerHTML;
      buttonEl.innerHTML = `<span>✓ ${successLabel || 'COPIED TO CLIPBOARD!'}</span>`;
      buttonEl.classList.add('copied');
      setTimeout(() => {
        buttonEl.innerHTML = originalText;
        buttonEl.classList.remove('copied');
      }, 2000);
    }

    showToast('Copied to clipboard! Ready to paste into ByX.');
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

// Save Raw Edits to Local Storage
function saveCurrentPostEdits() {
  if (!postsData[currentPostIndex]) return;
  postsData[currentPostIndex].raw = rawContent.value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(postsData));
  showToast('Saved raw notes to local storage.');
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
    copyText(rawContent.value, copyRawBtn, 'RAW DICTATION COPIED');
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

  // Edit / Dictate Header button switches to Raw Tab and focuses textarea
  document.getElementById('newPostBtn').addEventListener('click', () => {
    switchTab('raw');
    rawContent.focus();
  });
}

// Start app
document.addEventListener('DOMContentLoaded', initApp);
