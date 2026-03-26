#!/usr/bin/env python3
"""
Validation script to check if generated ideas have all required fields
and identify parsing issues in FocusLock project ideas.
"""

import json
import sys
from typing import Dict, List

def load_ideas() -> List[Dict]:
    """Load ideas from data/ideas.json"""
    try:
        with open('data/ideas.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ data/ideas.json not found")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON in data/ideas.json: {e}")
        sys.exit(1)

def check_required_fields(idea: Dict) -> Dict[str, bool]:
    """Check if idea has all required fields with meaningful content"""
    required_fields = {
        'projectName': False,
        'who': False,
        'pain': False,
        'gap': False,
        'stack': False,
        'deploy': False,
        'whyNow': False,
        'potential': False,
        'description': False
    }
    
    for field in required_fields:
        value = idea.get(field, '')
        # Check if field exists and has meaningful content (not empty or just whitespace)
        if value and isinstance(value, str) and value.strip():
            required_fields[field] = True
    
    return required_fields

def analyze_idea_quality(idea: Dict) -> Dict:
    """Analyze the quality and completeness of an idea"""
    fields = check_required_fields(idea)
    missing_fields = [field for field, present in fields.items() if not present]
    
    # Check description quality
    description = idea.get('description', '')
    has_core_mechanic = False
    if description:
        # Look for action words that indicate a clear solution
        action_indicators = ['upload', 'scan', 'analyze', 'generate', 'convert', 'track', 'automate', 'connect']
        has_core_mechanic = any(word in description.lower() for word in action_indicators)
    
    return {
        'id': idea.get('id', 'unknown'),
        'projectName': idea.get('projectName', 'Unknown'),
        'date': idea.get('date', 'Unknown'),
        'missing_fields': missing_fields,
        'field_count': len(fields) - len(missing_fields),
        'total_fields': len(fields),
        'completeness_pct': round((len(fields) - len(missing_fields)) / len(fields) * 100, 1),
        'has_core_mechanic': has_core_mechanic,
        'description_length': len(description),
        'raw_length': len(idea.get('raw', ''))
    }

def main():
    ideas = load_ideas()
    
    print(f"📊 Analyzing {len(ideas)} ideas...\n")
    
    # Analyze all ideas
    analyses = [analyze_idea_quality(idea) for idea in ideas]
    
    # Find problematic ideas (missing 3+ fields or no core mechanic)
    problematic = [a for a in analyses if len(a['missing_fields']) >= 3 or not a['has_core_mechanic']]
    
    # Recent ideas (last 5)
    recent = analyses[-5:]
    
    print("🔍 RECENT IDEAS ANALYSIS (Last 5):")
    print("=" * 60)
    for analysis in recent:
        status = "✅" if len(analysis['missing_fields']) <= 2 and analysis['has_core_mechanic'] else "❌"
        print(f"{status} {analysis['projectName']}")
        print(f"   Date: {analysis['date']}")
        print(f"   Completeness: {analysis['completeness_pct']}% ({analysis['field_count']}/{analysis['total_fields']} fields)")
        print(f"   Core mechanic: {'Yes' if analysis['has_core_mechanic'] else 'No'}")
        if analysis['missing_fields']:
            print(f"   Missing: {', '.join(analysis['missing_fields'])}")
        print()
    
    if problematic:
        print(f"\n⚠️  PROBLEMATIC IDEAS ({len(problematic)} found):")
        print("=" * 60)
        for analysis in problematic[-10:]:  # Show last 10 problematic ones
            print(f"❌ {analysis['projectName']} ({analysis['date']})")
            print(f"   Completeness: {analysis['completeness_pct']}%")
            print(f"   Missing: {', '.join(analysis['missing_fields'])}")
            print()
    
    # Summary stats
    avg_completeness = sum(a['completeness_pct'] for a in analyses) / len(analyses)
    ideas_with_mechanic = sum(1 for a in analyses if a['has_core_mechanic'])
    
    print("📈 SUMMARY STATISTICS:")
    print("=" * 60)
    print(f"Total ideas: {len(ideas)}")
    print(f"Average completeness: {avg_completeness:.1f}%")
    print(f"Ideas with core mechanic: {ideas_with_mechanic}/{len(ideas)} ({ideas_with_mechanic/len(ideas)*100:.1f}%)")
    print(f"Problematic ideas: {len(problematic)} ({len(problematic)/len(ideas)*100:.1f}%)")
    
    # Check if NonprofitNet exists and analyze it
    nonprofit_idea = next((idea for idea in ideas if 'NonprofitNet' in idea.get('projectName', '')), None)
    if nonprofit_idea:
        print(f"\n🔍 NONPROFIT NET ANALYSIS:")
        print("=" * 60)
        analysis = analyze_idea_quality(nonprofit_idea)
        print(f"Completeness: {analysis['completeness_pct']}%")
        print(f"Missing fields: {', '.join(analysis['missing_fields']) if analysis['missing_fields'] else 'None'}")
        print(f"Has core mechanic: {'Yes' if analysis['has_core_mechanic'] else 'No'}")
        print(f"Description length: {analysis['description_length']} chars")
        print(f"Raw text length: {analysis['raw_length']} chars")

if __name__ == "__main__":
    main()