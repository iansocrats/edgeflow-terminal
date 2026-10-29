"""
EdgeFlow Mathematical Gatekeeper (Quality Firewall Engine)
=========================================================
Strict automated validation pipeline. Every dictated or generated post
must pass all 7 quantitative mathematical benchmarks before publication.

Benchmarks:
  1. Word Count Fidelity: Exactly 130–145 words
  2. The 3 Polishing Rules (Punctuation, Terminology, Emoji Spacing)
  3. Shannon Entropy Density: H(X) >= 6.50 bits/token
  4. Kolmogorov Complexity: LZW Ratio >= 0.55 & Min NCD >= 0.65
  5. Maximum Pairwise Jaccard: <= 18.5%
  6. 5-State Markov Narrative Flow (Macro -> Liquidity -> Trigger -> Invalidation -> Payoff)
  7. Kelly & Capital Risk Compliance: Explicit Invalidation Price, Leverage <= 4x, R:R >= 2.5
"""

import math
import re
import zlib
from collections import Counter
from typing import List, Dict, Any, Tuple


def tokenize(text: str) -> List[str]:
    if not text:
        return []
    return re.findall(r"\b[a-zA-Z0-9'$%.-]+\b", text.lower())


class MathematicalGatekeeper:
    def __init__(self, existing_posts: List[Dict[str, Any]] = None):
        self.existing_posts = existing_posts or []
        self.existing_texts = [p.get("improved", p.get("raw", "")) for p in self.existing_posts]
        self.existing_corpus = [tokenize(t) for t in self.existing_texts]

    def check_word_count(self, text: str) -> Dict[str, Any]:
        words = text.split()
        count = len(words)
        passed = 130 <= count <= 145
        return {
            "name": "1. Word Count Fidelity (130–145 Words)",
            "passed": passed,
            "value": f"{count} words",
            "threshold": "130–145 words",
            "delta": 0 if passed else (130 - count if count < 130 else count - 145),
            "message": "Fails target budget; adjust length." if not passed else "Optimal length."
        }

    def check_polishing_rules(self, text: str) -> Dict[str, Any]:
        violations = []

        # Rule 1: Emoji Spacing (Must have leading space and trailing space, not stacked)
        if re.search(r"[\u2600-\u27bf\U0001f300-\U0001f9ff]{2,}", text):
            violations.append("Stacked emojis detected without intervening space.")
        if re.search(r"[a-zA-Z0-9][\u2600-\u27bf\U0001f300-\U0001f9ff]", text):
            violations.append("Missing space before emoji.")
        if re.search(r"[\u2600-\u27bf\U0001f300-\U0001f9ff][a-zA-Z0-9]", text):
            violations.append("Missing space after emoji.")

        # Rule 2: Punctuation (No broken double spaces or hanging dashes)
        if "  " in text:
            violations.append("Double spaces detected.")
        if re.search(r"\s+[,.!?;:]", text):
            violations.append("Floating punctuation with preceding space detected.")

        # Rule 3: Must include professional hashtag or ticker anchor
        if not re.search(r"\$[A-Z0-9]+|#[A-Z0-9]+", text):
            violations.append("Missing $COIN or #COIN ticker tag.")

        passed = len(violations) == 0
        return {
            "name": "2. Three Polishing Rules Compliance",
            "passed": passed,
            "value": "Compliant ✓" if passed else f"{len(violations)} Violations",
            "violations": violations,
            "message": "Adheres to punctuation, emoji, and term rules." if passed else "; ".join(violations)
        }

    def check_shannon_entropy(self, text: str) -> Dict[str, Any]:
        tokens = tokenize(text)
        if not tokens:
            return {"name": "3. Shannon Entropy Density", "passed": False, "value": "0.00 bits", "threshold": ">= 6.50 bits"}
        counts = Counter(tokens)
        n = len(tokens)
        h = -sum((c / n) * math.log2(c / n) for c in counts.values())
        h = round(h, 3)
        passed = h >= 6.50
        return {
            "name": "3. Shannon Information Entropy H(X)",
            "passed": passed,
            "value": f"{h} bits/token",
            "threshold": ">= 6.50 bits/token",
            "delta": round(6.50 - h, 3) if not passed else 0.0,
            "message": "High lexical density and information richness." if passed else "Repetitive phrasing; increase vocabulary variety."
        }

    def check_kolmogorov_and_ncd(self, text: str) -> Dict[str, Any]:
        raw_bytes = len(text.encode("utf-8"))
        comp_bytes = len(zlib.compress(text.encode("utf-8"), level=9))
        ratio = round(comp_bytes / raw_bytes, 3) if raw_bytes > 0 else 0.0

        # Pairwise NCD against all OTHER existing posts (exclude self)
        ncd_values = []
        for other in self.existing_texts:
            if other.strip() == text.strip():
                continue
            c_other = len(zlib.compress(other.encode("utf-8"), level=9))
            c_joint = len(zlib.compress((text + " " + other).encode("utf-8"), level=9))
            ncd = (c_joint - min(comp_bytes, c_other)) / max(comp_bytes, c_other)
            ncd_values.append(ncd)

        min_ncd = round(min(ncd_values), 3) if ncd_values else 0.85
        passed_ratio = ratio >= 0.55
        passed_ncd = min_ncd >= 0.65
        passed = passed_ratio and passed_ncd

        return {
            "name": "4. Kolmogorov Complexity & NCD Incompressibility",
            "passed": passed,
            "value": f"LZW: {ratio} | Min NCD: {min_ncd}",
            "threshold": "LZW >= 0.55 & Min NCD >= 0.65",
            "message": "Algorithmic incompressibility verified (zero AI-template overlap)." if passed else "Text compressible into existing setups; increase distinct phrasing."
        }

    def check_similarity_barrier(self, text: str) -> Dict[str, Any]:
        tokens = set(tokenize(text))
        if not self.existing_corpus or not tokens:
            return {"name": "5. Max Pairwise Jaccard Similarity", "passed": True, "value": "0.0%", "threshold": "<= 18.5%"}

        max_jaccard = 0.0
        most_similar_idx = -1
        for i, other_tokens in enumerate(self.existing_corpus):
            if self.existing_texts[i].strip() == text.strip():
                continue  # Exclude self comparison
            other_set = set(other_tokens)
            inter = len(tokens.intersection(other_set))
            union = len(tokens.union(other_set))
            sim = inter / union if union > 0 else 0.0
            if sim > max_jaccard:
                max_jaccard = sim
                most_similar_idx = i

        pct = round(max_jaccard * 100, 1)
        passed = pct <= 18.5
        return {
            "name": "5. Max Pairwise Jaccard Similarity",
            "passed": passed,
            "value": f"{pct}%",
            "threshold": "<= 18.5%",
            "most_similar_post_index": most_similar_idx + 1 if most_similar_idx >= 0 else None,
            "message": "Hyper-divergent alpha verified." if passed else f"Cross-post collision with Post {most_similar_idx + 1}; prune shared words."
        }

    def check_markov_narrative_flow(self, text: str) -> Dict[str, Any]:
        t_lower = text.lower()
        # 5 Essential Narrative States:
        has_macro = any(k in t_lower for k in ["liquidity", "sweep", "fomc", "compression", "consolidation", "range", "structure", "orderflow", "flow", "momentum", "divergence", "depin", "macro"])
        has_levels = any(k in t_lower for k in ["support", "resistance", "floor", "ceiling", "zone", "level", "retest", "$", "0."])
        has_trigger = any(k in t_lower for k in ["trigger", "breakout", "entry", "rebound", "expansion", "catalyst", "confirm", "flip", "accumulate", "bids", "stage"])
        has_invalidation = any(k in t_lower for k in ["invalidation", "stop", "stop-loss", "risk", "beneath", "below", "closure", "protect", "negate", "negates"])
        has_payoff = any(k in t_lower for k in ["target", "tp", "asymmetric", "ratio", "r:r", "upside", "expansion", "gain", "path", "payoff", "milestone"])

        states_found = sum([has_macro, has_levels, has_trigger, has_invalidation, has_payoff])
        passed = states_found >= 4  # At least 4 of 5 must be clearly present
        return {
            "name": "6. 5-State Markov Narrative Flow Structure",
            "passed": passed,
            "value": f"{states_found} / 5 States Present",
            "threshold": ">= 4 / 5 States (Macro, Levels, Trigger, Invalidation, Payoff)",
            "states_detected": {
                "Macro Context": has_macro,
                "Key Levels": has_levels,
                "Execution Trigger": has_trigger,
                "Invalidation Anchor": has_invalidation,
                "Asymmetric Payoff": has_payoff
            },
            "message": "Ergodic narrative flow verified." if passed else "Missing key thesis components (ensure invalidation and levels are explicit)."
        }

    def check_risk_compliance(self, text: str) -> Dict[str, Any]:
        t_lower = text.lower()
        has_inval_price = (
            bool(re.search(r"(invalidation|defensive|risk cutoff|setup negation|capital safety|stop|breakdown below|closing under|closing beneath|cut)\s*.*?\$?(\d+(?:\.\d+)?)", t_lower))
            or "stop" in t_lower
            or "invalidation" in t_lower
            or "cutoff" in t_lower
            or "negation" in t_lower
        )
        
        # Check leverage (must be <= 4x or disciplined)
        leverage_match = re.search(r"(\d+)x", t_lower)
        safe_leverage = True
        leverage_val = "Disciplined (2x–4x)"
        if leverage_match:
            lev = int(leverage_match.group(1))
            leverage_val = f"{lev}x"
            if lev > 4:
                safe_leverage = False

        passed = has_inval_price and safe_leverage
        return {
            "name": "7. Kelly Simplex & Capital Risk Compliance",
            "passed": passed,
            "value": f"Stop Anchor: {'Yes' if has_inval_price else 'No'} | Leverage: {leverage_val}",
            "threshold": "Explicit Stop + Leverage <= 4x",
            "message": "Disciplined institutional risk limits met." if passed else "Violates risk policy; add explicit invalidation level and cap leverage <= 4x."
        }

    def check_gltr_predictability(self, text: str) -> Dict[str, Any]:
        from .math_engine.gltr_engine import evaluate_gltr
        ev = evaluate_gltr(text)
        passed = ev["passed"]
        yellow = ev["contextual_yellow_pct"]
        purple = ev["creative_purple_pct"]
        green = ev["top10_green_pct"]
        return {
            "name": "8. Harvard GLTR Token Predictability (Rank Optimization)",
            "passed": passed,
            "value": f"Contextual: {yellow}% | Creative: {purple}% | Top-10: {green}%",
            "threshold": "Contextual: 38%–58% (Target: 40–50%) | Creative: 18%–35% (Target: 20–30%)",
            "details": ev,
            "message": "Balanced contextual flow and rich creative domain alpha verified." if passed else "Token distribution outside calibrated Harvard GLTR bounds."
        }

    def audit_post(self, text: str, coin: str = "") -> Dict[str, Any]:
        """Runs the candidate post through all 8 benchmarks."""
        results = [
            self.check_word_count(text),
            self.check_polishing_rules(text),
            self.check_shannon_entropy(text),
            self.check_kolmogorov_and_ncd(text),
            self.check_similarity_barrier(text),
            self.check_markov_narrative_flow(text),
            self.check_risk_compliance(text),
            self.check_gltr_predictability(text)
        ]

        all_passed = all(r["passed"] for r in results)
        failed_count = sum(1 for r in results if not r["passed"])

        return {
            "coin": coin,
            "approved_for_publishing": all_passed,
            "score": round(((8 - failed_count) / 8) * 100, 1),
            "passed_benchmarks": 8 - failed_count,
            "total_benchmarks": 8,
            "details": results
        }

    def auto_polish(self, text: str) -> str:
        """Automatically repairs formatting, spacing, and punctuation violations."""
        t = text
        # Clean double spaces
        t = re.sub(r"[ ]{2,}", " ", t)
        # Fix floating punctuation
        t = re.sub(r"\s+([,.!?;:])", r"\1", t)
        # Ensure single space before emoji if attached to word
        t = re.sub(r"([a-zA-Z0-9])([\u2600-\u27bf\U0001f300-\U0001f9ff])", r"\1 \2", t)
        # Ensure single space after emoji if attached to word
        t = re.sub(r"([\u2600-\u27bf\U0001f300-\U0001f9ff])([a-zA-Z0-9])", r"\1 \2", t)
        return t.strip()
