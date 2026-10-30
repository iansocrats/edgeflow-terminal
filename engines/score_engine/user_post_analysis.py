"""
Bybit Creator Post Analysis & Dataset Ingestion Engine
======================================================
Ingests, parses, and performs deep comparative analysis on posts from
top Bybit Community creators (e.g., Crypto BOSS, UID: 535233761).
"""

import json
import os
import re
from typing import Dict, Any, List

DATASET_FILE = "datasets/bybit_user_posts.json"

class BybitUserPostAnalyzer:
    def __init__(self, dataset_path: str = DATASET_FILE):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.dataset_path = os.path.join(base_dir, dataset_path) if not os.path.isabs(dataset_path) else dataset_path

    def load_dataset(self) -> Dict[str, Any]:
        if os.path.exists(self.dataset_path):
            with open(self.dataset_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"posts": []}

    def generate_comparative_audit(self) -> Dict[str, Any]:
        data = self.load_dataset()
        posts = data.get("posts", [])
        
        audit_results = []
        for p in posts:
            audit = {
                "post_id": p["post_id"],
                "url": p["url"],
                "symbols": p["symbols"],
                "engagement": p["engagement"],
                "word_count": p["metrics"]["word_count"],
                "flesch_kincaid_grade": p["metrics"]["flesch_kincaid_grade"],
                "entropy_bits": p["metrics"]["vocabulary_entropy_bits"],
                "colloquial_markers_count": p["metrics"]["colloquial_density_score"],
                "campaign_hashtags": p["metrics"]["campaign_hashtags"],
                "byx_score": p["byx_evaluation"]["total_byx_score"],
                "key_strengths": [],
                "contrasts_with_day4": []
            }
            
            if p["post_id"] == "576460752305256405":
                audit["title"] = "Post 1: $ETHUSDT Dip-Buying & Bottoming Zone Opportunity"
                audit["key_strengths"] = [
                    "Storytelling Timeline: Sequences 17:00 top ($2,379.49) -> 21:00 liquidation candle ($2,232.40) -> 22:00 bounce ($2,274) -> current consolidation ($2,270).",
                    "Skin-in-the-game Authenticity: 'I already have my trade on this, so for me it's about the zone and not chasing.'",
                    "Conversational Risk Framing: 'the idea is wrong if it closes under $2,225', 'size it with that in mind'.",
                    "Official Campaign Tags: Includes #ByXIMPACT and #IMPACTbyTrade for direct platform campaign indexing.",
                    "Grade 3.7 Readability: Simple, accessible language that international retail traders immediately understand."
                ]
                audit["contrasts_with_day4"] = [
                    "Day 4 used rigid 4-bullet headers ('Structural Base', 'Laddered Entries'). This creator uses fluid, continuous paragraphs.",
                    "Day 4 used textbook compliance jargon ('disciplined 3x gearing'). This creator uses natural trader guidance ('size it with that in mind', 'roughly 2 to 1 and 3.5 to 1').",
                    "Day 4 posts lacked the official #ByXIMPACT and #IMPACTbyTrade tracking tags."
                ]
            elif p["post_id"] == "8070450532249793081":
                audit["title"] = "Post 2: $XAUT vs $PAXG vs $XAG Gold & Silver Comparative Breakdown"
                audit["key_strengths"] = [
                    "Thematic Comparison Matrix: Breaks down Tether Gold ($XAUT) vs Pax Gold ($PAXG) vs Silver ($XAG).",
                    "Macro Catalyst Context: Directly connects precious metal price action to US inflation data (PCE) and interest rate expectations.",
                    "Ratio Analysis: Highlights gold-to-silver ratio sitting at 77 to demonstrate relative weakness.",
                    "High Comment Engagement: Closed with 'Your pick: $XAUT, $PAXG or $XAG into the next data release? Tell me why.' and creator actively replied ('thnx bro'), capturing Bybit's 3x comment weighting bonus.",
                    "Earned 45 Likes and 4 active discussions."
                ]
                audit["contrasts_with_day4"] = [
                    "Day 4 covered single isolated assets. This post runs a multi-token comparative thesis, giving users multiple instruments to trade.",
                    "Author personally responds to commenters in the thread, boosting community trust and algorithmic distribution."
                ]
            elif p["post_id"] == "4035225266125856630":
                audit["title"] = "Post 3: $VVVUSDT Parabolic Trend Management & Dynamic Trailing Stop"
                audit["key_strengths"] = [
                    "High-Energy Active Trade Hook: 'VVV just went absolutely vertical, and this is exactly where real wealth is built in this market... I am actively managing it to squeeze every drop of profit.'",
                    "Dual Technical Perspective: Balances expansion indicators (MACD wide open, EMA cluster fanning) with explicit exhaustion warnings (RSI6 at 76.16, piercing Bollinger Band).",
                    "Dynamic Stop-Loss Rule: Uses EMA7 (24.650) as an active trailing floor instead of static price targets ('I do not try to guess the top. Guessing tops is how you lose money.').",
                    "Disciplined Capital Preservation & FOMO Warning: Warns followers who missed the blast not to FOMO chase green candles, but to wait for a micro-pullback or flag.",
                    "Earned 41 Likes, demonstrating high community resonance for momentum/trend execution."
                ]
                audit["contrasts_with_day4"] = [
                    "Day 4 posts used static take-profit and entry tables. This post teaches active trade management and trailing dynamic stops.",
                    "Day 4 lacked urgent psychological guardrails ('do not FOMO chase this massive green candle').",
                    "Incorporates both $VVVUSDT and $ETHUSDT with #ByXIMPACT #IMPACTbyTrade."
                ]
                
            audit_results.append(audit)
            
        return {
            "creator": data.get("creator_profile", {}),
            "posts_analyzed": audit_results,
            "universal_creator_patterns": [
                "1. Always include official campaign hashtags: #ByXIMPACT #IMPACTbyTrade.",
                "2. Keep readability between Grade 3 and Grade 7 (avoid academic textbook phrasing).",
                "3. Express personal positioning ('I already have my trade on this', 'I am actively managing it').",
                "4. Anchor risk in dynamic trader terminology ('aggressively trailing my stop loss', 'the idea is wrong if it closes under X').",
                "5. Provide actionable guidance for non-positioned traders ('do not FOMO chase... wait for a micro-pullback').",
                "6. End with a specific engagement question ('Are you riding this parabolic move, or are you waiting...?').",
                "7. Actively reply to comments in the thread to unlock Bybit's 3x community comment weighting."
            ]
        }

if __name__ == "__main__":
    analyzer = BybitUserPostAnalyzer()
    res = analyzer.generate_comparative_audit()
    print(json.dumps(res, indent=2))
