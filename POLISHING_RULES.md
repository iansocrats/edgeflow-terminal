# Strict Polishing Rules for ByX Posts

Whenever polishing a dictated post for Bybit ByX, the following mandatory rules must be followed:

### 1. Punctuation Only
- You are ONLY allowed to fix and add punctuation.
- Add missing periods, commas, colons, question marks, and capitalize sentence beginnings.
- Do NOT rewrite or alter the user's spoken sentence structure.

### 2. Word Replacements Only (When Word Doesn't Seem Right)
- You are ONLY allowed to suggest word replacements if a word doesn't seem right (e.g. dictation transcription errors, spoken numbers like `67800` ➔ `$67,800`, timeframes like `15 minute` ➔ `15m`, or obvious typos).
- **CRITICAL:** You cannot suggest whole sentence changes, sentence restructuring, or synthetic marketing filler. The user's original speech flow remains 100% intact.

### 3. Emojis, Spacing & Bullet Points
- You can suggest relevant emojis at key anchor points (e.g., 📊, 🎯, 🛑).
- You can suggest clean line breaks/spacing to make reading easier on mobile.
- If the user dictates a list or conditional branches (e.g., "if we hold... or if we break..."), you can suggest bullet points (`•`) or numbering (`1.`, `2.`).

### 4. Color-Coded Draft Suggestions Stage
Before finalizing the post, present a Draft displaying:
- 🟢 **Punctuation:** Green indicator on punctuation additions/fixes.
- 🟡 **Word Replacements:** Amber indicator on suggested word replacements (`[original ➔ suggested]`).
- 🟣 **Emojis & Spacing:** Purple indicator on suggested emojis, line breaks, or bullet points.

### 5. AI Detection & Authenticity Benchmark
- The final polished text must pass the 3 client-side mathematical detectors:
  - **GPTZero Burstiness Engine:** Preserves natural sentence variance ($\sigma \ge 4.5$).
  - **ZeroGPT Syntax Classifier:** 0 robotic transition phrases (`furthermore`, `moreover`, etc.).
  - **RoBERTa Entropy Benchmark:** High vocabulary richness and organic Type-Token Ratio ($TTR$).
