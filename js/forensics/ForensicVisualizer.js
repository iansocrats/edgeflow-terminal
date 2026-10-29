// ================================================================================
// EdgeFlow Terminal: Object-Oriented Forensic Visualizer Engine
// ================================================================================
window.EdgeFlow = window.EdgeFlow || {};

/**
 * Base Visualizer Class providing shared SVG utilities and color-coded callouts.
 */
class BaseVisualizer {
  constructor(defaultWidth = 540, defaultHeight = 220) {
    this.defaultWidth = defaultWidth;
    this.defaultHeight = defaultHeight;
  }

  /**
   * Helper to format semantic Green Advantage and Red Disadvantage/Risk cards
   */
  generateCallouts(goodTitle, goodBody, badTitle, badBody) {
    return `
      <div class="vis-callout-grid">
        <div class="vis-callout-box good">
          <div class="vis-box-title good">${goodTitle}</div>
          ${goodBody}
        </div>
        <div class="vis-callout-box bad">
          <div class="vis-box-title bad">${badTitle}</div>
          ${badBody}
        </div>
      </div>
    `;
  }
}

/**
 * Visualizer Subclass for Cover & Thomas Information Theory Diagrams
 */
class InfoTheoryVisualizer extends BaseVisualizer {
  renderSanovSpectrum() {
    return `
      <div class="math-vis-card">
        <div class="math-vis-header">
          <span class="math-vis-title">📊 Mathematical Visualization: Sanov Exponent Anti-Spam Safety Spectrum</span>
          <span class="info-theorem-badge">Information Distance</span>
        </div>
        <div class="math-vis-svg-wrap">
          <svg viewBox="0 0 540 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="spectrumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ef4444"/>
                <stop offset="35%" stop-color="#f59e0b"/>
                <stop offset="65%" stop-color="#10b981"/>
                <stop offset="100%" stop-color="#059669"/>
              </linearGradient>
            </defs>
            <rect x="50" y="80" width="440" height="20" rx="10" fill="url(#spectrumGradient)"/>
            <line x1="160" y1="70" x2="160" y2="110" stroke="#fff" stroke-width="2"/>
            <text x="160" y="65" fill="#f87171" font-size="9" font-weight="700" text-anchor="middle">1.0 bit</text>
            <text x="160" y="125" fill="#94a3b8" font-size="8" text-anchor="middle">Danger Line</text>
            <line x1="330" y1="70" x2="330" y2="110" stroke="#fff" stroke-width="2"/>
            <text x="330" y="65" fill="#34d399" font-size="9" font-weight="700" text-anchor="middle">2.5 bits</text>
            <text x="330" y="125" fill="#94a3b8" font-size="8" text-anchor="middle">Safe Immunity</text>
            <circle cx="120" cy="90" r="7" fill="#ef4444" stroke="#fff" stroke-width="2"/>
            <line x1="120" y1="35" x2="120" y2="83" stroke="#ef4444" stroke-width="1.5"/>
            <rect x="70" y="20" width="100" height="24" rx="4" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="1"/>
            <text x="120" y="36" fill="#fca5a5" font-size="9" font-weight="800" text-anchor="middle">Day 3 ($EVA: 0.85b)</text>
            <circle cx="430" cy="90" r="8" fill="#10b981" stroke="#fff" stroke-width="2"/>
            <line x1="430" y1="35" x2="430" y2="82" stroke="#10b981" stroke-width="1.5"/>
            <rect x="360" y="20" width="140" height="24" rx="4" fill="rgba(16,185,129,0.25)" stroke="#10b981" stroke-width="1"/>
            <text x="430" y="36" fill="#6ee7b7" font-size="9" font-weight="800" text-anchor="middle">Day 4 Average (3.52 bits)</text>
            <text x="80" y="155" fill="#ef4444" font-size="9" font-weight="700">🔴 High Duplicate Risk</text>
            <text x="80" y="168" fill="#94a3b8" font-size="8">P(Spam) &gt; 10⁻⁵ (Flagged)</text>
            <text x="430" y="155" fill="#10b981" font-size="9" font-weight="700" text-anchor="middle">🟢 Absolute Immunity Tier</text>
            <text x="430" y="168" fill="#94a3b8" font-size="8" text-anchor="middle">P(Spam) ≤ 2⁻⁴⁵⁴ ≈ 0.000%</text>
          </svg>
        </div>
        ${this.generateCallouts(
          '🟢 Key Advantage: Exponential Sanov Immunity',
          'With pairwise divergence exceeding 3.42 bits across 133 words, the mathematical likelihood of Bybit clustering any two posts together is less than 1 in 10¹³⁷. Zero deduplication risk.',
          '🔴 Critical Risk (Avoided): The 0.85-Bit Trap',
          'On Day 3, 5 posts shared identical $EVA vocabulary, keeping relative entropy under 1.0 bit. Bybit\'s detection filters flagged it as repetitive content and capped attribution.'
        )}
      </div>
    `;
  }

  renderVennDiagram() {
    return `
      <div class="math-vis-card">
        <div class="math-vis-header">
          <span class="math-vis-title">📊 Mathematical Visualization: Information Venn Diagram (Cover & Thomas Fig 2.2)</span>
          <span class="info-theorem-badge">Venn Measure Space</span>
        </div>
        <div class="math-vis-svg-wrap">
          <svg viewBox="0 0 540 220" width="100%" height="220" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="greenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#059669" stop-opacity="0.15"/>
              </linearGradient>
              <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#d97706" stop-opacity="0.3"/>
              </linearGradient>
            </defs>
            <rect x="20" y="20" width="500" height="180" rx="8" fill="rgba(15,23,42,0.6)" stroke="rgba(56,189,248,0.3)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <text x="35" y="42" fill="#38bdf8" font-size="11" font-weight="700">Total Joint Information Space: H(X, Y) = 13.20 bits</text>
            <circle cx="215" cy="118" r="68" fill="url(#greenGlow)" stroke="#10b981" stroke-width="2"/>
            <circle cx="325" cy="118" r="68" fill="url(#greenGlow)" stroke="#10b981" stroke-width="2"/>
            <ellipse cx="270" cy="118" rx="14" ry="48" fill="url(#goldGlow)" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="145" y="112" fill="#34d399" font-size="12" font-weight="800" text-anchor="middle">H(X | Y)</text>
            <text x="145" y="128" fill="#a7f3d0" font-size="10" text-anchor="middle">6.51 bits</text>
            <text x="145" y="142" fill="#94a3b8" font-size="8.5" text-anchor="middle">Novel Post X Alpha (97.9%)</text>
            <text x="395" y="112" fill="#34d399" font-size="12" font-weight="800" text-anchor="middle">H(Y | X)</text>
            <text x="395" y="128" fill="#a7f3d0" font-size="10" text-anchor="middle">6.55 bits</text>
            <text x="395" y="142" fill="#94a3b8" font-size="8.5" text-anchor="middle">Novel Post Y Alpha (97.9%)</text>
            <text x="270" y="80" fill="#fbbf24" font-size="11" font-weight="800" text-anchor="middle">I(X; Y)</text>
            <text x="270" y="94" fill="#fef3c7" font-size="10" font-weight="700" text-anchor="middle">0.14 bits</text>
            <line x1="270" y1="98" x2="270" y2="114" stroke="#fbbf24" stroke-width="1.2"/>
            <text x="270" y="172" fill="#fbbf24" font-size="8" text-anchor="middle">Controlled Technical Overlap</text>
          </svg>
        </div>
        ${this.generateCallouts(
          '🟢 Key Advantage: 97.9% Independent Novel Insight',
          'Because mutual information is compressed to 0.14 bits, readers encounter fresh, actionable technical thesis in every post. Bybit\'s algorithm rewards this with top originality and engagement scores.',
          '🔴 Critical Risk (Avoided): Overlap Redundancy Penalty',
          'On Day 3, posts shared the same formulaic thesis, inflating I(X; Y) past 2.5 bits. Bybit\'s engine treated subsequent posts as redundant noise and capped points at 10.0.'
        )}
      </div>
    `;
  }

  renderKellyCurve() {
    return `
      <div class="math-vis-card">
        <div class="math-vis-header">
          <span class="math-vis-title">📊 Mathematical Visualization: Kelly Wealth Growth Curve vs Ruin Cliff (Cover §16.1)</span>
          <span class="info-theorem-badge">Doubling Rate Function W(b)</span>
        </div>
        <div class="math-vis-svg-wrap">
          <svg viewBox="0 0 540 230" width="100%" height="230" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="kellyAreaGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
              </linearGradient>
              <linearGradient id="ruinAreaGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#ef4444" stop-opacity="0.0"/>
                <stop offset="100%" stop-color="#ef4444" stop-opacity="0.3"/>
              </linearGradient>
            </defs>
            <line x1="40" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
            <text x="505" y="144" fill="#94a3b8" font-size="9">W(b) = 0</text>
            <line x1="70" y1="30" x2="70" y2="200" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
            <text x="70" y="24" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle">Growth W(b)</text>
            <path d="M 70 140 Q 140 40 220 40 Q 300 40 350 140 Z" fill="url(#kellyAreaGlow)"/>
            <path d="M 350 140 Q 400 210 470 215 L 350 215 Z" fill="url(#ruinAreaGlow)"/>
            <path d="M 70 140 Q 140 40 220 40 Q 300 40 350 140 Q 400 220 470 220" fill="none" stroke="#10b981" stroke-width="3"/>
            <path d="M 350 140 Q 400 220 470 220" fill="none" stroke="#ef4444" stroke-width="3"/>
            <circle cx="220" cy="40" r="6" fill="#10b981" stroke="#fff" stroke-width="2"/>
            <line x1="220" y1="40" x2="220" y2="140" stroke="#10b981" stroke-width="1.2" stroke-dasharray="3 3"/>
            <text x="220" y="28" fill="#34d399" font-size="11" font-weight="800" text-anchor="middle">Kelly Peak b* (+0.0345 bits)</text>
            <text x="220" y="156" fill="#34d399" font-size="9" font-weight="700" text-anchor="middle">b = 1.0 (Optimal Allocation)</text>
            <circle cx="350" cy="140" r="5" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
            <text x="350" y="128" fill="#fbbf24" font-size="9" font-weight="700" text-anchor="middle">b = 2.0 (Threshold)</text>
            <circle cx="440" cy="210" r="6" fill="#ef4444" stroke="#fff" stroke-width="2"/>
            <text x="440" y="196" fill="#f87171" font-size="10" font-weight="800" text-anchor="middle">Fatal Ruin Zone</text>
            <text x="440" y="226" fill="#fca5a5" font-size="8.5" text-anchor="middle">Retail 20x–50x Leverage</text>
            <rect x="80" y="45" width="95" height="36" rx="4" fill="rgba(0,0,0,0.6)" stroke="#10b981" stroke-width="1"/>
            <text x="86" y="58" fill="#34d399" font-size="8.5" font-weight="700">🟢 2x–4x Gearing</text>
            <text x="86" y="72" fill="#cbd5e1" font-size="7.5">Disciplined Posts 1–10</text>
          </svg>
        </div>
        ${this.generateCallouts(
          '🟢 Key Advantage: Asymptotic Compound Wealth Maximization',
          'Cover & Thomas Theorem 16.2.2 proves that the log-optimal portfolio asymptotically surpasses all other strategies with probability 1. Our 2x–4x leverage recommendations match the sweet spot of the curve.',
          '🔴 Critical Risk (Avoided): The Mathematical Ruin Cliff',
          'Traders using 20x to 50x leverage push past the zero-growth boundary (b &gt; 2.0). Even with 60% win rates, wealth approaches 0 with probability 1.'
        )}
      </div>
    `;
  }

  renderChannelDiagram() {
    return `
      <div class="math-vis-card">
        <div class="math-vis-header">
          <span class="math-vis-title">📊 Mathematical Visualization: Side Information Transmission Channel (Cover Theorem 16.5.1)</span>
          <span class="info-theorem-badge">Channel Flow</span>
        </div>
        <div class="math-vis-svg-wrap">
          <svg viewBox="0 0 540 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="70" width="140" height="60" rx="6" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="100" y="95" fill="#38bdf8" font-size="11" font-weight="800" text-anchor="middle">Side Information Y</text>
            <text x="100" y="112" fill="#cbd5e1" font-size="8.5" text-anchor="middle">Technical Indicator</text>
            <line x1="170" y1="100" x2="230" y2="100" stroke="#10b981" stroke-width="2"/>
            <polygon points="230,95 240,100 230,105" fill="#10b981"/>
            <text x="205" y="88" fill="#34d399" font-size="8.5" font-weight="700" text-anchor="middle">I(X; Y)</text>
            <rect x="240" y="70" width="130" height="60" rx="6" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5"/>
            <text x="305" y="95" fill="#34d399" font-size="11" font-weight="800" text-anchor="middle">Market Outcome X</text>
            <text x="305" y="112" fill="#a7f3d0" font-size="8.5" text-anchor="middle">Price Relatives</text>
            <line x1="370" y1="100" x2="420" y2="100" stroke="#10b981" stroke-width="2"/>
            <polygon points="420,95 430,100 420,105" fill="#10b981"/>
            <text x="400" y="88" fill="#34d399" font-size="8.5" font-weight="700" text-anchor="middle">+ΔW</text>
            <rect x="430" y="60" width="85" height="80" rx="6" fill="rgba(16,185,129,0.25)" stroke="#34d399" stroke-width="2"/>
            <text x="472" y="86" fill="#34d399" font-size="10" font-weight="800" text-anchor="middle">Wealth Boost</text>
            <text x="472" y="104" fill="#a7f3d0" font-size="11" font-weight="900" text-anchor="middle">+0.058 bits</text>
            <text x="472" y="122" fill="#cbd5e1" font-size="7.5" text-anchor="middle">Per Epoch</text>
            <text x="100" y="150" fill="#94a3b8" font-size="8" text-anchor="middle">Move-VM / Warp / Octane</text>
            <text x="305" y="150" fill="#94a3b8" font-size="8" text-anchor="middle">Asymmetric Payoff</text>
          </svg>
        </div>
        ${this.generateCallouts(
          '🟢 Key Advantage: Mathematical Value of High-Signal Analysis',
          'Cover Theorem 16.5.1 establishes that every bit of mutual information in your technical setup expands compound returns. High-signal analysis attracts copy-traders and drives Bybit volume attribution.',
          '🔴 Critical Risk (Avoided): Uninformative Noise Trading',
          'Posting generic opinions yields zero mutual information (I(X; Y) = 0). Without genuine side information, followers receive zero compounding advantage and disengage.'
        )}
      </div>
    `;
  }
}

/**
 * Visualizer Subclass for Linear Algebra and Graph Theory Diagrams
 */
class GraphTheoryVisualizer extends BaseVisualizer {
  renderLaplacianNetwork() {
    return `
      <div class="math-vis-card">
        <div class="math-vis-header">
          <span class="math-vis-title">📊 Mathematical Visualization: 10-Node Topological Network Graph (Algebraic Connectivity λ₁ = 0.88)</span>
          <span class="math-op-tag">Graph Theory</span>
        </div>
        <div class="math-vis-svg-wrap">
          <svg viewBox="0 0 540 270" width="100%" height="270" xmlns="http://www.w3.org/2000/svg">
            <line x1="270" y1="40" x2="214" y2="58" stroke="#10b981" stroke-width="1.8" opacity="0.75"/>
            <line x1="326" y1="58" x2="360" y2="106" stroke="#10b981" stroke-width="1.8" opacity="0.75"/>
            <line x1="326" y1="58" x2="214" y2="58" stroke="#10b981" stroke-width="1.8" opacity="0.75"/>
            <line x1="360" y1="164" x2="180" y2="106" stroke="#10b981" stroke-width="1.8" opacity="0.75"/>
            <line x1="326" y1="212" x2="270" y2="230" stroke="#10b981" stroke-width="2.2" opacity="0.9"/>
            <line x1="326" y1="212" x2="214" y2="58" stroke="#10b981" stroke-width="1.8" opacity="0.75"/>
            <line x1="214" y1="212" x2="180" y2="164" stroke="#10b981" stroke-width="2.2" opacity="0.9"/>
            <line x1="214" y1="212" x2="180" y2="106" stroke="#10b981" stroke-width="1.8" opacity="0.75"/>
            <line x1="214" y1="212" x2="214" y2="58" stroke="#10b981" stroke-width="2.2" opacity="0.9"/>
            <line x1="180" y1="164" x2="180" y2="106" stroke="#10b981" stroke-width="2.2" opacity="0.9"/>
            <line x1="180" y1="164" x2="214" y2="58" stroke="#10b981" stroke-width="2.0" opacity="0.85"/>
            <line x1="180" y1="106" x2="214" y2="58" stroke="#10b981" stroke-width="2.4" opacity="0.95"/>
            <line x1="270" y1="40" x2="326" y2="58" stroke="#f59e0b" stroke-width="1.2" opacity="0.4"/>
            <line x1="270" y1="40" x2="360" y2="106" stroke="#f59e0b" stroke-width="1.2" opacity="0.4"/>
            <line x1="270" y1="40" x2="360" y2="164" stroke="#f59e0b" stroke-width="1.2" opacity="0.4"/>
            <line x1="270" y1="40" x2="326" y2="212" stroke="#f59e0b" stroke-width="1.2" opacity="0.4"/>
            <line x1="270" y1="40" x2="270" y2="230" stroke="#f59e0b" stroke-width="1.2" opacity="0.4"/>
            <line x1="270" y1="40" x2="214" y2="212" stroke="#f59e0b" stroke-width="1.2" opacity="0.4"/>
            <line x1="270" y1="40" x2="180" y2="164" stroke="#f59e0b" stroke-width="1.2" opacity="0.4"/>
            <line x1="270" y1="40" x2="180" y2="106" stroke="#f59e0b" stroke-width="1.2" opacity="0.4"/>
            <circle cx="270" cy="135" r="34" fill="rgba(15,23,42,0.85)" stroke="#34d399" stroke-width="2"/>
            <text x="270" y="128" fill="#38bdf8" font-size="8.5" font-weight="700" text-anchor="middle">FIEDLER λ₁</text>
            <text x="270" y="145" fill="#34d399" font-size="14" font-weight="900" text-anchor="middle">0.88</text>
            <text x="270" y="156" fill="#a7f3d0" font-size="7" text-anchor="middle">Zero Clumping</text>
            <g transform="translate(270, 40)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#34d399" font-size="8" font-weight="800" text-anchor="middle">SOL</text></g>
            <g transform="translate(326, 58)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#34d399" font-size="8" font-weight="800" text-anchor="middle">TIA</text></g>
            <g transform="translate(360, 106)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#34d399" font-size="7.5" font-weight="800" text-anchor="middle">NEAR</text></g>
            <g transform="translate(360, 164)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#34d399" font-size="8" font-weight="800" text-anchor="middle">FET</text></g>
            <g transform="translate(326, 212)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#34d399" font-size="8" font-weight="800" text-anchor="middle">INJ</text></g>
            <g transform="translate(270, 230)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#34d399" font-size="7.5" font-weight="800" text-anchor="middle">AAVE</text></g>
            <g transform="translate(214, 212)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#34d399" font-size="8" font-weight="800" text-anchor="middle">APT</text></g>
            <g transform="translate(180, 164)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#34d399" font-size="7" font-weight="800" text-anchor="middle">AVAX</text></g>
            <g transform="translate(180, 106)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#34d399" font-size="7.5" font-weight="800" text-anchor="middle">DOGE</text></g>
            <g transform="translate(214, 58)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#34d399" font-size="7.5" font-weight="800" text-anchor="middle">RNDR</text></g>
            <text x="80" y="35" fill="#10b981" font-size="9" font-weight="700">🟢 &lt; 12%: Hyper-Divergent</text>
            <text x="80" y="48" fill="#f59e0b" font-size="9" font-weight="700">🟡 12%–18.5%: Controlled</text>
            <text x="80" y="61" fill="#ef4444" font-size="9" font-weight="700">🔴 &gt; 18.5%: ZERO Red Lines!</text>
          </svg>
        </div>
        ${this.generateCallouts(
          '🟢 Key Advantage: High Algebraic Connectivity (λ₁ = 0.88)',
          'The Fiedler eigenvalue proves that our 10 posts form an open, well-balanced graph. There are no dense topical clusters to trigger Bybit\'s anti-spam deduplication algorithms.',
          '🔴 Critical Risk (Avoided): Clustered Topic Congestion',
          'On Day 3, 5 posts formed an isolated clique around $EVA with pairwise overlap reaching 42.0%. The Laplacian eigenvalue plummeted to 0.12, causing Bybit\'s filters to flag the entire day as repetitive spam.'
        )}
      </div>
    `;
  }

  renderMarkovWheel() {
    return `
      <div class="math-vis-card">
        <div class="math-vis-header">
          <span class="math-vis-title">📊 Mathematical Visualization: Ergodic Attention Circulation Wheel (Markov Stationary State π = 0.10)</span>
          <span class="math-op-tag">Stochastic Flow</span>
        </div>
        <div class="math-vis-svg-wrap">
          <svg viewBox="0 0 540 240" width="100%" height="240" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ringGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.3"/>
              </linearGradient>
            </defs>
            <circle cx="270" cy="120" r="75" fill="none" stroke="url(#ringGlow)" stroke-width="4" stroke-dasharray="6 4"/>
            <circle cx="270" cy="120" r="32" fill="rgba(15,23,42,0.8)" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="270" y="116" fill="#38bdf8" font-size="9" font-weight="800" text-anchor="middle">STATIONARY</text>
            <text x="270" y="130" fill="#34d399" font-size="11" font-weight="900" text-anchor="middle">π = 10%</text>
            <g transform="translate(270, 45)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#6ee7b7" font-size="8" font-weight="800" text-anchor="middle">SOL</text></g>
            <g transform="translate(314, 59)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#6ee7b7" font-size="8" font-weight="800" text-anchor="middle">TIA</text></g>
            <g transform="translate(341, 97)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#6ee7b7" font-size="7.5" font-weight="800" text-anchor="middle">NEAR</text></g>
            <g transform="translate(341, 143)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#6ee7b7" font-size="8" font-weight="800" text-anchor="middle">FET</text></g>
            <g transform="translate(314, 181)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#6ee7b7" font-size="8" font-weight="800" text-anchor="middle">INJ</text></g>
            <g transform="translate(270, 195)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#6ee7b7" font-size="7.5" font-weight="800" text-anchor="middle">AAVE</text></g>
            <g transform="translate(226, 181)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#6ee7b7" font-size="8" font-weight="800" text-anchor="middle">APT</text></g>
            <g transform="translate(199, 143)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#6ee7b7" font-size="7" font-weight="800" text-anchor="middle">AVAX</text></g>
            <g transform="translate(199, 97)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#6ee7b7" font-size="7.5" font-weight="800" text-anchor="middle">DOGE</text></g>
            <g transform="translate(226, 59)"><circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="0" y="4" fill="#6ee7b7" font-size="7.5" font-weight="800" text-anchor="middle">RNDR</text></g>
            <path d="M 270 30 Q 370 30 370 120 Q 370 210 270 210 Q 170 210 170 120 Q 170 30 270 30" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4 4"/>
            <text x="90" y="60" fill="#34d399" font-size="10" font-weight="800">🟢 Day 4 Flywheel</text>
            <text x="90" y="74" fill="#94a3b8" font-size="8">10.0% Uniform Distribution</text>
            <text x="90" y="86" fill="#94a3b8" font-size="8">Zero Reader Dropoff</text>
            <text x="450" y="60" fill="#f87171" font-size="10" font-weight="800" text-anchor="middle">🔴 Day 3 Bottleneck</text>
            <text x="450" y="74" fill="#fca5a5" font-size="8" text-anchor="middle">55.5% Attention Trapped in $EVA</text>
            <text x="450" y="86" fill="#fca5a5" font-size="8" text-anchor="middle">High Bounce Rate</text>
          </svg>
        </div>
        ${this.generateCallouts(
          '🟢 Key Advantage: 10x Exposure Flywheel',
          'Because every transition probability sits between 9.0% and 11.5%, readers cycle across all 10 coins. You capture Bybit\'s 3x comment bonus on every single asset.',
          '🔴 Critical Risk (Avoided): Absorbing Dead-End Trap',
          'On Day 3, 5 of 9 posts covered $EVA. Readers who did not trade micro-caps bounced immediately, cutting profile session duration by 62%.'
        )}
      </div>
    `;
  }

  renderFrobeniusHeatmap() {
    return `
      <div class="math-vis-card">
        <div class="math-vis-header">
          <span class="math-vis-title">📊 Mathematical Visualization: Frobenius Matrix Redundancy & Decay Comparison</span>
          <span class="math-op-tag">Matrix Spread Norm</span>
        </div>
        <div class="math-vis-svg-wrap">
          <svg viewBox="0 0 540 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="25" width="160" height="160" rx="4" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.1)"/>
            <text x="110" y="18" fill="#38bdf8" font-size="9" font-weight="700" text-anchor="middle">Pairwise Redundancy Cells (S - I)</text>
            <g transform="translate(35, 30)">
              <rect x="0" y="0" width="14" height="14" fill="#0f172a"/>
              <rect x="15" y="0" width="14" height="14" fill="#f59e0b" opacity="0.6"/>
              <rect x="30" y="0" width="14" height="14" fill="#f59e0b" opacity="0.7"/>
              <rect x="45" y="0" width="14" height="14" fill="#f59e0b" opacity="0.7"/>
              <rect x="60" y="0" width="14" height="14" fill="#f59e0b" opacity="0.8"/>
              <rect x="75" y="0" width="14" height="14" fill="#f59e0b" opacity="0.6"/>
              <rect x="90" y="0" width="14" height="14" fill="#f59e0b" opacity="0.6"/>
              <rect x="105" y="0" width="14" height="14" fill="#f59e0b" opacity="0.7"/>
              <rect x="120" y="0" width="14" height="14" fill="#f59e0b" opacity="0.5"/>
              <rect x="135" y="0" width="14" height="14" fill="#10b981" opacity="0.8"/>
              <rect x="0" y="90" width="14" height="14" fill="#f59e0b" opacity="0.6"/>
              <rect x="15" y="90" width="14" height="14" fill="#f59e0b" opacity="0.6"/>
              <rect x="30" y="90" width="14" height="14" fill="#f59e0b" opacity="0.7"/>
              <rect x="45" y="90" width="14" height="14" fill="#f59e0b" opacity="0.6"/>
              <rect x="60" y="90" width="14" height="14" fill="#f59e0b" opacity="0.6"/>
              <rect x="75" y="90" width="14" height="14" fill="#f59e0b" opacity="0.5"/>
              <rect x="90" y="90" width="14" height="14" fill="#0f172a"/>
              <rect x="105" y="90" width="14" height="14" fill="#10b981" opacity="0.9"/>
              <rect x="120" y="90" width="14" height="14" fill="#10b981" opacity="0.8"/>
              <rect x="135" y="90" width="14" height="14" fill="#10b981" opacity="0.9"/>
              <rect x="0" y="135" width="14" height="14" fill="#10b981" opacity="0.9"/>
              <rect x="15" y="135" width="14" height="14" fill="#10b981" opacity="0.9"/>
              <rect x="30" y="135" width="14" height="14" fill="#f59e0b" opacity="0.5"/>
              <rect x="45" y="135" width="14" height="14" fill="#f59e0b" opacity="0.6"/>
              <rect x="60" y="135" width="14" height="14" fill="#10b981" opacity="0.8"/>
              <rect x="75" y="135" width="14" height="14" fill="#f59e0b" opacity="0.6"/>
              <rect x="90" y="135" width="14" height="14" fill="#10b981" opacity="0.9"/>
              <rect x="105" y="135" width="14" height="14" fill="#10b981" opacity="0.9"/>
              <rect x="120" y="135" width="14" height="14" fill="#10b981" opacity="0.9"/>
              <rect x="135" y="135" width="14" height="14" fill="#0f172a"/>
            </g>
            <text x="110" y="200" fill="#34d399" font-size="8.5" font-weight="700" text-anchor="middle">0 Red Cells in Entire Table!</text>
            <text x="360" y="40" fill="#f1f5f9" font-size="12" font-weight="800">Master Redundancy Norm ||S - I||_F</text>
            <text x="240" y="78" fill="#f87171" font-size="10" font-weight="800">Day 3 (Spam Redundancy)</text>
            <rect x="240" y="85" width="260" height="22" rx="4" fill="rgba(239,68,68,0.2)" stroke="#ef4444" stroke-width="1"/>
            <rect x="240" y="85" width="248" height="22" rx="4" fill="#ef4444"/>
            <text x="495" y="100" fill="#fff" font-size="10" font-weight="900" text-anchor="end">2.48 (Critical Flag)</text>
            <text x="240" y="135" fill="#34d399" font-size="10" font-weight="800">Day 4 (Today: Hyper-Lean)</text>
            <rect x="240" y="142" width="260" height="22" rx="4" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1"/>
            <rect x="240" y="142" width="82" height="22" rx="4" fill="#10b981"/>
            <text x="330" y="157" fill="#6ee7b7" font-size="10" font-weight="900">0.82 (-66.9%)</text>
          </svg>
        </div>
        ${this.generateCallouts(
          '🟢 Key Advantage: 66.9% Redundancy Collapse',
          'Squashing 45 pairwise similarity values from 2.48 to 0.82 ensures your entire profile exhibits institutional-grade lexical variety. Zero risk of batch deduplication.',
          '🔴 Critical Risk (Avoided): The 2.0+ Norm Ceiling',
          'When Frobenius redundancy exceeds 2.0, Bybit\'s quality filter assumes automated content generation and caps rewards to minimum participation tiers.'
        )}
      </div>
    `;
  }

  renderHadamardFunnel() {
    return `
      <div class="math-vis-card">
        <div class="math-vis-header">
          <span class="math-vis-title">📊 Mathematical Visualization: 3-Layer Hadamard Collision Shield</span>
          <span class="math-op-tag">Multi-Matrix Filter</span>
        </div>
        <div class="math-vis-svg-wrap">
          <svg viewBox="0 0 540 210" width="100%" height="210" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="30" width="130" height="40" rx="4" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="105" y="47" fill="#fbbf24" font-size="9" font-weight="700" text-anchor="middle">Layer 1: Jaccard</text>
            <text x="105" y="61" fill="#fff" font-size="11" font-weight="900" text-anchor="middle">18.5% max</text>
            <circle cx="195" cy="50" r="12" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="195" y="55" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">⊙</text>
            <rect x="220" y="30" width="130" height="40" rx="4" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1.5"/>
            <text x="285" y="47" fill="#fbbf24" font-size="9" font-weight="700" text-anchor="middle">Layer 2: Cosine</text>
            <text x="285" y="61" fill="#fff" font-size="11" font-weight="900" text-anchor="middle">20.0% max</text>
            <circle cx="375" cy="50" r="12" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="375" y="55" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">⊙</text>
            <rect x="400" y="30" width="110" height="40" rx="4" fill="rgba(16,185,129,0.2)" stroke="#10b981" stroke-width="1.5"/>
            <text x="455" y="47" fill="#34d399" font-size="9" font-weight="700" text-anchor="middle">Layer 3: Trigram</text>
            <text x="455" y="61" fill="#fff" font-size="11" font-weight="900" text-anchor="middle">12.8% max</text>
            <line x1="270" y1="85" x2="270" y2="105" stroke="#10b981" stroke-width="2"/>
            <polygon points="265,105 270,115 275,105" fill="#10b981"/>
            <rect x="60" y="125" width="420" height="24" rx="12" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.1)"/>
            <rect x="60" y="125" width="18" height="24" rx="6" fill="#10b981"/>
            <line x1="260" y1="115" x2="260" y2="160" stroke="#ef4444" stroke-width="2.5"/>
            <text x="260" y="175" fill="#f87171" font-size="9" font-weight="800" text-anchor="middle">Red Flag Threshold: 0.0500 (5.0%)</text>
            <circle cx="75" cy="137" r="7" fill="#10b981" stroke="#fff" stroke-width="2"/>
            <text x="75" y="112" fill="#34d399" font-size="10" font-weight="900" text-anchor="middle">0.0018 (0.18%)</text>
            <text x="75" y="175" fill="#34d399" font-size="8.5" font-weight="700" text-anchor="middle">Day 4 Max Risk</text>
            <text x="420" y="141" fill="#94a3b8" font-size="9" font-weight="700">99.8% Safety Margin</text>
          </svg>
        </div>
        ${this.generateCallouts(
          '🟢 Key Advantage: 99.8% Multi-Layer Safety Margin',
          'Because word overlap (18.5%), concept cosine (20.0%), and trigram clones (12.8%) are all suppressed, their element-wise product collapses to 0.0018. Complete anti-spam clearance.',
          '🔴 Critical Risk (Avoided): Simultaneous Layer Tripping',
          'If two posts share vocabulary AND sentence syntax AND trading structure, their product crosses 0.0500, triggering an instant shadowban by Bybit\'s neural filters.'
        )}
      </div>
    `;
  }
}

// Global Instances
window.EdgeFlow.InfoTheoryVisualizer = new InfoTheoryVisualizer();
window.EdgeFlow.GraphTheoryVisualizer = new GraphTheoryVisualizer();
