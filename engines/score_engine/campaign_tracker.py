"""
Campaign Milestone & Weekly Roadmap Tracker
===========================================
Tracks progress toward the 150-point prize floor ($400 cash bonus):
  • Day 1: 9.0 pts (5 posts, archive)
  • Day 2: 11.0 pts (10 posts, archive)
  • Day 3: 10.0 pts (9 posts, archive)
  • Day 4 (Today): 30.0 pts (projected target)
  • Days 5–10: 30.0 pts/day trajectory
  • Total Projected: 210.0 / 150.0 Pts (+60 Pts Safety Margin)
"""

from typing import Dict, Any, List


class CampaignTrackerModule:
    PRIZE_FLOOR_POINTS = 150.0
    BONUS_REWARD_USD = 400.0

    def __init__(self, historical_scores: Dict[str, float] = None):
        self.scores = historical_scores or {
            "day1": 9.0,
            "day2": 11.0,
            "day3": 10.0,
            "day4": 30.0
        }

    def compute_campaign_trajectory(self) -> Dict[str, Any]:
        accumulated_to_date = sum(self.scores.values())
        days_remaining = 6 # Days 5 through 10
        projected_daily_rate = 30.0
        projected_future_points = days_remaining * projected_daily_rate
        final_projected_total = round(accumulated_to_date + projected_future_points, 1)

        progress_percent = round((accumulated_to_date / self.PRIZE_FLOOR_POINTS) * 100, 1)
        is_floor_secured = final_projected_total >= self.PRIZE_FLOOR_POINTS

        daily_roadmap = [
            {"day": "Day 1 (Oct 26)", "status": "Archived", "posts": 5, "score": self.scores.get("day1", 9.0), "pts_per_post": 1.80},
            {"day": "Day 2 (Oct 27)", "status": "Archived", "posts": 10, "score": self.scores.get("day2", 11.0), "pts_per_post": 1.10},
            {"day": "Day 3 (Oct 28)", "status": "Archived", "posts": 9, "score": self.scores.get("day3", 10.0), "pts_per_post": 1.11},
            {"day": "Day 4 (Oct 29)", "status": "Active (Calibrated)", "posts": 10, "score": self.scores.get("day4", 30.0), "pts_per_post": 3.00},
            {"day": "Day 5 (Oct 30)", "status": "Projected", "posts": 10, "score": 30.0, "pts_per_post": 3.00},
            {"day": "Day 6 (Oct 31)", "status": "Projected", "posts": 10, "score": 30.0, "pts_per_post": 3.00},
            {"day": "Day 7 (Nov 01)", "status": "Projected", "posts": 10, "score": 30.0, "pts_per_post": 3.00},
            {"day": "Day 8 (Nov 02)", "status": "Projected", "posts": 10, "score": 30.0, "pts_per_post": 3.00},
            {"day": "Day 9 (Nov 03)", "status": "Projected", "posts": 10, "score": 30.0, "pts_per_post": 3.00},
            {"day": "Day 10 (Nov 04)", "status": "Projected", "posts": 10, "score": 30.0, "pts_per_post": 3.00}
        ]

        return {
            "accumulated_points_to_date": accumulated_to_date,
            "prize_floor_points": self.PRIZE_FLOOR_POINTS,
            "progress_to_floor_percent": progress_percent,
            "final_projected_points": final_projected_total,
            "safety_margin_over_floor": round(final_projected_total - self.PRIZE_FLOOR_POINTS, 1),
            "floor_secured": is_floor_secured,
            "prize_reward_usd": self.BONUS_REWARD_USD,
            "roadmap": daily_roadmap
        }
