"""
Quick script to convert Telegram messages to ideas.json format.
Run this once to populate ideas.json with historical data.
"""

import json
from datetime import datetime

# Sample idea - you'll need to manually extract the key fields from each Telegram message
# This is just a template showing the structure

ideas = [
    {
        "id": "idea_1709276400",
        "date": "2026-03-01T07:32:00",
        "projectName": "FamilyHarmony Hub",
        "stack": "Next.js + Supabase + Tailwind CSS + Google Analytics + Hotjar + Stripe API + PayPal SDK",
        "deploy": "Vercel / Railway / Render / Northflank",
        "who": "Busy parents juggling family and kids",
        "pain": "They find it challenging to manage schedules, finances, healthcare appointments for children, meal planning across dietary needs, tracking academic progress with reminders.",
        "gap": "No family operating system that centralizes schedules, automates routine planning, tracks child development milestones, and provides gentle reminders for important tasks.",
        "impact": "They miss important appointments, feel constantly overwhelmed, struggle with work-life balance, and worry they're failing their children due to disorganization.",
        "whyNow": "With over half of households in developed nations having children under 18, this problem demands urgent attention as the tech market for family management solutions is underexplored but rapidly expanding.",
        "potential": "Targets around $250K revenue & growing to a user base of over 30k within first year through organic growth, affiliate partnerships, and targeted ads.",
        "raw": "Full telegram message text here..."
    },
    # Add more ideas following the same structure
]

# Write to both data and public folders
with open('data/ideas.json', 'w') as f:
    json.dump(ideas, f, indent=2)

with open('public/ideas.json', 'w') as f:
    json.dump(ideas, f, indent=2)

print(f"✓ Converted {len(ideas)} ideas to JSON format")
print("✓ Saved to data/ideas.json and public/ideas.json")
