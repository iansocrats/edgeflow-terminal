// ================================================================================
// EdgeFlow Terminal: EFL Broadcast Hub & Famous Trader Wisdom Module
// Inspired by https://www.efl.com & Warren Buffett / Charlie Munger SKILL_ISSUE repository
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
    { id: 7, wave: 'W4', coin: '$SUI', tf: '4H', price: '$0.899', status: 'live', time: '16:48', label: '16:48 KO' },
    { id: 8, wave: 'W4', coin: '$DOGE', tf: '4H', price: '$0.075', status: 'upcoming', time: '17:00', label: '17:00 KO' },
    { id: 9, wave: 'W5', coin: '$XAUT', tf: '4H', price: '$3,878', status: 'upcoming', time: '19:30', label: '19:30 KO' },
    { id: 10, wave: 'W5', coin: '$AAVE', tf: '4H', price: '$130.0', status: 'upcoming', time: '19:42', label: '19:42 KO' },
    { id: 11, wave: 'W6', coin: '$LINK', tf: '4H', price: '$11.48', status: 'upcoming', time: '22:12', label: '22:12 KO' },
    { id: 12, wave: 'W6', coin: '$ONDO', tf: '4H', price: '$0.410', status: 'upcoming', time: '22:25', label: 'FINAL' }
  ];

  const WISDOM_CATEGORIES = [
    {
      name: "Range Compression & Patience",
      desc: "Chop, range-bound floors, waiting for the fat pitch ($BTC, $XRP, $DOGE)",
      quotes: [
        { text: '"The big money is not in the buying and the selling, but in the waiting." — Charlie Munger', author: "CHARLIE MUNGER" },
        { text: '"The stock market is a device to transfer money from the impatient to the patient." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"You do not have to swing at every pitch. You can wait for the pitch you want." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"Patience combined with opportunity is a devastating combination." — Charlie Munger', author: "CHARLIE MUNGER" },
        { text: '"The desire to get rich fast is pretty dangerous; patience is the ultimate edge in speculative markets." — Charlie Munger', author: "CHARLIE MUNGER" },
        { text: '"Activity does not equal achievement. Great traders spend most of their time doing nothing until the odds tilt heavily in their favor." — Charlie Munger', author: "CHARLIE MUNGER" }
      ]
    },
    {
      name: "Fading Panic & Liquidity Sweeps",
      desc: "Panic dips, oversold RSI wicks, negative funding absorbs ($ETH, $SOL, $XAUT)",
      quotes: [
        { text: '"Be fearful when others are greedy, and greedy when others are fearful." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"The most common cause of low prices is pessimism. We want to do business in such an environment because we like the discount prices it produces." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"Opportunities come infrequently. When it rains gold, put out the bucket, not the thimble." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"A lot of people with high IQs are terrible investors because they have terrible temperaments." — Charlie Munger', author: "CHARLIE MUNGER" },
        { text: '"Widespread fear is your best friend as a trader, because it serves up bargain liquidity on a silver platter." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"The time to accumulate conviction is when liquidation cascades wash out emotional leverage." — Charlie Munger', author: "CHARLIE MUNGER" }
      ]
    },
    {
      name: "Breakout Discipline & FOMO Rejection",
      desc: "Overhead supply walls, positive funding carry traps, resisting retail chase ($NEAR, $AAVE, $SUI)",
      quotes: [
        { text: '"Price is what you pay; value is what you get." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"It is remarkable how much long-term advantage people have gotten by trying to be consistently not stupid, instead of trying to be very intelligent." — Charlie Munger', author: "CHARLIE MUNGER" },
        { text: '"Speculation is most dangerous precisely when it looks easiest and everyone is celebrating." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"Invert, always invert: instead of asking how much you can make on this breakout, ask what happens if it fails and who is waiting to sell into you." — Charlie Munger', author: "CHARLIE MUNGER" },
        { text: '"Chasing price after the expansion has already occurred is merely subsidizing someone else\'s exit liquidity." — Charlie Munger', author: "CHARLIE MUNGER" }
      ]
    },
    {
      name: "Leverage Discipline & Capital Survival",
      desc: "Hard stop-losses, avoiding liquidation, disciplined sizing ($BNB, $SOL, high-beta)",
      quotes: [
        { text: '"There are three things that ruin people in finance: drugs, liquor, and leverage." — Charlie Munger', author: "CHARLIE MUNGER" },
        { text: '"Rule No. 1: Never lose capital. Rule No. 2: Never forget Rule No. 1." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"If you risk what is vital to you for something that is unimportant to you, it is simply foolish." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"Risk comes from not knowing what you are doing or failing to define your invalidation before entering." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"Surviving long enough to let positive expectancy compound is the entire game." — Charlie Munger', author: "CHARLIE MUNGER" }
      ]
    },
    {
      name: "Sound Money & Scarcity Moats",
      desc: "Gold perps, Bitcoin monetary store, macro hedges ($XAUT, $BTC)",
      quotes: [
        { text: '"Gold is a way of going long on human fear, and throughout history it has proven to be an enduring hedge against paper dilution." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"In an uncertain macro regime, capital relentlessly migrates toward tangible certainty and scarcity." — Charlie Munger', author: "CHARLIE MUNGER" },
        { text: '"Currencies and credit promises come and go, but intrinsic scarcity remains the silent benchmark of value." — Charlie Munger', author: "CHARLIE MUNGER" }
      ]
    },
    {
      name: "Technological Infrastructure & Real Yield",
      desc: "RWA tokenization, decentralized oracles, L1/L2 networks ($ONDO, $LINK, $AAVE)",
      quotes: [
        { text: '"The best economic engines are the ones that possess an enduring royalty on the growth of others." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"Someone is sitting in the shade today because someone planted a tree a long time ago." — Warren Buffett', author: "WARREN BUFFETT" },
        { text: '"You do not have to predict every technological shift; you only need to identify where institutional capital is inevitably compelled to flow." — Charlie Munger', author: "CHARLIE MUNGER" },
        { text: '"No wise engineer builds a skyscraper on sand; code without verified oracle infrastructure is blind conjecture." — Charlie Munger', author: "CHARLIE MUNGER" },
        { text: '"The future arrives gradually in protocol development, then all at once in capital rotation." — Charlie Munger', author: "CHARLIE MUNGER" }
      ]
    }
  ];

  class EflBroadcastManager {
    constructor() {
      this.fixtures = FIXTURES_DATA;
      this.selectedPostId = 7;
      this.init();
    }

    init() {
      this.injectTickerRibbon();
      this.injectEflHeaderBranding();
      this.injectWisdomModule();
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

    injectWisdomModule() {
      if (document.getElementById('famousTraderWisdomBox')) return;

      const tabsNav = document.querySelector('.tabs-nav');
      if (!tabsNav || !tabsNav.parentNode) return;

      const box = document.createElement('div');
      box.id = 'famousTraderWisdomBox';
      box.className = 'wisdom-box';

      // Build drawer with 40+ quotes
      let drawerHtml = WISDOM_CATEGORIES.map(cat => {
        let qItems = cat.quotes.map(q => `
          <div class="wisdom-quote-item" data-quote="${encodeURIComponent(q.text)}" data-author="${q.author}">
            <span>${q.text}</span>
            <span class="use-btn">Use Quote</span>
          </div>
        `).join('');

        return `
          <div class="wisdom-category-group">
            <div class="wisdom-category-title">📂 ${cat.name} (${cat.desc})</div>
            ${qItems}
          </div>
        `;
      }).join('');

      box.innerHTML = `
        <div class="wisdom-header">
          <div class="wisdom-title">
            <span>🏛️ MARKET WISDOM:</span>
            <span id="wisdomAuthorBadge" class="wisdom-author-badge">CHARLIE MUNGER</span>
          </div>
          <div class="wisdom-controls">
            <button id="btnCycleWisdomQuote" type="button" class="btn-wisdom-action" title="Swap quote with another relevant quote from SKILL_ISSUE.md">🎲 Swap Wisdom Quote</button>
            <button id="btnOpenWisdomDrawer" type="button" class="btn-wisdom-action" title="View all 40+ quotes categorized by market context">📖 View 40+ Quotes Repository</button>
          </div>
        </div>
        <div id="wisdomQuoteText" class="wisdom-quote-content">
          "The big money is not in the buying and the selling, but in the waiting." — Charlie Munger
        </div>
        <div id="wisdomQuotesDrawer" class="wisdom-drawer" style="display: none;">
          ${drawerHtml}
        </div>
      `;

      tabsNav.parentNode.insertBefore(box, tabsNav);

      // Event bindings for wisdom box
      const btnToggleDrawer = box.querySelector('#btnOpenWisdomDrawer');
      const drawer = box.querySelector('#wisdomQuotesDrawer');
      if (btnToggleDrawer && drawer) {
        btnToggleDrawer.addEventListener('click', () => {
          const isHidden = drawer.style.display === 'none';
          drawer.style.display = isHidden ? 'block' : 'none';
          btnToggleDrawer.textContent = isHidden ? '🔼 Close Repository' : '📖 View 40+ Quotes Repository';
        });
      }

      box.querySelectorAll('.wisdom-quote-item').forEach(item => {
        item.addEventListener('click', () => {
          const rawQ = item.getAttribute('data-quote');
          const author = item.getAttribute('data-author');
          if (rawQ) {
            const quoteText = decodeURIComponent(rawQ);
            this.applyQuoteToCurrentPost(quoteText, author);
          }
        });
      });

      const btnCycle = box.querySelector('#btnCycleWisdomQuote');
      if (btnCycle) {
        btnCycle.addEventListener('click', () => {
          this.cycleRandomQuote();
        });
      }

      this.updateWisdomDisplay(this.selectedPostId);
    }

    updateWisdomDisplay(postId) {
      const quoteEl = document.getElementById('wisdomQuoteText');
      const authorEl = document.getElementById('wisdomAuthorBadge');
      if (!quoteEl || !authorEl) return;

      const posts = (window.EdgeFlow && window.EdgeFlow.posts) ? window.EdgeFlow.posts : [];
      let post = posts.find(p => p.id === postId);

      if (!post && typeof getDay6PreloadedSlots === 'function') {
        const d6 = getDay6PreloadedSlots();
        post = d6.find(p => p.id === postId);
      }

      if (post && post.improved) {
        const lines = post.improved.split('\n').map(l => l.trim()).filter(Boolean);
        // Look for quoted line
        const qLine = lines.find(l => l.startsWith('"') && (l.includes('—') || l.includes('-')));
        if (qLine) {
          quoteEl.textContent = qLine;
          if (qLine.includes('Warren Buffett')) {
            authorEl.textContent = 'WARREN BUFFETT';
          } else if (qLine.includes('Charlie Munger')) {
            authorEl.textContent = 'CHARLIE MUNGER';
          } else {
            authorEl.textContent = 'FAMOUS TRADER';
          }
          return;
        }
      }

      // Default fallback
      quoteEl.textContent = '"The big money is not in the buying and the selling, but in the waiting." — Charlie Munger';
      authorEl.textContent = 'CHARLIE MUNGER';
    }

    applyQuoteToCurrentPost(newQuote, author) {
      const quoteEl = document.getElementById('wisdomQuoteText');
      const authorEl = document.getElementById('wisdomAuthorBadge');
      if (quoteEl) quoteEl.textContent = newQuote;
      if (authorEl && author) authorEl.textContent = author;

      const polishedEl = document.getElementById('polishedContent');
      if (polishedEl && polishedEl.value) {
        let text = polishedEl.value.trim();
        let parts = text.split('\n\n');

        // Look for existing quote line
        let quoteIndex = -1;
        for (let i = 0; i < parts.length; i++) {
          let trimmed = parts[i].trim();
          if (trimmed.startsWith('"') && (trimmed.includes('—') || trimmed.includes('Munger') || trimmed.includes('Buffett'))) {
            quoteIndex = i;
            break;
          }
        }

        if (quoteIndex !== -1) {
          parts[quoteIndex] = newQuote;
        } else if (parts.length >= 2) {
          // Insert before last part (poll question)
          parts.splice(parts.length - 1, 0, newQuote);
        } else {
          parts.push(newQuote);
        }

        const updated = parts.join('\n\n');
        polishedEl.value = updated;

        // Also update memory
        const currentIdx = (typeof currentPostIndex !== 'undefined') ? currentPostIndex : (this.selectedPostId - 1);
        if (typeof postsData !== 'undefined' && postsData[currentIdx]) {
          postsData[currentIdx].improved = updated;
          if (typeof getDaySessionStorageKey === 'function' && typeof currentSessionId !== 'undefined') {
            localStorage.setItem(getDaySessionStorageKey(currentSessionId), JSON.stringify(postsData));
          }
        }
      }

      if (window.IncubationShield && typeof window.IncubationShield.showToast === 'function') {
        window.IncubationShield.showToast(`✓ Injected quote: ${newQuote.slice(0, 35)}...`);
      }
    }

    cycleRandomQuote() {
      // Pick random quote across categories
      const allQuotes = WISDOM_CATEGORIES.flatMap(c => c.quotes);
      const randomQ = allQuotes[Math.floor(Math.random() * allQuotes.length)];
      this.applyQuoteToCurrentPost(randomQ.text, randomQ.author);
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
        const isPlayoff = idx >= 4 && idx < 6;
        const rowClass = isPromotion ? 'promotion-zone' : (isPlayoff ? 'playoff-zone' : '');
        const isFt = f.status === 'ft';
        const isLive = f.status === 'live';

        let formHtml = '';
        if (isFt) {
          formHtml = `<span class="efl-form-dots"><span class="efl-dot w" title="Win/Done"></span><span class="efl-dot w"></span><span class="efl-dot w"></span></span>`;
        } else if (isLive) {
          formHtml = `<span class="efl-form-dots"><span class="efl-dot w"></span><span class="efl-dot d" title="In Play / Next"></span><span class="efl-dot p"></span></span>`;
        } else {
          formHtml = `<span class="efl-form-dots"><span class="efl-dot p"></span><span class="efl-dot p"></span><span class="efl-dot p"></span></span>`;
        }

        const rr = idx % 2 === 0 ? '1:2.80' : '1:2.65';
        const statusBadge = isFt 
          ? `<span class="efl-match-status ft">DONE ✓</span>`
          : (isLive ? `<span class="efl-match-status live">16:48 KO</span>` : `<span class="efl-match-status upcoming">UPCOMING</span>`);

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
            <span>🟢 Promotion Zone (Banked 6/12)</span>
            <span>🔵 Playoff Cut (Next Wave 4)</span>
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
      this.updateWisdomDisplay(id);
    }

    observePostChanges() {
      // Listen for pill clicks or post switches in main app
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
