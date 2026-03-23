import json
import re
import subprocess
from datetime import datetime, timezone

def check_workflow_schedule_risk():
    """Warn if running close to workflow schedule (07:00 UTC)"""
    now = datetime.now(timezone.utc)
    # Workflow runs at 07:00 UTC - warn if within 10 minutes
    minutes_to_run = (7 * 60) - (now.hour * 60 + now.minute)
    minutes_to_run = minutes_to_run % (24 * 60)  # wrap around midnight
    
    if minutes_to_run <= 10:
        print(f"⚠️  WARNING: Workflow runs in ~{minutes_to_run} min (07:00 UTC)!")
        confirm = input("Continue anyway? (y/N): ")
        if confirm.lower() != 'y':
            print("Aborted. Run after 07:10 UTC to be safe.")
            exit(0)

def check_git_is_clean():
    """Ensure git working directory is clean"""
    result = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True)
    if result.stdout.strip():
        print("❌ Uncommitted changes detected. Pull and stage first:")
        print("   git pull && python reparse_ideas.py")
        exit(1)

# Safety checks before proceeding
check_workflow_schedule_risk()
check_git_is_clean()

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
    
    # Extract project name and description from various formats
    # Format: Project "ProjectName" – Description (handles all dash types)
    project_patterns = [
        r'Project:\s*["\u201c]([^"\u201d]+)["\u201d]\s*[-\u2013\u2014—–]\s*(.+?)(?=\n\n|\nStack)',
        r'Project\s+["\u201c]([^"\u201d]+)["\u201d]\s*[-\u2013\u2014—–]\s*(.+?)(?=\n\n|\nStack)',
        r'Project:\s*["\u201c]([^"\u201d]+)["\u201d]',
        r'Project\s+["\u201c]([^"\u201d]+)["\u201d]',
        r'PROJECT\s*\u2192\s*(.+?)(?:\n|$)',
        r'Project\s*\u2192\s*(.+?)(?:\n|$)',
    ]
    for pattern in project_patterns:
        match = re.search(pattern, raw, re.IGNORECASE | re.DOTALL)
        if match:
            if len(match.groups()) == 2:
                result["projectName"] = match.group(1).strip()
                result["description"] = match.group(2).strip()
            else:
                full_text = match.group(1).strip()
                # Try to split on - or —
                if ' - ' in full_text or ' — ' in full_text or ' \u2014 ' in full_text:
                    parts = re.split(r'\s*[-\u2014]\s*', full_text, 1)
                    result["projectName"] = parts[0].strip().strip('""\u201c\u201d')
                    result["description"] = parts[1].strip() if len(parts) > 1 else ""
                else:
                    result["projectName"] = full_text.strip('""\u201c\u201d')
            break
    
    # Extract project name from various formats
    project_patterns = [
        r'Project:\s*["\u201c]?([^"\u201d\n]+)["\u201d]?',
        r'PROJECT\s*\u2192\s*(.+?)(?:\n|$)',
        r'Project\s*\u2192\s*(.+?)(?:\n|$)',
    ]
    for pattern in project_patterns:
        match = re.search(pattern, raw, re.IGNORECASE)
        if match:
            result["projectName"] = match.group(1).strip()
            break
    
    # Extract Stack section (handles multi-line, case-insensitive section headers, with or without colon)
    stack_match = re.search(r'(?:Stack|STACK)\s*:?\s*\n\s*(.+?)(?=\n\s*(?:Deploy|DEPLOY|Docs|DOCS|Why now|WHY NOW|Potential|POTENTIAL|Target|TARGET)|$)', raw, re.IGNORECASE | re.DOTALL)
    if stack_match:
        result["stack"] = stack_match.group(1).strip().replace('\n', ' ')
    
    # Extract Deploy section (handles multi-line, case-insensitive section headers, with or without colon)
    deploy_match = re.search(r'(?:Deploy|DEPLOY)\s*:?\s*\n\s*(.+?)(?=\n\s*(?:Docs|DOCS|Why now|WHY NOW|Potential|POTENTIAL|Target|TARGET)|$)', raw, re.IGNORECASE | re.DOTALL)
    if deploy_match:
        result["deploy"] = deploy_match.group(1).strip().replace('\n', ' ')
    
    # Extract docs section (with or without colon)
    docs_match = re.search(r'(?:Docs & Links|DOCS & LINKS)\s*:?\s*\n\s*((?:\u2022.+(?:\n|$))+)', raw, re.IGNORECASE)
    if docs_match:
        result["docs"] = docs_match.group(1).strip()
    
    # Extract Why now section (handles multi-line, case-insensitive, with or without colon)
    why_match = re.search(r'(?:Why now|WHY NOW)\s*:?\s*\n\s*(.+?)(?=\n\s*(?:Potential|POTENTIAL|Target|TARGET)|$)', raw, re.IGNORECASE | re.DOTALL)
    if why_match:
        result["whyNow"] = why_match.group(1).strip().replace('\n', ' ')
    
    # Extract Potential section (handles multi-line, case-insensitive, with or without colon)
    potential_match = re.search(r'(?:Potential|POTENTIAL)\s*:?\s*\n\s*(.+?)(?=\n\s*(?:Target audience|TARGET AUDIENCE|Next idea|NEXT IDEA)|$)', raw, re.IGNORECASE | re.DOTALL)
    if potential_match:
        result["potential"] = potential_match.group(1).strip().replace('\n', ' ')
    
    for line in raw.split("\n"):
        line = line.strip()
        sep = "\u2192" if "\u2192" in line else ("->" if "->" in line else None)
        if not sep:
            continue
        
        key, _, value = line.partition(sep)
        key = key.strip().lower().rstrip(":")
        value = value.strip()
        
        if not value:
            continue
        
        if key == "stack" and not result["stack"]:
            result["stack"] = value
        elif key == "deploy" and not result["deploy"]:
            result["deploy"] = value
        elif key == "who":
            result["who"] = value
        elif key == "pain":
            result["pain"] = value
        elif key == "gap":
            result["gap"] = value
        elif key in ("impact if unsolved", "impact"):
            result["impact"] = value
        elif key == "why now" and not result["whyNow"]:
            result["whyNow"] = value
        elif key == "potential" and not result["potential"]:
            result["potential"] = value
    
    return result

# Load ideas
with open('data/ideas.json', 'r', encoding='utf-8-sig') as f:
    ideas = json.load(f)

# Re-parse all ideas
for idea in ideas:
    parsed = parse_idea(idea['raw'])
    idea.update(parsed)
    print(f"Updated: {idea['projectName']}")

# Save updated ideas
with open('data/ideas.json', 'w', encoding='utf-8') as f:
    json.dump(ideas, f, indent=2)

with open('public/ideas.json', 'w', encoding='utf-8') as f:
    json.dump(ideas, f, indent=2)

print("\n✓ All ideas re-parsed and saved!")
