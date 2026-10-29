"""
Scores & Campaign Engine Runner (Tier 2 Entrypoint)
===================================================
Evaluates ByX benchmark dimensions, tracks 150-point prize floor milestones,
and writes structured scores contract to contracts/scores.json.
"""

import json
import os
import sys
from typing import Dict, Any

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from .byx_evaluator import ByxEvaluatorModule
from .campaign_tracker import CampaignTrackerModule
from .post_mortem import PostMortemModule


def run_score_engine(posts_file: str = "posts.json", output_file: str = "contracts/scores.json") -> Dict[str, Any]:
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
        alt_path = os.path.join(base_dir, "contracts", "posts.json")
        if os.path.exists(alt_path):
            with open(alt_path, "r", encoding="utf-8") as f:
                posts = json.load(f)

    print(f"\n[Score Engine] Evaluating ByX content benchmarks & campaign attribution...")

    evaluator = ByxEvaluatorModule(posts)
    eval_data = evaluator.evaluate_all()

    tracker = CampaignTrackerModule()
    campaign_data = tracker.compute_campaign_trajectory()

    post_mortem = PostMortemModule.get_strategic_comparison()

    scores_contract = {
        "version": "1.0.0",
        "timestamp": "2026-10-29T16:20:00Z",
        "byx_evaluation": eval_data,
        "campaign_milestones": campaign_data,
        "post_mortem": post_mortem
    }

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(scores_contract, f, indent=2)

    print(f"[Score Engine] ✓ Success! Scores contract written to: {output_file}")
    print(f"  • Average ByX Score:     {eval_data['average_byx_quality_score']} / 100 ({eval_data['overall_grade']})")
    print(f"  • Projected Daily Rate:  {eval_data['projected_daily_points']}")
    print(f"  • Campaign Total Floor:  {campaign_data['final_projected_points']} / 150.0 Pts (+{campaign_data['safety_margin_over_floor']} Margin)")
    print(f"  • Prize Floor ($400):    {'SECURED ✓' if campaign_data['floor_secured'] else 'In Progress'}")

    return scores_contract


if __name__ == "__main__":
    run_score_engine()
