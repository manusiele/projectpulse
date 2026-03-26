#!/usr/bin/env python3
"""
Fix the core data issues that the format cleanup missed:
- Broken WHO/PAIN/GAP fields with garbled content
- Missing essential fields
- Verbose stack descriptions that weren't properly cleaned
"""

import json
import re

# Complete field reconstructions for problematic entries
COMPLETE_FIXES = {
    "PetSafeConnect": {
        "domain": "Pet Care Services",
        "description": "A unified platform connecting pet owners with veterinary services, grooming, and pet care providers with integrated scheduling and records management.",
        "who": "Pet owners and veterinary clinics managing pet care coordination",
        "pain": "Pet owners struggle to coordinate appointments, track medical records, and communicate with multiple service providers while vets manage scheduling chaos",
        "gap": "No unified platform connects pet owners with veterinary services, grooming, and pet care providers with integrated scheduling and records management",
        "impact": "Pets receive coordinated care, owners easily manage health records, and service providers reduce scheduling conflicts",
        "whyNow": "Post-pandemic pet adoption boom combined with increased demand for professional pet care services creates market opportunity",
        "potential": "Could streamline pet care industry operations while improving health outcomes through better coordination",
        "stack": "React Native, Next.js, Supabase, Stripe, Auth0, Tailwind CSS",
        "deploy": "Vercel + Supabase",
        "docs": "• React Native\n• Next.js\n• Supabase\n• Stripe API"
    },
    "ConfluenceStreamer™": {
        "who": "Remote teams and distributed organizations managing asynchronous collaboration",
        "pain": "Remote teams struggle with information silos, missed updates in async communication, and lack of context in distributed decision-making",
        "gap": "No platform optimizes asynchronous collaboration with intelligent information streaming and context-aware communication",
        "impact": "Teams make informed decisions with complete context, reducing duplicated work and improving async productivity",
        "stack": "Next.js, Supabase, WebSockets, Redis, Tailwind CSS",
        "deploy": "Vercel + Railway"
    },
    "IndieGenius Cloud Suite": {
        "who": "Independent game developers and small studios creating niche games",
        "pain": "Indie developers struggle with project management, asset organization, team collaboration, and marketing their games effectively",
        "gap": "No comprehensive platform designed specifically for indie game development workflow from concept to market launch",
        "impact": "Indie games reach their target audience more effectively while developers focus on creativity instead of admin tasks",
        "stack": "Unity, Next.js, Supabase, Stripe, Discord API, Steam API",
        "deploy": "Vercel + AWS S3"
    },
    "PetGuardian Prime": {
        "who": "Pet care service providers and pet boarding facilities",
        "pain": "Pet care businesses manually manage bookings, struggle with client communication, and lack integrated payment systems",
        "gap": "No comprehensive business management platform designed specifically for pet care service providers",
        "impact": "Pet care businesses operate more efficiently, retain more clients, and scale their operations effectively",
        "stack": "Next.js, Supabase, Stripe, Twilio, Tailwind CSS",
        "deploy": "Vercel + Supabase"
    },
    "Legal Pulse": {
        "who": "Solo legal practitioners and small law firms",
        "pain": "Solo attorneys manually track case deadlines, client communications, and billable hours across disconnected systems",
        "gap": "Current legal software targets large firms rather than solo practitioners' specific workflow challenges",
        "impact": "Solo attorneys reduce malpractice risk, increase billable efficiency, and focus more time on legal work",
        "whyNow": "Growing gig economy in law and shift towards digitization among attorneys creates market opportunity",
        "potential": "Could transform solo legal practice efficiency while reducing compliance risks",
        "stack": "Next.js, Supabase, TypeScript, Tailwind CSS, Stripe",
        "deploy": "Vercel + Supabase",
        "docs": "• Next.js\n• Supabase\n• TypeScript\n• Tailwind CSS"
    },
    "ClientFlow Master": {
        "who": "Consultants and coaches delivering professional services",
        "pain": "Service professionals struggle with session scheduling, client onboarding, progress tracking, and billing across multiple tools",
        "gap": "No unified platform streamlines the complete client lifecycle for service-based professionals",
        "impact": "Consultants spend more time on service delivery and less on administrative tasks while improving client experience",
        "whyNow": "Service-based economy growth and demand for professional coaching creates market opportunity",
        "potential": "Could transform how professional services are delivered and managed globally",
        "stack": "React Native, Supabase, Stripe, Tailwind CSS, Zustand",
        "deploy": "Expo + Supabase",
        "docs": "• React Native\n• Supabase\n• Stripe\n• Zustand"
    },
    "[Podcaster United]": {
        "who": "Podcast creators and audio content producers",
        "pain": "Podcasters struggle with post-production workflow, show notes creation, audience analytics, and monetization coordination",
        "gap": "No integrated platform handles the complete podcast lifecycle from recording to monetization",
        "impact": "Podcasters focus on content creation while automated tools handle production and business operations",
        "whyNow": "Podcast industry growth and AI transcription technology make comprehensive automation viable",
        "potential": "Could democratize professional podcast production for independent creators",
        "stack": "Next.js, Supabase, OpenAI API, Stripe, WebSockets",
        "deploy": "Vercel + Railway"
    }
}

def clean_stack_properly(stack_text: str) -> str:
    """More aggressive stack cleaning"""
    if not stack_text:
        return ""
    
    # Remove everything in parentheses and after dashes
    cleaned = re.sub(r'\([^)]*\)', '', stack_text)
    cleaned = re.sub(r'[-–—].*?(?=\n|$)', '', cleaned, flags=re.MULTILINE)
    
    # Extract just technology names
    tech_names = []
    
    # Common patterns
    patterns = [
        r'\b(?:Next\.js|React(?:\s+Native)?|Vue(?:\.js)?|Angular|Svelte)\b',
        r'\b(?:Node\.js|Express|FastAPI|Django|Flask)\b',
        r'\b(?:Supabase|Firebase|MongoDB|PostgreSQL|MySQL|Redis)\b',
        r'\b(?:Prisma|TypeORM|Sequelize)\b',
        r'\b(?:Tailwind\s*CSS|Bootstrap|Chakra\s*UI)\b',
        r'\b(?:TypeScript|JavaScript|Python|Go|Rust)\b',
        r'\b(?:Stripe|PayPal|Auth0|Clerk)\b',
        r'\b(?:OpenAI|Anthropic|Cohere)\b',
        r'\b(?:WebSockets|GraphQL|tRPC|REST)\b',
        r'\b(?:Zustand|Redux|Recoil)\b',
        r'\b(?:Expo|Electron|Tauri)\b'
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, cleaned, re.IGNORECASE)
        for match in matches:
            if match not in tech_names:
                tech_names.append(match)
    
    if tech_names:
        return ', '.join(tech_names[:6])
    
    # Fallback to simple comma/plus splitting
    if ',' in cleaned:
        parts = [p.strip() for p in cleaned.split(',')]
    elif '+' in cleaned:
        parts = [p.strip() for p in cleaned.split('+')]
    else:
        parts = [cleaned.strip()]
    
    clean_parts = []
    for part in parts[:6]:
        # Remove extra words, keep just the tech name
        part = re.sub(r'\b(?:for|with|using|and|&)\b.*', '', part, flags=re.IGNORECASE).strip()
        if part and len(part) < 30:
            clean_parts.append(part)
    
    return ', '.join(clean_parts) if clean_parts else "Next.js, Supabase, Tailwind CSS"

def fix_core_issues():
    """Fix the fundamental data problems"""
    with open('data/ideas.json', 'r', encoding='utf-8') as f:
        ideas = json.load(f)
    
    fixed_count = 0
    
    for idea in ideas:
        project_name = idea.get('projectName', '')
        
        # Apply complete fixes for known problematic entries
        if project_name in COMPLETE_FIXES:
            fixes = COMPLETE_FIXES[project_name]
            for field, value in fixes.items():
                idea[field] = value
            print(f"✅ Completely fixed {project_name}")
            fixed_count += 1
            continue
        
        # Fix broken WHO fields (common patterns of garbled content)
        who = idea.get('who', '')
        if who and any(phrase in who.lower() for phrase in ['engage with', 'previously relied', 'desire an all-encompassing', 'can rely on']):
            # This is clearly garbled, try to reconstruct from description/domain
            domain = idea.get('domain', '')
            if 'health' in domain.lower():
                idea['who'] = "Health-conscious individuals seeking integrated wellness solutions"
            elif 'business' in domain.lower() or 'management' in domain.lower():
                idea['who'] = "Small business owners and entrepreneurs managing operations"
            elif 'real estate' in domain.lower():
                idea['who'] = "Real estate professionals managing listings and clients"
            elif 'legal' in domain.lower():
                idea['who'] = "Legal professionals and small law firms"
            else:
                idea['who'] = "Professionals seeking specialized software solutions"
            print(f"🔧 Fixed broken WHO field for {project_name}")
            fixed_count += 1
        
        # Clean up verbose stacks that weren't caught before
        stack = idea.get('stack', '')
        if stack and (len(stack) > 200 or '(' in stack or '—' in stack):
            new_stack = clean_stack_properly(stack)
            if new_stack != stack:
                idea['stack'] = new_stack
                print(f"🔧 Re-cleaned stack for {project_name}")
                fixed_count += 1
        
        # Fix missing essential fields with reasonable defaults
        if not idea.get('pain', '').strip():
            domain = idea.get('domain', '')
            if 'health' in domain.lower():
                idea['pain'] = "Users struggle with fragmented health and wellness management across multiple apps and services"
            elif 'business' in domain.lower():
                idea['pain'] = "Business owners waste time on manual processes and disconnected tools for operations management"
            else:
                idea['pain'] = "Users face inefficient workflows and lack of integrated solutions for their specific needs"
            print(f"🔧 Added missing PAIN for {project_name}")
            fixed_count += 1
        
        if not idea.get('gap', '').strip():
            idea['gap'] = "No comprehensive platform addresses these specific workflow challenges with integrated automation"
            print(f"🔧 Added missing GAP for {project_name}")
            fixed_count += 1
        
        if not idea.get('impact', '').strip():
            idea['impact'] = "Users achieve better outcomes with less time spent on administrative tasks and improved workflow efficiency"
            print(f"🔧 Added missing IMPACT for {project_name}")
            fixed_count += 1
    
    # Save updated data
    with open('data/ideas.json', 'w', encoding='utf-8') as f:
        json.dump(ideas, f, indent=2)
    
    print(f"\n✅ Fixed core data issues in {fixed_count} ideas!")
    
    # Also update public file
    try:
        with open('public/ideas.json', 'r', encoding='utf-8') as f:
            public_ideas = json.load(f)
        
        for i, public_idea in enumerate(public_ideas):
            project_name = public_idea.get('projectName', '')
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
    fix_core_issues()