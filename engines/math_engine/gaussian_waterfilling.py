"""
Cover & Thomas Chapters 8 & 9: Differential Entropy & Gaussian Channel Water-Filling
=====================================================================================
Calculates:
  • Continuous Differential Entropy h(X) & Multivariate Gaussian Bound (8.6.5)
  • Shannon Gaussian Channel Capacity C = 1/2 log2(1 + P/N) (9.1.1)
  • Shannon Water-Filling Capital Allocation across 10 Parallel Assets (9.4.1)
  • Optimal Signal-to-Noise Ratio (SNR) and Channel Pruning
"""

import math
from typing import List, Dict, Any, Tuple


class GaussianWaterFillingModule:
    """
    Implements Cover & Thomas Theorem 9.4.1 (Parallel Gaussian Channels & Water-Filling)
    and Chapter 8 (Differential Entropy).
    """

    def __init__(self, labels: List[str]):
        self.labels = labels
        self.m = len(labels)
        # Measured annualized return volatility (noise power N_i = sigma_i^2)
        # Lower noise = cleaner signal; High noise = choppy / low SNR
        self.noise_variance = {
            "$SOL":    0.16,  # Moderate noise
            "$TIA":    0.32,  # Elevated volatility
            "$NEAR":   0.14,  # Clean trend channel
            "$FET":    0.24,  # AI narrative volatility
            "$INJ":    0.36,  # Choppy orderbook
            "$AAVE":   0.09,  # Low volatility DeFi anchor
            "$APT":    0.20,  # Layer 1 baseline
            "$AVAX":   0.12,  # Clean swing structure
            "$DOGE":   0.58,  # Ultra-high meme coin noise floor
            "$RENDER": 0.22,  # Moderate GPU compute trend
            "$MSFT":   0.08   # Low-noise enterprise cloud anchor
        }

    def compute_differential_entropy(self) -> Dict[str, Any]:
        """
        Cover & Thomas Theorem 8.6.5:
        Differential entropy of a Gaussian random variable:
        h(X) = 0.5 * log2(2 * pi * e * sigma^2)
        Multivariate Gaussian MAXIMIZES differential entropy over all distributions
        with the same covariance matrix Sigma.
        """
        entropies = {}
        for coin in self.labels:
            var = self.noise_variance.get(coin, 0.20)
            h = 0.5 * math.log2(2.0 * math.pi * math.e * var)
            entropies[coin] = round(h, 3)

        avg_h = round(sum(entropies.values()) / len(entropies), 3) if entropies else 0.0

        return {
            "theorem": "Cover & Thomas Theorem 8.6.5 (Maximum Differential Entropy of Gaussian)",
            "equation": "h(X) = 0.5 * log2(2 * π * e * σ²)",
            "average_differential_entropy": f"{avg_h} bits",
            "asset_differential_entropies": entropies,
            "maxent_property": "Gaussian assumption maximizes entropy, yielding the most conservative risk model."
        }

    def solve_water_filling(self, total_power: float = 1.0) -> Dict[str, Any]:
        """
        Cover & Thomas Theorem 9.4.1:
        Given parallel Gaussian channels with noise variances N_1, ..., N_m,
        the capacity-maximizing power/capital allocation is:
            P_i = (nu - N_i)^+
        where nu (water level) satisfies sum_i (nu - N_i)^+ = P_total.
        """
        # Noise levels for active assets
        noises = [self.noise_variance.get(c, 0.20) for c in self.labels]
        sorted_indices = sorted(range(self.m), key=lambda i: noises[i])

        # Bisection / exact search for water level nu
        low = min(noises)
        high = max(noises) + total_power
        nu = low

        for _ in range(100):
            mid = (low + high) / 2.0
            allocated = sum(max(0.0, mid - noises[i]) for i in range(self.m))
            if abs(allocated - total_power) < 1e-6:
                nu = mid
                break
            elif allocated < total_power:
                low = mid
            else:
                high = mid
            nu = mid

        allocations = {}
        capacities = {}
        snr_db = {}
        pruned_assets = []

        total_capacity = 0.0

        for i, coin in enumerate(self.labels):
            n_i = noises[i]
            p_i = max(0.0, nu - n_i)
            allocations[coin] = round(p_i / total_power, 3)
            
            # Shannon capacity: C_i = 0.5 * log2(1 + P_i / N_i) bits/use
            if p_i > 0:
                snr = p_i / n_i
                cap = 0.5 * math.log2(1.0 + snr)
                capacities[coin] = round(cap, 3)
                snr_db[coin] = round(10.0 * math.log10(snr), 1)
                total_capacity += cap
            else:
                capacities[coin] = 0.0
                snr_db[coin] = -999.0
                pruned_assets.append(coin)

        return {
            "theorem": "Cover & Thomas Theorem 9.4.1 (Shannon Water-Filling on Parallel Channels)",
            "equation": "P_i = (ν - N_i)⁺  subject to  ∑ P_i = P_total",
            "water_level_nu": round(nu, 4),
            "total_capital_budget": total_power,
            "total_shannon_capacity": round(total_capacity, 3),
            "allocations": allocations,
            "channel_capacities_bits": capacities,
            "snr_db": snr_db,
            "noise_variance": {c: self.noise_variance.get(c, 0.20) for c in self.labels},
            "pruned_assets": pruned_assets,
            "allocation_insight": (
                f"Water level ν = {round(nu, 3)}. Assets with noise > ν ({', '.join(pruned_assets) if pruned_assets else 'None'}) "
                f"receive 0 capital because noise exceeds the channel capacity threshold."
            )
        }

    def compute_telemetry(self) -> Dict[str, Any]:
        diff_entropy = self.compute_differential_entropy()
        water_filling = self.solve_water_filling(total_power=1.0)

        return {
            "differential_entropy": diff_entropy,
            "water_filling": water_filling,
            "total_shannon_capacity": f"{water_filling['total_shannon_capacity']} bits/channel-use",
            "water_level": water_filling["water_level_nu"],
            "pruned_assets": water_filling["pruned_assets"]
        }
