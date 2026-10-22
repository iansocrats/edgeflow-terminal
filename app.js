// Live UTC Clock & Global Trading Session Indicator
function updateUtcClock() {
  const now = new Date();
  const hours = now.getUTCHours();
  const mins = String(now.getUTCMinutes()).padStart(2, '0');
  const secs = String(now.getUTCSeconds()).padStart(2, '0');
  const hrsStr = String(hours).padStart(2, '0');

  const clockEl = document.getElementById('utcClock');
  const sessionEl = document.getElementById('sessionStatus');

  if (clockEl) {
    clockEl.textContent = `UTC: ${hrsStr}:${mins}:${secs}`;
  }

  if (sessionEl) {
    let statusText = '';
    if (hours >= 7 && hours < 11) {
      statusText = '🟢 London Open Window — Publish Note #1 (Primary Setup)';
    } else if (hours >= 13 && hours < 17) {
      statusText = '🔥 NY Open Peak Volume — Publish Note #2 (Live Update / Hot Mover)';
    } else if (hours >= 19 && hours < 23) {
      statusText = '🌙 Daily Close Window — Publish Note #3 (Recap / Post-Mortem)';
    } else {
      statusText = '⚡ Asian / Off-Peak Session — Monitor Limit Orders & Reply to Comments';
    }
    sessionEl.textContent = statusText;
  }
}

setInterval(updateUtcClock, 1000);
updateUtcClock();

// AI Red-Flag Phrase Dictionary
const AI_RED_FLAGS = [
  'dive in',
  'let\'s dive',
  'delve into',
  'in conclusion',
  'furthermore',
  'moreover',
  'it is important to note',
  'it\'s important to remember',
  'exercise caution',
  'only time will tell',
  'testament to',
  'tapestry',
  'ever-evolving',
  'navigate the',
  'comprehensive overview',
  'as always, do your own research',
  'in summary'
];

// Post Builder Generator
const templateSelect = document.getElementById('templateType');
const coinInput = document.getElementById('coinPair');
const directionSelect = document.getElementById('direction');
const timeframeSelect = document.getElementById('timeframe');
const entryInput = document.getElementById('entryPrice');
const stopInput = document.getElementById('stopPrice');
const tp1Input = document.getElementById('tp1Price');
const tp2Input = document.getElementById('tp2Price');
const catalystInput = document.getElementById('customCatalyst');
const postOutput = document.getElementById('postOutput');
const reminderTicker = document.getElementById('reminderTicker');

function buildPostDraft() {
  const type = templateSelect.value;
  const coin = (coinInput.value || 'SOL').toUpperCase().replace('$', '');
  const dir = directionSelect.value;
  const tf = timeframeSelect.value;
  const entry = entryInput.value || '184.50';
  const stop = stopInput.value || '189.20';
  const tp1 = tp1Input.value || '176.00';
  const tp2 = tp2Input.value || '169.50';
  const catalyst = catalystInput.value.trim() || 'price swept key liquidity and immediately stalled out';

  if (reminderTicker) {
    reminderTicker.textContent = coin;
  }

  let draft = '';

  if (type === 'reversal') {
    const oppositeGroup = dir === 'Short' ? 'late retail longs' : 'late breakout shorts';
    const sweepSide = dir === 'Short' ? 'highs' : 'lows';
    draft = `Why I'm stepping into a $${coin} ${dir} right here (${tf} setup):

Everyone is chasing this move, but look closely at the ${tf} structure — ${catalyst}. To me, this looks like ${oppositeGroup} getting trapped right at the ${sweepSide}.

My Execution Plan:
• Direction: $${coin} Perp ${dir}
• Entry Zone: $${entry}
• Invalidation (Hard Stop): $${stop}
• Targets: TP1 at $${tp1} / TP2 at $${tp2}

I'm keeping risk tight (around 1% account risk) in case volatility spikes. If we get a clean ${tf} candle close past $${stop}, my idea is wrong and I'll cut it immediately.

Are you fading this move at $${entry} or playing the continuation? Drop your bias below 👇`;
  } else if (type === 'pullback') {
    draft = `My gameplan for $${coin} today (Not chasing current price):

$${coin} has been moving hard, but jumping in mid-range gives terrible risk-to-reward. Looking at the ${tf} chart, ${catalyst}.

Instead of FOMOing, I have my limit orders resting at the reload zone:
• Setup: $${coin} ${dir} Limit
• Entry Zone: $${entry}
• Stop-Loss / Invalidation: $${stop}
• Take-Profit Targets: $${tp1} then $${tp2}

If it runs without tapping $${entry}, so be it — I'd rather miss a move than become exit liquidity. Where are your bids/asks sitting for today's session? 👇`;
  } else if (type === 'twoway') {
    draft = `$${coin} is coiling tight on the ${tf} chart — here is how I'm trading both sides of the breakout:

Right now ${catalyst}, so guessing direction inside the chop is a coin flip. I'm waiting for price to tip its hand at my key trigger levels:

🟢 Bull Scenario: Clean ${tf} close above $${entry} -> Long targeting $${tp1} and $${tp2} (Stop below $${stop}).
🔴 Bear Scenario: Sweep & rejection at $${entry} -> Short back down toward $${stop} liquidity pool.

My orders are mapped out on the widget below. Which side gets swept first today — bulls or bears? 👇`;
  } else if (type === 'update') {
    draft = `Honest update on my $${coin} ${dir} from earlier (${tf} view):

Took this $${coin} ${dir} from $${entry} because ${catalyst}. Price just tapped $${tp1}, so I've locked in partial profit and moved my stop-loss from $${stop} to breakeven on the rest, leaving a runner for $${tp2}.

Key lesson from today's session: waiting for the liquidity sweep before entering saved me from getting chopped up early.

Did anyone else catch this $${coin} move, or are you waiting for the next setup? 👇`;
  }

  postOutput.value = draft;
  scanTextForAI(draft);
}

function scanTextForAI(text) {
  const lower = text.toLowerCase();
  const foundFlags = AI_RED_FLAGS.filter(phrase => lower.includes(phrase));
  const scannerBox = document.getElementById('scannerReport');
  const badge = document.getElementById('authScoreBadge');

  if (foundFlags.length === 0) {
    scannerBox.className = 'scanner-box';
    scannerBox.innerHTML = `<span>✅ <strong>Zero templated boilerplate detected.</strong> First-person voice & concrete levels look 100% authentic.</span>`;
    badge.className = 'authenticity-badge';
    badge.textContent = '100% Human Voice';
  } else {
    scannerBox.className = 'scanner-box flagged';
    scannerBox.innerHTML = `<span>⚠️ <strong>Tone Filter Warning:</strong> Remove robotic phrases (${foundFlags.map(f => `"${f}"`).join(', ')}) to avoid quality score penalties!</span>`;
    badge.className = 'authenticity-badge warn';
    badge.textContent = `${Math.max(20, 100 - foundFlags.length * 25)}% Human Score`;
  }
}

document.getElementById('generatePostBtn').addEventListener('click', buildPostDraft);
postOutput.addEventListener('input', (e) => scanTextForAI(e.target.value));

document.getElementById('copyPostBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(postOutput.value).then(() => {
    const btn = document.getElementById('copyPostBtn');
    const original = btn.textContent;
    btn.textContent = '✅ Copied to Clipboard!';
    setTimeout(() => { btn.textContent = original; }, 2000);
  });
});

document.getElementById('clearPostBtn').addEventListener('click', () => {
  postOutput.value = '';
  scanTextForAI('');
  postOutput.focus();
});

// Initialize default post draft
buildPostDraft();

// Daily Checklist Persistence
const STORAGE_KEY = 'edgeflow_daily_checklist_v1';
const checkboxes = document.querySelectorAll('#checklistContainer input[type="checkbox"]');
const counterEl = document.getElementById('checklistCounter');

function loadChecklist() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    checkboxes.forEach(cb => {
      const key = cb.getAttribute('data-task');
      cb.checked = Boolean(saved[key]);
      cb.closest('.check-item').classList.toggle('completed', cb.checked);
    });
    updateChecklistCount();
  } catch (e) {
    console.error(e);
  }
}

function saveChecklist() {
  const state = {};
  checkboxes.forEach(cb => {
    const key = cb.getAttribute('data-task');
    state[key] = cb.checked;
    cb.closest('.check-item').classList.toggle('completed', cb.checked);
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateChecklistCount();
}

function updateChecklistCount() {
  const total = checkboxes.length;
  const done = Array.from(checkboxes).filter(cb => cb.checked).length;
  if (counterEl) {
    counterEl.textContent = `${done} / ${total} Completed`;
  }
}

checkboxes.forEach(cb => cb.addEventListener('change', saveChecklist));

document.getElementById('resetChecklistBtn').addEventListener('click', () => {
  checkboxes.forEach(cb => {
    cb.checked = false;
    cb.closest('.check-item').classList.remove('completed');
  });
  localStorage.removeItem(STORAGE_KEY);
  updateChecklistCount();
});

loadChecklist();
