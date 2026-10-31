// ================================================================================
// EdgeFlow Terminal: EFL (English Football League) Broadcast Hub
// Inspired by https://www.efl.com (Top Matchday Fixtures Ticker & Standings Table)
// ================================================================================
(function() {
  'use strict';

  const FIXTURES_DATA = [
    { id: 1, wave: 'W1', coin: '$BTC', tf: '4H', price: '$77.2K', status: 'ft', score: '3.92', label: 'FT' },
    { id: 2, wave: 'W1', coin: '$ETH', tf: '4H', price: '$2,240', status: 'ft', score: '3.92', label: 'FT' },
    { id: 3, wave: 'W2', coin: '$SOL', tf: '4H', price: '$95.58', status: 'ft', score: '3.92', label: 'FT' },
    { id: 4, wave: 'W2', coin: '$XRP', tf: '4H', price: '$1.25',  status: 'ft', score: '3.92', label: 'FT' },
    { id: 5, wave: 'W3', coin: '$NEAR', tf: '4H', price: '$4.31', status: 'ft', score: '3.92', label: 'FT' },
    { id: 6, wave: 'W3', coin: '$BNB', tf: '4H', price: '$703',   status: 'ft', score: '3.92', label: 'FT' },
    { id: 7, wave: 'W4', coin: '$SUI', tf: '4H', price: '$0.899', status: 'ft', score: '3.92', label: 'FT' },
    { id: 8, wave: 'W4', coin: '$DOGE', tf: '4H', price: '$0.075', status: 'ft', score: '3.92', label: 'FT' },
    { id: 9, wave: 'W5', coin: '$XAUT', tf: '4H', price: '$3,878', status: 'ft', score: '3.92', label: 'FT' },
    { id: 10, wave: 'W5', coin: '$AAVE', tf: '4H', price: '$130.0', status: 'ft', score: '3.92', label: 'FT' },
    { id: 11, wave: 'W6', coin: '$LINK', tf: '4H', price: '$11.48', status: 'live', time: '22:12', label: '22:12 KO' },
    { id: 12, wave: 'W6', coin: '$ONDO', tf: '4H', price: '$0.410', status: 'upcoming', time: '22:25', label: 'FINAL' }
  ];

  class EflBroadcastManager {
    constructor() {
      this.fixtures = FIXTURES_DATA;
      this.selectedPostId = 11;
      this.init();
    }

    init() {
      this.injectTickerRibbon();
      this.injectEflHeaderBranding();
      this.injectStandingsSection();
      this.bindEvents();
      this.observePostChanges();
    }

    injectTickerRibbon() {
      if (document.getElementById('eflTickerRibbon')) return;

      const shell = document.querySelector('.app-shell');
      if (!shell) return;

      const ribbon = document.createElement('div');
      ribbon.id = 'eflTickerRibbon';
      ribbon.className = 'efl-ticker-ribbon';

      let fixturesHtml = this.fixtures.map(f => {
        const isSelected = f.id === this.selectedPostId;
        const activeCls = isSelected ? 'active-match' : '';
        const statusCls = f.status === 'ft' ? 'ft' : (f.status === 'live' ? 'live' : 'upcoming');
        return `
          <div class="efl-match-card ${activeCls}" data-post-id="${f.id}" title="Click to view Match ${f.id} (${f.coin})">
            <div class="efl-match-header">
              <span>${f.wave} • ${f.tf}</span>
              <span class="efl-match-status ${statusCls}">${f.label}</span>
            </div>
            <div class="efl-match-teams">
              <span>${f.coin}</span>
              <span style="font-size:0.68rem; font-family:var(--efl-font-mono); color:var(--efl-sky-blue);">${f.price}</span>
            </div>
          </div>
        `;
      }).join('');

      ribbon.innerHTML = `
        <div class="efl-ticker-badge">
          <span>⚽ EFL MATCHDAY 6</span>
        </div>
        <div class="efl-fixtures-scroll" id="eflFixturesScroll">
          ${fixturesHtml}
        </div>
      `;

      shell.insertBefore(ribbon, shell.firstChild);
    }

    injectEflHeaderBranding() {
      const brandH1 = document.querySelector('.brand h1');
      if (brandH1 && !brandH1.dataset.eflFormatted) {
        brandH1.dataset.eflFormatted = 'true';
        brandH1.innerHTML = `BYBIT CREATOR CHAMPIONSHIP <span style="font-size:0.7rem; font-weight:800; color:var(--efl-sky-blue); padding:2px 8px; border-radius:4px; background:rgba(0,163,224,0.15); border:1px solid rgba(0,163,224,0.3); margin-left:8px;">SKY BET EFL EDITION</span>`;
      }
    }

    injectStandingsSection() {
      if (document.getElementById('eflStandingsCard')) return;

      const workspace = document.getElementById('postWorkspaceWrapper');
      if (!workspace) return;

      const standingsCard = document.createElement('section');
      standingsCard.id = 'eflStandingsCard';
      standingsCard.className = 'efl-standings-card';

      const rowsHtml = this.fixtures.map((f, idx) => {
        const isPromotion = idx < 4;
        const isPlayoff = idx >= 4 && idx < 8;
        const rowClass = isPromotion ? 'promotion-zone' : (isPlayoff ? 'playoff-zone' : '');
        const isFt = f.status === 'ft';
        const isLive = f.status === 'live';

        let formHtml = '';
        if (isFt) {
          formHtml = `<span class="efl-form-dots"><span class="efl-dot w" title="Banked / Done"></span><span class="efl-dot w"></span><span class="efl-dot w"></span></span>`;
        } else if (isLive) {
          formHtml = `<span class="efl-form-dots"><span class="efl-dot w"></span><span class="efl-dot d" title="In Play / Wave 5"></span><span class="efl-dot p"></span></span>`;
        } else {
          formHtml = `<span class="efl-form-dots"><span class="efl-dot p"></span><span class="efl-dot p"></span><span class="efl-dot p"></span></span>`;
        }

        const rr = idx % 2 === 0 ? '1:2.80' : '1:2.65';
        const statusBadge = isFt 
          ? `<span class="efl-match-status ft">DONE ✓</span>`
          : (isLive ? `<span class="efl-match-status live">19:30 KO</span>` : `<span class="efl-match-status upcoming">UPCOMING</span>`);

        return `
          <tr class="${rowClass}" style="cursor:pointer;" onclick="if(window.EdgeFlow&&window.EdgeFlow.selectPost)window.EdgeFlow.selectPost(${f.id});if(window.EflBroadcast)window.EflBroadcast.selectFixture(${f.id});">
            <td><span class="efl-pos-badge">${f.id}</span></td>
            <td>
              <div class="efl-coin-cell">
                <span>${f.coin}</span>
                <span style="font-size:0.65rem; color:var(--efl-text-secondary);">${f.tf}</span>
              </div>
            </td>
            <td>${f.wave}</td>
            <td>${f.price}</td>
            <td>${statusBadge}</td>
            <td>${formHtml}</td>
            <td style="font-family:var(--efl-font-mono);">${rr}</td>
            <td style="font-weight:800; color:#34d399;">+${f.score || '3.92'}</td>
            <td>
              <button type="button" class="btn-copy-card" style="padding:2px 7px; font-size:0.64rem;" onclick="event.stopPropagation();if(window.IncubationShield)window.IncubationShield.copyPost(${f.id});">📋 Copy</button>
            </td>
          </tr>
        `;
      }).join('');

      standingsCard.innerHTML = `
        <div class="efl-standings-header">
          <div class="efl-table-title">
            <span class="trophy">🏆</span> SKY BET CHAMPIONSHIP TABLE: <span style="color:var(--efl-sky-blue);">DAY 6 FIXTURES & FORM GUIDE</span>
          </div>
          <div style="font-size:0.72rem; color:var(--efl-text-secondary); display:flex; align-items:center; gap:12px;">
            <span>🟢 Promotion Zone (Banked 8/12 - 66.7%)</span>
            <span>🔵 Playoff Cut (Next Wave 5: 19:30)</span>
            <button type="button" id="btnToggleTableCollapse" style="background:rgba(255,255,255,0.06); border:1px solid var(--efl-navy-border); color:#ffffff; padding:3px 9px; border-radius:4px; font-size:0.68rem; cursor:pointer;">Collapse / Expand Table</button>
          </div>
        </div>

        <div style="overflow-x:auto;" id="eflTableWrapper">
          <table class="efl-league-table">
            <thead>
              <tr>
                <th>POS</th>
                <th>PERPETUAL ASSET</th>
                <th>WAVE</th>
                <th>REFERENCE</th>
                <th>STATUS</th>
                <th>FORM</th>
                <th>R:R</th>
                <th>EXP PTS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `;

      workspace.appendChild(standingsCard);
    }

    selectFixture(id) {
      this.selectedPostId = id;
      document.querySelectorAll('.efl-match-card').forEach(card => {
        const cardId = parseInt(card.getAttribute('data-post-id'), 10);
        if (cardId === id) {
          card.classList.add('active-match');
        } else {
          card.classList.remove('active-match');
        }
      });
    }

    observePostChanges() {
      document.addEventListener('click', (e) => {
        const pill = e.target.closest('.pill-btn');
        if (pill) {
          const index = parseInt(pill.getAttribute('data-index'), 10);
          if (!isNaN(index)) {
            const postId = index + 1;
            this.selectFixture(postId);
          }
        }
      });
    }

    bindEvents() {
      document.querySelectorAll('.efl-match-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = parseInt(card.getAttribute('data-post-id'), 10);
          this.selectFixture(id);
          if (window.EdgeFlow && typeof window.EdgeFlow.selectPost === 'function') {
            window.EdgeFlow.selectPost(id);
          } else if (typeof window.selectSlot === 'function') {
            window.selectSlot(id);
          }
        });
      });

      const btnCollapse = document.getElementById('btnToggleTableCollapse');
      if (btnCollapse) {
        btnCollapse.addEventListener('click', () => {
          const wrapper = document.getElementById('eflTableWrapper');
          if (wrapper) {
            const isHidden = wrapper.style.display === 'none';
            wrapper.style.display = isHidden ? 'block' : 'none';
            btnCollapse.textContent = isHidden ? 'Collapse Table' : 'Expand Table';
          }
        });
      }
    }
  }

  window.EflBroadcast = new EflBroadcastManager();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.EflBroadcast.init();
    });
  } else {
    window.EflBroadcast.init();
  }
})();
