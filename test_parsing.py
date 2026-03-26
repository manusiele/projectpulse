#!/usr/bin/env python3
"""Test the updated parsing function"""

import re
from datetime import datetime

def parse_idea(raw: str) -> dict:
    """Extract structured fields from the LLM-generated idea text."""
    result = {
        "projectName": "",
        "description": "",
        "stack": "",
        "deploy": "",
        "who": "",
        "pain": "",
        "gap": "",
        "impact": "",
        "whyNow": "",
        "potential": "",
        "docs": "",
    }
    
    print(f"DEBUG: Parsing idea with {len(raw)} characters")
    
    # Extract PROBLEM STATEMENT fields (WHO, PAIN, GAP, IMPACT)
    problem_section = re.search(r'PROBLEM STATEMENT\s*\n(.*?)(?=\n\s*Project|\n\s*PROJECT|$)', raw, re.IGNORECASE | re.DOTALL)
    if problem_section:
        problem_text = problem_section.group(1)
        
        # Extract WHO
        who_match = re.search(r'WHO:\s*(.+?)(?=\nPAIN:|\nGAP:|\nIMPACT:|$)', problem_text, re.IGNORECASE | re.DOTALL)
        if who_match:
            result["who"] = who_match.group(1).strip().replace('\n', ' ')
            print(f"DEBUG: Found WHO: '{result['who'][:50]}...'")
        
        # Extract PAIN
        pain_match = re.search(r'PAIN:\s*(.+?)(?=\nGAP:|\nIMPACT:|\nWHO:|$)', problem_text, re.IGNORECASE | re.DOTALL)
        if pain_match:
            result["pain"] = pain_match.group(1).strip().replace('\n', ' ')
            print(f"DEBUG: Found PAIN: '{result['pain'][:50]}...'")
        
        # Extract GAP
        gap_match = re.search(r'GAP:\s*(.+?)(?=\nIMPACT:|\nWHO:|\nPAIN:|$)', problem_text, re.IGNORECASE | re.DOTALL)
        if gap_match:
            result["gap"] = gap_match.group(1).strip().replace('\n', ' ')
            print(f"DEBUG: Found GAP: '{result['gap'][:50]}...'")
        
        # Extract IMPACT
        impact_match = re.search(r'IMPACT:\s*(.+?)(?=\nWHO:|\nPAIN:|\nGAP:|$)', problem_text, re.IGNORECASE | re.DOTALL)
        if impact_match:
            result["impact"] = impact_match.group(1).strip().replace('\n', ' ')
            print(f"DEBUG: Found IMPACT: '{result['impact'][:50]}...'")
    
    # Extract project name and description from various formats
    project_patterns = [
        r'Project\s*\n\s*["\u201c]([^"\u201d]+)["\u201d]\s*[-\u2013\u2014—–]\s*(.+?)(?=\n\s*Stack|\n\s*STACK|$)',
        r'Project:\s*["\u201c]([^"\u201d]+)["\u201d]\s*[-\u2013\u2014—–]\s*(.+?)(?=\n\s*Stack|\n\s*STACK|$)',
        r'Project\s+["\u201c]([^"\u201d]+)["\u201d]\s*[-\u2013\u2014—–]\s*(.+?)(?=\n\s*Stack|\n\s*STACK|$)',
        r'Project\s*\n\s*["\u201c]([^"\u201d]+)["\u201d]',
        r'Project:\s*["\u201c]([^"\u201d]+)["\u201d]',
        r'Project\s+["\u201c]([^"\u201d]+)["\u201d]',
    ]
    
    for pattern in project_patterns:
        match = re.search(pattern, raw, re.IGNORECASE | re.DOTALL)
        if match:
            result["projectName"] = match.group(1).strip()
            if len(match.groups()) >= 2 and match.group(2):
                result["description"] = match.group(2).strip().replace('\n', ' ')
            print(f"DEBUG: Found project name: '{result['projectName']}'")
            if result["description"]:
                print(f"DEBUG: Found description: '{result['description'][:50]}...'")
            break
    
    # Extract Stack section
    stack_match = re.search(r'Stack\s*\n\s*(.+?)(?=\n\s*Deploy|\n\s*DEPLOY|\n\s*Docs|\n\s*DOCS|\n\s*Why now|\n\s*WHY NOW|$)', raw, re.IGNORECASE | re.DOTALL)
    if stack_match:
        result["stack"] = stack_match.group(1).strip().replace('\n', ' ')
        print(f"DEBUG: Found stack: '{result['stack'][:50]}...'")
    
    # Extract Deploy section
    deploy_match = re.search(r'Deploy\s*\n\s*(.+?)(?=\n\s*Docs|\n\s*DOCS|\n\s*Why now|\n\s*WHY NOW|\n\s*Potential|\n\s*POTENTIAL|$)', raw, re.IGNORECASE | re.DOTALL)
    if deploy_match:
        result["deploy"] = deploy_match.group(1).strip().replace('\n', ' ')
        print(f"DEBUG: Found deploy: '{result['deploy'][:50]}...'")
    
    # Extract Docs & Links section
    docs_match = re.search(r'Docs & Links\s*\n\s*((?:\u2022.+(?:\n|$))+)', raw, re.IGNORECASE)
    if docs_match:
        result["docs"] = docs_match.group(1).strip()
        print(f"DEBUG: Found docs section")
    
    # Extract Why now section
    why_match = re.search(r'Why now\s*\n\s*(.+?)(?=\n\s*Potential|\n\s*POTENTIAL|\n\s*Target|\n\s*TARGET|$)', raw, re.IGNORECASE | re.DOTALL)
    if why_match:
        result["whyNow"] = why_match.group(1).strip().replace('\n', ' ')
        print(f"DEBUG: Found why now: '{result['whyNow'][:50]}...'")
    
    # Extract Potential section
    potential_match = re.search(r'Potential\s*\n\s*(.+?)(?=\n\s*Target|\n\s*TARGET|$)', raw, re.IGNORECASE | re.DOTALL)
    if potential_match:
        result["potential"] = potential_match.group(1).strip().replace('\n', ' ')
        print(f"DEBUG: Found potential: '{result['potential'][:50]}...'")
    
    print(f"DEBUG: Final parsed result - projectName: '{result['projectName']}'")
    return result

# Test with sample text matching the current prompt format
sample_text = """PROBLEM STATEMENT
WHO: Health-conscious professionals aged 25-45 seeking personalized fitness guidance
PAIN: Generic fitness apps don't adapt to individual needs; expensive trainers are inaccessible
GAP: No affordable, AI-powered personal training solution that combines fitness + mental wellness
IMPACT: Continued health deterioration and mental wellness neglect

Project
"PersonalFit AI" — An AI-powered personal training platform that combines fitness tracking with mental wellness support, providing personalized workout plans and nutrition guidance tailored to individual needs and constraints.

Stack
Next.js 15, Supabase, OpenAI API, Stripe, Tailwind CSS, Redis, Prisma

Deploy
Vercel for optimal Next.js deployment with serverless functions and global CDN distribution.

Docs & Links
• Next.js 15 - Server-side rendering with app router for optimal performance
• Supabase - Real-time database for user progress tracking and social features
• OpenAI API - Personalized workout and nutrition plan generation

Why now
Post-pandemic fitness boom combined with AI accessibility reaching mainstream adoption makes personalized health tech viable for mass market.

Potential
Could transform how people approach fitness by making personalized training accessible to everyone, potentially reducing healthcare costs through preventive wellness."""

print("Testing parsing function:")
print("=" * 60)
result = parse_idea(sample_text)

print("\nParsed Results:")
print("=" * 60)
for key, value in result.items():
    if value:
        print(f"{key}: {value}")
    else:
        print(f"{key}: [MISSING]")