"""
EdgeFlow Mathematical Engine (Tier 1)
=====================================
Specialized quantitative forensics & Cover & Thomas Information Theory:
  • Cover & Thomas Information Theory (Ch. 2, 8, 11)
  • Algebraic Graph Theory & Linear Algebra (Graph Laplacian, Markov, Frobenius)
  • Portfolio Gambling & Universal Portfolio (Ch. 6 & 16)
  • Gaussian Channel Water-Filling & Differential Entropy (Ch. 8 & 9)
  • Algorithmic Complexity, Kolmogorov & Universal Coding (Ch. 5, 13 & 14)
  • Stochastic Process Markov Entropy Rates & MaxEnt (Ch. 4 & 12)
  • Information Inequalities & Statistical Bounds (Ch. 2 & 11)
"""

from .info_theory import InformationTheoryModule
from .graph_laplacian import GraphLaplacianModule
from .kelly_portfolio import KellyPortfolioModule
from .portfolio_gambling import PortfolioGamblingModule
from .gaussian_waterfilling import GaussianWaterFillingModule
from .algorithmic_complexity import AlgorithmicComplexityModule
from .stochastic_process import StochasticProcessModule
from .information_inequalities import InformationInequalitiesModule
from .chaos_dynamics import ChaosDynamicsModule
from .gltr_engine import GLTRPredictabilityModule

__all__ = [
    "InformationTheoryModule",
    "GraphLaplacianModule",
    "KellyPortfolioModule",
    "PortfolioGamblingModule",
    "GaussianWaterFillingModule",
    "AlgorithmicComplexityModule",
    "StochasticProcessModule",
    "InformationInequalitiesModule",
    "ChaosDynamicsModule",
    "GLTRPredictabilityModule"
]
