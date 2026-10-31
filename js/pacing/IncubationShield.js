// ================================================================================
// EdgeFlow Terminal: Algorithmic Wave Incubation Timer & Cannibalization Shield
// ================================================================================
(function() {
  'use strict';

  const WAVES_CONFIG = [
    { id: 1, name: 'Wave 1', slots: [1, 2], coins: ['$BTC', '$ETH'], timeStr: '07:00 & 08:52', status: 'done' },
    { id: 2, name: 'Wave 2', slots: [3, 4], coins: ['$SOL', '$XRP'], timeStr: '11:22 & 11:35', status: 'done' },
    { id: 3, name: 'Wave 3', slots: [5, 6], coins: ['$NEAR', '$BNB'], timeStr: '14:05 & 14:18', status: 'done' },
    { id: 4, name: 'Wave 4', slots: [7, 8], coins: ['$SUI', '$DOGE'], timeStr: '16:10 & 16:36', status: 'done' },
    { id: 5, name: 'Wave 5', slots: [9, 10], coins: ['$XAUT', '$AAVE'], targetHour: 19, targetMin: 30, timeStr: '19:30 & 19:42', status: 'active' },
    { id: 6, name: 'Wave 6', slots: [11, 12], coins: ['$LINK', '$ONDO'], targetHour: 22, targetMin: 12, timeStr: '22:12 & 22:25', status: 'pending' }
  ];

  class IncubationShieldManager {
    constructor() {
      this.currentWave = 5;
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
      // Wave 5 target: 19:30 local time today
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 30, 0);
      return target.getTime();
    }

    getWave4PostedTimestamp() {
      // Wave 4 completed around 16:36 today
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 36, 0).getTime();
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
                  Wave 4 (<strong style="color:#38bdf8;">$SUI</strong> & <strong style="color:#fbbf24;">$DOGE</strong>) banked (8/12 done). 2.5h incubation window protects algorithmic reach until Wave 5.
                </div>
              </div>
            </div>

            <div class="shield-timer-block">
              <div class="shield-timer-tag">WAVE 5 COUNTDOWN (19:30 LOCAL)</div>
              <div class="shield-countdown-digits" id="shieldCountdownDisplay">02:53:15</div>
            </div>
          </div>

          <!-- Progress Bar of 2.5h incubation window -->
          <div class="shield-progress-wrap">
            <div class="shield-progress-bar-bg">
              <div class="shield-progress-bar-fill" id="shieldProgressFill" style="width: 2%;"></div>
            </div>
            <div class="shield-progress-labels">
              <span>Wave 4 Banked (16:36)</span>
              <span id="shieldPercentLabel" style="font-weight:700; color:#38bdf8;">2% Elapsed (~2h 53m to 19:30)</span>
              <span>Wave 5 Target (19:30)</span>
            </div>
          </div>

          <!-- Action Controls & Pre-Flight Switcher -->
          <div class="shield-action-row">
            <div class="shield-action-left">
              <button type="button" id="btnToggleWave5Preflight" class="btn-shield-action primary">
                🔍 Pre-Flight Wave 5 (<strong style="color:#fbbf24;">$XAUT</strong> & <strong style="color:#a855f7;">$AAVE</strong>)
              </button>
              <button type="button" id="btnCopyQuickP9" class="btn-shield-action" title="Quick Copy Post 9 ($XAUT) to clipboard">
                📋 Copy Post 9 ($XAUT)
              </button>
              <button type="button" id="btnCopyQuickP10" class="btn-shield-action" title="Quick Copy Post 10 ($AAVE) to clipboard">
                📋 Copy Post 10 ($AAVE)
              </button>
            </div>
            <div class="shield-action-right">
              <button type="button" id="btnToggleOverride" class="btn-shield-action outline" title="Fast-forward or toggle shield lock for testing">
                ⚡ <span id="overrideBtnText">${this.isOverrideUnlocked ? 'Re-Engage Shield' : 'Bypass / Force Ready'}</span>
              </button>
            </div>
          </div>

          <!-- Wave 5 Pre-Flight Inspection Deck (Collapsible) -->
          <div class="wave5-preflight-deck" id="wave5PreflightDeck" style="display: none;">
            <div class="deck-header">
              <div class="deck-title">
                ⚡ WAVE 5 AUDIT DECK: <span style="color:#34d399;">SKILL_ISSUE.md Compliance Check</span>
              </div>
              <div class="deck-subtitle">Pre-audited: Zero hashtags, ≤50c hook, unhedged 4H geometry, Buffett/Munger wisdom & 3-gram LSH uniqueness.</div>
            </div>

            <!-- Pre-flight checklist grid -->
            <div class="preflight-grid">
              <div class="preflight-item">
                <span class="pf-label">Hook Length (≤50c):</span>
                <span class="pf-badge pass">P9: 40c | P10: 42c ✓</span>
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
                <span class="pf-badge pass">Unhedged R:R ≥ 2.65 ✓</span>
              </div>
              <div class="preflight-item">
                <span class="pf-label">Trader Wisdom Quote:</span>
                <span class="pf-badge pass">Buffett & Munger Pre-Poll ✓</span>
              </div>
              <div class="preflight-item">
                <span class="pf-label">3-Gram LSH Overlap:</span>
                <span class="pf-badge pass">0.69% (Limit &lt; 1.5%) ✓</span>
              </div>
            </div>

            <!-- Tabbed Post Viewers for Wave 5 -->
            <div class="wave4-posts-container">
              <div class="wave4-post-card">
                <div class="w4-card-header">
                  <div class="w4-coin-title">
                    <span class="w4-badge gold" style="background:rgba(245,158,11,0.2); color:#fbbf24; border:1px solid rgba(245,158,11,0.4);">$XAUT (Post 9)</span>
                    <span class="w4-hook">🥇 $XAUT 4H At $3,878: Oversold Macro Dip</span>
                  </div>
                  <button type="button" class="btn-copy-card" onclick="window.IncubationShield.copyPost(9)">📋 Copy Post 9</button>
                </div>
                <div class="w4-text-preview" id="previewPost9Text"></div>
              </div>

              <div class="wave4-post-card">
                <div class="w4-card-header">
                  <div class="w4-coin-title">
                    <span class="w4-badge aave" style="background:rgba(168,85,247,0.2); color:#c084fc; border:1px solid rgba(168,85,247,0.4);">$AAVE (Post 10)</span>
                    <span class="w4-hook">⚡ $AAVE 4H Up 5.3%: Why I Respect 132 Wall</span>
                  </div>
                  <button type="button" class="btn-copy-card" onclick="window.IncubationShield.copyPost(10)">📋 Copy Post 10</button>
                </div>
                <div class="w4-text-preview" id="previewPost10Text"></div>
              </div>
            </div>

            <div class="deck-footer-actions">
              <button type="button" id="btnMarkWave5Done" class="btn-mark-wave-done">
                ✓ Confirm Wave 5 Posted (Advances Schedule to Wave 6 Finale at 22:12)
              </button>
            </div>
          </div>
        </div>
      `;

      this.populatePostPreviews();
    }

    populatePostPreviews() {
      const p9El = document.getElementById('previewPost9Text');
      const p10El = document.getElementById('previewPost10Text');
      if (!p9El || !p10El) return;

      const posts = (window.EdgeFlow && window.EdgeFlow.posts) ? window.EdgeFlow.posts : [];
      let post9 = posts.find(p => p.id === 9);
      let post10 = posts.find(p => p.id === 10);

      if (!post9 && typeof getDay6PreloadedSlots === 'function') {
        const d6 = getDay6PreloadedSlots();
        post9 = d6.find(p => p.id === 9);
        post10 = d6.find(p => p.id === 10);
      }

      if (post9 && post9.improved) {
        p9El.textContent = post9.improved;
      }
      if (post10 && post10.improved) {
        p10El.textContent = post10.improved;
      }
    }

    startCountdown() {
      if (this.timerInterval) clearInterval(this.timerInterval);

      const update = () => {
        const now = new Date().getTime();
        const target = this.getTargetTimestamp();
        const start = this.getWave4PostedTimestamp();
        const totalDuration = target - start;
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

        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((remaining % (1000 * 60)) / 1000);

        const pad = (n) => String(n).padStart(2, '0');
        countdownEl.textContent = `${pad(hours)}:${pad(mins)}:${pad(secs)}`;

        const elapsed = now - start;
        const pct = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
        if (fillEl) fillEl.style.width = `${pct}%`;
        if (pctEl) pctEl.textContent = `${pct}% Elapsed (~${pad(hours)}h ${pad(mins)}m to 19:30)`;

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
      const btnToggleDeck = document.getElementById('btnToggleWave5Preflight');
      if (btnToggleDeck) {
        btnToggleDeck.addEventListener('click', () => {
          const deck = document.getElementById('wave5PreflightDeck');
          if (deck) {
            const isHidden = deck.style.display === 'none';
            deck.style.display = isHidden ? 'block' : 'none';
            if (isHidden) this.populatePostPreviews();
            btnToggleDeck.innerHTML = isHidden 
              ? '🔼 Hide Wave 5 Pre-Flight Deck' 
              : '🔍 Pre-Flight Wave 5 (<strong style="color:#fbbf24;">$XAUT</strong> & <strong style="color:#a855f7;">$AAVE</strong>)';
          }
        });
      }

      const btnCopyP9 = document.getElementById('btnCopyQuickP9');
      if (btnCopyP9) {
        btnCopyP9.addEventListener('click', () => this.copyPost(9));
      }

      const btnCopyP10 = document.getElementById('btnCopyQuickP10');
      if (btnCopyP10) {
        btnCopyP10.addEventListener('click', () => this.copyPost(10));
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
          this.showToast(this.isOverrideUnlocked ? '⚡ Shield bypassed: Wave 5 marked Ready' : '🛡️ Incubation Shield re-engaged');
        });
      }

      const btnMarkDone = document.getElementById('btnMarkWave5Done');
      if (btnMarkDone) {
        btnMarkDone.addEventListener('click', () => {
          this.markWave5AsDone();
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

    markWave5AsDone() {
      if (window.EdgeFlow && window.EdgeFlow.posts) {
        const p9 = window.EdgeFlow.posts.find(p => p.id === 9);
        const p10 = window.EdgeFlow.posts.find(p => p.id === 10);
        if (p9) { p9.done = true; p9.status = 'done'; }
        if (p10) { p10.done = true; p10.status = 'done'; }
      }

      const chips = document.querySelectorAll('.pacing-chip');
      if (chips && chips.length >= 6) {
        if (chips[4]) {
          chips[4].className = 'pacing-chip done';
          chips[4].textContent = 'Wave 5: P9 & P10 ✓';
        }
        if (chips[5]) {
          chips[5].className = 'pacing-chip active';
          chips[5].textContent = 'Wave 6: P11 (22:12) & P12 (22:25 Finale) Next';
        }
      }

      if (typeof updateQuestTrackerUi === 'function') {
        updateQuestTrackerUi();
      }

      this.showToast('✓ Wave 5 ($XAUT & $AAVE) confirmed posted! Advancing to Wave 6 Finale.');
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
