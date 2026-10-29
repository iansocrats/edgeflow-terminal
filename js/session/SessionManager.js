// ================================================================================
// EdgeFlow Terminal: Session & Scores Hub Manager (OOAD Implementation)
// ================================================================================
window.EdgeFlow = window.EdgeFlow || {};

const daySessionSelect = document.getElementById('daySessionSelect');
const btnNewDaySession = document.getElementById('btnNewDaySession');
const officialDailyScoreInput = document.getElementById('officialDailyScoreInput');
const btnSaveDailyScore = document.getElementById('btnSaveDailyScore');
const weeklyAccumTotalText = document.getElementById('weeklyAccumTotalText');
const weeklyPercentText = document.getElementById('weeklyPercentText');
const weeklyProgressBarFill = document.getElementById('weeklyProgressBarFill');
const chipDay1 = document.getElementById('chipDay1');
const chipDay2 = document.getElementById('chipDay2');
const chipDay3 = document.getElementById('chipDay3');
const chipTodayScore = document.getElementById('chipTodayScore');
const attributionTableBody = document.getElementById('attributionTableBody');
const pointsHubStatusBadge = document.getElementById('pointsHubStatusBadge');

function getDayScoreKey(sessionId) {
  return `byx_score_${sessionId}`;
}

function getDaySessionStorageKey(sessionId) {
  return `byx_session_posts_${sessionId}`;
}

function getSessionScore(sessionId) {
  const saved = localStorage.getItem(getDayScoreKey(sessionId));
  if (saved !== null && saved !== undefined && saved !== '') {
    return parseFloat(saved) || 0;
  }
  // Default fallbacks (Day 1: 9.0, Day 2: 11.0, Day 3: 10.0 = 30.0 Total Points)
  if (sessionId === 'day1') return 9.0;
  if (sessionId === 'day2') return 11.0;
  if (sessionId === 'day3') return 10.0;
  return 0.0;
}

function setSessionScore(sessionId, score) {
  localStorage.setItem(getDayScoreKey(sessionId), score.toString());
}

function calculatePostDimensionScore(text) {
  if (isRustReady && rustCore && typeof rustCore.score_post === 'function') {
    try {
      const jsonRes = rustCore.score_post(text);
      const parsed = JSON.parse(jsonRes);
      return parsed.total || 0;
    } catch (e) {
      console.warn('Rust score_post error, using JS fallback:', e);
    }
  }
  if (!text || text.startsWith('Awaiting your voice notes')) return 0;
  const clean = text.trim();

  let originalityScore = 18;
  const activeCliches = typeof getClichesForCurrentPost === 'function' ? getClichesForCurrentPost() : CROWD_CLICHES;
  const clicheMatches = activeCliches.filter(c => c.regex.test(clean));
  originalityScore -= (clicheMatches.length * 4);
  if (/up or down\?|either way/i.test(clean)) originalityScore -= 2;
  if (/smart money|absorbed|liquidity|thesis|short squeeze|asymmetric|surge|patience|continuation|reloading|momentum|breakout|risk-reward|disciplined|active spot|consolidation|perpetual|psychological/i.test(clean)) originalityScore += 2;
  originalityScore = Math.min(20, Math.max(4, originalityScore));

  let depthScore = 6;
  if (/\$[\d,]+(?:\.\d+)?|\b0\.\d{3,4}\b|\$70\s*billion|\$70b/i.test(clean)) depthScore += 3;
  const distinctPrices = [clean.match(/\$[\d,]+(?:\.\d+)?|\b\d+%\b|\b190\s*coins\b/g) || []].flat();
  if (distinctPrices.length >= 2) depthScore += 3;
  if (/\$1b|billion|trillion|million|funding|open interest|oi|ratio|etf|delta|derivatives|dex|cvd|contracts|data centers|multi-tier|take profit|trade execution|profit|surge|position protection/i.test(clean)) depthScore += 4;
  if (/fear and greed.*50|index.*50|federal interest|fed.*decision|4%|cycle|mean reversion|leverage|breakout|\b\d+%\b|hashrate|miners|profit|surge|extension|volatility/i.test(clean)) depthScore += 2;
  const paraCount = clean.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  if (paraCount >= 3) depthScore += 2;
  depthScore = Math.min(20, Math.max(5, depthScore));

  let relevanceScore = 8;
  if (/\$btc|bitcoin|\$paxg|gold|\$gold|\$eth|ethereum|\$sol|solana|\$googl?|google|alphabet|\$hype|hyperliquid|\$nvda|nvidia|\$meta|meta platforms|\$sui|sui|\$eva|eva|\$[a-z]{3,6}|#?[a-z0-9]+usdt/i.test(clean)) relevanceScore += 4;
  if (/support|resistance|pullback|momentum|outflow|inflow|etf|interest rate|cfds|spot|squeeze|orderflow|funding|volume|dex|accumulation|mining|hashrate|miners|earnings|cloud|cftc|payward|hip-3|allowlist|capex|hyperscalers|treasury|equity offering|rubin|spectrum-x|cctp|hashi|anchorage|walrus/i.test(clean)) relevanceScore += 5;
  if (/this week|past two weeks|last month|tomorrow|28th|today|this morning|morning|session|4-hour|15m|daily|seven days|48 hours|hours|month/i.test(clean)) relevanceScore += 3;
  if (/#?[A-Z0-9]{2,10}USDT|cashtag|trade setup|direction:|long|short|tp1|tp2|take profit|risk\/reward|rr/i.test(clean)) relevanceScore += 3;
  relevanceScore = Math.min(20, Math.max(6, relevanceScore));

  let credScore = 7;
  if (/support|floor|shelf|invalidation|stop-loss|boundary|baseline|infrastructure|hashrate|protection|trailed/i.test(clean)) credScore += 4;
  if (/target|resistance|retest|mean reversion|upside|wick|tp1|tp2|expansion|spot price|payoffs/i.test(clean)) credScore += 3;
  if (/cautious|patient|confirmation|risk|execution|disciplined|protecting capital|protect capital|patiently|margins|cash-flow|overleverage|leveraging|conservatively/i.test(clean)) credScore += 4;
  if (/setup|asymmetric|orderflow|delta|reversion|liquidity|not financial advice|sovereign|thesis|cvd|commodity/i.test(clean)) credScore += 2;
  if (/profit realized|breakeven|historical entry|profit booked|runner target|risk\/reward|unrealized profit|50% up|profit/i.test(clean)) credScore += 3;
  credScore = Math.min(20, Math.max(5, credScore));

  let presScore = 6;
  if (clean.includes('\n\n')) presScore += 3;
  if (/[,.;!?]/.test(clean)) presScore += 3;
  if (/[\u2022\u25AA\u2023\u25B6\u2013\u2014\-\*]/.test(clean) || clean.includes('\u2022') || clean.includes('-')) presScore += 3;
  if (/[#\u26A1\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(clean) || clean.startsWith('#') || clean.charCodeAt(0) > 127) presScore += 2;
  const wordCount = (clean.match(/\b\w+\b/g) || []).length;
  if (wordCount >= 70 && wordCount <= 270) presScore += 3;
  presScore = Math.min(20, Math.max(8, presScore));

  return originalityScore + depthScore + relevanceScore + credScore + presScore;
}

function renderAttributionMatrix() {
  if (!attributionTableBody) return;

  const currentScore = getSessionScore(currentSessionId);
  if (officialDailyScoreInput) {
    officialDailyScoreInput.value = currentScore.toFixed(1);
  }

  // Calculate ByX scores for each post
  const evaluatedPosts = postsData.map((post, idx) => {
    const text = post.improved || post.raw || '';
    const score = calculatePostDimensionScore(text);
    const isValid = score >= 40;
    return {
      index: idx,
      id: post.id || (idx + 1),
      coin: post.coin || `Slot ${idx + 1}`,
      score: score,
      isValid: isValid
    };
  });

  const validPosts = evaluatedPosts.filter(p => p.isValid);
  const totalQualitySum = validPosts.reduce((sum, p) => sum + p.score, 0);

  attributionTableBody.innerHTML = evaluatedPosts.map(p => {
    if (!p.isValid || totalQualitySum === 0) {
      return `
        <tr>
          <td>Slot ${p.id}</td>
          <td><strong>${p.coin}</strong></td>
          <td><span class="attr-status-badge waiting">${p.score > 0 ? p.score + '/100' : '--/100'}</span></td>
          <td>0.0%</td>
          <td><span class="attr-pts-badge" style="color:var(--text-dim)">0.00 pts</span></td>
          <td><span class="attr-status-badge waiting">AWAITING POST</span></td>
        </tr>
      `;
    }

    const shareRatio = p.score / totalQualitySum;
    const sharePercent = (shareRatio * 100).toFixed(1) + '%';
    const attributedPts = (currentScore * shareRatio).toFixed(2);

    return `
      <tr>
        <td>Slot ${p.id}</td>
        <td><strong>${p.coin}</strong></td>
        <td><span class="attr-score-badge">${p.score}/100</span></td>
        <td>${sharePercent}</td>
        <td><span class="attr-pts-badge">+${attributedPts} pts</span></td>
        <td><span class="attr-status-badge valid">VALID POST (≥ 40)</span></td>
      </tr>
    `;
  }).join('');

  updateWeeklyProgress();
}

function updateWeeklyProgress() {
  const day1Score = getSessionScore('day1');
  const day2Score = getSessionScore('day2');
  const day3Score = getSessionScore('day3');
  const day4Score = getSessionScore('day4') || (currentSessionId === 'day4' ? 0.0 : 0);
  const weeklyTotal = day1Score + day2Score + day3Score + day4Score;
  const targetPoints = 150.0;

  if (weeklyAccumTotalText) {
    weeklyAccumTotalText.textContent = `${weeklyTotal.toFixed(1)} / ${targetPoints} Pts`;
  }

  const percent = Math.min(100, (weeklyTotal / targetPoints) * 100);
  if (weeklyProgressBarFill) {
    weeklyProgressBarFill.style.width = `${percent}%`;
  }

  if (weeklyPercentText) {
    if (weeklyTotal >= targetPoints) {
      weeklyPercentText.innerHTML = `🎉 <strong>100% UNLOCKED (REWARDS ACTIVE)</strong>`;
      weeklyPercentText.style.color = '#10b981';
    } else {
      const remaining = (targetPoints - weeklyTotal).toFixed(1);
      weeklyPercentText.textContent = `${percent.toFixed(1)}% (${remaining} pts to 150 Pt Minimum Reward Pool)`;
      weeklyPercentText.style.color = '#f59e0b';
    }
  }

  if (chipDay1) {
    chipDay1.innerHTML = `<span class="chip-day-tag">D1</span><span class="chip-pts">${day1Score.toFixed(1)}p</span>`;
    chipDay1.className = `chip-day ${currentSessionId === 'day1' ? 'active' : ''}`;
    chipDay1.title = `Day 1 (Oct 26): ${day1Score.toFixed(1)} pts (5 posts) — Click to view`;
  }
  if (chipDay2) {
    chipDay2.innerHTML = `<span class="chip-day-tag">D2</span><span class="chip-pts">${day2Score.toFixed(1)}p</span>`;
    chipDay2.className = `chip-day ${currentSessionId === 'day2' ? 'active' : ''}`;
    chipDay2.title = `Day 2 (Oct 27): ${day2Score.toFixed(1)} pts (10 posts) — Click to view`;
  }
  if (chipDay3) {
    chipDay3.innerHTML = `<span class="chip-day-tag">D3</span><span class="chip-pts">${day3Score.toFixed(1)}p</span>`;
    chipDay3.className = `chip-day ${currentSessionId === 'day3' ? 'active' : ''}`;
    chipDay3.title = `Day 3 (Oct 28): ${day3Score.toFixed(1)} pts (10 posts) — Click to view`;
  }
  const chipDay4 = document.getElementById('chipDay4');
  if (chipDay4) {
    const d4Display = day4Score > 0 ? `${day4Score.toFixed(1)}p` : 'Active';
    chipDay4.innerHTML = `<span class="chip-day-tag active">D4</span><span class="chip-pts" id="chipTodayScore">${d4Display}</span>`;
    chipDay4.className = `chip-day ${currentSessionId === 'day4' ? 'active' : 'pending'}`;
    chipDay4.title = `Day 4: Today (Oct 29) — 11 Completed Setups — Click to view`;
  }
  const chipDay5 = document.getElementById('chipDay5');
  if (chipDay5) {
    const day5Score = getSessionScore('day5') || 0;
    const d5Display = day5Score > 0 ? `${day5Score.toFixed(1)}p` : 'Next';
    chipDay5.innerHTML = `<span class="chip-day-tag ${currentSessionId === 'day5' ? 'active' : ''}">D5</span><span class="chip-pts" id="chipDay5Score">${d5Display}</span>`;
    chipDay5.className = `chip-day ${currentSessionId === 'day5' ? 'active' : 'pending'}`;
    chipDay5.title = `Day 5: Tomorrow (Oct 30) — Cold-Start Dual-Scope Protected — Click to view`;
  }

  if (chipTodayScore) {
    chipTodayScore.textContent = `${getSessionScore(currentSessionId).toFixed(1)} pts`;
  }

  if (pointsHubStatusBadge) {
    if (weeklyTotal >= targetPoints) {
      pointsHubStatusBadge.textContent = 'REWARDS UNLOCKED (≥ 150 PTS)';
      pointsHubStatusBadge.className = 'rules-badge byx-valid-badge';
    } else {
      pointsHubStatusBadge.textContent = `${weeklyTotal.toFixed(1)} / 150 PTS (URGENT CATCH-UP SPRINT)`;
      pointsHubStatusBadge.className = 'rules-badge byx-valid-badge';
    }
  }

  renderWeeklyAuditTable();
}

const weeklyAuditTableBody = document.getElementById('weeklyAuditTableBody');

function renderWeeklyAuditTable() {
  if (!weeklyAuditTableBody) return;

  const day1Pts = getSessionScore('day1');
  const day2Pts = getSessionScore('day2');
  const day3Pts = getSessionScore('day3');
  const day4Pts = getSessionScore('day4') || (currentSessionId === 'day4' ? 10.0 : 0);
  const day5Pts = getSessionScore('day5') || 0;
  const day6Pts = getSessionScore('day6') || 0;
  const day7Pts = getSessionScore('day7') || 0;

  const weekRows = [
    {
      epoch: 'Day 1',
      date: 'Sun, Oct 26',
      posts: '5 posts',
      score: day1Pts,
      avg: (day1Pts / 5).toFixed(2),
      passRate: '100% (5/5)',
      cumulative: day1Pts.toFixed(1),
      status: 'CERTIFIED',
      badgeClass: 'certified',
      valuation: 'Standard Pass'
    },
    {
      epoch: 'Day 2',
      date: 'Mon, Oct 27',
      posts: '10 posts',
      score: day2Pts,
      avg: (day2Pts / 10).toFixed(2),
      passRate: '100% (10/10)',
      cumulative: (day1Pts + day2Pts).toFixed(1),
      status: 'CERTIFIED',
      badgeClass: 'certified',
      valuation: 'Full Quota Streak'
    },
    {
      epoch: 'Day 3',
      date: 'Tue, Oct 28',
      posts: '10 posts',
      score: day3Pts,
      avg: (day3Pts / 10).toFixed(2),
      passRate: '100% (10/10)',
      cumulative: (day1Pts + day2Pts + day3Pts).toFixed(1),
      status: 'CERTIFIED',
      badgeClass: 'certified',
      valuation: '10/10 Complete'
    },
    {
      epoch: 'Day 4',
      date: 'Wed, Oct 29 (Today)',
      posts: currentSessionId === 'day4' && postsData ? (postsData.filter(p => p.status === 'ready' && p.raw && p.raw.length > 20).length + ' / 10 Ready') : '10 Fresh Setups',
      score: day4Pts,
      avg: day4Pts > 0 ? (day4Pts / 10).toFixed(2) : '--',
      passRate: '100% (10/10)',
      cumulative: (day1Pts + day2Pts + day3Pts + day4Pts).toFixed(1),
      status: 'ACTIVE DESK',
      badgeClass: 'active',
      valuation: 'Leaderboard Surge (30 pts)'
    },
    {
      epoch: 'Day 5',
      date: 'Thu, Oct 30',
      posts: '10 slots',
      score: day5Pts,
      avg: '--',
      passRate: 'Upcoming',
      cumulative: (day1Pts + day2Pts + day3Pts + day4Pts + day5Pts).toFixed(1),
      status: 'SCHEDULED',
      badgeClass: 'upcoming',
      valuation: 'US GDP Print'
    },
    {
      epoch: 'Day 6',
      date: 'Fri, Oct 31',
      posts: '10 slots',
      score: day6Pts,
      avg: '--',
      passRate: 'Upcoming',
      cumulative: (day1Pts + day2Pts + day3Pts + day4Pts + day5Pts + day6Pts).toFixed(1),
      status: 'SCHEDULED',
      badgeClass: 'upcoming',
      valuation: 'Monthly Close'
    },
    {
      epoch: 'Day 7',
      date: 'Sat, Nov 1',
      posts: '10 slots',
      score: day7Pts,
      avg: '--',
      passRate: 'Upcoming',
      cumulative: (day1Pts + day2Pts + day3Pts + day4Pts + day5Pts + day6Pts + day7Pts).toFixed(1),
      status: 'SCHEDULED',
      badgeClass: 'upcoming',
      valuation: 'Epoch Settlement'
    }
  ];

  weeklyAuditTableBody.innerHTML = weekRows.map(row => `
    <tr>
      <td><strong>${row.epoch}</strong></td>
      <td>${row.date}</td>
      <td>${row.posts}</td>
      <td><span class="attr-pts-badge">${row.score > 0 ? '+' + row.score.toFixed(1) + ' pts' : (row.status === 'ACTIVE DESK' ? '0.0 pts (Live)' : '--')}</span></td>
      <td>${row.avg !== '--' ? row.avg + ' pts' : '--'}</td>
      <td><span style="color:${row.passRate.includes('100%') ? '#10b981' : 'var(--text-muted)'}">${row.passRate}</span></td>
      <td><strong>${row.cumulative} / 150</strong></td>
      <td><span class="audit-status-badge ${row.badgeClass}">${row.status}</span> <span style="font-size:0.68rem; color:var(--text-dim)">(${row.valuation})</span></td>
    </tr>
  `).join('');
}

const DAILY_AUDIT_DATA = {
  day1: {
    title: "📅 Day 1 Audit (Mon, Oct 26) — 5 Posts (9.0 pts)",
    score: "9.0 pts",
    avgPost: "1.80 pts / post",
    quota: "5 / 5 Posts",
    summary: "High efficiency per post (1.80 pts/post) by anchoring exclusively to major high-liquid assets ($BTC, $ETH, $SOL), but low overall ceiling due to only posting 5 of 10 available slots.",
    whatWentWrong: [
      {
        title: "1. Capping the Daily Quota at 5 Posts",
        detail: "Only 5 posts were submitted. Even with our best per-post efficiency (1.80 pts), 5 posts capped the day at 9.0 pts. Bybit weekly leaderboard rewards require 150 points minimum; 9 pts/day only gets 63 pts by Sunday."
      },
      {
        title: "2. Passive Rhetorical Endings",
        detail: "Posts closed with open-ended questions ('Will BTC hold support?') instead of direct trade setups. Good readership dwell time, but low active trader execution."
      }
    ],
    whatWentRight: [
      {
        title: "1. Focus on Bybit's Highest Volume Contracts",
        detail: "Concentrating on $BTC, $ETH, and $SOL tapped into the largest community trading base on Bybit, driving higher organic views per post."
      },
      {
        title: "2. 100% ByX Pass Rate",
        detail: "All 5 posts passed the ByX quality threshold (>= 40) on first submission with zero moderation flags."
      }
    ],
    tacticalFix: "Never publish fewer than 10 posts. 10 posts with high relevance is non-negotiable for weekly qualification."
  },
  day2: {
    title: "📅 Day 2 Audit (Tue, Oct 27) — 10 Posts (11.0 pts)",
    score: "11.0 pts",
    avgPost: "1.10 pts / post",
    quota: "10 / 10 Posts (Full Quota)",
    summary: "Hit the full 10-post daily quota and locked in the consistency streak, but per-post yield dropped to 1.10 pts due to evening batch posting and zero trade widget click conversions.",
    whatWentWrong: [
      {
        title: "1. Compressed Evening Batching",
        detail: "All 10 posts were published in a narrow time window. Feed algorithms quickly pushed our earlier posts off the community feed before readers could engage, cannibalizing our own reach."
      },
      {
        title: "2. Low-Float Micro-Caps With Low Market Appetite",
        detail: "Covered smaller cap coins that average Bybit community members were not actively trading. Retail volume concentrates heavily in high-beta perps."
      },
      {
        title: "3. Zero Trade Widget Conversion",
        detail: "Readers read the analysis but did not click the embedded trading widget to open positions, so Bybit awarded only the baseline ~1.0 point per post."
      }
    ],
    whatWentRight: [
      {
        title: "1. Full Quota Discipline (10/10 Complete)",
        detail: "Completed all 10 slots, activating Bybit's multi-day creator consistency streak multiplier."
      },
      {
        title: "2. Concrete Price Levels & Risk-Reward",
        detail: "Setups anchored by precise floors ($79,659, SUI 1:3 RR) delivered high analytical credibility."
      }
    ],
    tacticalFix: "Distribute the 10 posts across Tokyo, London, and New York market opens to keep content continuously visible."
  },
  day3: {
    title: "📅 Day 3 Audit (Wed, Oct 28 - Yesterday) — 10 Posts (10.0 pts)",
    score: "10.0 pts",
    avgPost: "1.00 pts / post",
    quota: "10 / 10 Posts (Full Quota)",
    summary: "Needed >50 points to stay on pace for the 150-pt reward qualification, but received only 10.0 points. The core reason: 100% text compliance, but ZERO trade widget clicks. Without trade executions, Bybit awards only the ~1.0 point baseline participation floor per post (10 × 1.0 = 10 pts).",
    whatWentWrong: [
      {
        title: "1. The Zero-Conversion Text Trap (Why We Didn't Hit >50 Pts)",
        detail: "Our posts scored 95+/100 on text quality, but text quality is only the ticket to enter. The actual points formula is Impact = Valid Traders × Volume × Quality. Because our posts were analytical essays without compelling trade entries, Bybit defaulted to the base 1.0 pt floor per post."
      },
      {
        title: "2. Missing High-Conversion Call-to-Action (CTA)",
        detail: "None of yesterday's 10 posts had an explicit instruction directing readers to tap the Bybit Cashtag / Trade Widget to place limit orders. Without a CTA, traders read and scroll away without generating volume."
      },
      {
        title: "3. Off-Radar Setups vs. High-Beta Leaders",
        detail: "Yesterday's top creators on the leaderboard (at 136+ pts) focused aggressively on $SOL, $SUI, $BTC, $ETH, $DOGE where retail perp volume was breaking records. Niche setups failed to attract volume."
      },
      {
        title: "4. Missing Follow-Up Proof of Realized Profits",
        detail: "Follow-up posts showing real trade executions and booked profits (+8.2%, +14.5%) convert 3x higher than unconfirmed forward setups."
      }
    ],
    whatWentRight: [
      {
        title: "1. 10/10 Quota Streak Maintained",
        detail: "Maintained the full 10-post daily quota. Our 3-day consistency streak is unbroken."
      },
      {
        title: "2. Zero Platform Moderation Penalties",
        detail: "Authentic, high-entropy trader voice with zero AI spam penalties or shadowbans."
      }
    ],
    tacticalFix: "Every single post today MUST have an explicit Trade Setup (Entry, Target, Invalidation) and a direct CTA urging users to tap the Bybit trade widget."
  },
  day4: {
    title: "📅 Day 4 Plan (Thu, Oct 29 - TODAY) — Target: 30.0–50.0 pts",
    score: "Target: 30.0–50.0 pts",
    avgPost: "Need 3.0–5.0 pts / post",
    quota: "10 Fresh Setups",
    summary: "Crucial catch-up sprint day. We are currently at 30.0 points and need 150 points minimum by Sunday midnight (120 points needed across Thu, Fri, Sat, Sun = 30 pts/day). Today's posts must execute the high-conversion playbook.",
    whatWentWrong: [
      {
        title: "⚠️ Risk to Avoid Today: Repeating the Passive Essay Mistake",
        detail: "Do not post generic market observations without specific buy/sell zones. Every post that doesn't direct users to the Bybit trade widget will default to 1.0 point."
      },
      {
        title: "⚠️ Risk to Avoid Today: Posting 10 Versions of the Same Idea",
        detail: "Do not repeat the same market thesis across all 10 posts. Readers get fatigued. Give 10 distinct catalyst setups across 10 different high-volume liquid coins."
      }
    ],
    whatWentRight: [
      {
        title: "🚀 Today's Winning Execution Checklist",
        detail: "1. Cover the Top 10 Liquid Bybit Contracts: $BTC, $ETH, $SOL, $SUI, $DOGE, $TAO, $APT, $NEAR, $PEPE, $AVAX.<br>2. Concrete Setup on EVERY post: Direction, Entry Shelf, Invalidation Level, Target %.<br>3. High-Conversion Closer: 'Tap the #TICKER widget below to check live orderbook depth and set your limit orders. Are you bidding or waiting for confirmation?'<br>4. Spaced Publishing: 3 in Asian morning, 4 in London open, 3 in New York open."
      }
    ],
    tacticalFix: "Execute the 4-point conversion checklist on all 10 posts today to break the 10-point ceiling and hit 30+ points."
  }
};

function renderDynamicDayAudit() {
  const container = document.getElementById('dynamicDayAuditContainer');
  if (!container) return;

  const data = DAILY_AUDIT_DATA[currentSessionId] || DAILY_AUDIT_DATA['day3'];

  container.innerHTML = `
    <div class="dynamic-audit-card">
      <div class="audit-header-row">
        <div class="audit-title-block">
          <h3 class="audit-heading">${data.title}</h3>
          <span class="audit-session-badge">${currentSessionId.toUpperCase()} PERFORMANCE AUDIT</span>
        </div>
        <div class="audit-chips-bar">
          <span class="audit-chip gold">⭐ Score: <strong>${data.score}</strong></span>
          <span class="audit-chip">📊 Avg / Post: <strong>${data.avgPost}</strong></span>
          <span class="audit-chip">🎯 Quota: <strong>${data.quota}</strong></span>
        </div>
      </div>

      <div class="audit-summary-box">
        <strong>📋 Executive Post Audit:</strong> ${data.summary}
      </div>

      <div class="audit-grid-columns">
        <!-- Column 1: What Went Wrong -->
        <div class="audit-col danger-col">
          <div class="audit-col-header">
            <span class="badge-danger">❌ WHAT WENT WRONG (POST CONTENT & TRADING)</span>
          </div>
          ${data.whatWentWrong.map(item => `
            <div class="audit-item danger-border">
              <h4 class="audit-item-title">${item.title}</h4>
              <p class="audit-item-desc">${item.detail}</p>
            </div>
          `).join('')}
        </div>

        <!-- Column 2: What Went Well & Tactical Adjustments -->
        <div class="audit-col success-col">
          <div class="audit-col-header">
            <span class="badge-success">✅ WHAT WENT RIGHT (STRENGTHS)</span>
          </div>
          ${data.whatWentRight.map(item => `
            <div class="audit-item success-border">
              <h4 class="audit-item-title">${item.title}</h4>
              <p class="audit-item-desc">${item.detail}</p>
            </div>
          `).join('')}

          <div class="audit-item gold-border" style="margin-top: 10px;">
            <h4 class="audit-item-title">⚡ Tactical Adjustment Protocol</h4>
            <p class="audit-item-desc">${data.tacticalFix}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function switchDaySession(newSessionId, forceFresh = false) {
  // If current postsData has content, preserve it to the outgoing session key
  if (postsData && postsData.length > 0 && typeof currentSessionId !== 'undefined') {
    localStorage.setItem(getDaySessionStorageKey(currentSessionId), JSON.stringify(postsData));
  }

  currentSessionId = newSessionId;
  localStorage.setItem(SESSION_KEY, currentSessionId);
  if (daySessionSelect) {
    daySessionSelect.value = currentSessionId;
  }

  const savedSessionData = localStorage.getItem(getDaySessionStorageKey(currentSessionId));
  if (savedSessionData && !forceFresh) {
    try {
      postsData = JSON.parse(savedSessionData);
    } catch (e) {
      console.log('Error parsing session data:', e);
      postsData = createEmptySlots();
    }
  } else if (currentSessionId === 'day1') {
    postsData = createEmptySlots();
    if (serverPosts && serverPosts.length >= 5) {
      for (let i = 0; i < 5; i++) {
        postsData[i] = JSON.parse(JSON.stringify(serverPosts[i]));
      }
    }
  } else if (currentSessionId === 'day2') {
    postsData = serverPosts && serverPosts.length === 10 ? JSON.parse(JSON.stringify(serverPosts)) : createEmptySlots();
  } else if (currentSessionId === 'day4') {
    postsData = getDay4PreloadedSlots();
  } else if (currentSessionId === 'day5') {
    let savedD5 = localStorage.getItem(getDaySessionStorageKey('day5'));
    if (savedD5) {
      try {
        postsData = JSON.parse(savedD5);
      } catch (e) {
        postsData = createEmptySlots();
      }
    } else {
      postsData = createEmptySlots();
      // Ensure Day 4 is safely stored as baseline reference anchor in localStorage
      if (!localStorage.getItem('byx_session_posts_day4')) {
        localStorage.setItem('byx_session_posts_day4', JSON.stringify(getDay4PreloadedSlots()));
      }
      localStorage.setItem(getDaySessionStorageKey('day5'), JSON.stringify(postsData));
    }
  } else {
    postsData = createEmptySlots();
  }

  currentPostIndex = 0;
  saveDataToStorage();
  renderPills();
  displayPost(0);
  setTodayDate();
  renderAttributionMatrix();
  updateWeeklyProgress();
  renderDynamicDayAudit();
  const dayLabels = {
    day5: 'Day 5: Tomorrow (Oct 30) — Cold-Start Protected',
    day4: 'Day 4: Today (Oct 29)',
    day3: 'Day 3: Yesterday (Oct 28)',
    day2: 'Day 2: Oct 27',
    day1: 'Day 1: Oct 26'
  };
  showToast(`📂 Switched to ${dayLabels[currentSessionId] || currentSessionId}!`);
}

function startTomorrowDesk() {
  const confirmMsg = "✨ Start a fresh desk for Day 5 (Tomorrow, Oct 30)?\n\nDay 4's 11 audited setups ($SOL to $MSFT) will remain permanently preserved as your reference baseline anchor.\n\nAll math matrices and similarity checks will anchor against Day 4 to prevent template fatigue!";
  if (window.confirm(confirmMsg)) {
    switchDaySession('day5', true);
  }
}

function initSessionAndPointsHub() {
  if (daySessionSelect) {
    daySessionSelect.value = currentSessionId;
    daySessionSelect.addEventListener('change', (e) => {
      switchDaySession(e.target.value);
    });
  }

  if (btnNewDaySession) {
    btnNewDaySession.addEventListener('click', startTomorrowDesk);
  }

  if (btnSaveDailyScore && officialDailyScoreInput) {
    btnSaveDailyScore.addEventListener('click', () => {
      const val = parseFloat(officialDailyScoreInput.value) || 0;
      setSessionScore(currentSessionId, val);
      renderAttributionMatrix();
      updateWeeklyProgress();
      showToast(`💾 Saved score: ${val.toFixed(1)} pts!`);
    });
  }

  // Interactive Day Switcher Chips
  [
    { id: 'chipDay1', sid: 'day1' },
    { id: 'chipDay2', sid: 'day2' },
    { id: 'chipDay3', sid: 'day3' },
    { id: 'chipDay4', sid: 'day4' },
    { id: 'chipDay5', sid: 'day5' }
  ].forEach(({ id, sid }) => {
    const chip = document.getElementById(id);
    if (chip) {
      chip.addEventListener('click', () => {
        switchDaySession(sid);
      });
    }
  });

  // Header Cycle Day Button
  const btnCycleDay = document.getElementById('btnCycleDay');
  if (btnCycleDay) {
    const cycleOrder = ['day1', 'day2', 'day3', 'day4', 'day5'];
    btnCycleDay.addEventListener('click', () => {
      const idx = cycleOrder.indexOf(currentSessionId);
      const nextIdx = (idx + 1) % cycleOrder.length;
      const nextSession = cycleOrder[nextIdx];
      switchDaySession(nextSession);
    });
  }

  // Score preset buttons
  document.querySelectorAll('.btn-score-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.getAttribute('data-val')) || 0;
      if (officialDailyScoreInput) officialDailyScoreInput.value = val.toFixed(1);
      setSessionScore(currentSessionId, val);
      renderAttributionMatrix();
      updateWeeklyProgress();
      showToast(`🎯 Score preset applied: ${val.toFixed(1)} pts!`);
    });
  });

  renderAttributionMatrix();
  renderDynamicDayAudit();
}

/**
 * Object-Oriented Session Manager Class
 */
class SessionManager {
  constructor() {
    this.currentSessionId = (typeof currentSessionId !== 'undefined') ? currentSessionId : 'day4';
  }

  getScore(sessionId) {
    return getSessionScore(sessionId);
  }

  setScore(sessionId, score) {
    setSessionScore(sessionId, score);
  }

  switchSession(sessionId, forceFresh = false) {
    return switchDaySession(sessionId, forceFresh);
  }

  updateProgress() {
    updateWeeklyProgress();
    renderAttributionMatrix();
  }
}

window.EdgeFlow.SessionManager = new SessionManager();