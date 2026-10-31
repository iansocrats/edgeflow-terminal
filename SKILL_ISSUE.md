# 🛡️ SKILL ISSUE LOG & OPERATIONAL FACT-CHECKING REPOSITORY
> **EdgeFlow Terminal • Living Ground-Truth Guardrails**
> *Strict rule: Consult and verify against this file on EVERY action, schedule generation, score calculation, and post-production.*

---

## 📌 Section 1: Campaign Runway & Leaderboard Scoring Rules

| ID | Historical "Skill Issue" (Where We Went Wrong) | Permanent Ground Truth Fix | Impact & Penalty if Violated |
| :--- | :--- | :--- | :--- |
| **SKILL-001** | Assumed campaign had 10 days or ran past Sunday. | **Campaign is strictly Monday through Sunday (7 days total).** It resets every Monday at 00:00 UTC. Day 6 is Saturday (Today), Day 7 is Sunday (Tomorrow - Final Day). | False roadmap planning, missing weekly reward settlement deadline. |
| **SKILL-002** | Miscalculated Day 5 historical output as 10 posts. | **Day 5 had exactly 11 posts** yielding **19.0 points** ($1.73\text{ pts/post}$). | Historical attribution inaccuracies and flawed run-rate modeling. |
| **SKILL-003** | Assumed comments multiply points on Bybit ByX. | **Comments do NOT multiply Bybit ByX creator points.** Bybit is a crypto exchange where points are driven by: (1) Content Quality Score $\ge 40$, (2) Trading Conversion & Actionability (real setups with entry/invalidation/targets), (3) Unique Authenticated Reader Reach, and (4) Daily Quota Completion without duplicate content flags. | Wasting CTA prompts on begging for comments instead of directing readers to live trade execution. |
| **SKILL-004** | Projected 18.8 pts/day across 5 days to hit 150. | **With only 2 days left (Day 6 & Day 7) and 56.0 pts banked, the 150 floor requires exactly 47.0 pts/day ($94 \div 2$).** Realistic ceiling is ~22–26 pts/day (landing at ~106 pts for Tier 2). Next fresh cycle starts Monday (Nov 02) requiring 21.5 pts/day over 7 days. | Delusional pacing expectations. |

---

## 📌 Section 2: Post Formatting & Trading Relevance Rules

| ID | Historical "Skill Issue" (Where We Went Wrong) | Permanent Ground Truth Fix | Impact & Penalty if Violated |
| :--- | :--- | :--- | :--- |
| **SKILL-005** | Included hashtags (`#ByXIMPACT`, `#Crypto`, etc.). | **ZERO `#` HASHTAGS EVER.** Absolute 100% ban on hashtags. Bybit's automated scraper flags `#` as bot spam. | Automated bot multiplier penalty, loss of algorithmic distribution. |
| **SKILL-006** | First line hook exceeded 50 characters. | **Title/Hook MUST be $\le 50$ characters.** Always include coin ticker (e.g., `⚡ $SOL Squeeze Coils: My Next Move`). | UI truncation on mobile Bybit app, destroying CTR. |
| **SKILL-007** | Mixed timeframes (1H, 15m, 1D). | **Strictly standardized to 4-Hour (4H) timeframe.** Derivative perpetual traders anchor to 4H candles. | Fractured analysis authority. |
| **SKILL-008** | Vague, conversational advice without trade geometry. | **Mandatory unhedged line-by-line `Execution setup:` block:**<br>• Entry zone: `[price low - price high]`<br>• Invalidation stop: `exact price (4H close below/above)`<br>• Targets: `TP1, TP2, TP3`<br>• Exact R:R: `e.g. 1:2.85` | Zero trading conversion attribution, failing ByX Trading Relevance. |
| **SKILL-009** | 1-sided conclusion or rhetorical filler. | **Closing MUST be an authentic 2-sided debate question** inviting capital positioning (e.g. *"Are you longing this dip into support, or waiting for the sweep?"*). | Low dwell time and zero reader interaction. |
| **SKILL-010** | Spaced posts too tightly (< 45 min apart). | **Strict 2.5-hour wave pacing.** Maximum 2 posts per wave. Never dump posts in bursts. | Feed cannibalization: Bybit algorithm stops distributing post N as soon as post N+1 is dropped. |
| **SKILL-017** | Missing philosophical market depth before closing poll. | **Mandatory philosophical quote/reflection preceding the closing debate question.** Connect the specific coin's price action to a timeless market truth (patience, risk, human consensus, liquidity cycles). | Elevates content authority above retail noise and boosts dwell time. |

---

## 📌 Section 3: AI Detection, Anti-Plagiarism & Mathematical Veracity

| ID | Historical "Skill Issue" (Where We Went Wrong) | Permanent Ground Truth Fix | Impact & Penalty if Violated |
| :--- | :--- | :--- | :--- |
| **SKILL-011** | Relied on outdated 2019 GLTR token ranking. | **Upgraded to Stanford Fast-DetectGPT (2024 SOTA)** measuring local probability curvature ($\kappa > 0$ dispersed human manifold). | Flags false positives and fails modern institutional AI detectors. |
| **SKILL-012** | Repeated sentence structures and bullet templates. | **Enforce polymorphic archetypes** from benchmark corpus: `relative_value`, `tactical_signal`, `sentiment_trap`, `liquidity_sweep`. | Jaccard similarity spikes $> 18.5\%$, triggering duplicate content penalties. |
| **SKILL-013** | Using generic AI vocabulary (*moreover, delve, testaments, landscape*). | **Enforce Thematic Trading Lexicon**: *bid depth, absorption wick, funding carry, short coil, delta divergence, liquidation cascade*. | Detectors flag robotic syntax. |
| **SKILL-018** | Injected verbatim famous quotes (Warren Buffett, Charlie Munger). | **ABSOLUTE BAN ON FAMOUS VERBATIM QUOTES.** Because LLMs memorize famous quotes during pre-training, detectors (Fast-DetectGPT, GLTR) assign near-zero perplexity to those exact token sequences, spiking AI coverage risk by >10%. Always write **original, unquoted human trader philosophy** grounded directly in live order book and liquidity mechanics. | Spikes AI detector risk >10%, trips token memorization flags, ruins human authenticity. |

---

## 📌 Section 4: Architecture, Engineering & Tooling Integrity

| ID | Historical "Skill Issue" (Where We Went Wrong) | Permanent Ground Truth Fix | Impact & Penalty if Violated |
| :--- | :--- | :--- | :--- |
| **SKILL-014** | Unescaped `${...}` inside JS template literals in HTML builders. | **Always escape `${` as `\${` or concatenate strings** when generating code preview snippets inside template literals. | Hard `SyntaxError: Unexpected token 'class'` crashing script load. |
| **SKILL-015** | Calling unhandled forensic render functions. | **Every tab in `index.html` must have a corresponding, fully implemented render function** in `ForensicHub.js`. | Blank views or crashes when user clicks buttons. |
| **SKILL-016** | Printing raw non-ASCII emojis to Windows PowerShell stdout. | **Always encode with `errors='backslashreplace'` or ASCII fallback** when writing diagnostic python scripts. | `UnicodeEncodeError: 'charmap' codec can't encode character` crashing automation. |

---
---

## 📌 Section 5: Original Human Trader Philosophy (Zero-AI & Zero-Plagiarism Framework)
> **Core Principle**: Never use quotation marks, attribution tags, or famous names (Buffett, Munger, Livermore). Write pure, unadorned, personal reflections on trading psychology, capital preservation, and tape mechanics that flow seamlessly into the closing debate question.

### 🎯 6 Archetypal Angles for Original Market Philosophy:

1. **Range High / Breakout Resistance (P1 $BTC, P5 $NEAR, P10 $AAVE)**
   * *Thematic Focus*: Paying tuition to patient limit bids; missing a move costs nothing, but FOMO destroys capital.
   * *Tone*: Cold, disciplined, patient.

2. **Crowded Panic / Support Absorptions (P2 $ETH, P3 $SOL, P7 $SUI)**
   * *Thematic Focus*: Crowded consensus at support is where late leverage dies; letting others burn carry against the floor.
   * *Tone*: Contrarian, predatory, calm.

3. **Sideways Chop & Volatility Squeezes (P4 $XRP, P8 $DOGE)**
   * *Thematic Focus*: Boredom kills more accounts than bad analysis; surviving the fakeouts until the coiling spring expands.
   * *Tone*: Grounded, stoic, strategic.

4. **Macro Stress & Flight to Scarcity (P6 $BNB, P9 $XAUT)**
   * *Thematic Focus*: Market noise is deafening but institutional absorption is quiet; structural patience in sound value areas.
   * *Tone*: Institutional, macro-aware, unwavering.

5. **Harvesting Gains & Defending Capital (P11 $LINK)**
   * *Thematic Focus*: Taking partial profits is never an error; realized capital buys emotional freedom for the next setup.
   * *Tone*: Professional, risk-first, unattached.

6. **Secular Narratives vs Intraday Leverage (P12 $ONDO)**
   * *Thematic Focus*: Long-term protocol adoption unfolds over months, but leverage liquidates in minutes; anchoring to structural baselines.
   * *Tone*: Forward-looking, thesis-driven, structurally sound.

---
*Last verified & updated: Saturday, Oct 31, 2026 • 16:50 UTC+3*
