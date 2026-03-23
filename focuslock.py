import os
import json
from datetime import datetime
import requests
import ollama
from dotenv import load_dotenv
import random
import re

load_dotenv()

TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")
MODEL = "phi3:mini"  # or "llama3.2", "gemma2", etc.

# Persistent history
os.makedirs("data", exist_ok=True)
HISTORY_FILE = "data/history.json"
IDEAS_FILE = "data/ideas.json"

if os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "r", encoding="utf-8-sig") as f:
        history = json.load(f)
else:
    history = [
        "Building real apps from PC only — no Termux ever",
        "Obsessed with clean deploys: Vercel, Railway, Render, Fly.io",
        "Wants project name + exact stack + useful links only",
        "Every idea must start with a sharp Problem Statement"
    ]

if os.path.exists(IDEAS_FILE):
    with open(IDEAS_FILE, "r", encoding="utf-8-sig") as f:
        ideas_store = json.load(f)
else:
    ideas_store = []

# Universal problem domains
PROBLEM_DOMAINS = [
    {
        "who": "Small business owners, freelancers, and solopreneurs trying to grow their ventures",
        "pain": "They juggle invoicing, client communication, bookkeeping, and marketing manually across scattered tools. Every task eats hours that could be spent on actual work. Cash flow tracking is a nightmare, client follow-ups get missed, and tax season becomes panic mode.",
        "gap": "There's no affordable, unified system that handles money management, client relations, and business operations in one place without requiring accounting degrees or expensive subscriptions.",
        "impact": "They lose revenue through poor cash flow visibility, waste 10+ hours weekly on admin tasks, miss growth opportunities due to disorganization, and risk business failure from financial mismanagement."
    },
    {
        "who": "Students, job seekers, and career switchers trying to break into tech or advance their skills",
        "pain": "They're overwhelmed by scattered learning resources, unclear career paths, and the gap between online courses and real-world skills. Building portfolios feels impossible without guidance, and job applications disappear into black holes.",
        "gap": "There's no personalized learning system that combines skill tracking, project guidance, portfolio building, and job matching based on actual capabilities and market demand.",
        "impact": "They waste months learning irrelevant skills, struggle to prove competence to employers, miss job opportunities due to poor portfolio presentation, and remain stuck in low-paying roles."
    },
    {
        "who": "Content creators, influencers, and digital entrepreneurs building online presence",
        "pain": "They struggle to maintain consistent posting schedules, analyze what content works, manage multiple platforms, and turn engagement into revenue. Content ideas dry up, analytics are confusing, and monetization feels like guesswork.",
        "gap": "There's no intelligent system that generates content ideas based on trends, optimizes posting schedules, tracks cross-platform performance, and recommends monetization strategies.",
        "impact": "They lose followers due to inconsistent posting, waste effort on low-performing content, miss viral opportunities, and struggle to convert audience into sustainable income."
    },
    {
        "who": "Remote teams, distributed startups, and async-first companies trying to stay aligned",
        "pain": "They drown in endless Slack messages, meetings that could be emails, scattered documentation, and timezone chaos. Important decisions get lost in chat history, onboarding new members takes weeks, and project context evaporates.",
        "gap": "There's no async-first platform that captures decisions, maintains living documentation, surfaces relevant context automatically, and keeps everyone aligned without synchronous meetings.",
        "impact": "They waste hours in unnecessary meetings, duplicate work due to poor knowledge sharing, struggle with employee retention, and move too slowly to compete with faster teams."
    },
    {
        "who": "Health-conscious individuals trying to improve fitness, nutrition, and mental wellbeing",
        "pain": "They're lost in conflicting diet advice, can't stick to workout plans, track progress inconsistently, and ignore mental health until crisis hits. Generic apps don't adapt to their lifestyle, and personal trainers are too expensive.",
        "gap": "There's no adaptive wellness system that combines personalized nutrition, progressive fitness plans, mental health check-ins, and habit formation based on individual goals and constraints.",
        "impact": "They waste money on ineffective programs, yo-yo between fitness phases, develop health problems from neglect, and feel constant guilt about unmet wellness goals."
    },
    {
        "who": "Parents managing family schedules, finances, and children's development",
        "pain": "They coordinate school activities, medical appointments, meal planning, and budgets across multiple apps while trying to track kids' academic progress and emotional wellbeing. Everything feels urgent and nothing gets the attention it deserves.",
        "gap": "There's no family operating system that centralizes schedules, automates routine planning, tracks child development milestones, and provides gentle reminders for important tasks.",
        "impact": "They miss important appointments, feel constantly overwhelmed, struggle with work-life balance, and worry they're failing their children due to disorganization."
    },
    {
        "who": "Local service providers (plumbers, electricians, tutors, cleaners) trying to find and retain clients",
        "pain": "They rely on word-of-mouth, struggle with online visibility, lack professional booking systems, and lose clients to more tech-savvy competitors. Marketing feels too expensive and complicated.",
        "gap": "There's no local services platform that handles discovery, booking, payments, and review management specifically designed for service professionals without technical skills.",
        "impact": "They remain dependent on expensive middleman platforms, struggle with irregular income, miss potential clients, and can't scale beyond their immediate network."
    },
    {
        "who": "Researchers, writers, and knowledge workers managing information overload",
        "pain": "They save articles, papers, and notes across browsers, apps, and devices but can never find them when needed. Connecting ideas is manual, citations are a nightmare, and synthesizing research takes forever.",
        "gap": "There's no intelligent knowledge management system that automatically organizes sources, surfaces connections, generates summaries, and helps transform research into original writing.",
        "impact": "They waste hours re-finding information, struggle with writer's block, miss important connections between ideas, and produce lower-quality work than their research deserves."
    },
    {
        "who": "E-commerce sellers managing inventory, orders, and customer service across platforms",
        "pain": "They manually track stock across marketplaces, respond to customer queries on multiple channels, struggle with shipping logistics, and have no clear view of profitability per product.",
        "gap": "There's no unified commerce dashboard that syncs inventory in real-time, centralizes customer communication, automates routine responses, and provides clear profit analytics.",
        "impact": "They oversell products causing customer complaints, waste hours on repetitive messages, lose money on unprofitable items, and can't scale without hiring expensive help."
    },
    {
        "who": "Event organizers managing registrations, communications, and logistics for gatherings",
        "pain": "They cobble together registration forms, email lists, payment collection, and attendee communication using disconnected tools. Last-minute changes become nightmares, and attendee engagement drops off after registration.",
        "gap": "There's no end-to-end event platform that handles registration, automated reminders, attendee networking, real-time updates, and post-event follow-up in one place.",
        "impact": "They lose attendees to poor communication, struggle with low engagement, waste hours on manual coordination, and can't build community beyond single events."
    },
    {
        "who": "Nonprofit organizations trying to manage donors, volunteers, and impact tracking",
        "pain": "They manually track donations in spreadsheets, struggle to engage volunteers consistently, can't demonstrate impact to funders, and spend too much time on admin instead of mission work.",
        "gap": "There's no affordable nonprofit management system that combines donor CRM, volunteer coordination, impact measurement, and automated reporting for grant applications.",
        "impact": "They lose donors due to poor engagement, struggle to secure funding without clear impact data, burn out volunteers with disorganization, and ultimately serve fewer people."
    },
    {
        "who": "Landlords and property managers handling multiple rental properties",
        "pain": "They manually track rent payments, maintenance requests pile up in texts and emails, tenant screening is time-consuming, and financial reporting for taxes is a mess.",
        "gap": "There's no simple property management system that automates rent collection, centralizes maintenance tracking, screens tenants, and generates financial reports automatically.",
        "impact": "They lose income from missed payments, face tenant complaints due to slow maintenance, make bad tenant choices, and panic during tax season with incomplete records."
    },
    {
        "who": "Personal finance enthusiasts trying to achieve financial independence and smart investing",
        "pain": "They track expenses manually, can't visualize long-term financial goals, struggle to optimize investments across accounts, and miss tax-saving opportunities due to complexity.",
        "gap": "There's no holistic financial dashboard that aggregates all accounts, projects retirement scenarios, recommends optimizations, and identifies tax strategies automatically.",
        "impact": "They miss wealth-building opportunities, pay unnecessary taxes, feel anxious about retirement readiness, and make suboptimal financial decisions from incomplete information."
    },
    {
        "who": "Agritech innovators, smallholder farmers, and agrotech startups trying to modernize agriculture",
        "pain": "They wrestle with unpredictable weather, market price volatility, limited access to quality inputs, poor supply chain visibility, and lack of data to make informed planting decisions.",
        "gap": "There's no integrated platform that combines weather forecasts, market prices, input sourcing, farm management, and direct buyer connections for small-scale farmers.",
        "impact": "They lose entire harvests to preventable issues, sell crops below market rate, struggle with food security, and remain trapped in subsistence farming instead of profitable agribusiness."
    },
    {
        "who": "Mental health professionals managing clients, notes, billing, and compliance",
        "pain": "They juggle HIPAA-compliant note-taking, appointment scheduling, insurance billing, and client progress tracking across multiple systems while trying to provide quality care.",
        "gap": "There's no affordable, compliant practice management system designed specifically for solo therapists and small mental health practices that handles all aspects of practice management.",
        "impact": "They waste therapy time on admin work, risk compliance violations, lose revenue to billing errors, and burn out trying to manage business operations alongside clinical work."
    },
    {
        "who": "Podcast creators and audio content producers trying to grow their audience",
        "pain": "They struggle with editing, transcription, show notes creation, distribution across platforms, audience analytics, and monetization. Each episode requires hours of post-production work.",
        "gap": "There's no unified platform that automates podcast workflow from recording to distribution while providing actionable audience insights and monetization tools.",
        "impact": "They burn out from manual editing, miss sponsorship opportunities, can't track what content resonates, and struggle to grow beyond their initial audience."
    },
    {
        "who": "Independent game developers and small studios creating games",
        "pain": "They face challenges with asset management, version control, playtesting coordination, bug tracking, and marketing. Limited resources mean wearing too many hats.",
        "gap": "There's no affordable, integrated development environment specifically designed for indie game creators that combines project management, testing, and marketing tools.",
        "impact": "They miss launch deadlines, ship buggy games, struggle with visibility in crowded marketplaces, and often abandon projects due to overwhelming complexity."
    },
    {
        "who": "Legal professionals and small law firms managing cases and clients",
        "pain": "They manually track case deadlines, client communications, billable hours, and document versions across disconnected systems. Missing a deadline can mean malpractice.",
        "gap": "There's no affordable, compliant case management system for solo practitioners that automates deadline tracking, time billing, and client communication.",
        "impact": "They risk malpractice from missed deadlines, lose revenue from unbilled hours, waste time on admin work, and struggle to scale their practice."
    },
    {
        "who": "Real estate agents managing multiple property listings and clients",
        "pain": "They juggle property showings, client follow-ups, document signing, market analysis, and lead generation across multiple platforms. Leads fall through cracks.",
        "gap": "There's no unified CRM designed specifically for real estate that combines listing management, client communication, document handling, and market insights.",
        "impact": "They lose deals to more organized competitors, waste time on manual follow-ups, miss market opportunities, and can't scale beyond a handful of clients."
    },
    {
        "who": "Restaurant owners and food service managers handling operations",
        "pain": "They struggle with inventory management, staff scheduling, online orders, table reservations, and customer feedback across multiple systems. Food waste and labor costs spiral.",
        "gap": "There's no affordable, integrated restaurant management system that handles operations, online presence, and customer engagement in one platform.",
        "impact": "They lose money through food waste, poor scheduling, missed online orders, and can't compete with chain restaurants' operational efficiency."
    },
    {
        "who": "Fitness trainers and gym owners managing clients and classes",
        "pain": "They manually schedule sessions, track client progress, handle payments, create workout plans, and manage class bookings. Client retention suffers from lack of engagement.",
        "gap": "There's no comprehensive platform for fitness professionals that combines scheduling, progress tracking, payment processing, and client engagement tools.",
        "impact": "They lose clients due to poor communication, waste time on admin tasks, struggle with payment collection, and can't scale beyond in-person training."
    },
    {
        "who": "Photographers and videographers managing bookings and deliverables",
        "pain": "They juggle client inquiries, booking calendars, contracts, shoot planning, editing workflows, and file delivery. Client galleries and payments are scattered.",
        "gap": "There's no unified platform for visual creators that handles booking, contracts, editing workflow, client galleries, and payment processing.",
        "impact": "They lose bookings due to slow responses, waste time on manual contract handling, struggle with file delivery, and miss payment follow-ups."
    },
    {
        "who": "Music teachers and performing arts instructors managing students",
        "pain": "They manually schedule lessons, track student progress, handle payments, assign practice materials, and communicate with parents. Recital planning is chaotic.",
        "gap": "There's no affordable platform designed for music educators that combines scheduling, progress tracking, payment processing, and parent communication.",
        "impact": "They lose students due to poor organization, waste time on admin work, struggle with payment collection, and can't grow their teaching practice."
    },
    {
        "who": "Consultants and coaches delivering services to multiple clients",
        "pain": "They struggle with session scheduling, client onboarding, progress tracking, resource delivery, and invoicing. Each client relationship requires manual management.",
        "gap": "There's no unified platform for service-based professionals that automates client lifecycle from onboarding to invoicing while tracking outcomes.",
        "impact": "They can't scale beyond a few clients, waste time on repetitive admin tasks, struggle to demonstrate ROI, and lose clients due to poor experience."
    },
    {
        "who": "Pet care providers including groomers, sitters, and trainers",
        "pain": "They manually manage bookings, pet profiles, owner communications, medical records, and payments. Emergency contacts and special instructions get lost.",
        "gap": "There's no comprehensive platform for pet care professionals that handles scheduling, pet records, owner communication, and payment processing.",
        "impact": "They risk pet safety from lost information, lose bookings due to poor organization, struggle with payment collection, and can't scale their services."
    }
]

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
                # Try to split on - or — or em dash
                if ' - ' in full_text or ' — ' in full_text or ' \u2014 ' in full_text:
                    parts = re.split(r'\s*[-\u2014—]\s*', full_text, 1)
                    result["projectName"] = parts[0].strip().strip('""\u201c\u201d')
                    result["description"] = parts[1].strip() if len(parts) > 1 else ""
                else:
                    result["projectName"] = full_text.strip('""\u201c\u201d')
            print(f"DEBUG: Found project name: '{result['projectName']}'")
            if result["description"]:
                print(f"DEBUG: Found description: '{result['description'][:50]}...'")
            break
    
    # Extract Stack section (handles multi-line, case-insensitive section headers, with or without colon)
    stack_match = re.search(r'(?:Stack|STACK)\s*:?\s*\n\s*(.+?)(?=\n\s*(?:Deploy|DEPLOY|Docs|DOCS|Why now|WHY NOW|Potential|POTENTIAL|Target|TARGET)|$)', raw, re.IGNORECASE | re.DOTALL)
    if stack_match:
        result["stack"] = stack_match.group(1).strip().replace('\n', ' ')
        print(f"DEBUG: Found stack")
    
    # Extract Deploy section (handles multi-line, case-insensitive section headers, with or without colon)
    deploy_match = re.search(r'(?:Deploy|DEPLOY)\s*:?\s*\n\s*(.+?)(?=\n\s*(?:Docs|DOCS|Why now|WHY NOW|Potential|POTENTIAL|Target|TARGET)|$)', raw, re.IGNORECASE | re.DOTALL)
    if deploy_match:
        result["deploy"] = deploy_match.group(1).strip().replace('\n', ' ')
        print(f"DEBUG: Found deploy")
    
    # Extract docs section (with or without colon)
    docs_match = re.search(r'(?:Docs & Links|DOCS & LINKS)\s*:?\s*\n\s*((?:\u2022.+(?:\n|$))+)', raw, re.IGNORECASE)
    if docs_match:
        result["docs"] = docs_match.group(1).strip()
        print(f"DEBUG: Found docs section")
    
    # Extract Why now section (handles multi-line, case-insensitive, with or without colon)
    why_match = re.search(r'(?:Why now|WHY NOW)\s*:?\s*\n\s*(.+?)(?=\n\s*(?:Potential|POTENTIAL|Target|TARGET)|$)', raw, re.IGNORECASE | re.DOTALL)
    if why_match:
        result["whyNow"] = why_match.group(1).strip().replace('\n', ' ')
        print(f"DEBUG: Found why now")
    
    # Extract Potential section (handles multi-line, case-insensitive, with or without colon)
    potential_match = re.search(r'(?:Potential|POTENTIAL)\s*:?\s*\n\s*(.+?)(?=\n\s*(?:Target audience|TARGET AUDIENCE|Next idea|NEXT IDEA)|$)', raw, re.IGNORECASE | re.DOTALL)
    if potential_match:
        result["potential"] = potential_match.group(1).strip().replace('\n', ' ')
        print(f"DEBUG: Found potential")
    
    for line in raw.split("\n"):
        line = line.strip()
        # Support both → and -> separators
        sep = "\u2192" if "\u2192" in line else ("->" if "->" in line else None)
        if not sep:
            continue
        
        key, _, value = line.partition(sep)
        key = key.strip().lower().rstrip(":")
        value = value.strip()
        
        if not value:
            continue
            
        print(f"DEBUG: Found key='{key}', value='{value[:50]}...'")
        
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
    
    print(f"DEBUG: Parsed result - projectName: '{result['projectName']}'")
    return result

def save_idea(raw: str, domain: str = ""):
    """Save a structured idea entry to ideas.json for the web dashboard."""
    try:
        parsed = parse_idea(raw)
        idea_id = f"idea_{int(datetime.now().timestamp())}"
        entry = {
            "id": idea_id,
            "date": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            "raw": raw,
            "domain": domain,
            **parsed,
        }
        ideas_store.append(entry)
        with open(IDEAS_FILE, "w") as f:
            json.dump(ideas_store, f, indent=2)
        print(f"✓ Idea saved to {IDEAS_FILE}")
        print(f"✓ Parsed project name: {parsed.get('projectName', 'N/A')}")
        return idea_id
    except Exception as e:
        print(f"✗ Failed to save idea: {e}")
        import traceback
        traceback.print_exc()
        return None

def log_activity(text: str):
    entry = f"{text} — {datetime.now().strftime('%Y-%m-%d %H:%M')}"
    history.append(entry)
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)

def get_context() -> str:
    return "\n".join(history[-8:]) if history else "Fresh PC warrior."

def generate_idea():
    context = get_context()
    
    # Select random problem domain
    problem = random.choice(PROBLEM_DOMAINS)
    
    # Determine domain name based on problem characteristics
    domain_name = determine_domain(problem)
    
    prompt = f"""You are FocusLock — elite, no-fluff AI co-pilot for a developer building real apps from PC only.

Recent vibe:
{context}

Generate exactly ONE focused project idea with this EXACT format (no extra text, no greetings):

PROBLEM STATEMENT
{problem['pain']} {problem['gap']} {problem['impact']}

Project
"[Memorable Project Name]" — A comprehensive [brief description of what the platform/app does, its unique value proposition, and how it serves the target users]. Make this 2-3 sentences that capture the essence and innovation of the solution.

Stack
[List all technologies with detailed descriptions in brackets, e.g., Next.js + Supabase (for backend and database management) + Tailwind CSS (for styling)] & [any additional frameworks or tools with their purposes]. Be specific about what each technology does in the stack.

Deploy
[Platform name] / [Alternative platform] (explain why these platforms - e.g., "for optimized build times and easy deployment")

Docs & Links
• [Technology Name] Documentation - [2-3 sentences explaining what developers will learn from this documentation, why it's essential for this project, and what specific features or capabilities it enables]
• [Technology Name] Documentation - [2-3 sentences explaining the value and specific use case for this project]
• [Technology Name] Guide - [2-3 sentences about implementation details and why this matters for the project]
• [Technology Name] Documentation - [2-3 sentences covering integration steps and benefits]

Why now
[Write 2-4 sentences explaining the market timing, current trends, technological readiness, user behavior shifts, competitive landscape, and why this exact moment is critical for launching this solution. Make it compelling and data-driven where possible.]

Potential
[Write 2-4 sentences covering realistic revenue projections for year 1, user growth targets, market size, monetization strategy (commission, subscriptions, ads, etc.), and long-term vision for community building or market impact. Include specific numbers like "$10M revenue" or "100k users".]

Target audience: {problem['who']}
Make every section detailed, actionable, and inspiring. Use natural language, not bullet points except in Docs & Links."""

    response = ollama.generate(model=MODEL, prompt=prompt)
    return response["response"], domain_name

def send_telegram(message: str):
    if not TOKEN or not CHAT_ID:
        print("❌ ERROR: Missing TELEGRAM_TOKEN or CHAT_ID environment variables")
        print(f"   TOKEN exists: {bool(TOKEN)}")
        print(f"   CHAT_ID exists: {bool(CHAT_ID)}")
        return False

    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    payload = {
        "chat_id": CHAT_ID,
        "text": message,
        "parse_mode": "Markdown",
        "disable_web_page_preview": True
    }
    try:
        print(f"📤 Sending message to Telegram...")
        print(f"   Message length: {len(message)} chars")
        print(f"   Chat ID: {CHAT_ID}")
        resp = requests.post(url, data=payload, timeout=15)
        if resp.status_code == 200:
            print("✅ Message sent to Telegram successfully!")
            return True
        else:
            print(f"❌ Telegram API error {resp.status_code}:")
            print(f"   Response: {resp.text}")
            return False
    except requests.exceptions.Timeout:
        print("❌ Telegram request timeout after 15s")
        return False
    except Exception as e:
        print(f"❌ Telegram request failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def determine_domain(problem: dict) -> str:
    """Determine domain name based on problem characteristics."""
    who = problem['who'].lower()
    
    # Map keywords to domain names
    if 'business' in who or 'freelancer' in who or 'solopreneur' in who:
        return "Business Management"
    elif 'student' in who or 'job seeker' in who or 'career' in who:
        return "Career Development"
    elif 'content creator' in who or 'influencer' in who:
        return "Content Creation"
    elif 'remote team' in who or 'distributed' in who or 'startup' in who:
        return "Remote Collaboration"
    elif 'health' in who or 'fitness' in who or 'wellness' in who:
        return "Health & Wellness"
    elif 'parent' in who or 'family' in who:
        return "Family Management"
    elif 'service provider' in who or 'plumber' in who or 'electrician' in who or 'tutor' in who or 'cleaner' in who:
        return "Local Services"
    elif 'researcher' in who or 'writer' in who or 'knowledge worker' in who:
        return "Knowledge Management"
    elif 'e-commerce' in who or 'seller' in who:
        return "E-commerce"
    elif 'event organizer' in who:
        return "Event Management"
    elif 'nonprofit' in who:
        return "Nonprofit Management"
    elif 'landlord' in who or 'property manager' in who:
        return "Property Management"
    elif 'finance' in who or 'investing' in who:
        return "Personal Finance"
    elif 'farm' in who or 'agri' in who:
        return "Agriculture Tech"
    elif 'mental health' in who or 'therapist' in who:
        return "Mental Health"
    elif 'podcast' in who or 'audio' in who:
        return "Podcast Production"
    elif 'game' in who or 'indie' in who:
        return "Game Development"
    elif 'legal' in who or 'law' in who or 'attorney' in who:
        return "Legal Services"
    elif 'real estate' in who or 'agent' in who:
        return "Real Estate"
    elif 'restaurant' in who or 'food service' in who:
        return "Restaurant Operations"
    elif 'fitness trainer' in who or 'gym' in who:
        return "Fitness Training"
    elif 'photographer' in who or 'videographer' in who:
        return "Photography & Video"
    elif 'music teacher' in who or 'performing arts' in who:
        return "Music Education"
    elif 'consultant' in who or 'coach' in who:
        return "Consulting & Coaching"
    elif 'pet care' in who or 'groomer' in who or 'sitter' in who:
        return "Pet Care Services"
    else:
        return "General"

if __name__ == "__main__":
    try:
        print("🚀 FocusLock starting...")
        idea, domain = generate_idea()
        timestamp = datetime.now().strftime('%b %d • %H:%M')
        
        # Parse the idea to get key fields
        parsed = parse_idea(idea)
        
        # Save full idea to JSON and get the ID
        idea_id = save_idea(idea, domain)
        
        # Create shareable URL
        project_url = f"https://focuslock-ai-gzi6.vercel.app/dashboard?idea={idea_id}"
        
        # Create detailed Telegram message (Telegram limit is 4096 chars)
        telegram_parts = []
        telegram_parts.append(f"*{parsed['projectName'] or 'Daily Project Idea'}*")
        
        if parsed['description']:
            # Full description, no truncation
            telegram_parts.append(f"\n{parsed['description']}")
        
        if parsed['stack']:
            # Expanded stack section
            telegram_parts.append(f"\n\n*Stack*\n{parsed['stack'][:800]}")
        
        if parsed['deploy']:
            # Add deploy section
            telegram_parts.append(f"\n\n*Deploy*\n{parsed['deploy'][:400]}")
        
        if parsed['whyNow']:
            # Add why now section
            telegram_parts.append(f"\n\n*Why Now*\n{parsed['whyNow'][:600]}")
        
        if parsed['potential']:
            # Expanded potential section
            telegram_parts.append(f"\n\n*Potential*\n{parsed['potential'][:600]}")
        
        # Add clickable link to full project
        telegram_parts.append(f"\n\n[📱 View full details on dashboard]({project_url})")
        
        short_idea = ''.join(telegram_parts)
        
        # Check if message is too long (Telegram limit: 4096 chars)
        if len(short_idea) > 3800:  # Leave room for header and footer
            # If too long, truncate sections proportionally
            telegram_parts = []
            telegram_parts.append(f"*{parsed['projectName'] or 'Daily Project Idea'}*")
            
            if parsed['description']:
                telegram_parts.append(f"\n{parsed['description'][:400]}")
            
            if parsed['stack']:
                telegram_parts.append(f"\n\n*Stack*\n{parsed['stack'][:500]}...")
            
            if parsed['deploy']:
                telegram_parts.append(f"\n\n*Deploy*\n{parsed['deploy'][:300]}...")
            
            if parsed['whyNow']:
                telegram_parts.append(f"\n\n*Why Now*\n{parsed['whyNow'][:400]}...")
            
            if parsed['potential']:
                telegram_parts.append(f"\n\n*Potential*\n{parsed['potential'][:400]}...")
            
            telegram_parts.append(f"\n\n[📱 View full details on dashboard]({project_url})")
            short_idea = ''.join(telegram_parts)
        
        message = f"*FocusLock • Daily Spark*\n{timestamp} EAT\n\n{short_idea}\n\n_Next idea: Tomorrow at 10:00 AM EAT_"
        
        send_telegram(message)
        log_activity("Delivered project with Problem Statement + clean stack")
        print("✅ FocusLock complete")
    except Exception as e:
        print(f"❌ FocusLock crashed: {e}")
        raise
