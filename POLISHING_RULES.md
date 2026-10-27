# EdgeFlow Terminal — Official ByX Competition Content Rules & Evaluation System

Every dictated post on EdgeFlow Terminal adheres to the official Bybit ByX content rules and the creator's foundational guidelines to ensure every post achieves a **Content Quality Score $\ge 40$** (Valid Post status).

---

### Part 1: Official ByX 5 Content Dimensions (Score $\ge 40$ Threshold)

ByX evaluates every post across 5 dimensions. A post must score 40 or higher to count as a Valid Post for weekly reward multipliers:

1. **Dimension 1 — Originality (Weight: Critical):**
   - Must use natural, human spoken language.
   - **Strictly NO AI-templated content.** Any synthetic patterns or generic LLM transitions trigger an instant quality penalty.

2. **Dimension 2 — Depth & Structure:**
   - Must feature structured reasoning supported by solid data, verifiable price metrics, and concrete levels.
   - Vague commentary without numbers is classified as low-quality filler.

3. **Dimension 3 — Relevance & Hotspots:**
   - Direct focus on active crypto market narratives, coin cashtags (e.g. `$BTC`), and macro/ETF events.

4. **Dimension 4 — Credibility & Investment Risk:**
   - Must include verifiable source references (e.g. spot ETF flows) and explicit trade invalidation levels. No guaranteed promises without defined risk.

5. **Dimension 5 — Presentation & Formatting:**
   - Clean mobile typography: structured line breaks, bullet points (`•`), and clear spacing.
   - No walls of unpunctuated text; no excessive emoji clutter.

---

### Part 2: Foundational Dictation Rules (Preserving 100% Spoken Voice)

6. **Rule 6 — Punctuation Only:**
   - Only periods, commas, colons, question marks, and sentence-start capitalization are applied.
   - Sentence structures and authentic spoken phrasing remain 100% untouched.

7. **Rule 7 — Word Replacements Only When a Word Doesn't Seem Right:**
   - Strictly limited to spoken numbers (e.g. `67800` ➔ `$67,800`, `15 minute` ➔ `15m`), transcription typos, or spoken abbreviations.

8. **Rule 8 — Emojis, Spacing & Bullet Points:**
   - Suggestions for anchor emojis (e.g. `📊`, `📉`, `🎯`, `🛑`) and paragraph breaks to enhance ByX presentation score.

---

### Part 3: High-IMPACT Alpha Rules (Creator Approved)

9. **Rule 9 — The "One Contrarian Angle" Rule:**
   - Eliminate generic fence-sitting (*"could go either way"*). Take a clear, defensible position: *"Crowd thinks X, but data shows Y."*

10. **Rule 10 — The "Skin-in-the-Game Invalidation" Rule:**
    - Always state the exact invalidation price where the thesis is wrong.

11. **Rule 11 — The "Forbidden Consensus Phrase" Rule:**
    - Ban worn-out crypto clichés: *"could go either way"*, *"up or down"*, *"only time will tell"*, *"be cautious and be patient"*, *"do your own research"*.

12. **Rule 12 — The "Native Bybit Trade CTA" Rule:**
    - Prompt readers to interact with the Bybit Trade Widget (driving Valid Traders and Volume factors in the ByX IMPACT formula).

13. **Rule 13 — The "Single Metric Anchor" Rule:**
    - Anchor the post around one striking metric (e.g., *"$1B spot outflow in 14 days absorbed at $79K"*).

14. **Rule 14 — The "Hook Under 8 Words" Rule:**
    - The opening hook must be a high-impact scroll-stopper under 8 words.

15. **Rule 15 — The "Asymmetric Risk-Reward Frame" Rule:**
    - Outline a clear risk-to-reward ratio (e.g. risking 800 pts to catch a 3,200 pt move — 1:4 RR).

---

### Part 4: Real Measurement Technologies Behind the 5 Dimensions

1. **Originality Engine — MinHash 3-Gram LSH & Shannon Information Entropy ($H$):**
   - **Math:** $H = -\sum_{i=1}^U p_i \log_2(p_i)$ where $p_i = \text{freq}(w_i) / N$.
   - **Function:** Detects vocabulary predictability and cross-references 3-grams against 25+ common Twitter/crypto consensus clichés. Flagged clichés deduct points; high organic entropy ($H \ge 3.8\text{ bits/token}$) earns maximum 20/20.

2. **Depth & Structure Engine — Financial Named Entity Recognition (NER):**
   - **Regex Pattern:** Extract concrete quantitative anchors: `\$[\d,]+`, `\d+[\d,]*\s*(billion|million|k)`, `\d+%`.
   - **Function:** Requires verifiable numbers ($79,659 current price, $87,000 previous high, $1B ETF outflow, 50 Fear/Greed index) and multi-tier paragraph architecture.

3. **Relevance Engine — Market Catalyst Vector Lexicon:**
   - **Lexicon:** Matches active cashtags (`$BTC`), orderflow catalysts (`inflow`, `outflow`, `ETF`, `spot volume`, `support floor`, `resistance`, `pullback`), and timeframe anchors (`this week`, `past two weeks`).

4. **Credibility & Risk Engine — Invalidation Boundary & Risk Assertion Classifier:**
   - **Classifier:** Detects explicit structural boundaries (e.g. `$76,000 floor support`, `$84,000 resistance invalidation`) and disciplined entry criteria (`wait for confirmation`, `risk-reward`).

5. **Presentation Engine — Flesch-Kincaid Grade 7 Readability Formula:**
   - **Math:** $\text{FKGL} = 0.39 \left(\frac{\text{total words}}{\text{total sentences}}\right) + 11.8 \left(\frac{\text{total syllables}}{\text{total words}}\right) - 15.59$.
   - **Function:** Ensures text lands in the Grade 6 to 8 range for optimal mobile scan speed, combined with clean comma/period pauses and bullet point formatting.

---

### Part 5: Two-Stage Terminal Workflow

- **Stage 1 (Polished Post):** The laboratory where uniqueness is injected, AI probability is diagnosed, repetitive tokens are diversified, and n-gram clustering is broken up.
- **Stage 2 (Draft & Rules):** The primary final posting stage. Whenever changes are made or flags are resolved, the terminal automatically recalculates all ByX dimensions and presents the clean audited draft ready to copy and post.
