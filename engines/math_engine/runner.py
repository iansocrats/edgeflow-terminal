"""
Mathematical Engine Runner (Tier 1 Entrypoint)
==============================================
Loads posts, computes Information Theory, Graph Laplacian, and the complete
Cover & Thomas theoretical suite, and writes the telemetry contract to contracts/forensics.json.
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
from .portfolio_gambling import PortfolioGamblingModule
from .gaussian_waterfilling import GaussianWaterFillingModule
from .algorithmic_complexity import AlgorithmicComplexityModule
from .stochastic_process import StochasticProcessModule
from .information_inequalities import InformationInequalitiesModule


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
    raw_texts = [p.get("improved", p.get("raw", "")) for p in posts]
    corpus = [tokenize(t) for t in raw_texts]

    print(f"\n[Math Engine] Processing {len(posts)} assets across Cover & Thomas Information Theory suite...")

    # 1. Base Information Theory & Graph Laplacian
    info_mod = InformationTheoryModule(corpus, labels)
    info_data = info_mod.compute_telemetry()

    graph_mod = GraphLaplacianModule(corpus, labels)
    graph_data = graph_mod.compute_telemetry()

    # 2. Cover & Thomas Suite Modules
    gambling_mod = PortfolioGamblingModule(labels)
    gambling_data = gambling_mod.compute_telemetry()

    waterfill_mod = GaussianWaterFillingModule(labels)
    waterfill_data = waterfill_mod.compute_telemetry()

    algo_mod = AlgorithmicComplexityModule(raw_texts, corpus, labels)
    algo_data = algo_mod.compute_telemetry()

    stoch_mod = StochasticProcessModule(corpus, labels)
    stoch_data = stoch_mod.compute_telemetry()

    ineq_mod = InformationInequalitiesModule(corpus, labels)
    ineq_data = ineq_mod.compute_telemetry()

    forensics_contract = {
        "version": "2.0.0",
        "timestamp": "2026-10-29T19:00:00Z",
        "asset_count": len(posts),
        "labels": labels,
        "information_theory": info_data,
        "graph_laplacian": graph_data,
        "portfolio_gambling": gambling_data,
        "gaussian_waterfilling": waterfill_data,
        "algorithmic_complexity": algo_data,
        "stochastic_process": stoch_data,
        "information_inequalities": ineq_data
    }

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(forensics_contract, f, indent=2)

    print(f"[Math Engine] ✓ Success! Comprehensive forensics contract written to: {output_file}")
    print(f"  • Shannon Entropy:          {info_data['average_shannon_entropy']} bits/token")
    print(f"  • Graph Laplacian λ₁:       {graph_data['fiedler_eigenvalue']} (Algebraic Connectivity)")
    print(f"  • Kelly Doubling Rate:       {gambling_data['doubling_rate_summary']}")
    print(f"  • Universal Portfolio:       {gambling_data['universal_portfolio']['universal_wealth_multiplier']}x Multiplier (Rebalance Alpha: {gambling_data['universal_portfolio']['rebalancing_alpha']})")
    print(f"  • Gaussian Channel Capacity: {waterfill_data['total_shannon_capacity']} (Water Level ν = {waterfill_data['water_level']})")
    print(f"  • Kolmogorov Proxy (LZW):    {algo_data['avg_compression_ratio']} avg ratio | NCD = {algo_data['avg_ncd_distance']}")
    print(f"  • Markov Narrative Rate:     {stoch_data['markov_entropy_rate']} (Memory Reduction: -{stoch_data['memory_reduction_bits']} bits)")
    print(f"  • Fano's Error Bound:        Max Win-Rate Floor: {ineq_data['max_win_rate_ceiling']} | Sanov: {ineq_data['pinsker_sanov_bounds']['sanov_collision_bound']}")

    return forensics_contract


if __name__ == "__main__":
    run_math_engine()
