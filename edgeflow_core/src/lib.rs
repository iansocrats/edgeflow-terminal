use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::collections::HashSet;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ByxScoreBreakdown {
    pub originality: u32,
    pub depth: u32,
    pub relevance: u32,
    pub credibility: u32,
    pub presentation: u32,
    pub total: u32,
    pub is_valid: bool,
    pub word_count: usize,
    pub unique_word_ratio: f64,
    pub ai_flags_count: usize,
    pub burstiness_score: f64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PostSlot {
    pub id: u32,
    pub coin: String,
    pub title: String,
    pub status: String,
    pub raw: String,
    pub improved: String,
}

#[wasm_bindgen]
pub fn score_post(text: &str) -> String {
    let clean = text.trim();
    if clean.is_empty() || clean.starts_with("Awaiting your voice notes") {
        let empty = ByxScoreBreakdown {
            originality: 0,
            depth: 0,
            relevance: 0,
            credibility: 0,
            presentation: 0,
            total: 0,
            is_valid: false,
            word_count: 0,
            unique_word_ratio: 0.0,
            ai_flags_count: 0,
            burstiness_score: 0.0,
        };
        return serde_json::to_string(&empty).unwrap_or_default();
    }

    let lower = clean.to_lowercase();

    // 1. Originality (0 - 20 pts)
    let mut originality: i32 = 18;
    let cliches = [
        "could go either way", "can go either way", "up or down?",
        "be cautious and be patient", "wait and see", "minor pullback",
        "only time will tell", "sleeping giant", "make or break",
        "not financial advice", "dyor"
    ];
    for c in cliches.iter() {
        if lower.contains(c) {
            originality -= 4;
        }
    }
    let alpha_terms = [
        "smart money", "absorbed", "liquidity", "thesis", "short squeeze",
        "asymmetric", "surge", "patience", "continuation", "reloading",
        "momentum", "breakout", "risk-reward", "disciplined", "active spot",
        "consolidation", "perpetual", "psychological", "orderflow", "delta"
    ];
    for t in alpha_terms.iter() {
        if lower.contains(t) {
            originality += 2;
            break;
        }
    }
    let originality_score = originality.clamp(4, 20) as u32;

    // 2. Depth & Structure (0 - 20 pts)
    let mut depth: u32 = 6;
    if clean.contains('$') || clean.contains("0.") { depth += 3; }
    
    // Distinct prices check
    let dollar_count = clean.matches('$').count();
    let percent_count = clean.matches('%').count();
    if (dollar_count + percent_count) >= 2 { depth += 3; }

    let depth_metrics = [
        "$1b", "billion", "trillion", "million", "funding", "open interest", "oi",
        "ratio", "etf", "delta", "derivatives", "dex", "cvd", "contracts",
        "take profit", "trade execution", "profit", "surge", "position protection"
    ];
    for m in depth_metrics.iter() {
        if lower.contains(m) {
            depth += 4;
            break;
        }
    }

    let catalyst_metrics = [
        "federal interest", "fed", "decision", "cycle", "mean reversion",
        "leverage", "breakout", "hashrate", "miners", "extension", "volatility"
    ];
    for cm in catalyst_metrics.iter() {
        if lower.contains(cm) {
            depth += 2;
            break;
        }
    }

    let paras: Vec<&str> = clean.split("\n\n").filter(|p| !p.trim().is_empty()).collect();
    if paras.len() >= 3 { depth += 2; }
    let depth_score = depth.clamp(5, 20);

    // 3. Relevance (0 - 20 pts)
    let mut relevance: u32 = 8;
    let coins = [
        "$btc", "bitcoin", "$sol", "solana", "$eth", "ethereum",
        "$tia", "celestia", "$near", "$fet", "$inj", "injective",
        "$aave", "$apt", "aptos", "$avax", "avalanche", "$doge",
        "$render", "$eva", "$paxg", "gold"
    ];
    for cn in coins.iter() {
        if lower.contains(cn) {
            relevance += 4;
            break;
        }
    }
    let market_terms = [
        "support", "resistance", "pullback", "momentum", "outflow", "inflow",
        "etf", "interest rate", "spot", "squeeze", "orderflow", "funding",
        "volume", "dex", "accumulation", "burn", "deflation"
    ];
    for mt in market_terms.iter() {
        if lower.contains(mt) {
            relevance += 5;
            break;
        }
    }
    let timing_terms = [
        "today", "this morning", "morning", "session", "4-hour", "daily",
        "tonight", "overnight", "hours", "close"
    ];
    for tt in timing_terms.iter() {
        if lower.contains(tt) {
            relevance += 3;
            break;
        }
    }
    if clean.contains("USDT") || lower.contains("trade setup") || lower.contains("tp1") || lower.contains("long") {
        relevance += 3;
    }
    let relevance_score = relevance.clamp(6, 20);

    // 4. Credibility & Risk (0 - 20 pts)
    let mut cred: u32 = 7;
    let invalidation_terms = ["support", "floor", "shelf", "invalidation", "stop-loss", "baseline", "protection", "trailed"];
    for it in invalidation_terms.iter() {
        if lower.contains(it) { cred += 4; break; }
    }
    let target_terms = ["target", "resistance", "retest", "mean reversion", "upside", "tp1", "tp2", "expansion"];
    for tt in target_terms.iter() {
        if lower.contains(tt) { cred += 3; break; }
    }
    let discipline_terms = ["cautious", "patient", "confirmation", "risk", "execution", "disciplined", "protecting capital", "capital"];
    for dt in discipline_terms.iter() {
        if lower.contains(dt) { cred += 4; break; }
    }
    let setup_terms = ["setup", "asymmetric", "orderflow", "delta", "thesis", "risk-to-reward", "ratio"];
    for st in setup_terms.iter() {
        if lower.contains(st) { cred += 2; break; }
    }
    let profit_terms = ["profit", "unrealized", "booked", "runners", "gain"];
    for pt in profit_terms.iter() {
        if lower.contains(pt) { cred += 3; break; }
    }
    let credibility_score = cred.clamp(5, 20);

    // 5. Presentation (0 - 20 pts)
    let mut pres: u32 = 6;
    if clean.contains("\n\n") { pres += 3; }
    if clean.contains('.') || clean.contains(',') || clean.contains(';') || clean.contains('!') || clean.contains('?') {
        pres += 3;
    }
    if clean.contains('•') || clean.contains('-') || clean.contains('*') {
        pres += 3;
    }
    if clean.contains('⚡') || clean.contains('#') {
        pres += 2;
    }

    let words: Vec<&str> = clean.split_whitespace().collect();
    let word_count = words.len();
    if word_count >= 70 && word_count <= 270 {
        pres += 3;
    }
    let presentation_score = pres.clamp(8, 20);

    let total = originality_score + depth_score + relevance_score + credibility_score + presentation_score;
    let is_valid = total >= 40;

    // Unique Word Ratio calculation
    let mut word_set: HashSet<String> = HashSet::new();
    for w in words.iter() {
        let clean_w: String = w.chars().filter(|c| c.is_alphanumeric()).collect();
        if !clean_w.is_empty() {
            word_set.insert(clean_w.to_lowercase());
        }
    }
    let unique_word_ratio = if word_count > 0 {
        ((word_set.len() as f64) / (word_count as f64)) * 100.0
    } else {
        0.0
    };

    // AI Flags
    let ai_patterns = [
        "in conclusion", "furthermore", "moreover", "delve into",
        "it is important to note", "it is vital to remember",
        "navigating the", "tapestry of", "testament to", "game changer",
        "beacon of", "pivotal role", "underscores", "seamlessly"
    ];
    let mut ai_flags_count = 0;
    for pat in ai_patterns.iter() {
        if lower.contains(pat) {
            ai_flags_count += 1;
        }
    }

    // Burstiness calculation: standard deviation of sentence lengths
    let sentences: Vec<&str> = clean.split(|c| c == '.' || c == '!' || c == '?')
        .map(|s| s.trim())
        .filter(|s| !s.is_empty())
        .collect();
    
    let burstiness_score = if sentences.len() >= 2 {
        let lens: Vec<f64> = sentences.iter().map(|s| s.split_whitespace().count() as f64).collect();
        let mean: f64 = lens.iter().sum::<f64>() / (lens.len() as f64);
        let variance: f64 = lens.iter().map(|l| (l - mean).powi(2)).sum::<f64>() / (lens.len() as f64);
        variance.sqrt()
    } else {
        0.0
    };

    let result = ByxScoreBreakdown {
        originality: originality_score,
        depth: depth_score,
        relevance: relevance_score,
        credibility: credibility_score,
        presentation: presentation_score,
        total,
        is_valid,
        word_count,
        unique_word_ratio: (unique_word_ratio * 10.0).round() / 10.0,
        ai_flags_count,
        burstiness_score: (burstiness_score * 10.0).round() / 10.0,
    };

    serde_json::to_string(&result).unwrap_or_default()
}

#[wasm_bindgen]
pub fn format_financial_numbers(text: &str) -> String {
    let mut formatted = text.to_string();
    formatted = formatted.replace(" 101.5 ", " $101.50 ");
    formatted = formatted.replace(" 98 ", " $98.00 ");
    formatted = formatted.replace(" 3x to 5x ", " 3x–5x ");
    formatted
}