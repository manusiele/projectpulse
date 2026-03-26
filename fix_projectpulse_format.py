#!/usr/bin/env python3
"""
Fix all ideas to match the proper ProjectPulse card format:
- Clean up verbose fields (stack, docs)
- Fix wrong domain assignments
- Ensure all required fields are present and properly formatted
- Remove explanatory text, keep only essential info
"""

import json
import re

# Correct domain mappings
DOMAIN_FIXES = {
    "AgriNet Suite": "Agriculture Tech",
    "FocusFrame": "Photography & Video", 
    "PetSafeConnect": "Pet Care Services",
    "PetGuardian Prime": "Pet Care Services",
    "ConfluenceStreamer™": "Remote Collaboration",
    "IndieGenius Cloud Suite": "Game Development",
    "SkyNet Realty Manager": "Property Management",
    "Family Harmony Hub": "Family Management",
    "LocalLinkUp!": "Local Services",
    "Holistic Harmony": "Health & Wellness",
    "NonprofitNet": "Nonprofit Management",
    "AgentStream": "Real Estate",
    "Legal Pulse": "Legal Services",
    "ClientFlow Master": "Consulting & Coaching",
    "ClientFlow Elevate: A Unified Experience for Professional Service Delivery & Management (2026)": "Consulting & Coaching",
    "[Podcaster United]": "Podcast Production",
    "Therapeutic Harmony Hub": "Health & Wellness",
    "RealtyConnect": "Real Estate"
}

def clean_stack(stack_text: str) -> str:
    """Extract clean tech stack from verbose descriptions"""
    if not stack_text:
        return ""
    
    # Common tech patterns to extract
    tech_patterns = [
        r'Next\.js\s*(?:1[0-9])?',
        r'React(?:\s+Native)?',
        r'Vue(?:\.js)?',
        r'Angular',
        r'Svelte',
        r'Node\.js',
        r'Express',
        r'FastAPI',
        r'Django',
        r'Flask',
        r'Supabase',
        r'Firebase',
        r'MongoDB',
        r'PostgreSQL',
        r'MySQL',
        r'Redis',
        r'Prisma',
        r'Tailwind\s*CSS',
        r'TypeScript',
        r'Python',
        r'Go',
        r'Rust',
        r'Stripe',
        r'Vercel\s*AI\s*SDK',
        r'OpenAI\s*(?:API)?',
        r'Twilio',
        r'SendGrid',
        r'Shopify\s*(?:API)?',
        r'FFmpeg',
        r'Expo',
        r'Electron',
        r'Tauri',
        r'GraphQL',
        r'Apollo',
        r'tRPC',
        r'WebSockets',
        r'NextAuth(?:\.js)?',
        r'Auth0',
        r'Clerk',
        r'Resend',
        r'Nodemailer'
    ]
    
    found_tech = []
    for pattern in tech_patterns:
        matches = re.findall(pattern, stack_text, re.IGNORECASE)
        for match in matches:
            clean_match = match.strip()
            if clean_match and clean_match not in found_tech:
                found_tech.append(clean_match)
    
    # If we found tech, return clean list
    if found_tech:
        return ', '.join(found_tech[:8])  # Limit to 8 items
    
    # Fallback: try to extract from + separated list
    if '+' in stack_text:
        parts = [part.strip() for part in stack_text.split('+')]
        clean_parts = []
        for part in parts[:8]:
            # Remove explanatory text in parentheses or after dashes
            clean_part = re.sub(r'\s*[\(\[\-\u2013\u2014].*$', '', part).strip()
            if clean_part and len(clean_part) < 50:  # Reasonable tech name length
                clean_parts.append(clean_part)
        if clean_parts:
            return ', '.join(clean_parts)
    
    # Last resort: return first reasonable sentence
    sentences = stack_text.split('.')
    if sentences:
        first = sentences[0].strip()
        if len(first) < 200:
            return first
    
    return "Next.js, Supabase, Tailwind CSS, Stripe"  # Default fallback

def clean_docs(docs_text: str) -> str:
    """Extract clean documentation links from verbose descriptions"""
    if not docs_text:
        return ""
    
    # Split by bullet points
    items = re.split(r'[•\*\-]\s*', docs_text)
    clean_items = []
    
    for item in items:
        if not item.strip():
            continue
            
        # Extract just the tech name (before dash or explanation)
        tech_name = re.split(r'\s*[-\u2013\u2014]\s*', item)[0].strip()
        
        # Clean up common patterns
        tech_name = re.sub(r'\s*(?:Documentation|Guide|Docs|API)\s*', '', tech_name, flags=re.IGNORECASE)
        tech_name = tech_name.strip()
        
        if tech_name and len(tech_name) < 50:
            clean_items.append(f"• {tech_name}")
    
    return '\n'.join(clean_items[:4])  # Limit to 4 items

def clean_deploy(deploy_text: str) -> str:
    """Extract clean deployment info"""
    if not deploy_text:
        return ""
    
    # Look for platform names
    platforms = ['Vercel', 'Railway', 'Render', 'Fly.io', 'Netlify', 'AWS', 'Cloudflare', 'Supabase', 'Firebase']
    
    found_platforms = []
    for platform in platforms:
        if platform.lower() in deploy_text.lower():
            found_platforms.append(platform)
    
    if found_platforms:
        return ' + '.join(found_platforms[:2])  # Max 2 platforms
    
    # Fallback: return first sentence if reasonable
    sentences = deploy_text.split('.')
    if sentences:
        first = sentences[0].strip()
        if len(first) < 100:
            return first
    
    return "Vercel"  # Default fallback

def fix_all_ideas():
    """Fix all ideas to match ProjectPulse format"""
    # Load current data
    with open('data/ideas.json', 'r', encoding='utf-8') as f:
        ideas = json.load(f)
    
    fixed_count = 0
    
    for idea in ideas:
        project_name = idea.get('projectName', '')
        original_idea = idea.copy()
        
        # Fix domain if wrong
        if project_name in DOMAIN_FIXES:
            idea['domain'] = DOMAIN_FIXES[project_name]
            print(f"Fixed domain for {project_name}: {idea['domain']}")
        
        # Clean up verbose stack
        if idea.get('stack'):
            original_stack = idea['stack']
            idea['stack'] = clean_stack(original_stack)
            if idea['stack'] != original_stack:
                print(f"Cleaned stack for {project_name}")
        
        # Clean up verbose docs
        if idea.get('docs'):
            original_docs = idea['docs']
            idea['docs'] = clean_docs(original_docs)
            if idea['docs'] != original_docs:
                print(f"Cleaned docs for {project_name}")
        
        # Clean up verbose deploy
        if idea.get('deploy'):
            original_deploy = idea['deploy']
            idea['deploy'] = clean_deploy(original_deploy)
            if idea['deploy'] != original_deploy:
                print(f"Cleaned deploy for {project_name}")
        
        # Ensure description is concise (2-3 sentences max)
        if idea.get('description') and len(idea['description']) > 500:
            sentences = idea['description'].split('.')
            if len(sentences) > 3:
                idea['description'] = '. '.join(sentences[:3]) + '.'
                print(f"Shortened description for {project_name}")
        
        # Check if anything changed
        if idea != original_idea:
            fixed_count += 1
    
    # Save updated data
    with open('data/ideas.json', 'w', encoding='utf-8') as f:
        json.dump(ideas, f, indent=2)
    
    print(f"✅ Fixed {fixed_count} ideas to match ProjectPulse format!")
    
    # Also update public/ideas.json if it exists
    try:
        with open('public/ideas.json', 'r', encoding='utf-8') as f:
            public_ideas = json.load(f)
        
        # Apply same fixes to public file
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
    fix_all_ideas()