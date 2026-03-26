#!/usr/bin/env python3
"""Test the generation and parsing pipeline"""

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

def validate_idea_quality(parsed: dict, raw: str) -> tuple[bool, list[str]]:
    """Validate if an idea meets quality standards"""
    issues = []
    
    # Check core fields
    required_fields = ['projectName', 'who', 'pain', 'gap', 'stack']
    missing_core = [field for field in required_fields if not parsed.get(field, '').strip()]
    
    if missing_core:
        issues.append(f"Missing core fields: {missing_core}")
    
    # Check field lengths
    if parsed.get('projectName'):
        if len(parsed['projectName']) < 3:
            issues.append("Project name too short")
        if len(parsed['projectName']) > 100:
            issues.append("Project name too long")
    
    if parsed.get('description'):
        if len(parsed['description']) < 50:
            issues.append("Description too short")
        if len(parsed['description']) > 500:
            issues.append("Description too long")
    
    # Check raw text quality
    if len(raw) < 500:
        issues.append("Raw text too short")
    if len(raw) > 3000:
        issues.append("Raw text too long (likely rambling)")
    
    # Check for required sections in raw
    required_sections = ['PROBLEM STATEMENT', 'Project', 'Stack', 'Deploy', 'Why now', 'Potential']
    missing_sections = [section for section in required_sections if section not in raw]
    if missing_sections:
        issues.append(f"Missing sections in raw: {missing_sections}")
    
    return len(issues) == 0, issues

# Test with a well-formed example
test_raw = """PROBLEM STATEMENT
WHO: Small business owners, freelancers, and solopreneurs trying to grow their ventures
PAIN: They juggle invoicing, client communication, bookkeeping, and marketing manually across scattered tools. Every task eats hours that could be spent on actual work.
GAP: There's no affordable, unified system that handles money management, client relations, and business operations in one place.
IMPACT: They lose revenue through poor cash flow visibility, waste 10+ hours weekly on admin tasks, miss growth opportunities.

Project
"BizFlow Pro" — A unified business management platform that combines invoicing, CRM, bookkeeping, and marketing automation in one dashboard, powered by AI-driven insights and automated workflows.

Stack
Next.js 15, Supabase, Stripe, Prisma, Tailwind CSS, Redis, Resend

Deploy
Vercel for seamless Next.js deployment with edge functions and global CDN for optimal performance.

Docs & Links
• Next.js 15 - App router with server components for optimal performance
• Supabase - Real-time database with row-level security for multi-tenant architecture
• Stripe - Payment processing and subscription management integration

Why now
The rise of AI automation tools and no-code solutions has made complex business workflows accessible to small teams, while remote work has increased demand for unified digital business tools.

Potential
Could democratize enterprise-level business management for small businesses, potentially saving millions of hours in administrative work and enabling better financial decision-making through automated insights."""

print("Testing idea validation pipeline:")
print("=" * 60)

# Parse the test idea
parsed = parse_idea(test_raw)

print("\n" + "=" * 60)
print("PARSED FIELDS:")
for key, value in parsed.items():
    if value:
        print(f"{key}: {value}")
    else:
        print(f"{key}: [MISSING]")

# Validate quality
is_valid, issues = validate_idea_quality(parsed, test_raw)

print("\n" + "=" * 60)
print("QUALITY VALIDATION:")
print(f"Valid: {is_valid}")
if issues:
    print("Issues found:")
    for issue in issues:
        print(f"  - {issue}")
else:
    print("✅ All quality checks passed!")

# Calculate completeness
total_fields = len(parsed)
filled_fields = len([v for v in parsed.values() if v and v.strip()])
completeness = (filled_fields / total_fields) * 100

print(f"\nCompleteness: {completeness:.1f}% ({filled_fields}/{total_fields} fields)")