#!/usr/bin/env python3
"""Fix the NonprofitNet entry by reconstructing missing fields"""

import json

def fix_nonprofit_entry():
    # Load current data
    with open('data/ideas.json', 'r', encoding='utf-8') as f:
        ideas = json.load(f)
    
    # Find NonprofitNet entry
    nonprofit_idx = None
    for i, idea in enumerate(ideas):
        if idea.get('projectName') == 'NonprofitNet':
            nonprofit_idx = i
            break
    
    if nonprofit_idx is None:
        print("NonprofitNet entry not found")
        return
    
    print("Found NonprofitNet entry, fixing missing fields...")
    
    # Reconstruct missing fields based on the description and domain
    nonprofit_entry = ideas[nonprofit_idx]
    
    # Add missing structured fields
    nonprofit_entry.update({
        "who": "Nonprofit organizations struggling with fragmented donor management and volunteer coordination",
        "pain": "Nonprofits juggle donor data across spreadsheets, manage volunteers through email chains, and struggle to measure impact effectively while spending countless hours on manual grant reporting",
        "gap": "No unified platform combines donor analytics, volunteer management, social media engagement, and automated grant reporting in one affordable solution",
        "stack": "Next.js 15, Supabase, Redis, Stripe, Prisma, NextAuth, Tailwind CSS",
        "deploy": "Vercel for optimal Next.js deployment with serverless functions and global CDN distribution",
        "whyNow": "Post-pandemic digital transformation in nonprofit sector combined with increased demand for transparency and impact measurement makes comprehensive nonprofit management platforms essential",
        "potential": "Could streamline nonprofit operations globally, enabling organizations to focus more resources on their mission rather than administrative overhead while improving donor trust through better transparency",
        "impact": "Nonprofits lose funding opportunities due to poor grant reporting, waste volunteer time through disorganized coordination, and struggle to demonstrate impact to donors"
    })
    
    # Add a reconstructed raw field for debugging
    nonprofit_entry["raw"] = """PROBLEM STATEMENT
WHO: Nonprofit organizations struggling with fragmented donor management and volunteer coordination
PAIN: Nonprofits juggle donor data across spreadsheets, manage volunteers through email chains, and struggle to measure impact effectively while spending countless hours on manual grant reporting
GAP: No unified platform combines donor analytics, volunteer management, social media engagement, and automated grant reporting in one affordable solution
IMPACT: Nonprofits lose funding opportunities due to poor grant reporting, waste volunteer time through disorganized coordination, and struggle to demonstrate impact to donors

Project
"NonprofitNet" — A one-stop platform that synergizes donor data analytics, seamless volunteer management, real-time social media engagement tools and an easy-to-use impact measurement dashboard with automated grant reporting for streamlined nonprofit operations.

Stack
Next.js 15, Supabase, Redis, Stripe, Prisma, NextAuth, Tailwind CSS

Deploy
Vercel for optimal Next.js deployment with serverless functions and global CDN distribution

Why now
Post-pandemic digital transformation in nonprofit sector combined with increased demand for transparency and impact measurement makes comprehensive nonprofit management platforms essential

Potential
Could streamline nonprofit operations globally, enabling organizations to focus more resources on their mission rather than administrative overhead while improving donor trust through better transparency"""
    
    # Save updated data
    with open('data/ideas.json', 'w', encoding='utf-8') as f:
        json.dump(ideas, f, indent=2)
    
    print("✅ NonprofitNet entry fixed!")
    print(f"✅ Added missing fields: who, pain, gap, stack, deploy, whyNow, potential, impact, raw")
    
    # Also update public/ideas.json if it exists
    try:
        with open('public/ideas.json', 'r', encoding='utf-8') as f:
            public_ideas = json.load(f)
        
        # Find and update in public file too
        for i, idea in enumerate(public_ideas):
            if idea.get('projectName') == 'NonprofitNet':
                public_ideas[i] = nonprofit_entry.copy()
                break
        
        with open('public/ideas.json', 'w', encoding='utf-8') as f:
            json.dump(public_ideas, f, indent=2)
        
        print("✅ Also updated public/ideas.json")
    except FileNotFoundError:
        print("ℹ️  public/ideas.json not found, skipping")

if __name__ == "__main__":
    fix_nonprofit_entry()