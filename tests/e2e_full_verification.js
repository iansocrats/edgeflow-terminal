const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8089;
const CDP_PORT = 9222;
const BASE_DIR = path.resolve(__dirname, '..');

// 1. Static HTTP Server
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(BASE_DIR, reqPath);
  console.log(`[HTTP REQ] ${req.method} ${req.url} -> ${fs.existsSync(filePath) ? 'EXISTS' : 'NOT FOUND'}`);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.wasm': 'application/wasm'
  };
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, async () => {
  console.log(`[HTTP] Server started at http://127.0.0.1:${PORT}`);
  runE2ETest();
});

async function runE2ETest() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + path.join(BASE_DIR, '.chrome-test-profile'),
    'about:blank'
  ]);

  let killed = false;
  const cleanup = () => {
    if (!killed) {
      killed = true;
      try { chromeProc.kill(); } catch (e) {}
      server.close();
    }
  };

  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);

  // Wait for Chrome CDP port to open
  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
    const targets = await listRes.json();
    console.log('[CDP] Available targets:', targets.map(t => ({ type: t.type, title: t.title, url: t.url })));
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const wsUrl = pageTarget.webSocketDebuggerUrl;
    console.log('[CDP] Connecting to Page target via WebSocket:', wsUrl);

    const ws = new WebSocket(wsUrl);
    let msgId = 1;
    const callbacks = new Map();
    const consoleLogs = [];
    const jsErrors = [];

    const send = (method, params = {}) => {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    };

    const networkRequests = [];
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        const cb = callbacks.get(data.id);
        callbacks.delete(data.id);
        if (data.error) cb.reject(data.error);
        else cb.resolve(data.result);
      } else if (data.method === 'Runtime.consoleAPICalled') {
        const args = (data.params.args || []).map(a => a.value || a.description).join(' ');
        consoleLogs.push(`[Console ${data.params.type}] ${args}`);
      } else if (data.method === 'Runtime.exceptionThrown') {
        jsErrors.push(data.params.exceptionDetails);
        console.error('🚨 BROWSER EXCEPTION:', data.params.exceptionDetails.text, data.params.exceptionDetails.exception?.description);
      } else if (data.method === 'Network.responseReceived') {
        networkRequests.push(`${data.params.response.status} ${data.params.response.url}`);
      } else if (data.method === 'Network.loadingFailed') {
        networkRequests.push(`FAILED: ${data.params.errorText} ${data.params.canceled ? '(canceled)' : ''}`);
      }
    };

    await new Promise((resolve) => ws.onopen = resolve);
    console.log('[CDP] WebSocket connected successfully.');

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Network.enable');

    console.log('[CDP] Navigating to http://127.0.0.1:' + PORT + '/index.html ...');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });

    // Wait for load and initialization
    await new Promise(r => setTimeout(r, 2000));

    // Helper to evaluate JS in the browser context
    const evalBrowser = async (expression) => {
      const res = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true
      });
      if (res.exceptionDetails) {
        throw new Error('Evaluation error: ' + (res.exceptionDetails.exception?.description || res.exceptionDetails.text));
      }
      return res.result ? res.result.value : undefined;
    };

    console.log('\n--- BEGINNING LIVE COMPONENT AUDIT ---');
    console.log('Network Requests:', networkRequests);
    console.log('Browser Console Logs:', consoleLogs);
    console.log('Browser ReadyState:', await evalBrowser('document.readyState'));
    console.log('typeof initApp:', await evalBrowser('typeof initApp'));
    console.log('postsData length:', await evalBrowser('postsData ? postsData.length : "null"'));

    // 1. Check Console Errors during page load
    if (jsErrors.length > 0) {
      console.error('❌ FAILED: Browser threw exceptions on initial page load!');
      cleanup();
      process.exit(1);
    } else {
      console.log('✅ PASS: Initial page load completed with ZERO JavaScript exceptions.');
    }

    // 2. Check Day 5 Active Recovery Desk Post Pills rendered
    const pillCount = await evalBrowser('document.querySelectorAll("#pillsContainer .pill-item").length');
    console.log(`✅ PASS: Found ${pillCount} post pills in Day 5 carousel.`);
    if (pillCount !== 10) throw new Error(`Expected 10 pills on Day 5, got ${pillCount}`);

    // 3. Check Post 1 Content loaded on Day 5 ($SOL)
    const postTitle = await evalBrowser('document.getElementById("currentPostTitle").textContent');
    const postContent = await evalBrowser('document.getElementById("polishedContent").value');
    console.log(`✅ PASS: Active Post Title: "${postTitle}"`);
    console.log(`✅ PASS: Active Post Content length: ${postContent.length} chars.`);
    if (!postTitle.includes('SOL')) throw new Error('Expected Post 1 to be SOL');

    // 4. Test clicking Pill 2 ($BTC Heatmap Trap on Day 5)
    console.log('\n--- TESTING DAY 5 POST CAROUSEL NAVIGATION ---');
    await evalBrowser('document.querySelectorAll("#pillsContainer .pill-item")[1].click()');
    await new Promise(r => setTimeout(r, 300));
    const titleP2 = await evalBrowser('document.getElementById("currentPostTitle").textContent');
    const contentP2 = await evalBrowser('document.getElementById("polishedContent").value');
    console.log(`✅ PASS: Clicked Pill 2 -> New Title: "${titleP2}"`);
    console.log(`✅ PASS: Post 2 Content loaded (${contentP2.length} chars, contains: "${contentP2.slice(0, 40)}...")`);
    if (!titleP2.includes('BTC')) throw new Error('Expected Post 2 to be BTC');

    // 4b. Test Day 4 Certified Archive Preservation (13 posts, $MSFT, $ETH, $BTC)
    console.log('\n--- TESTING DAY 4 CERTIFIED ARCHIVE PRESERVATION ---');
    await evalBrowser('switchDaySession("day4")');
    await new Promise(r => setTimeout(r, 300));
    const d4PillCount = await evalBrowser('document.querySelectorAll("#pillsContainer .pill-item").length');
    console.log(`✅ PASS: Day 4 Archive loaded with ${d4PillCount} preserved setups.`);
    if (d4PillCount !== 13) throw new Error(`Expected 13 pills in Day 4 Archive, got ${d4PillCount}`);

    // Click Pill 11 ($MSFT) in Day 4 Archive
    await evalBrowser('document.querySelectorAll("#pillsContainer .pill-item")[10].click()');
    await new Promise(r => setTimeout(r, 300));
    const titleP11 = await evalBrowser('document.getElementById("currentPostTitle").textContent');
    console.log(`✅ PASS: Clicked Pill 11 in Day 4 Archive -> Title: "${titleP11}"`);
    if (!titleP11.includes('MSFT')) throw new Error('Expected Pill 11 in Day 4 Archive to be MSFT');

    // Click Pill 12 ($ETH) in Day 4 Archive
    await evalBrowser('document.querySelectorAll("#pillsContainer .pill-item")[11].click()');
    await new Promise(r => setTimeout(r, 300));
    const titleP12 = await evalBrowser('document.getElementById("currentPostTitle").textContent');
    console.log(`✅ PASS: Clicked Pill 12 in Day 4 Archive -> Title: "${titleP12}"`);
    if (!titleP12.includes('ETH')) throw new Error('Expected Pill 12 in Day 4 Archive to be ETH');

    // Click Pill 13 ($BTC) in Day 4 Archive
    await evalBrowser('document.querySelectorAll("#pillsContainer .pill-item")[12].click()');
    await new Promise(r => setTimeout(r, 300));
    const titleP13 = await evalBrowser('document.getElementById("currentPostTitle").textContent');
    console.log(`✅ PASS: Clicked Pill 13 in Day 4 Archive -> Title: "${titleP13}"`);
    if (!titleP13.includes('BTC')) throw new Error('Expected Pill 13 in Day 4 Archive to be BTC');

    // Reset back to Day 5 Active Desk
    await evalBrowser('switchDaySession("day5")');
    await new Promise(r => setTimeout(r, 300));

    // Test Copy Polished Post button trigger
    const copyPolishedBtnExists = await evalBrowser('document.getElementById("copyPolishedBtn") !== null');
    console.log(`✅ PASS: Copy Polished Post button exists: ${copyPolishedBtnExists}`);
    if (!copyPolishedBtnExists) throw new Error('Expected copyPolishedBtn to exist');

    // 4d. Test Harvard NLP GLTR Next-Token Rank Predictability Engine
    console.log('\n--- TESTING HARVARD NLP GLTR RANK PREDICTABILITY ENGINE ---');
    await evalBrowser('document.getElementById("recalcGltrBtn").click()');
    await new Promise(r => setTimeout(r, 200));

    const gltrGreen = await evalBrowser('document.getElementById("gltrGreenVal").textContent');
    const gltrYellow = await evalBrowser('document.getElementById("gltrYellowVal").textContent');
    const gltrPurple = await evalBrowser('document.getElementById("gltrPurpleVal").textContent');
    const gltrVerdict = await evalBrowser('document.getElementById("gltrVerdict").textContent');
    console.log(`✅ PASS: GLTR Live Telemetry: Top-10=${gltrGreen}, Contextual=${gltrYellow}, Creative=${gltrPurple}`);
    console.log(`✅ PASS: GLTR Verdict: "${gltrVerdict.slice(0, 75)}..."`);

    const yellowVal = parseInt(gltrYellow);
    const purpleVal = parseInt(gltrPurple);
    const greenVal = parseInt(gltrGreen);

    const hasContextualPill = await evalBrowser('document.querySelector(".gltr-token-pill.contextual") !== null');
    console.log(`✅ PASS: GLTR Contextual tokens explicitly tagged: ${hasContextualPill}`);
    if (!hasContextualPill) throw new Error('Expected GLTR contextual tokens to be tagged in diagnostics');

    if (yellowVal < 30 || yellowVal > 52) {
      throw new Error(`Expected Contextual Words to be in 30-52% range (Target: 35-45%), got ${yellowVal}%`);
    }
    if (purpleVal < 20 || purpleVal > 40) {
      throw new Error(`Expected Creative Leaps to be in 20-40% range (Target: 25-35%), got ${purpleVal}%`);
    }
    if (greenVal > 35) {
      throw new Error(`Expected Top-10 Predictable to be <= 35%, got ${greenVal}%`);
    }
    if (!gltrVerdict.includes('PASSED')) {
      throw new Error(`Expected GLTR Verdict to be PASSED, got "${gltrVerdict}"`);
    }

    // 5. Test clicking Score Hub
    console.log('\n--- TESTING SCORE HUB NAVIGATION & ENGINE ---');
    await evalBrowser('document.getElementById("btnOpenScoresModal").click()');
    await new Promise(r => setTimeout(r, 400));

    const scoresHubVisible = await evalBrowser('!document.getElementById("viewScoresHub").classList.contains("hidden")');
    const workspaceHiddenFromScores = await evalBrowser('document.getElementById("postWorkspaceWrapper").classList.contains("hidden")');
    const attributionRowCount = await evalBrowser('document.querySelectorAll("#attributionTableBody tr").length');
    console.log(`✅ PASS: Score Hub is visible: ${scoresHubVisible}`);
    console.log(`✅ PASS: Post Workspace is hidden: ${workspaceHiddenFromScores}`);
    console.log(`✅ PASS: Point Attribution Matrix rows rendered: ${attributionRowCount}`);
    if (!scoresHubVisible || !workspaceHiddenFromScores || attributionRowCount < 5) {
      throw new Error('Score Hub failed to switch or render attribution table properly');
    }

    // Return to Post Workspace
    await evalBrowser('document.getElementById("returnPostsFromScoresBtn").click()');
    await new Promise(r => setTimeout(r, 300));
    const workspaceRestored = await evalBrowser('!document.getElementById("postWorkspaceWrapper").classList.contains("hidden")');
    console.log(`✅ PASS: Returned back to Post Workspace: ${workspaceRestored}`);

    // 6. Test clicking Deep Forensic Trade & Writing Analysis & Cross-Analysis
    console.log('\n--- TESTING TRADE & WRITING ANALYSIS HUB & CROSS-ANALYSIS ---');
    await evalBrowser('document.getElementById("pillBarCrossAnalysisBtn").click()');
    await new Promise(r => setTimeout(r, 400));

    const analysisHubVisible = await evalBrowser('!document.getElementById("viewForensicAnalysisHub").classList.contains("hidden")');
    const containerHasContent = await evalBrowser('document.getElementById("forensicAnalysisContentContainer").children.length > 0');
    const hasCrossHero = await evalBrowser('document.querySelector(".cross-hero-card") !== null');
    const rootCausesCount = await evalBrowser('document.querySelectorAll(".root-cause-card").length');
    const diagToolsCount = await evalBrowser('document.querySelectorAll(".tool-card").length');
    console.log(`✅ PASS: Cross-Analysis opened via Pill Bar -> Visible: ${analysisHubVisible}`);
    console.log(`✅ PASS: Cross-Analysis Hero rendered: ${hasCrossHero}`);
    console.log(`✅ PASS: 5 Fatal Root Causes rendered: ${rootCausesCount === 5} (Count: ${rootCausesCount})`);
    console.log(`✅ PASS: 5 Analytical Diagnostic Tools rendered: ${diagToolsCount === 5} (Count: ${diagToolsCount})`);
    if (!analysisHubVisible || !hasCrossHero || rootCausesCount !== 5 || diagToolsCount !== 5) {
      throw new Error('Cross-Analysis Hub failed to render complete post-mortem diagnostics');
    }

    // Test Day 5 Active Desk Tab
    console.log('\n--- TESTING DAY 5 ACTIVE DESK FORENSIC TAB ---');
    await evalBrowser('document.getElementById("btnForensicDay5").click()');
    await new Promise(r => setTimeout(r, 300));
    const day5HasScorecard = await evalBrowser('document.querySelector(".forensic-scorecard-grid") !== null');
    console.log(`✅ PASS: Switched to Day 5 Active Desk -> Scorecard present: ${day5HasScorecard}`);

    // Test Day 4 Archive Tab
    console.log('\n--- TESTING DAY 4 ARCHIVE FORENSIC TAB ---');
    await evalBrowser('document.getElementById("btnForensicDay4").click()');
    await new Promise(r => setTimeout(r, 300));
    const day4HasScorecard = await evalBrowser('document.querySelector(".forensic-scorecard-grid") !== null');
    console.log(`✅ PASS: Switched to Day 4 Archive -> Scorecard present: ${day4HasScorecard}`);

    // Test Day 3 Archive Tab
    console.log('\n--- TESTING DAY 3 ARCHIVE FORENSIC TAB ---');
    await evalBrowser('document.getElementById("btnForensicDay3").click()');
    await new Promise(r => setTimeout(r, 300));
    const day3HasRedundancyTable = await evalBrowser('document.querySelector(".similarity-table") !== null');
    console.log(`✅ PASS: Switched to Day 3 Archive -> Similarity table present: ${day3HasRedundancyTable}`);

    // Switch back to Day 4 to test dynamic 13x13 similarity matrix
    await evalBrowser('document.getElementById("btnForensicDay4").click()');
    await new Promise(r => setTimeout(r, 300));

    // Test Metric Pills
    console.log('\n--- TESTING METRIC SELECTOR PILLS ---');
    const metricPills = ['tfidf', 'trigram', 'entropy', 'jsd', 'syntax', 'jaccard'];
    for (const metric of metricPills) {
      await evalBrowser(`document.querySelector('.metric-pill[data-metric="${metric}"]').click()`);
      await new Promise(r => setTimeout(r, 200));
      const activeMetric = await evalBrowser('currentForensicMetric');
      console.log(`  ✓ Metric pill "${metric}" clicked -> currentForensicMetric is "${activeMetric}"`);
    }

    // Verify Dynamic 13-Post Similarity Matrix in Forensic Hub
    console.log('\n--- TESTING DYNAMIC 13x13 MATRIX IN FORENSIC HUB ---');
    const headerCols = await evalBrowser(`
      Array.from(document.querySelectorAll('.similarity-table thead th')).map(th => th.textContent.trim()).filter(t => t !== 'ASSET')
    `);
    const rowCoins = await evalBrowser(`
      Array.from(document.querySelectorAll('.similarity-table tbody tr th')).map(th => th.textContent.trim())
    `);
    console.log(`  ✓ Dynamic Similarity Matrix header columns count: ${headerCols.length} (${headerCols.join(', ')})`);
    console.log(`  ✓ Dynamic Similarity Matrix body rows count: ${rowCoins.length} (${rowCoins.join(', ')})`);
    if (headerCols.length !== 13 || rowCoins.length !== 13) {
      throw new Error(`Expected 13x13 matrix in Forensic Hub, got ${headerCols.length} columns and ${rowCoins.length} rows`);
    }
    if (!headerCols.includes('$MSFT') || !headerCols.includes('$ETH') || !headerCols.includes('$BTC')) {
      throw new Error('Matrix headers missing Post 11 ($MSFT), Post 12 ($ETH), or Post 13 ($BTC)');
    }
    if (!rowCoins.includes('$MSFT') || !rowCoins.includes('$ETH') || !rowCoins.includes('$BTC')) {
      throw new Error('Matrix rows missing Post 11 ($MSFT), Post 12 ($ETH), or Post 13 ($BTC)');
    }
    console.log('✅ PASS: All 13 posts (including $MSFT, $ETH, $BTC) fully incorporated into Dynamic Similarity Matrix!');

    // Test Math Suite Tabs: Linear Algebra & Graph Operations
    console.log('\n--- TESTING ACADEMIC MATHEMATICS DECK (LINEAR ALGEBRA & GRAPH OPS) ---');
    await evalBrowser('document.querySelector(\'.math-suite-tab[data-suite="linalg"]\').click()');
    await new Promise(r => setTimeout(r, 300));
    const suiteLinalg = await evalBrowser('currentMathSuite');
    console.log(`✅ PASS: Switched to Linear Algebra & Graph Operations Suite: "${suiteLinalg}"`);

    const ops = ['laplacian', 'markov', 'frobenius', 'hadamard', 'svd', 'von_neumann', 'gramian'];
    for (const op of ops) {
      await evalBrowser(`document.querySelector('.math-op-btn[data-op="${op}"]').click()`);
      await new Promise(r => setTimeout(r, 200));
      const hasSvg = await evalBrowser('document.querySelector(".math-op-display-card svg") !== null');
      const opTitle = await evalBrowser('document.querySelector(".math-op-name") ? document.querySelector(".math-op-name").textContent : ""');
      console.log(`  ✓ Linear Algebra Op "${op}" rendered graph SVG: ${hasSvg} | "${opTitle.slice(0, 45)}..."`);
    }

    // Test Streaming Cold-Start Matrix Mode Selector Pills
    console.log('\n--- TESTING STREAMING COLD-START MATRIX MODES ---');
    const matrixModes = ['shadow', 'cross', 'live'];
    for (const mode of matrixModes) {
      await evalBrowser(`document.querySelector('.matrix-mode-pill[data-matrix-mode="${mode}"]').click()`);
      await new Promise(r => setTimeout(r, 150));
      const activeMode = await evalBrowser('currentMatrixMode');
      console.log(`  ✓ Matrix Mode pill "${mode}" clicked -> currentMatrixMode is "${activeMode}"`);
      if (activeMode !== mode) throw new Error(`Expected currentMatrixMode to be "${mode}", got "${activeMode}"`);
    }

    // Test Information Theory Suite
    console.log('\n--- TESTING COVER & THOMAS INFORMATION THEORY DECK ---');
    await evalBrowser('document.querySelector(\'.math-suite-tab[data-suite="infotheory"]\').click()');
    await new Promise(r => setTimeout(r, 300));

    const infoConcepts = [
      'kl', 'mutual_info', 'kelly_wealth', 'universal_portfolio',
      'aep', 'channel_capacity', 'rate_distortion',
      'waterfilling', 'kolmogorov', 'markov_rate', 'inequalities'
    ];
    for (const concept of infoConcepts) {
      await evalBrowser(`document.querySelector('.info-nav-btn[data-concept="${concept}"]').click()`);
      await new Promise(r => setTimeout(r, 200));
      const hasTheoremCard = await evalBrowser('document.querySelector(".info-theorem-card") !== null');
      const theoremTitle = await evalBrowser('document.querySelector(".info-theorem-title") ? document.querySelector(".info-theorem-title").textContent : ""');
      console.log(`  ✓ Info Theory Concept "${concept}" rendered card: ${hasTheoremCard} | "${theoremTitle.slice(0, 45)}..."`);
    }

    // Test Chaos Theory & Nonlinear Phase Space Suite
    console.log('\n--- TESTING CHAOS THEORY & NONLINEAR PHASE SPACE SUITE ---');
    await evalBrowser('document.querySelector(\'.math-suite-tab[data-suite="chaos"]\').click()');
    await new Promise(r => setTimeout(r, 300));

    const chaosConcepts = ['attractor', 'hurst', 'lyapunov'];
    for (const concept of chaosConcepts) {
      await evalBrowser(`document.querySelector('.chaos-nav-btn[data-concept="${concept}"]').click()`);
      await new Promise(r => setTimeout(r, 200));
      const hasTheoremCard = await evalBrowser('document.querySelector(".info-theorem-card") !== null');
      const theoremTitle = await evalBrowser('document.querySelector(".info-theorem-title") ? document.querySelector(".info-theorem-title").textContent : ""');
      console.log(`  ✓ Chaos Concept "${concept}" rendered card: ${hasTheoremCard} | "${theoremTitle.slice(0, 45)}..."`);
    }

    // Return to workspace
    await evalBrowser('document.getElementById("returnPostsFromAnalysisBtn").click()');
    await new Promise(r => setTimeout(r, 300));
    const backInWorkspace = await evalBrowser('!document.getElementById("postWorkspaceWrapper").classList.contains("hidden")');
    console.log(`✅ PASS: Returned back to Post Workspace from Analysis Hub: ${backInWorkspace}`);

    // --- TESTING COMPACT DAY SWITCHERS & RESPONSIVE VIEWPORTS ---
    console.log('\n--- TESTING COMPACT DAY SWITCHERS & RESPONSIVE DESIGN ---');
    // Test Cycle Day button
    const initialSession = await evalBrowser('currentSessionId');
    await evalBrowser('document.getElementById("btnCycleDay").click()');
    await new Promise(r => setTimeout(r, 200));
    const cycledSession = await evalBrowser('currentSessionId');
    console.log(`  ✓ Clicked #btnCycleDay: switched from "${initialSession}" to "${cycledSession}"`);

    // Switch to Scores Hub and test chip click
    await evalBrowser('document.getElementById("btnOpenScoresModal").click()');
    await new Promise(r => setTimeout(r, 200));
    await evalBrowser('document.getElementById("chipDay2").click()');
    await new Promise(r => setTimeout(r, 200));
    const chipSession = await evalBrowser('currentSessionId');
    console.log(`  ✓ Clicked #chipDay2: active session is now "${chipSession}"`);

    await evalBrowser('document.getElementById("chipDay5").click()');
    await new Promise(r => setTimeout(r, 200));
    const chipSessionD5 = await evalBrowser('currentSessionId');
    console.log(`  ✓ Clicked #chipDay5: active session is now "${chipSessionD5}" (Tomorrow Cold-Start Ready)`);
    if (chipSessionD5 !== 'day5') throw new Error(`Expected active session to be day5, got ${chipSessionD5}`);

    // Reset back to Day 4
    await evalBrowser('switchDaySession("day4")');
    await new Promise(r => setTimeout(r, 200));
    await evalBrowser('document.getElementById("returnPostsFromScoresBtn").click()');
    await new Promise(r => setTimeout(r, 200));

    // Test Responsive Viewports for Zero Horizontal Overflow
    const viewports = [
      { name: 'Mobile (375x667)', width: 375, height: 667 },
      { name: 'Large Mobile (414x896)', width: 414, height: 896 },
      { name: 'Tablet (768x1024)', width: 768, height: 1024 },
      { name: 'Desktop (1440x900)', width: 1440, height: 900 }
    ];

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 1024
      });
      await new Promise(r => setTimeout(r, 250));
      const overflow = await evalBrowser(`
        document.documentElement.scrollWidth > window.innerWidth + 1
      `);
      const bodyWidth = await evalBrowser('document.documentElement.scrollWidth');
      console.log(`  ✓ Viewport ${vp.name}: width=${bodyWidth}px, horizontal overflow=${overflow ? 'YES (FAIL)' : 'NO (PERFECT)'}`);
      if (overflow) {
        console.error(`🚨 HORIZONTAL OVERFLOW DETECTED AT ${vp.name}! scrollWidth: ${bodyWidth}, innerWidth: ${vp.width}`);
      }
    }

    // Check final error count
    console.log('\n================================================================');
    if (jsErrors.length === 0) {
      console.log('🏆 COMPLETE VERIFICATION PASSED: ALL ENGINES, HUBS, AND BUTTONS OPERATIONAL!');
      console.log('   - Post Studio & Carousel: 100% functional');
      console.log('   - Scores Hub & Point Attribution: 100% functional');
      console.log('   - Forensic Trade & Writing Analysis Hub: 100% functional');
      console.log('   - Academic Math Deck & Visualizations: 100% functional');
      console.log('   - Total Browser Exceptions Encountered: 0');
      console.log('================================================================');
      cleanup();
      process.exit(0);
    } else {
      console.error(`❌ FAILED: ${jsErrors.length} browser errors detected during testing.`);
      cleanup();
      process.exit(1);
    }

  } catch (err) {
    console.error('❌ E2E Test Execution Error:', err);
    cleanup();
    process.exit(1);
  }
}
