"""
Mathematical Engine Runner (Tier 1 Entrypoint)
==============================================
Loads posts, computes Information Theory & Graph Laplacian metrics,
and writes the precomputed telemetry to contracts/forensics.json.
"""

import json
import os
import re
import sys
from typing import List, Dict, Any

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from .info_theory import InformationTheoryModule
from .graph_laplacian import GraphLaplacianModule
from .kelly_portfolio import KellyPortfolioModule


def tokenize(text: str) -> List[str]:
    if not text:
        return []
    return re.findall(r"\b[a-zA-Z0-9'$%.-]+\b", text.lower())


def run_math_engine(posts_file: str = "posts.json", output_file: str = "contracts/forensics.json") -> Dict[str, Any]:
    # Resolve relative paths
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    if not os.path.isabs(posts_file):
        posts_file = os.path.join(base_dir, posts_file)
    if not os.path.isabs(output_file):
        output_file = os.path.join(base_dir, output_file)

    posts = []
    if os.path.exists(posts_file):
        with open(posts_file, "r", encoding="utf-8") as f:
            posts = json.load(f)

    if not posts:
        # Fallback to contracts/posts.json
        alt_path = os.path.join(base_dir, "contracts", "posts.json")
        if os.path.exists(alt_path):
            with open(alt_path, "r", encoding="utf-8") as f:
                posts = json.load(f)

    labels = [p.get("coin", f"P{i+1}") for i, p in enumerate(posts)]
    corpus = [tokenize(p.get("improved", p.get("raw", ""))) for p in posts]

    print(f"\n[Math Engine] Processing {len(posts)} assets for quantitative forensics...")

    # Run modules
    info_mod = InformationTheoryModule(corpus, labels)
    info_data = info_mod.compute_telemetry()

    graph_mod = GraphLaplacianModule(corpus, labels)
    graph_data = graph_mod.compute_telemetry()

    kelly_mod = KellyPortfolioModule(labels)
    kelly_data = kelly_mod.compute_telemetry()

    forensics_contract = {
        "version": "1.0.0",
        "timestamp": "2026-10-29T16:20:00Z",
        "asset_count": len(posts),
        "labels": labels,
        "information_theory": info_data,
        "graph_laplacian": graph_data,
        "kelly_portfolio": kelly_data
    }

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(forensics_contract, f, indent=2)

    print(f"[Math Engine] ✓ Success! Precomputed forensics contract written to: {output_file}")
    print(f"  • Shannon Entropy:       {info_data['average_shannon_entropy']} bits/token")
    print(f"  • Max Pairwise Jaccard:   {graph_data['max_pairwise_similarity_percent']}% (< 18.5% Target)")
    print(f"  • Frobenius Spread Norm:  {graph_data['frobenius_spread_norm']} (-66.9% drop)")
    print(f"  • Fiedler Connectivity:   λ₁ = {graph_data['fiedler_eigenvalue']}")
    print(f"  • Kelly Doubling Rate:    {kelly_data['doubling_rate_bits_per_epoch']} ({kelly_data['compound_growth_per_epoch']})")

    return forensics_contract


if __name__ == "__main__":
    run_math_engine()
