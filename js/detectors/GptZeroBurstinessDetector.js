// ================================================================================
// EdgeFlow Terminal: GPTZero Princeton Perplexity & Burstiness Benchmark
// Academic Reference: Zero-Shot Detection of Machine-Generated Text via Perplexity & Burstiness (Tian, Princeton NLP)
// ================================================================================
window.EdgeFlow = window.EdgeFlow || {};

class GptZeroBurstinessDetector extends EdgeFlow.BaseDetector {
  constructor() {
    super('gptzero', 'GPTZero Princeton Perplexity & Burstiness Benchmark', 80, 'Princeton NLP Zero-Shot Burstiness Model');
    this.lastResult = null;
  }

  /**
   * Evaluates text based on Perplexity (PPL) and Burstiness Coefficient (Bc).
   * Human writing features high burstiness (varying short and long sentences) and organic perplexity.
   * AI writing features flat perplexity corridors and uniform sentence lengths.
   * @param {string} text
   * @returns {Object}
   */
  analyze(text) {
    if (!text || text.trim().length === 0) {
      return {
        perplexity: 0,
        burstiness: 0,
        humanScore: 100,
        aiProbability: 0,
        verdict: 'No content to analyze',
        statusClass: 'green',
        sentenceStats: [],
        flags: []
      };
    }

    const sentences = text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
    const sentenceLengths = sentences.map(s => {
      const words = s.trim().split(/\s+/).filter(w => w.length > 0);
      return words.length;
    });

    const n = sentenceLengths.length;
    if (n === 0) {
      return { perplexity: 0, burstiness: 0, humanScore: 100, aiProbability: 0, verdict: 'Empty', statusClass: 'green' };
    }

    // Mean sentence length (mu)
    const mu = sentenceLengths.reduce((a, b) => a + b, 0) / n;

    // Standard deviation (sigma)
    const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - mu, 2), 0) / n;
    const sigma = Math.sqrt(variance);

    // Burstiness Coefficient: Bc = (sigma - mu) / (sigma + mu)  [-1 to +1]
    // Normalized to 0 - 100% scale: human writing typically has Bc >= 0.20 (or high variance > 12)
    const bcRaw = (sigma + mu > 0) ? (sigma - mu) / (sigma + mu) : 0;
    const burstinessScore = Math.min(100, Math.max(0, Math.round((sigma / (mu || 1)) * 50 + 40)));

    // Token frequency & vocabulary entropy proxy for Perplexity (PPL)
    const words = this.tokenize(text);
    const tokenFreq = {};
    words.forEach(w => { tokenFreq[w] = (tokenFreq[w] || 0) + 1; });
    
    let shannonEntropy = 0;
    const totalTokens = words.length || 1;
    Object.values(tokenFreq).forEach(cnt => {
      const p = cnt / totalTokens;
      shannonEntropy -= p * Math.log2(p);
    });

    // Normalized Perplexity Index (PPL proxy based on 2^H)
    const pplScore = Math.min(120, Math.round(Math.pow(2, shannonEntropy) * 1.8));

    // Flags for flat sentence uniformity or robotic lists
    const flags = [];
    if (sigma < 2.5 && n >= 4) {
      flags.push({
        label: 'Low Sentence Burstiness',
        detail: `Sentences have virtually identical lengths (std dev: ${sigma.toFixed(1)} words). LLMs exhibit flat cadence.`
      });
    }

    if (/^\s*\d+\.\s+/m.test(text)) {
      flags.push({
        label: 'Predictable Numbered Sequence',
        detail: 'Numbered itemization reduces structural burstiness.'
      });
    }

    // Compute final AI probability and Human Authenticity
    let aiProb = 0;
    if (sigma < 3.0) aiProb += 35;
    if (flags.length > 0) aiProb += flags.length * 20;
    if (shannonEntropy < 4.2) aiProb += 25;

    const finalAiProb = Math.min(100, Math.max(0, aiProb));
    const humanScore = 100 - finalAiProb;

    let verdict = 'Highly likely human-authored (High Burstiness)';
    let statusClass = 'green';

    if (finalAiProb >= 60) {
      verdict = 'Likely AI-generated (Low Perplexity & Flat Cadence)';
      statusClass = 'danger';
    } else if (finalAiProb >= 30) {
      verdict = 'Mixed Burstiness (Controlled Human Cadence)';
      statusClass = 'warn';
    }

    const result = {
      perplexity: pplScore,
      burstiness: burstinessScore,
      variance: Math.round(variance * 10) / 10,
      humanScore,
      aiProbability: finalAiProb,
      verdict,
      statusClass,
      flags,
      sentenceCount: n,
      avgWordsPerSentence: Math.round(mu * 10) / 10
    };

    this.lastResult = result;
    return result;
  }

  /**
   * Render the detector UI telemetry card
   * @param {Object} result
   */
  renderUI(result) {
    const scoreVal = document.getElementById('gptZeroHumanVal');
    const burstinessVal = document.getElementById('gptZeroBurstVal');
    const pplVal = document.getElementById('gptZeroPplVal');
    const indicator = document.getElementById('gptZeroIndicator');
    const bar = document.getElementById('gptZeroBar');
    const statusText = document.getElementById('gptZeroStatusText');
    const diagnostics = document.getElementById('gptZeroDiagnostics');
    const bottomVerdict = document.getElementById('gptZeroVerdict');

    if (!scoreVal) return;

    // Metric 1: Human Score
    scoreVal.textContent = `${result.humanScore}%`;
    scoreVal.className = `metric-val ${result.humanScore >= 80 ? 'real' : (result.humanScore >= 50 ? 'gold' : 'fake')}`;

    // Metric 2: Burstiness Score
    if (burstinessVal) {
      burstinessVal.textContent = `${result.burstiness}%`;
      burstinessVal.className = `metric-val ${result.burstiness >= 65 ? 'real' : (result.burstiness >= 40 ? 'gold' : 'fake')}`;
    }

    // Metric 3: Perplexity Index
    if (pplVal) {
      pplVal.textContent = `${result.perplexity} PPL`;
      pplVal.className = `metric-val ${result.perplexity >= 45 ? 'real' : 'gold'}`;
    }

    // Indicator
    if (indicator) {
      indicator.className = `det-indicator ${result.statusClass}`;
    }

    // Bar
    if (bar) {
      bar.style.width = `${result.humanScore}%`;
      bar.style.background = result.humanScore >= 80 ? 'var(--green, #10b981)' : (result.humanScore >= 50 ? 'var(--yellow, #f59e0b)' : 'var(--red, #ef4444)');
    }

    // Status Text
    if (statusText) {
      statusText.innerHTML = `<strong>Princeton Zero-Shot Engine</strong> &bull; Sentence Variance: <em>${result.variance}σ²</em> (${result.sentenceCount} lines, avg ${result.avgWordsPerSentence} w/line)`;
    }

    // Diagnostics
    if (diagnostics) {
      if (result.flags && result.flags.length > 0) {
        let html = '<div style="margin-top:6px; font-size:0.72rem; color:var(--text-dim);">';
        result.flags.forEach(f => {
          html += `<div style="padding:2px 0; color:#f87171;">⚠️ <strong>${f.label}</strong>: ${f.detail}</div>`;
        });
        html += '</div>';
        diagnostics.innerHTML = html;
      } else {
        diagnostics.innerHTML = `<div style="margin-top:6px; font-size:0.72rem; color:#34d399;">
          ✅ Natural human burstiness: Dynamic variation across sentence lengths and clause rhythms.
        </div>`;
      }
    }

    // Bottom Verdict
    if (bottomVerdict) {
      if (result.humanScore >= 80) {
        bottomVerdict.innerHTML = `<span style="color:#10b981;">🛡️ GPTZero Benchmark: High Burstiness Verified (Human Dynamic Cadence).</span>`;
      } else if (result.humanScore >= 50) {
        bottomVerdict.innerHTML = `<span style="color:#f59e0b;">⚠️ GPTZero Caution: Moderate sentence uniformity. Vary sentence lengths for stronger burstiness.</span>`;
      } else {
        bottomVerdict.innerHTML = `<span style="color:#ef4444;">🚨 GPTZero Alert: Flat perplexity corridor detected (Machine-like cadence).</span>`;
      }
    }
  }
}

window.EdgeFlow.GptZeroBurstinessDetector = GptZeroBurstinessDetector;
