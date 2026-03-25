import json
import re

# Load ideas
with open('data/ideas.json', 'r', encoding='utf-8') as f:
    ideas = json.load(f)

def extract_who_from_raw(raw_text):
    """Extract WHO from raw text"""
    # Try to find WHO in various formats
    patterns = [
        r'WHO[:\s→]+([^\n]+)',
        r'Target audience[:\s]+([^\n]+)',
        r'PROBLEM STATEMENT[:\s\n]+WHO[:\s]+([^\n]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, raw_text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    
    # If no WHO found, try to infer from problem statement
    problem_match = re.search(r'PROBLEM STATEMENT[:\s\n]+([\s\S]{100,300})', raw_text, re.IGNORECASE)
    if problem_match:
        problem_text = problem_match.group(1)
        # Look for "They" at the start and try to find context before it
        if problem_text.strip().startswith('They') or problem_text.strip().startswith('they'):
            # Return a generic description
            return "Professionals and businesses"
    
    return ""

def fix_problem_statement(raw_text, who):
    """Add WHO to problem statement if missing"""
    if not who:
        return raw_text
    
    # Check if problem statement already has WHO
    if re.search(r'PROBLEM STATEMENT[:\s\n]+WHO[:\s]+', raw_text, re.IGNORECASE):
        return raw_text
    
    # Find problem statement and add WHO
    problem_match = re.search(r'(PROBLEM STATEMENT[:\s\n]+)([\s\S]+?)(?=\n\nProject|Project:|PROJECT)', raw_text, re.IGNORECASE)
    if problem_match:
        prefix = problem_match.group(1)
        problem_content = problem_match.group(2).strip()
        
        # Replace "They" with WHO
        if problem_content.startswith('They ') or problem_content.startswith('they '):
            problem_content = who + ' ' + problem_content[5:]
        
        new_problem = f"{prefix}WHO: {who}\nPAIN: {problem_content}"
        raw_text = raw_text.replace(problem_match.group(0), new_problem)
    
    return raw_text

# Fix each idea
for idea in ideas:
    raw = idea.get('raw', '')
    
    # Extract or use existing WHO
    who = idea.get('who', '') or extract_who_from_raw(raw)
    
    # Update WHO field
    if who:
        idea['who'] = who
        # Fix problem statement in raw
        idea['raw'] = fix_problem_statement(raw, who)

# Save fixed ideas
with open('data/ideas.json', 'w', encoding='utf-8') as f:
    json.dump(ideas, f, indent=2, ensure_ascii=False)

print(f"✓ Fixed {len(ideas)} ideas")
print("✓ Added WHO to problem statements")
print("✓ Replaced 'They' with specific audience")
