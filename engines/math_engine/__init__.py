"""
EdgeFlow Mathematical Engine (Tier 1)
=====================================
Specialized quantitative forensics:
  • Cover & Thomas Information Theory (Ch. 2, 8, 11)
  • Algebraic Graph Theory & Linear Algebra (Graph Laplacian, Markov, Frobenius)
  • Kelly Log-Optimal Portfolio Optimization (Ch. 16 Stock Market Theory)
"""

from .info_theory import InformationTheoryModule
from .graph_laplacian import GraphLaplacianModule
from .kelly_portfolio import KellyPortfolioModule

__all__ = [
    "InformationTheoryModule",
    "GraphLaplacianModule",
    "KellyPortfolioModule"
]
