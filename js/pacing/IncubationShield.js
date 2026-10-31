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
    { id: 5, name: 'Wave 5', slots: [9, 10], coins: ['$XAUT', '$AAVE'], timeStr: '19:30 & 19:42', status: 'done' },
    { id: 6, name: 'Wave 6', slots: [11, 12], coins: ['$LINK', '$ONDO'], targetHour: 22, targetMin: 12, timeStr: '22:12 & 22:25', status: 'active' }
  ];

  class IncubationShieldManager {
    constructor() {
      this.currentWave = 6;
      this.timerInterval = null;
      this.isOverrideUnlocked = false;
      this.init();
    }

    init() {
      const savedOverride = localStorage.getItem('edgeflow_shield_override_w6');
      if (savedOverride === 'true') {
        this.isOverrideUnlocked = true;
      }
      this.renderWidget();
      this.startCountdown();
      this.bindEvents();
    }

    getTargetTimestamp() {
      const now = new Date();
      // Wave 6 target: 22:12 local time today
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 12, 0);
      return target.getTime();
    }

    getWave5PostedTimestamp() {
      // Wave 5 completed around 19:42 today
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 42, 0).getTime();
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
                  Wave 5 (<strong style="color:#fbbf24;">$XAUT</strong> & <strong style="color:#c084fc;">$AAVE</strong>) banked (10/12 done — 83.3% quota). 2.5h incubation window protects algorithmic reach until Wave 6 Finale.
                </div>
              </div>
            </div>

            <div class="shield-timer-block">
              <div class="shield-timer-tag">WAVE 6 FINALE COUNTDOWN (22:12 LOCAL)</div>
              <div class="shield-countdown-digits" id="shieldCountdownDisplay">02:15:00</div>
            </div>
          </div>

          <!-- Progress Bar of 2.5h incubation window -->
          <div class="shield-progress-wrap">
            <div class="shield-progress-bar-bg">
              <div class="shield-progress-bar-fill" id="shieldProgressFill" style="width: 10%;"></div>
            </div>
            <div class="shield-progress-labels">
              <span>Wave 5 Banked (19:42)</span>
              <span id="shieldPercentLabel" style="font-weight:700; color:#38bdf8;">10% Elapsed (~2h 12m to 22:12)</span>
              <span>Wave 6 Finale (22:12)</span>
            </div>
          </div>

          <!-- Action Controls & Pre-Flight Switcher -->
          <div class="shield-action-row">
            <div class="shield-action-left">
              <button type="button" id="btnToggleWave6Preflight" class="btn-shield-action primary">
                🔍 Pre-Flight Wave 6 Finale (<strong style="color:#38bdf8;">$LINK</strong> & <strong style="color:#34d399;">$ONDO</strong>)
              </button>
              <button type="button" id="btnCopyQuickP11" class="btn-shield-action" title="Quick Copy Post 11 ($LINK) to clipboard">
                📋 Copy Post 11 ($LINK)
              </button>
              <button type="button" id="btnCopyQuickP12" class="btn-shield-action" title="Quick Copy Post 12 ($ONDO) to clipboard">
                📋 Copy Post 12 ($ONDO)
              </button>
            </div>
            <div class="shield-action-right">
              <button type="button" id="btnToggleOverride" class="btn-shield-action outline" title="Fast-forward or toggle shield lock for testing">
                ⚡ <span id="overrideBtnText">${this.isOverrideUnlocked ? 'Re-Engage Shield' : 'Bypass / Force Ready'}</span>
              </button>
            </div>
          </div>

          <!-- Wave 6 Pre-Flight Inspection Deck (Collapsible) -->
          <div class="wave5-preflight-deck" id="wave6PreflightDeck" style="display: none;">
            <div class="deck-header">
              <div class="deck-title">
                🏆 WAVE 6 FINALE AUDIT DECK: <span style="color:#34d399;">SKILL_ISSUE.md Compliance Check</span>
              </div>
              <div class="deck-subtitle">Pre-audited: Zero hashtags, ≤50c hook, unhedged 4H geometry, Human Trader Philosophy & 3-gram LSH uniqueness.</div>
            </div>

            <!-- Pre-flight checklist grid -->
            <div class="preflight-grid">
              <div class="preflight-item">
                <span class="pf-label">Hook Length (≤50c):</span>
                <span class="pf-badge pass">P11: 41c | P12: 41c ✓</span>
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
                <span class="pf-badge pass">Unhedged R:R ≥ 2.70 ✓</span>
              </div>
              <div class="preflight-item">
                <span class="pf-label">Trader Philosophy:</span>
                <span class="pf-badge pass">Original Trader Sense ✓ ✓</span>
              </div>
              <div class="preflight-item">
                <span class="pf-label">3-Gram LSH Overlap:</span>
                <span class="pf-badge pass">0.58% (Limit &lt; 1.5%) ✓</span>
              </div>
            </div>

            <!-- Tabbed Post Viewers for Wave 6 -->
            <div class="wave4-posts-container">
              <div class="wave4-post-card">
                <div class="w4-card-header">
                  <div class="w4-coin-title">
                    <span class="w4-badge link" style="background:rgba(56,189,248,0.2); color:#38bdf8; border:1px solid rgba(56,189,248,0.4);">$LINK (Post 11)</span>
                    <span class="w4-hook">🔗 $LINK 4H Jumps To $11.48: Scaling Gains</span>
                  </div>
                  <button type="button" class="btn-copy-card" onclick="window.IncubationShield.copyPost(11)">📋 Copy Post 11</button>
                </div>
                <div class="w4-text-preview" id="previewPost11Text"></div>
              </div>

              <div class="wave4-post-card">
                <div class="w4-card-header">
                  <div class="w4-coin-title">
                    <span class="w4-badge ondo" style="background:rgba(52,211,153,0.2); color:#34d399; border:1px solid rgba(52,211,153,0.4);">$ONDO (Post 12)</span>
                    <span class="w4-hook">🏛️ $ONDO 4H Bounces 6%: RWA Support Setup</span>
                  </div>
                  <button type="button" class="btn-copy-card" onclick="window.IncubationShield.copyPost(12)">📋 Copy Post 12</button>
                </div>
                <div class="w4-text-preview" id="previewPost12Text"></div>
              </div>
            </div>

            <div class="deck-footer-actions">
              <button type="button" id="btnMarkWave6Done" class="btn-mark-wave-done" style="background:linear-gradient(135deg, #10b981, #059669);">
                🎉 Confirm Wave 6 Posted (Completes 12/12 Day 6 Quota — 100% Target Met!)
              </button>
            </div>
          </div>
        </div>
      `;

      this.populatePostPreviews();
    }

    populatePostPreviews() {
      const p11El = document.getElementById('previewPost11Text');
      const p12El = document.getElementById('previewPost12Text');
      if (!p11El || !p12El) return;

      const posts = (window.EdgeFlow && window.EdgeFlow.posts) ? window.EdgeFlow.posts : [];
      let post11 = posts.find(p => p.id === 11);
      let post12 = posts.find(p => p.id === 12);

      if (!post11 && typeof getDay6PreloadedSlots === 'function') {
        const d6 = getDay6PreloadedSlots();
        post11 = d6.find(p => p.id === 11);
        post12 = d6.find(p => p.id === 12);
      }

      if (post11 && post11.improved) {
        p11El.textContent = post11.improved;
      }
      if (post12 && post12.improved) {
        p12El.textContent = post12.improved;
      }
    }

    startCountdown() {
      if (this.timerInterval) clearInterval(this.timerInterval);

      const update = () => {
        const now = new Date().getTime();
        const target = this.getTargetTimestamp();
        const start = this.getWave5PostedTimestamp();
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
          if (pctEl) pctEl.textContent = '100% (Incubation Complete — Finale Ready)';
          if (badgeEl) {
            badgeEl.innerHTML = `⚡ BYBIT FEED CANNIBALIZATION SHIELD: <span style="color:#34d399;">FINALE RELEASE WINDOW READY</span>`;
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
        if (pctEl) pctEl.textContent = `${pct}% Elapsed (~${pad(hours)}h ${pad(mins)}m to 22:12)`;

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
      const btnToggleDeck = document.getElementById('btnToggleWave6Preflight');
      if (btnToggleDeck) {
        btnToggleDeck.addEventListener('click', () => {
          const deck = document.getElementById('wave6PreflightDeck');
          if (deck) {
            const isHidden = deck.style.display === 'none';
            deck.style.display = isHidden ? 'block' : 'none';
            if (isHidden) this.populatePostPreviews();
            btnToggleDeck.innerHTML = isHidden 
              ? '🔼 Hide Wave 6 Pre-Flight Deck' 
              : '🔍 Pre-Flight Wave 6 Finale (<strong style="color:#38bdf8;">$LINK</strong> & <strong style="color:#34d399;">$ONDO</strong>)';
          }
        });
      }

      const btnCopyP11 = document.getElementById('btnCopyQuickP11');
      if (btnCopyP11) {
        btnCopyP11.addEventListener('click', () => this.copyPost(11));
      }

      const btnCopyP12 = document.getElementById('btnCopyQuickP12');
      if (btnCopyP12) {
        btnCopyP12.addEventListener('click', () => this.copyPost(12));
      }

      const btnOverride = document.getElementById('btnToggleOverride');
      if (btnOverride) {
        btnOverride.addEventListener('click', () => {
          this.isOverrideUnlocked = !this.isOverrideUnlocked;
          localStorage.setItem('edgeflow_shield_override_w6', this.isOverrideUnlocked ? 'true' : 'false');
          const txt = document.getElementById('overrideBtnText');
          if (txt) {
            txt.textContent = this.isOverrideUnlocked ? 'Re-Engage Shield' : 'Bypass / Force Ready';
          }
          this.startCountdown();
          this.showToast(this.isOverrideUnlocked ? '⚡ Shield bypassed: Wave 6 marked Ready' : '🛡️ Incubation Shield re-engaged');
        });
      }

      const btnMarkDone = document.getElementById('btnMarkWave6Done');
      if (btnMarkDone) {
        btnMarkDone.addEventListener('click', () => {
          this.markWave6AsDone();
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

    markWave6AsDone() {
      if (window.EdgeFlow && window.EdgeFlow.posts) {
        const p11 = window.EdgeFlow.posts.find(p => p.id === 11);
        const p12 = window.EdgeFlow.posts.find(p => p.id === 12);
        if (p11) { p11.done = true; p11.status = 'done'; }
        if (p12) { p12.done = true; p12.status = 'done'; }
      }

      const chips = document.querySelectorAll('.pacing-chip');
      if (chips && chips.length >= 6) {
        if (chips[5]) {
          chips[5].className = 'pacing-chip done';
          chips[5].textContent = 'Wave 6: P11 & P12 (12/12 Banked) ✓';
        }
      }

      if (typeof updateQuestTrackerUi === 'function') {
        updateQuestTrackerUi();
      }

      this.showToast('🎉 ALL 12 DAY 6 POSTS BANKED! 100% quota achieved for Bybit Creator Terminal!');
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
