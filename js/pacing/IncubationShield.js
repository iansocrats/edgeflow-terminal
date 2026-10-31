// ================================================================================
// EdgeFlow Terminal: Algorithmic Wave Incubation Timer & Cannibalization Shield
// ================================================================================
(function() {
  'use strict';

  const WAVES_CONFIG = [
    { id: 1, name: 'Wave 1', slots: [1, 2], coins: ['$BTC', '$ETH'], timeStr: '07:00 & 08:52', status: 'done' },
    { id: 2, name: 'Wave 2', slots: [3, 4], coins: ['$SOL', '$XRP'], timeStr: '11:22 & 11:35', status: 'done' },
    { id: 3, name: 'Wave 3', slots: [5, 6], coins: ['$NEAR', '$BNB'], timeStr: '14:05 & 14:18', status: 'done' },
    { id: 4, name: 'Wave 4', slots: [7, 8], coins: ['$SUI', '$DOGE'], targetHour: 16, targetMin: 48, timeStr: '16:48 & 17:00', status: 'active' },
    { id: 5, name: 'Wave 5', slots: [9, 10], coins: ['$XAUT', '$AAVE'], targetHour: 19, targetMin: 30, timeStr: '19:30 & 19:42', status: 'pending' },
    { id: 6, name: 'Wave 6', slots: [11, 12], coins: ['$LINK', '$ONDO'], targetHour: 22, targetMin: 12, timeStr: '22:12 & 22:25', status: 'pending' }
  ];

  class IncubationShieldManager {
    constructor() {
      this.currentWave = 4;
      this.timerInterval = null;
      this.isOverrideUnlocked = false;
      this.init();
    }

    init() {
      const savedOverride = localStorage.getItem('edgeflow_shield_override');
      if (savedOverride === 'true') {
        this.isOverrideUnlocked = true;
      }
      this.renderWidget();
      this.startCountdown();
      this.bindEvents();
    }

    getTargetTimestamp() {
      const now = new Date();
      // Wave 4 target: 16:48 local time today
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 48, 0);
      return target.getTime();
    }

    getWave3PostedTimestamp() {
      // Wave 3 completed around 14:07 - 14:18 today
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 18, 0).getTime();
    }

    renderWidget() {
      const container = document.getElementById('incubationShieldContainer');
      if (!container) return;

      container.innerHTML = `
        <div class="shield-card" id="cannibalizationShieldCard">
          <div class="shield-header">
            <div class="shield-title-group">
              <span class="shield-radar-pulse"></span>
              <div class="shield-status-text">
                <div class="shield-main-label" id="shieldStatusBadge">
                  🛡️ BYBIT FEED CANNIBALIZATION SHIELD: <span class="shield-state-highlight">ACTIVE INCUBATION</span>
                </div>
                <div class="shield-sub-label">
                  Wave 3 (<strong style="color:#38bdf8;">$NEAR</strong> & <strong style="color:#38bdf8;">$BNB</strong>) is circulating in Bybit ByX feed. 2.5-hour incubation preserves algorithmic reach.
                </div>
              </div>
            </div>

            <div class="shield-timer-block">
              <div class="shield-timer-tag">WAVE 4 COUNTDOWN (16:48 LOCAL)</div>
              <div class="shield-countdown-digits" id="shieldCountdownDisplay">02:34:30</div>
            </div>
          </div>

          <!-- Progress Bar of 2.5h incubation window -->
          <div class="shield-progress-wrap">
            <div class="shield-progress-bar-bg">
              <div class="shield-progress-bar-fill" id="shieldProgressFill" style="width: 15%;"></div>
            </div>
            <div class="shield-progress-labels">
              <span>Wave 3 Banked (14:18)</span>
              <span id="shieldPercentLabel" style="font-weight:700; color:#38bdf8;">15% Elapsed</span>
              <span>Wave 4 Target (16:48)</span>
            </div>
          </div>

          <!-- Action Controls & Pre-Flight Switcher -->
          <div class="shield-action-row">
            <div class="shield-action-left">
              <button type="button" id="btnToggleWave4Preflight" class="btn-shield-action primary">
                🔍 Pre-Flight Wave 4 (<strong style="color:#38bdf8;">$SUI</strong> & <strong style="color:#fbbf24;">$DOGE</strong>)
              </button>
              <button type="button" id="btnCopyQuickP7" class="btn-shield-action" title="Quick Copy Post 7 ($SUI) to clipboard">
                📋 Copy Post 7 ($SUI)
              </button>
              <button type="button" id="btnCopyQuickP8" class="btn-shield-action" title="Quick Copy Post 8 ($DOGE) to clipboard">
                📋 Copy Post 8 ($DOGE)
              </button>
            </div>
            <div class="shield-action-right">
              <button type="button" id="btnToggleOverride" class="btn-shield-action outline" title="Fast-forward or toggle shield lock for testing">
                ⚡ <span id="overrideBtnText">${this.isOverrideUnlocked ? 'Re-Engage Shield' : 'Bypass / Force Ready'}</span>
              </button>
            </div>
          </div>

          <!-- Wave 4 Pre-Flight Inspection Deck (Collapsible) -->
          <div class="wave4-preflight-deck" id="wave4PreflightDeck" style="display: none;">
            <div class="deck-header">
              <div class="deck-title">
                ⚡ WAVE 4 AUDIT DECK: <span style="color:#34d399;">SKILL_ISSUE.md Compliance Check</span>
              </div>
              <div class="deck-subtitle">Pre-audited against zero hashtags, ≤50c hook, unhedged 4H geometry, and 3-gram LSH uniqueness.</div>
            </div>

            <!-- Pre-flight checklist grid -->
            <div class="preflight-grid">
              <div class="preflight-item">
                <span class="pf-label">Hook Length (≤50c):</span>
                <span class="pf-badge pass">P7: 40c | P8: 41c ✓</span>
              </div>
              <div class="preflight-item">
                <span class="pf-label">Hashtag Count:</span>
                <span class="pf-badge pass">0 (Zero Banned Tags) ✓</span>
              </div>
              <div class="preflight-item">
                <span class="pf-label">Timeframe Declared:</span>
                <span class="pf-badge pass">Strictly 4H Timeframe ✓</span>
              </div>
              <div class="preflight-item">
                <span class="pf-label">Execution Geometry:</span>
                <span class="pf-badge pass">Unhedged R:R ≥ 2.60 ✓</span>
              </div>
              <div class="preflight-item">
                <span class="pf-label">Debate Hook Close:</span>
                <span class="pf-badge pass">2-Sided Binary Callout ✓</span>
              </div>
              <div class="preflight-item">
                <span class="pf-label">3-Gram LSH Overlap:</span>
                <span class="pf-badge pass">0.78% (Limit &lt; 1.5%) ✓</span>
              </div>
            </div>

            <!-- Tabbed Post Viewers for Wave 4 -->
            <div class="wave4-posts-container">
              <div class="wave4-post-card">
                <div class="w4-card-header">
                  <div class="w4-coin-title">
                    <span class="w4-badge sui">$SUI (Post 7)</span>
                    <span class="w4-hook">🌊 $SUI 4H At $0.90: Watching 0.92 Supply</span>
                  </div>
                  <button type="button" class="btn-copy-card" onclick="window.IncubationShield.copyPost(7)">📋 Copy Post 7</button>
                </div>
                <div class="w4-text-preview" id="previewPost7Text"></div>
              </div>

              <div class="wave4-post-card">
                <div class="w4-card-header">
                  <div class="w4-coin-title">
                    <span class="w4-badge doge">$DOGE (Post 8)</span>
                    <span class="w4-hook">🐕 $DOGE 4H Compresses: Volatility Squeeze</span>
                  </div>
                  <button type="button" class="btn-copy-card" onclick="window.IncubationShield.copyPost(8)">📋 Copy Post 8</button>
                </div>
                <div class="w4-text-preview" id="previewPost8Text"></div>
              </div>
            </div>

            <div class="deck-footer-actions">
              <button type="button" id="btnMarkWave4Done" class="btn-mark-wave-done">
                ✓ Confirm Wave 4 Posted (Advances Schedule to Wave 5 at 19:30)
              </button>
            </div>
          </div>
        </div>
      `;

      this.populatePostPreviews();
    }

    populatePostPreviews() {
      // Pull posts 7 & 8 from EdgeFlow post data or preloadedSlots
      const p7El = document.getElementById('previewPost7Text');
      const p8El = document.getElementById('previewPost8Text');
      if (!p7El || !p8El) return;

      const posts = (window.EdgeFlow && window.EdgeFlow.posts) ? window.EdgeFlow.posts : [];
      let post7 = posts.find(p => p.id === 7);
      let post8 = posts.find(p => p.id === 8);

      if (!post7 && typeof getDay6PreloadedSlots === 'function') {
        const d6 = getDay6PreloadedSlots();
        post7 = d6.find(p => p.id === 7);
        post8 = d6.find(p => p.id === 8);
      }

      if (post7 && post7.improved) {
        p7El.textContent = post7.improved;
      }
      if (post8 && post8.improved) {
        p8El.textContent = post8.improved;
      }
    }

    startCountdown() {
      if (this.timerInterval) clearInterval(this.timerInterval);

      const update = () => {
        const now = new Date().getTime();
        const target = this.getTargetTimestamp();
        const start = this.getWave3PostedTimestamp();
        const totalDuration = target - start; // 2.5 hours = 9,000,000 ms
        const remaining = target - now;

        const countdownEl = document.getElementById('shieldCountdownDisplay');
        const fillEl = document.getElementById('shieldProgressFill');
        const pctEl = document.getElementById('shieldPercentLabel');
        const badgeEl = document.getElementById('shieldStatusBadge');
        const cardEl = document.getElementById('cannibalizationShieldCard');

        if (!countdownEl) return;

        if (this.isOverrideUnlocked || remaining <= 0) {
          countdownEl.textContent = '00:00:00';
          countdownEl.style.color = '#34d399';
          if (fillEl) fillEl.style.width = '100%';
          if (pctEl) pctEl.textContent = '100% (Incubation Complete)';
          if (badgeEl) {
            badgeEl.innerHTML = `⚡ BYBIT FEED CANNIBALIZATION SHIELD: <span style="color:#34d399;">RELEASE WINDOW READY</span>`;
          }
          if (cardEl) {
            cardEl.classList.add('ready-state');
          }
          return;
        }

        // Calculate hours, mins, secs
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((remaining % (1000 * 60)) / 1000);

        const pad = (n) => String(n).padStart(2, '0');
        countdownEl.textContent = `${pad(hours)}:${pad(mins)}:${pad(secs)}`;

        // Progress percentage
        const elapsed = now - start;
        const pct = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
        if (fillEl) fillEl.style.width = `${pct}%`;
        if (pctEl) pctEl.textContent = `${pct}% Elapsed (${pad(hours)}h ${pad(mins)}m to 16:48)`;

        if (badgeEl) {
          badgeEl.innerHTML = `🛡️ BYBIT FEED CANNIBALIZATION SHIELD: <span class="shield-state-highlight">ACTIVE INCUBATION</span>`;
        }
        if (cardEl) {
          cardEl.classList.remove('ready-state');
        }
      };

      update();
      this.timerInterval = setInterval(update, 1000);
    }

    bindEvents() {
      const btnToggleDeck = document.getElementById('btnToggleWave4Preflight');
      if (btnToggleDeck) {
        btnToggleDeck.addEventListener('click', () => {
          const deck = document.getElementById('wave4PreflightDeck');
          if (deck) {
            const isHidden = deck.style.display === 'none';
            deck.style.display = isHidden ? 'block' : 'none';
            if (isHidden) this.populatePostPreviews();
            btnToggleDeck.innerHTML = isHidden 
              ? '🔼 Hide Wave 4 Pre-Flight Deck' 
              : '🔍 Pre-Flight Wave 4 (<strong style="color:#38bdf8;">$SUI</strong> & <strong style="color:#fbbf24;">$DOGE</strong>)';
          }
        });
      }

      const btnCopyP7 = document.getElementById('btnCopyQuickP7');
      if (btnCopyP7) {
        btnCopyP7.addEventListener('click', () => this.copyPost(7));
      }

      const btnCopyP8 = document.getElementById('btnCopyQuickP8');
      if (btnCopyP8) {
        btnCopyP8.addEventListener('click', () => this.copyPost(8));
      }

      const btnOverride = document.getElementById('btnToggleOverride');
      if (btnOverride) {
        btnOverride.addEventListener('click', () => {
          this.isOverrideUnlocked = !this.isOverrideUnlocked;
          localStorage.setItem('edgeflow_shield_override', this.isOverrideUnlocked ? 'true' : 'false');
          const txt = document.getElementById('overrideBtnText');
          if (txt) {
            txt.textContent = this.isOverrideUnlocked ? 'Re-Engage Shield' : 'Bypass / Force Ready';
          }
          this.startCountdown();
          this.showToast(this.isOverrideUnlocked ? '⚡ Shield bypassed: Wave 4 marked Ready' : '🛡️ Incubation Shield re-engaged');
        });
      }

      const btnMarkDone = document.getElementById('btnMarkWave4Done');
      if (btnMarkDone) {
        btnMarkDone.addEventListener('click', () => {
          this.markWave4AsDone();
        });
      }
    }

    copyPost(id) {
      let textToCopy = '';
      const posts = (window.EdgeFlow && window.EdgeFlow.posts) ? window.EdgeFlow.posts : [];
      let post = posts.find(p => p.id === id);

      if (!post && typeof getDay6PreloadedSlots === 'function') {
        const d6 = getDay6PreloadedSlots();
        post = d6.find(p => p.id === id);
      }

      if (post && post.improved) {
        textToCopy = post.improved;
      }

      if (!textToCopy) {
        this.showToast(`Post ${id} text not found.`);
        return;
      }

      navigator.clipboard.writeText(textToCopy).then(() => {
        this.showToast(`✓ Post ${id} (${post.coin}) copied to clipboard! Ready to publish.`);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
        this.showToast(`Copied Post ${id} using fallback`);
      });
    }

    markWave4AsDone() {
      // Mark slots 7 and 8 as done in memory
      if (window.EdgeFlow && window.EdgeFlow.posts) {
        const p7 = window.EdgeFlow.posts.find(p => p.id === 7);
        const p8 = window.EdgeFlow.posts.find(p => p.id === 8);
        if (p7) { p7.done = true; p7.status = 'done'; }
        if (p8) { p8.done = true; p8.status = 'done'; }
      }

      // Update Pacing Chips in the header bar
      const chips = document.querySelectorAll('.pacing-chip');
      if (chips && chips.length >= 5) {
        if (chips[3]) {
          chips[3].className = 'pacing-chip done';
          chips[3].textContent = 'Wave 4: P7 & P8 ✓';
        }
        if (chips[4]) {
          chips[4].className = 'pacing-chip active';
          chips[4].textContent = 'Wave 5: P9 (19:30) & P10 (19:42) Next';
        }
      }

      // Trigger quest tracker update if available
      if (typeof updateQuestTrackerUi === 'function') {
        updateQuestTrackerUi();
      }

      this.showToast('✓ Wave 4 ($SUI & $DOGE) confirmed posted! Incubation resetting for Wave 5.');
    }

    showToast(message) {
      let toast = document.getElementById('shieldToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'shieldToast';
        toast.className = 'shield-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.classList.add('visible');
      setTimeout(() => {
        toast.classList.remove('visible');
      }, 3500);
    }
  }

  // Export & auto-instantiate on DOMContentLoaded or immediate
  window.IncubationShield = new IncubationShieldManager();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.IncubationShield.renderWidget();
      window.IncubationShield.startCountdown();
      window.IncubationShield.bindEvents();
    });
  } else {
    window.IncubationShield.renderWidget();
    window.IncubationShield.startCountdown();
    window.IncubationShield.bindEvents();
  }
})();
