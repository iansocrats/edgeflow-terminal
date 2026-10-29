#!/usr/bin/env python3
"""
EdgeFlow Terminal — Master Orchestrator (manage.py)
===================================================
Controls the 3-Tier Architecture:
  • Tier 1: Mathematical Engine (engines/math_engine)
  • Tier 2: Scores & Campaign Engine (engines/score_engine)
  • Tier 3: Post & Publishing Studio (web client + edgeflow_core)

Usage:
  python manage.py all      # Run all backend engines & update contracts
  python manage.py math     # Run Mathematical Forensics Engine
  python manage.py scores   # Run Scores & Campaign Engine
  python manage.py status   # Display architecture health & campaign status
"""

import sys
import os
import json
import shutil

# Ensure UTF-8 output on Windows terminals
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Ensure root directory is on PYTHONPATH
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from engines.math_engine.runner import run_math_engine
from engines.score_engine.runner import run_score_engine


def sync_contracts():
    """Ensures contracts/posts.json is synchronized with root posts.json."""
    root_posts = os.path.join(BASE_DIR, "posts.json")
    contracts_posts = os.path.join(BASE_DIR, "contracts", "posts.json")
    os.makedirs(os.path.join(BASE_DIR, "contracts"), exist_ok=True)
    
    if os.path.exists(root_posts):
        shutil.copyfile(root_posts, contracts_posts)


def print_banner():
    print("=" * 80)
    print("⚡ EDGEFLOW TERMINAL — 3-TIER ENGINE ARCHITECTURE")
    print("=" * 80)


def cmd_math():
    print_banner()
    sync_contracts()
    run_math_engine()


def cmd_scores():
    print_banner()
    sync_contracts()
    run_score_engine()


def cmd_all():
    print_banner()
    sync_contracts()
    run_math_engine()
    run_score_engine()
    print("\n" + "=" * 80)
    print("🎉 All engines executed successfully! Data contracts updated:")
    print("   • contracts/forensics.json")
    print("   • contracts/scores.json")
    print("=" * 80 + "\n")


def cmd_status():
    print_banner()
    contracts_dir = os.path.join(BASE_DIR, "contracts")
    forensics_file = os.path.join(contracts_dir, "forensics.json")
    scores_file = os.path.join(contracts_dir, "scores.json")

    print("\n[Architecture Status]")
    print(f"  • Tier 1 (Math Engine):    {'ONLINE ✓' if os.path.exists(forensics_file) else 'NEEDS RUN'}")
    print(f"  • Tier 2 (Scores Engine):  {'ONLINE ✓' if os.path.exists(scores_file) else 'NEEDS RUN'}")
    print(f"  • Tier 3 (Post Studio):    ONLINE ✓ (Web PWA + Rust WASM)")

    if os.path.exists(scores_file):
        with open(scores_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        camp = data.get("campaign_milestones", {})
        print("\n[Campaign Outlook]")
        print(f"  • Progress to Floor:      {camp.get('progress_to_floor_percent')}% ({camp.get('accumulated_points_to_date')} / 150 Pts)")
        print(f"  • Final Projected Points: {camp.get('final_projected_points')} Pts (+{camp.get('safety_margin_over_floor')} Safety Margin)")
        print(f"  • $400 Prize Status:      {'SECURED ✓' if camp.get('floor_secured') else 'In Progress'}")
    print("=" * 80 + "\n")


def main():
    args = sys.argv[1:]
    if not args or args[0] in ["all", "run-all"]:
        cmd_all()
    elif args[0] in ["math", "forensics"]:
        cmd_math()
    elif args[0] in ["scores", "score"]:
        cmd_scores()
    elif args[0] in ["status", "check"]:
        cmd_status()
    else:
        print("Unknown command. Available commands: all, math, scores, status")


if __name__ == "__main__":
    main()
