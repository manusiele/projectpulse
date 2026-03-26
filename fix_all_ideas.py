#!/usr/bin/env python3
"""Fix all broken idea entries by reconstructing missing PROBLEM STATEMENT fields"""

import json

# Mapping of project names to their problem statement fields
PROBLEM_FIXES = {
    "AgentStream": {
        "who": "Real estate agents and property managers struggling with lead generation and client management",
        "pain": "Real estate professionals manually track leads across spreadsheets, struggle to provide personalized property recommendations, and waste time on unqualified prospects",
        "gap": "No integrated platform combines property listings with AI-powered lead qualification and personalized recommendations for real estate professionals",
        "impact": "Agents lose potential sales due to poor lead management, spend excessive time on unqualified leads, and cannot provide competitive personalized service"
    },
    "PetSafeConnect": {
        "who": "Pet owners and veterinary clinics managing pet care coordination",
        "pain": "Pet owners struggle to coordinate appointments, track medical records, and communicate with multiple service providers while vets manage scheduling chaos",
        "gap": "No unified platform connects pet owners with veterinary services, grooming, and pet care providers with integrated scheduling and records management",
        "impact": "Pets receive fragmented care, owners miss important health milestones, and service providers lose revenue through poor coordination"
    },
    "ConfluenceStreamer™": {
        "who": "Remote teams and distributed organizations managing asynchronous collaboration",
        "pain": "Remote teams struggle with information silos, missed updates in async communication, and lack of context in distributed decision-making processes",
        "gap": "No platform optimizes asynchronous collaboration with intelligent information streaming and context-aware communication for distributed teams",
        "impact": "Teams make decisions with incomplete information, duplicate work due to poor communication, and lose productivity in async workflows"
    },
    "IndieGenius Cloud Suite": {
        "who": "Independent game developers and small studios creating niche games",
        "pain": "Indie developers struggle with project management, asset organization, team collaboration, and marketing their games to the right audience",
        "gap": "No comprehensive platform designed specifically for indie game development workflow from concept to market launch",
        "impact": "Indie games fail to reach their audience, developers waste time on non-development tasks, and small studios struggle to compete with larger companies"
    },
    "PetGuardian Prime": {
        "who": "Pet care service providers and pet boarding facilities",
        "pain": "Pet care businesses manually manage bookings, struggle with client communication, and lack integrated payment and scheduling systems",
        "gap": "No comprehensive business management platform designed specifically for pet care service providers with integrated booking and client management",
        "impact": "Pet care businesses lose clients due to poor organization, miss revenue opportunities, and struggle to scale their operations"
    },
    "FocusFrame": {
        "who": "Freelance photographers and videographers managing client projects",
        "pain": "Creative professionals juggle client communications, project timelines, file sharing, and invoicing across multiple disconnected tools",
        "gap": "No unified platform designed for creative freelancers that combines project management, client communication, and business operations",
        "impact": "Creatives lose time on admin tasks, miss project deadlines, and struggle to maintain professional client relationships"
    },
    "Holistic Harmony": {
        "who": "Health-conscious individuals seeking integrated wellness solutions",
        "pain": "People struggle to coordinate fitness, nutrition, and mental health goals across separate apps and services without personalized guidance",
        "gap": "No platform integrates physical fitness, nutrition planning, and mental wellness with AI-powered personalization for holistic health management",
        "impact": "Individuals fail to achieve wellness goals due to fragmented approaches, lack of personalization, and poor habit formation support"
    },
    "SkyNet Realty Manager": {
        "who": "Property managers and landlords managing multiple rental properties",
        "pain": "Property managers manually track rent payments, maintenance requests, tenant communications, and property performance across spreadsheets and emails",
        "gap": "No comprehensive property management platform combines tenant management, maintenance coordination, and financial tracking with automation",
        "impact": "Property managers lose revenue through missed rent collections, delayed maintenance increases costs, and poor tenant relations lead to higher turnover"
    },
    "AgriNet Suite": {
        "who": "Small-scale farmers and agricultural cooperatives",
        "pain": "Farmers struggle with unpredictable weather, volatile market prices, limited access to agricultural inputs, and lack of supply chain transparency",
        "gap": "No integrated platform provides farmers with weather insights, market data, supply chain management, and cooperative coordination tools",
        "impact": "Farmers face crop losses due to poor planning, miss market opportunities, and struggle to access fair pricing for their products"
    },
    "Family Harmony Hub": {
        "who": "Busy parents managing multiple aspects of family life",
        "pain": "Parents struggle to coordinate school activities, medical appointments, meal planning, and budgets while monitoring children's development and activities",
        "gap": "No comprehensive family management platform integrates scheduling, budgeting, child development tracking, and household coordination",
        "impact": "Families miss important appointments, overspend due to poor budgeting, and children's development needs are overlooked in busy schedules"
    },
    "LocalLinkUp!": {
        "who": "Local service professionals seeking online visibility and client acquisition",
        "pain": "Service professionals rely on word-of-mouth but struggle with online visibility, lack reliable booking systems, and miss potential clients",
        "gap": "No platform specifically designed for local service providers combines online presence, booking management, and client relationship tools",
        "impact": "Local businesses lose clients to larger competitors, miss revenue opportunities, and struggle to grow beyond their immediate network"
    }
}

def fix_all_ideas():
    """Fix all broken idea entries"""
    # Load current data
    with open('data/ideas.json', 'r', encoding='utf-8') as f:
        ideas = json.load(f)
    
    fixed_count = 0
    
    for i, idea in enumerate(ideas):
        project_name = idea.get('projectName', '')
        
        # Check if this idea needs fixing (missing core fields)
        missing_fields = []
        core_fields = ['who', 'pain', 'gap']
        
        for field in core_fields:
            if not idea.get(field, '').strip():
                missing_fields.append(field)
        
        if missing_fields and project_name in PROBLEM_FIXES:
            print(f"Fixing {project_name}...")
            
            # Add the missing problem statement fields
            fixes = PROBLEM_FIXES[project_name]
            for field, value in fixes.items():
                idea[field] = value
            
            # Ensure we have other essential fields
            if not idea.get('stack', '').strip():
                # Extract stack from description or docs if possible
                description = idea.get('description', '')
                docs = idea.get('docs', '')
                
                # Try to extract technologies mentioned
                tech_keywords = ['Next.js', 'Supabase', 'Stripe', 'Tailwind', 'Redis', 'Prisma', 'Vercel']
                found_tech = [tech for tech in tech_keywords if tech in description or tech in docs]
                
                if found_tech:
                    idea['stack'] = ', '.join(found_tech)
                else:
                    idea['stack'] = 'Next.js 15, Supabase, Tailwind CSS, Stripe'
            
            if not idea.get('deploy', '').strip():
                idea['deploy'] = 'Vercel for optimal Next.js deployment with serverless functions and global CDN'
            
            if not idea.get('whyNow', '').strip():
                idea['whyNow'] = 'Digital transformation trends and increased demand for specialized software solutions make this the right time for innovative platforms'
            
            if not idea.get('potential', '').strip():
                idea['potential'] = 'Could significantly improve efficiency and user experience in this market segment while enabling better business outcomes'
            
            # Add reconstructed raw field if missing
            if not idea.get('raw', '').strip():
                idea['raw'] = f"""PROBLEM STATEMENT
WHO: {idea['who']}
PAIN: {idea['pain']}
GAP: {idea['gap']}
IMPACT: {idea.get('impact', 'Users struggle with inefficient processes and missed opportunities')}

Project
"{project_name}" — {idea.get('description', 'A comprehensive platform solution')}

Stack
{idea['stack']}

Deploy
{idea['deploy']}

Why now
{idea['whyNow']}

Potential
{idea['potential']}"""
            
            fixed_count += 1
    
    # Save updated data
    with open('data/ideas.json', 'w', encoding='utf-8') as f:
        json.dump(ideas, f, indent=2)
    
    print(f"✅ Fixed {fixed_count} ideas!")
    
    # Also update public/ideas.json if it exists
    try:
        with open('public/ideas.json', 'r', encoding='utf-8') as f:
            public_ideas = json.load(f)
        
        # Apply same fixes to public file
        for i, idea in enumerate(public_ideas):
            project_name = idea.get('projectName', '')
            if project_name in PROBLEM_FIXES:
                # Find corresponding fixed idea from data/ideas.json
                for fixed_idea in ideas:
                    if fixed_idea.get('projectName') == project_name:
                        public_ideas[i] = fixed_idea.copy()
                        break
        
        with open('public/ideas.json', 'w', encoding='utf-8') as f:
            json.dump(public_ideas, f, indent=2)
        
        print("✅ Also updated public/ideas.json")
    except FileNotFoundError:
        print("ℹ️  public/ideas.json not found, skipping")

if __name__ == "__main__":
    fix_all_ideas()