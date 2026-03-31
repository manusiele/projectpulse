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

# Universal problem domains - optimized for startup idea generation (2026)
PROBLEM_DOMAINS = [
    {
        "who": "Small business owners, freelancers, and solopreneurs trying to grow their ventures",
        "pain": "They juggle invoicing, client communication, bookkeeping, and marketing manually across scattered tools. Every task eats hours that could be spent on actual work. Cash flow tracking is a nightmare, client follow-ups get missed, and tax season becomes panic mode.",
        "gap": "There's no affordable, unified system that handles money management, client relations, and business operations in one place without requiring accounting degrees or expensive subscriptions.",
        "impact": "They lose revenue through poor cash flow visibility, waste 10+ hours weekly on admin tasks, miss growth opportunities due to disorganization, and risk business failure from financial mismanagement."
    },
    {
        "who": "Sales teams, marketers, and founders trying to generate and convert leads consistently",
        "pain": "They manually track prospects across spreadsheets, struggle with follow-up timing, can't personalize outreach at scale, and have no visibility into what messaging actually converts. Lead scoring is guesswork, pipeline forecasting is inaccurate, and most leads go cold from poor nurturing.",
        "gap": "There's no intelligent sales platform that automates personalized outreach, scores leads based on behavior, optimizes follow-up timing, and provides clear attribution from first touch to closed deal.",
        "impact": "They waste 60% of leads through poor follow-up, spend hours on manual data entry, miss revenue targets due to inaccurate forecasting, and can't identify which marketing channels actually drive sales."
    },

    {
        "who": "Content creators, influencers, YouTubers, and TikTokers trying to grow and monetize their audience",
        "pain": "They struggle to maintain consistent posting schedules, analyze what content works, manage multiple platforms, and turn engagement into revenue. Content ideas dry up, analytics are confusing, brand deals are hard to find, and monetization feels like guesswork.",
        "gap": "There's no intelligent creator platform that generates content ideas based on trends, optimizes posting schedules, tracks cross-platform performance, connects with brand partnerships, and recommends diversified monetization strategies.",
        "impact": "They lose followers due to inconsistent posting, waste effort on low-performing content, miss viral opportunities and brand deals, and struggle to convert audience into sustainable full-time income."
    },
    {
        "who": "Indie developers, software engineers, and small dev teams building products and tools",
        "pain": "They waste time on repetitive boilerplate code, struggle with deployment complexity, can't afford expensive dev tools, and have no clear path from idea to production. Code reviews are inconsistent, testing is manual, and technical debt piles up while trying to ship features.",
        "gap": "There's no affordable, integrated development platform that automates boilerplate generation, provides intelligent code review, handles deployment complexity, and helps solo developers maintain production-quality standards.",
        "impact": "They spend 40% of time on non-feature work, ship buggy code due to lack of review, struggle with scaling issues, and burn out trying to maintain quality while moving fast."
    },
    {
        "who": "E-commerce sellers, D2C brands, and online store owners managing inventory and orders across platforms",
        "pain": "They manually track stock across marketplaces, respond to customer queries on multiple channels, struggle with shipping logistics, have no clear view of profitability per product, and can't predict inventory needs accurately.",
        "gap": "There's no unified commerce dashboard that syncs inventory in real-time across all channels, centralizes customer communication, automates routine responses, provides clear profit analytics, and predicts optimal stock levels.",
        "impact": "They oversell products causing customer complaints, waste hours on repetitive messages, lose money on unprofitable items, face cash flow issues from poor inventory planning, and can't scale without hiring expensive help."
    },
    {
        "who": "Students, teachers, corporate trainers, and lifelong learners trying to acquire and teach skills effectively",
        "pain": "They're overwhelmed by scattered learning resources, can't track progress meaningfully, struggle with engagement in online learning, and have no way to verify actual skill mastery. Teachers can't personalize at scale, and learners don't know what to learn next.",
        "gap": "There's no adaptive learning platform that personalizes content based on learning style, tracks true skill mastery (not just completion), provides AI tutoring, and recommends optimal learning paths based on career goals and market demand.",
        "impact": "They waste months on ineffective learning methods, struggle with retention and application, can't prove competence to employers, and teachers burn out trying to personalize for every student."
    },
    {
        "who": "Health-conscious individuals, fitness enthusiasts, and wellness seekers trying to improve their physical and mental wellbeing",
        "pain": "They're lost in conflicting diet advice, can't stick to workout plans, track progress inconsistently across multiple apps, and ignore mental health until crisis hits. Generic fitness apps don't adapt to their lifestyle, injuries, or preferences, and personal trainers are too expensive.",
        "gap": "There's no adaptive wellness system that combines personalized nutrition based on biometrics, progressive fitness plans that adjust to performance, mental health check-ins, sleep optimization, and sustainable habit formation based on individual goals and real-life constraints.",
        "impact": "They waste money on ineffective programs and supplements, yo-yo between fitness phases, develop chronic health problems from neglect, and feel constant guilt and anxiety about unmet wellness goals."
    },
    {
        "who": "Individuals struggling with anxiety, depression, stress, and therapists managing client care",
        "pain": "They can't afford traditional therapy, wait weeks for appointments, struggle to find the right therapist match, and have no support between sessions. Therapists juggle HIPAA-compliant notes, scheduling, billing, and client progress tracking across disconnected systems.",
        "gap": "There's no accessible mental health platform that provides AI-powered daily check-ins, matches users with therapists based on needs and communication style, offers affordable between-session support, and helps therapists manage practice operations compliantly.",
        "impact": "They suffer in silence due to cost and access barriers, experience crisis without support, and therapists burn out from administrative burden while serving fewer people than they could."
    },
    {
        "who": "Personal finance enthusiasts, young professionals, and investors trying to build wealth and achieve financial independence",
        "pain": "They track expenses manually across accounts, can't visualize long-term financial goals, struggle to optimize investments and tax strategies, miss savings opportunities, and feel anxious about retirement readiness. Financial advisors are expensive and generic robo-advisors lack personalization.",
        "gap": "There's no holistic AI financial coach that aggregates all accounts, projects retirement scenarios with real-time adjustments, recommends tax optimizations, identifies wasteful spending patterns, and provides personalized wealth-building strategies based on income, goals, and risk tolerance.",
        "impact": "They miss wealth-building opportunities, pay thousands in unnecessary taxes, make suboptimal investment decisions, feel constant anxiety about money, and risk not achieving financial independence."
    },
    {
        "who": "Green businesses, eco-conscious consumers, and companies trying to reduce environmental impact",
        "pain": "They want to make sustainable choices but can't verify claims, struggle to measure carbon footprint accurately, find sustainable alternatives expensive or hard to source, and have no clear path to carbon neutrality. Greenwashing makes trust impossible.",
        "gap": "There's no transparent sustainability platform that verifies environmental claims, calculates accurate carbon footprints, recommends cost-effective sustainable alternatives, connects buyers with verified green suppliers, and tracks progress toward climate goals.",
        "impact": "They unknowingly support greenwashing, overpay for fake sustainability, can't prove environmental impact to stakeholders, miss cost savings from efficiency, and contribute to climate crisis despite good intentions."
    },
    {
        "who": "Parents, caregivers, and families managing household operations, children's development, and family wellbeing",
        "pain": "They coordinate school activities, medical appointments, meal planning, and budgets across multiple apps while trying to track kids' academic progress, screen time, and emotional wellbeing. Everything feels urgent, nothing gets proper attention, and guilt is constant.",
        "gap": "There's no family operating system that centralizes schedules, automates meal planning and grocery lists, tracks child development milestones, manages shared expenses, and provides age-appropriate activity recommendations based on each child's interests and development stage.",
        "impact": "They miss important appointments and milestones, feel constantly overwhelmed and guilty, struggle with work-life balance, waste money on duplicate purchases, and worry they're failing their children due to disorganization."
    },
    {
        "who": "Travelers, digital nomads, hotels, and tour operators trying to plan and deliver better travel experiences",
        "pain": "They spend hours researching destinations across scattered sources, can't find authentic local experiences, struggle with language barriers and logistics, and have no personalized recommendations. Hotels and tour operators can't compete with big platforms and lose direct bookings.",
        "gap": "There's no intelligent travel platform that provides AI-powered personalized itineraries, connects travelers with verified local guides, handles real-time translation and logistics, and helps small hospitality businesses compete with OTAs through direct booking tools.",
        "impact": "They waste vacation time on poor planning, miss authentic experiences, overpay for tourist traps, and small hospitality businesses lose 20-30% revenue to platform commissions."
    },
    {
        "who": "Real estate agents, property investors, landlords, and homebuyers navigating property transactions",
        "pain": "They juggle property listings, client communications, market analysis, document signing, and lead generation across disconnected platforms. Leads fall through cracks, market timing is guesswork, and property management is chaotic with maintenance requests in texts and emails.",
        "gap": "There's no unified proptech platform that combines listing management, AI-powered market analysis, client CRM, digital document handling, automated rent collection, maintenance tracking, and predictive analytics for property investment decisions.",
        "impact": "They lose deals to more organized competitors, miss optimal buying/selling windows, waste time on manual follow-ups, lose rental income from poor management, and make costly investment mistakes from incomplete market data."
    },
    {
        "who": "E-commerce businesses, distributors, and small logistics companies managing supply chain and deliveries",
        "pain": "They manually coordinate shipments across carriers, have no real-time visibility into inventory location, struggle with route optimization, face unexpected delays without proactive alerts, and can't accurately predict delivery times to customers.",
        "gap": "There's no affordable logistics platform that provides real-time tracking across all carriers, optimizes routes using AI, predicts delays before they happen, automates carrier selection based on cost and speed, and integrates seamlessly with e-commerce platforms.",
        "impact": "They waste 20-30% on inefficient routing, lose customers due to poor delivery experience, can't scale operations, face cash flow issues from inventory visibility gaps, and spend hours on manual coordination."
    },
    {
        "who": "Smallholder farmers, agribusinesses, and agritech startups trying to modernize agriculture and improve yields",
        "pain": "They wrestle with unpredictable weather, market price volatility, limited access to quality inputs, poor supply chain visibility, lack of data for informed planting decisions, and can't access credit due to lack of records. Pest and disease detection happens too late.",
        "gap": "There's no integrated agritech platform that combines AI weather forecasts, real-time market prices, input sourcing, farm management with IoT sensors, pest/disease detection via image recognition, yield prediction, and direct buyer connections for small-scale farmers.",
        "impact": "They lose 30-40% of harvests to preventable issues, sell crops below market rate due to poor timing, struggle with food security, remain trapped in subsistence farming, and can't access growth capital."
    },

    {
        "who": "Restaurant owners, cloud kitchens, and food service managers trying to run profitable operations",
        "pain": "They struggle with inventory management leading to food waste, staff scheduling chaos, online orders from multiple platforms, table reservations, customer feedback scattered everywhere, and have no clear view of dish profitability. Menu pricing is guesswork.",
        "gap": "There's no affordable, integrated restaurant management system that handles inventory with waste tracking, smart staff scheduling, unified online ordering, reservation management, customer engagement, and provides clear profitability analytics per dish.",
        "impact": "They lose 20-30% revenue through food waste and theft, poor scheduling costs thousands monthly, miss online orders, can't compete with chain efficiency, and make menu decisions that hurt profitability."
    },
    {
        "who": "Brick-and-mortar stores, retail chains, and omnichannel retailers trying to compete with e-commerce",
        "pain": "They struggle with inventory visibility across locations, can't offer seamless online-to-offline experiences, lack customer data compared to online competitors, and have no tools for personalized in-store experiences. Foot traffic is declining but they don't know why.",
        "gap": "There's no affordable retail platform that unifies inventory across all channels, enables buy-online-pickup-in-store, provides customer analytics comparable to e-commerce, and offers tools for personalized in-store experiences using mobile technology.",
        "impact": "They lose customers to pure e-commerce players, waste money on poor inventory allocation, can't compete on customer experience, and risk business closure as foot traffic declines."
    },
    {
        "who": "HR teams, recruiters, and growing companies trying to find, hire, and retain top talent",
        "pain": "They manually screen hundreds of resumes, struggle to assess cultural fit, can't track candidate experience, lose top talent to slow hiring processes, and have no data on what makes employees stay or leave. Onboarding is chaotic and retention is guesswork.",
        "gap": "There's no intelligent talent platform that automates resume screening with AI, assesses cultural fit through behavioral analysis, tracks candidate experience, speeds up hiring with automated scheduling, and predicts flight risk while recommending retention strategies.",
        "impact": "They lose top candidates to faster competitors, waste thousands on bad hires, struggle with high turnover, can't scale hiring, and have no insight into why good people leave."
    },
    {
        "who": "Lawyers, small law firms, and legal freelancers managing cases, clients, and compliance",
        "pain": "They manually track case deadlines across multiple courts, client communications are scattered, billable hours go unrecorded, document versions are chaos, and missing a single deadline can mean malpractice. Legal research is time-consuming and expensive.",
        "gap": "There's no affordable, bar-compliant case management system for solo practitioners that automates deadline tracking with court calendar integration, captures billable time automatically, manages documents with version control, and provides AI-powered legal research.",
        "impact": "They risk malpractice and bar complaints from missed deadlines, lose 20-30% revenue from unbilled hours, waste hours on admin work, pay thousands for legal research, and can't scale their practice."
    },
    {
        "who": "Consultants, coaches, agencies, and professional service providers delivering expertise to multiple clients",
        "pain": "They struggle with session scheduling across timezones, client onboarding is manual and inconsistent, progress tracking is scattered, resource delivery is ad-hoc, invoicing is delayed, and they can't demonstrate clear ROI. Each client relationship requires repetitive manual management.",
        "gap": "There's no unified platform for service-based professionals that automates the entire client lifecycle from lead to onboarding to delivery to invoicing, tracks outcomes and ROI automatically, and provides client portals for self-service.",
        "impact": "They can't scale beyond 10-15 clients, waste 15+ hours weekly on repetitive admin tasks, struggle to demonstrate value leading to churn, lose revenue from delayed invoicing, and burn out from manual client management."
    },
    {
        "who": "Small businesses, freelancers, and individuals trying to protect themselves from cyber threats and data breaches",
        "pain": "They don't know where their vulnerabilities are, can't afford enterprise security tools, struggle with password management, have no backup strategy, and don't understand compliance requirements. One breach could destroy their business or reputation.",
        "gap": "There's no affordable, automated cybersecurity platform for non-technical users that continuously scans for vulnerabilities, manages passwords and 2FA, automates backups, monitors for breaches, and provides clear compliance guidance.",
        "impact": "They lose everything to ransomware attacks, face lawsuits from data breaches, waste thousands recovering from incidents, lose customer trust permanently, and risk business closure from a single security failure."
    },
    {
        "who": "Photographers, videographers, designers, and creative agencies managing projects and client deliverables",
        "pain": "They juggle client inquiries, project briefs, asset management, editing workflows, revision requests, file delivery, and invoicing across disconnected tools. Creative feedback is scattered, version control is chaos, and clients don't understand the creative process.",
        "gap": "There's no unified creative operations platform that handles client onboarding, brief management, asset organization with AI tagging, collaborative editing with structured feedback, automated file delivery, and streamlined invoicing.",
        "impact": "They lose bookings due to slow responses, waste hours searching for assets, struggle with endless revision cycles, miss payment follow-ups, and can't scale beyond a few simultaneous projects."
    },
    {
        "who": "Seniors, family caregivers, and elder care facilities trying to ensure safety and quality of life for aging adults",
        "pain": "They worry constantly about medication adherence, fall detection, social isolation, cognitive decline, and emergency response. Coordinating care across family members and professionals is chaotic, and seniors resist intrusive monitoring that makes them feel helpless.",
        "gap": "There's no dignified elder care platform that monitors health passively through smart home sensors, reminds about medications gently, detects falls and emergencies, facilitates family coordination, provides cognitive exercises, and connects seniors with social activities.",
        "impact": "They face preventable medical emergencies, medication errors cause hospitalizations, social isolation accelerates decline, family caregivers burn out from constant worry, and seniors lose independence prematurely."
    },
    {
        "who": "Event organizers, corporate event planners, and community builders managing gatherings and experiences",
        "pain": "They cobble together registration forms, email lists, payment collection, and attendee communication using disconnected tools. Last-minute changes become nightmares, attendee engagement drops off after registration, networking is left to chance, and measuring event success is guesswork.",
        "gap": "There's no end-to-end event platform that handles registration with smart ticketing, automated reminders, AI-powered attendee matching for networking, real-time updates via mobile app, engagement tracking, and post-event follow-up with analytics.",
        "impact": "They lose attendees to poor communication, struggle with low engagement and networking, waste hours on manual coordination, can't prove ROI to sponsors, and can't build lasting community beyond single events."
    },
    {
        "who": "Pet owners, groomers, sitters, trainers, and veterinary clinics managing pet care and services",
        "pain": "They manually manage bookings, pet profiles, medical records, owner communications, and payments. Emergency contacts and special instructions get lost, vaccination records are scattered, and finding trusted pet care is stressful for owners.",
        "gap": "There's no comprehensive pet care ecosystem that handles service booking, complete pet health records, owner-provider communication, payment processing, and connects pet owners with verified, reviewed care providers.",
        "impact": "They risk pet safety from lost medical information, lose bookings due to poor organization, struggle with payment collection, can't scale services, and pet owners face anxiety and poor care quality."
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
        # "Project Name: Something" format
        r'Project Name:\s*["\u201c]?([^"\u201d\n]+)["\u201d]?',
        r'Project:\s*["\u201c]?([^"\u201d\n]+)["\u201d]?',
        # Old format with quotes and dash
        r'Project\s*\n\s*["\u201c]([^"\u201d]+)["\u201d]\s*[-\u2013\u2014—–]\s*(.+?)(?=\n\s*Stack|\n\s*STACK|$)',
        r'Project:\s*["\u201c]([^"\u201d]+)["\u201d]\s*[-\u2013\u2014—–]\s*(.+?)(?=\n\s*Stack|\n\s*STACK|$)',
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
    
    # Extract description separately if not found with project name
    if not result["description"]:
        desc_match = re.search(r'Description:\s*(.+?)(?=\n\s*Stack|\n\s*STACK|\n\s*Deploy|\n\s*DEPLOY|$)', raw, re.IGNORECASE | re.DOTALL)
        if desc_match:
            result["description"] = desc_match.group(1).strip().replace('\n', ' ')
            print(f"DEBUG: Found description separately: '{result['description'][:50]}...'")
    
    # Extract Stack section
    stack_match = re.search(r'Stack:\s*(.+?)(?=\n\s*Deploy|\n\s*DEPLOY|\n\s*Why|\n\s*WHY|$)', raw, re.IGNORECASE | re.DOTALL)
    if stack_match:
        result["stack"] = stack_match.group(1).strip().replace('\n', ' ')
        print(f"DEBUG: Found stack: '{result['stack'][:50]}...'")
    else:
        print(f"DEBUG: Stack section not found in output")
    
    # Extract Deploy section
    deploy_match = re.search(r'Deploy:\s*(.+?)(?=\n\s*Why|\n\s*WHY|\n\s*Potential|\n\s*POTENTIAL|$)', raw, re.IGNORECASE | re.DOTALL)
    if deploy_match:
        result["deploy"] = deploy_match.group(1).strip().replace('\n', ' ')
        print(f"DEBUG: Found deploy: '{result['deploy'][:50]}...'")
    else:
        print(f"DEBUG: Deploy section not found")
    
    # Extract Docs & Links section
    docs_match = re.search(r'Docs & Links\s*\n\s*((?:\u2022.+(?:\n|$))+)', raw, re.IGNORECASE)
    if docs_match:
        result["docs"] = docs_match.group(1).strip()
        print(f"DEBUG: Found docs section")
    else:
        print(f"DEBUG: Docs section not found")
    
    # Extract Why now section (now "Why Now:")
    why_match = re.search(r'Why Now:\s*(.+?)(?=\n\s*Potential|\n\s*POTENTIAL|$)', raw, re.IGNORECASE | re.DOTALL)
    if why_match:
        result["whyNow"] = why_match.group(1).strip().replace('\n', ' ')
        print(f"DEBUG: Found why now: '{result['whyNow'][:50]}...'")
    
    # Extract Potential section
    potential_match = re.search(r'Potential:\s*(.+?)(?=\n\s*$|$)', raw, re.IGNORECASE | re.DOTALL)
    if potential_match:
        result["potential"] = potential_match.group(1).strip().replace('\n', ' ')
        print(f"DEBUG: Found potential: '{result['potential'][:50]}...'")
    
    # Fallback: Look for arrow format (legacy support)
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
            
        print(f"DEBUG: Found legacy arrow format - key='{key}', value='{value[:50]}...'")
        
        if key == "stack" and not result["stack"]:
            result["stack"] = value
        elif key == "deploy" and not result["deploy"]:
            result["deploy"] = value
        elif key == "who" and not result["who"]:
            result["who"] = value
        elif key == "pain" and not result["pain"]:
            result["pain"] = value
        elif key == "gap" and not result["gap"]:
            result["gap"] = value
        elif key in ("impact if unsolved", "impact") and not result["impact"]:
            result["impact"] = value
        elif key == "why now" and not result["whyNow"]:
            result["whyNow"] = value
        elif key == "potential" and not result["potential"]:
            result["potential"] = value
    
    print(f"DEBUG: Final parsed result - projectName: '{result['projectName']}'")
    return result

def save_idea(raw: str, domain: str = "", problem: dict = None):
    """Save a structured idea entry to ideas.json for the web dashboard."""
    try:
        parsed = parse_idea(raw)
        
        # If parsing failed to extract problem statement fields, use the injected problem domain
        if problem:
            if not parsed.get('who', '').strip():
                parsed['who'] = problem['who']
                print(f"DEBUG: Using injected WHO from problem domain")
            if not parsed.get('pain', '').strip():
                parsed['pain'] = problem['pain']
                print(f"DEBUG: Using injected PAIN from problem domain")
            if not parsed.get('gap', '').strip():
                parsed['gap'] = problem['gap']
                print(f"DEBUG: Using injected GAP from problem domain")
            if not parsed.get('impact', '').strip():
                parsed['impact'] = problem['impact']
                print(f"DEBUG: Using injected IMPACT from problem domain")
        
        idea_id = f"idea_{int(datetime.now().timestamp())}"
        
        # Quality validation - ensure we have core fields
        # Stack is optional since LLM often doesn't format it correctly
        required_fields = ['projectName', 'who', 'pain', 'gap']
        missing_core = [field for field in required_fields if not parsed.get(field, '').strip()]
        
        if missing_core:
            raise ValueError(f"Parsed idea missing core fields: {missing_core}")
        
        # Check for reasonable field lengths (not empty, not too long)
        if len(parsed['projectName']) < 3 or len(parsed['projectName']) > 150:
            raise ValueError(f"Project name length invalid: {len(parsed['projectName'])} chars")
        
        # Description is optional since LLM often doesn't format it correctly
        if parsed.get('description') and (len(parsed['description']) < 20 or len(parsed['description']) > 1000):
            print(f"⚠ Description length unusual: {len(parsed['description'])} chars, but continuing")
        
        if not parsed.get('description'):
            print(f"⚠ No description found, using project name as fallback")
            parsed['description'] = f"A platform for {parsed['projectName']}"
        
        # Build entry with raw text always included
        entry = {
            "id": idea_id,
            "createdAt": datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ"),  # UTC timestamp
            "domain": domain,
            "raw": raw,  # Always save the raw text for debugging
            "views": 0,  # Initialize views to 0
            "likes": 0,  # Initialize likes to 0
            "shares": 0,  # Initialize shares to 0
        }
        
        # Assign difficulty level based on stack complexity
        stack_text = parsed.get('stack', '').lower()
        if stack_text:
            # Count advanced technologies
            advanced_tech = ['kubernetes', 'docker', 'microservices', 'graphql', 'redis', 'elasticsearch', 
                           'kafka', 'rabbitmq', 'terraform', 'aws', 'gcp', 'azure', 'blockchain', 
                           'machine learning', 'ai', 'neural', 'tensorflow', 'pytorch', 'websocket']
            intermediate_tech = ['react', 'vue', 'angular', 'node.js', 'express', 'fastapi', 'django', 
                               'flask', 'postgresql', 'mongodb', 'prisma', 'nextauth', 'oauth']
            beginner_tech = ['next.js', 'supabase', 'firebase', 'stripe', 'tailwind', 'vercel', 'netlify']
            
            advanced_count = sum(1 for tech in advanced_tech if tech in stack_text)
            intermediate_count = sum(1 for tech in intermediate_tech if tech in stack_text)
            beginner_count = sum(1 for tech in beginner_tech if tech in stack_text)
            
            # More balanced difficulty assignment
            if advanced_count >= 2:
                entry['difficulty'] = 'expert'
            elif advanced_count >= 1:
                entry['difficulty'] = 'expert'
            elif intermediate_count >= 2:
                entry['difficulty'] = 'intermediate'
            elif beginner_count >= 2 and intermediate_count == 0:
                entry['difficulty'] = 'beginner'
            else:
                entry['difficulty'] = 'intermediate'
        else:
            # Default to intermediate if no stack info
            entry['difficulty'] = 'intermediate'
        
        # Add parsed fields only if they have content
        for key, value in parsed.items():
            if value and value.strip():  # Only add non-empty strings
                entry[key] = value
        
        ideas_store.append(entry)
        with open(IDEAS_FILE, "w") as f:
            json.dump(ideas_store, f, indent=2)
        print(f"✓ Idea saved to {IDEAS_FILE}")
        print(f"✓ Parsed project name: {parsed.get('projectName', 'N/A')}")
        print(f"✓ Raw text length: {len(raw)} chars")
        print(f"✓ Parsed {len([k for k, v in parsed.items() if v and v.strip()])} fields successfully")
        return idea_id
    except Exception as e:
        print(f"✗ Failed to save idea: {e}")
        print(f"✗ Raw text preview: {raw[:200]}...")
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
    
    prompt = f"""You are FocusLock. Generate ONE project idea for developers.

PROBLEM STATEMENT
WHO: {problem['who']}
PAIN: {problem['pain']}
GAP: {problem['gap']}
IMPACT: {problem['impact']}

Now generate:

Project Name: [A catchy 2-3 word name]

Description: [2-3 sentences describing what this platform does and how it works. Be specific about features.]

Stack: [List 5-7 technologies like Next.js, Supabase, Stripe, Tailwind CSS]

Deploy: [One sentence: which platform and why]

Why Now: [2 sentences: what makes this possible now]

Potential: [2 sentences: what impact this could have]

Keep it under 1000 words total. Be specific and concise."""

    try:
        print(f"🤖 Calling Ollama with model: {MODEL}")
        print(f"   Prompt length: {len(prompt)} chars")
        
        # Add timeout to prevent hanging
        response = ollama.generate(
            model=MODEL, 
            prompt=prompt,
            options={
                "temperature": 0.3,  # Even lower for more focused output
                "num_predict": 1200,  # Tighter limit
                "top_p": 0.85,  # More focused
            }
        )
        
        if not response or 'response' not in response:
            raise ValueError("Ollama returned empty or invalid response")
        
        generated_text = response["response"]
        print(f"✓ Ollama generated {len(generated_text)} characters")
        
        # Validate structure and quality
        required_sections = ['Project Name', 'Description', 'Stack']
        missing_sections = [section for section in required_sections if section not in generated_text]
        
        if missing_sections:
            print(f"⚠ Missing sections: {missing_sections}, but continuing")
        
        # Check for reasonable length (not too short, not too long)
        if len(generated_text) < 300:
            raise ValueError(f"Output too short ({len(generated_text)} chars)")
        if len(generated_text) > 6000:
            print(f"⚠ Output long ({len(generated_text)} chars), truncating...")
            generated_text = generated_text[:6000]
        
        return generated_text, domain_name, problem
    except Exception as e:
        print(f"❌ Ollama generation failed: {e}")
        import traceback
        traceback.print_exc()
        raise

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
    
    # Map keywords to domain names (updated for 2026 domains)
    if 'business' in who or 'freelancer' in who or 'solopreneur' in who:
        return "Small Business Operations"
    elif 'sales' in who or 'marketer' in who or 'founder' in who:
        return "Sales & Marketing"
    elif 'content creator' in who or 'influencer' in who or 'youtuber' in who or 'tiktoker' in who:
        return "Content Creation & Creator Economy"
    elif 'developer' in who or 'indie' in who or 'software engineer' in who or 'dev team' in who:
        return "Software Development & Indie Hacking"
    elif 'e-commerce' in who or 'seller' in who or 'd2c' in who or 'online store' in who:
        return "E-commerce & D2C Brands"
    elif 'student' in who or 'teacher' in who or 'trainer' in who or 'learner' in who:
        return "Education & EdTech"
    elif 'health' in who or 'fitness' in who or 'wellness' in who:
        return "Health & Wellness"
    elif 'mental health' in who or 'therapist' in who or 'anxiety' in who or 'depression' in who:
        return "Mental Health & Therapy"
    elif 'finance' in who or 'investing' in who or 'investor' in who or 'wealth' in who:
        return "Personal Finance & Wealth Building"
    elif 'sustainability' in who or 'green' in who or 'eco-conscious' in who or 'climate' in who or 'carbon' in who:
        return "Sustainability & Climate Tech"
    elif 'parent' in who or 'family' in who or 'caregiver' in who:
        return "Family & Parenting"
    elif 'travel' in who or 'hotel' in who or 'tour operator' in who or 'nomad' in who:
        return "Travel & Hospitality"
    elif 'real estate' in who or 'agent' in who or 'landlord' in who or 'property' in who:
        return "Real Estate & PropTech"
    elif 'logistics' in who or 'supply chain' in who or 'distributor' in who or 'delivery' in who:
        return "Logistics & Supply Chain"
    elif 'farm' in who or 'agri' in who or 'agritech' in who:
        return "Agriculture & Agritech"
    elif 'restaurant' in who or 'food service' in who or 'cloud kitchen' in who:
        return "Food Service & Restaurants"
    elif 'retail' in who or 'brick-and-mortar' in who or 'store' in who:
        return "Retail (Physical + Omni-channel)"
    elif 'hr' in who or 'recruiter' in who or 'talent' in who or 'hiring' in who:
        return "HR, Recruiting & Talent"
    elif 'legal' in who or 'law' in who or 'attorney' in who or 'lawyer' in who:
        return "LegalTech"
    elif 'consultant' in who or 'coach' in who or 'agency' in who or 'professional service' in who:
        return "Consulting & Professional Services"
    elif 'cybersecurity' in who or 'security' in who or 'breach' in who or 'cyber threat' in who:
        return "Cybersecurity & Privacy"
    elif 'photographer' in who or 'videographer' in who or 'designer' in who or 'creative' in who:
        return "Creative Tools (Photo/Video/Design)"
    elif 'senior' in who or 'elder' in who or 'aging' in who or 'elderly' in who:
        return "Elder Care & Aging Tech"
    elif 'event organizer' in who or 'event planner' in who:
        return "Event & Experience Management"
    elif 'pet' in who or 'groomer' in who or 'sitter' in who or 'veterinary' in who:
        return "Pet Care"
    else:
        return "General"

if __name__ == "__main__":
    try:
        print("🚀 FocusLock starting...")
        idea, domain, problem = generate_idea()
        
        # Validate AI generation
        if not idea or len(idea.strip()) < 100:
            error_msg = f"❌ CRITICAL: AI generation failed or returned insufficient content (length: {len(idea) if idea else 0})"
            print(error_msg)
            raise ValueError(error_msg)
        
        print(f"✓ AI generated {len(idea)} characters")
        timestamp = datetime.now().strftime('%b %d • %H:%M')
        
        # Parse the idea to get key fields (pass problem domain for fallback)
        parsed = parse_idea(idea)
        
        # Use injected problem domain values if parsing failed
        if not parsed.get('who', '').strip():
            parsed['who'] = problem['who']
            print(f"DEBUG: Using injected WHO from problem domain")
        if not parsed.get('pain', '').strip():
            parsed['pain'] = problem['pain']
            print(f"DEBUG: Using injected PAIN from problem domain")
        if not parsed.get('gap', '').strip():
            parsed['gap'] = problem['gap']
            print(f"DEBUG: Using injected GAP from problem domain")
        if not parsed.get('impact', '').strip():
            parsed['impact'] = problem['impact']
            print(f"DEBUG: Using injected IMPACT from problem domain")
        
        # Validate parsing results
        if not parsed.get('projectName'):
            error_msg = f"❌ CRITICAL: Failed to parse project name from AI output"
            print(error_msg)
            print(f"First 500 chars of AI output: {idea[:500]}")
            raise ValueError(error_msg)
        
        print(f"✓ Parsed project: {parsed['projectName']}")
        
        # Save full idea to JSON and get the ID (pass problem domain for fallback)
        idea_id = save_idea(idea, domain, problem)
        
        if not idea_id:
            error_msg = "❌ CRITICAL: Failed to save idea to JSON"
            print(error_msg)
            raise ValueError(error_msg)
        
        # Create shareable URL
        project_url = f"https://projectpulse-dev.vercel.app/dashboard?idea={idea_id}"
        
        # Shorten URL using TinyURL
        try:
            print("🔗 Shortening URL with TinyURL...")
            shorten_response = requests.get(
                f"https://tinyurl.com/api-create.php?url={requests.utils.quote(project_url)}",
                timeout=10
            )
            if shorten_response.status_code == 200:
                short_url = shorten_response.text.strip()
                if short_url and short_url.startswith('http'):
                    project_url = short_url
                    print(f"✓ URL shortened: {project_url}")
                else:
                    print(f"⚠ TinyURL returned invalid response, using original URL")
            else:
                print(f"⚠ TinyURL API error {shorten_response.status_code}, using original URL")
        except Exception as e:
            print(f"⚠ Failed to shorten URL: {e}, using original URL")
        
        # Create minimal Telegram message (title + problem statement + link)
        telegram_parts = []
        telegram_parts.append(f"*{parsed['projectName']}*")
        
        # Add problem statement (Who/Pain/Gap)
        if parsed.get('who') or parsed.get('pain') or parsed.get('gap'):
            telegram_parts.append(f"\n\n*Problem Statement*")
            if parsed.get('who'):
                telegram_parts.append(f"\n• Who: {parsed['who']}")
            if parsed.get('pain'):
                telegram_parts.append(f"\n• Pain: {parsed['pain']}")
            if parsed.get('gap'):
                telegram_parts.append(f"\n• Gap: {parsed['gap']}")
        
        telegram_parts.append(f"\n\n[📱 View full details on dashboard]({project_url})")
        
        short_idea = ''.join(telegram_parts)
        
        message = f"*FocusLock • Daily Spark*\n{timestamp} EAT\n\n{short_idea}\n\n_Next idea: Tomorrow at 10:00 AM EAT_"
        
        # Validate message before sending
        if len(message.strip()) < 100:
            error_msg = f"❌ CRITICAL: Message too short ({len(message)} chars), likely missing content"
            print(error_msg)
            print(f"Message preview: {message[:500]}")
            raise ValueError(error_msg)
        
        print(f"✓ Message ready ({len(message)} chars)")
        
        telegram_success = send_telegram(message)
        if not telegram_success:
            error_msg = "❌ CRITICAL: Failed to send message to Telegram"
            print(error_msg)
            raise RuntimeError(error_msg)
        
        log_activity("Delivered project with Problem Statement + clean stack")
        print("✅ FocusLock complete")
    except Exception as e:
        print(f"❌ FocusLock crashed: {e}")
        import traceback
        traceback.print_exc()
        
        # Send error notification to Telegram
        if TOKEN and CHAT_ID:
            error_time = datetime.now().strftime('%b %d • %H:%M')
            error_message = f"*FocusLock • Error Report*\n{error_time} EAT\n\n❌ Failed to generate daily idea\n\nError: {str(e)[:500]}\n\n_Will retry tomorrow at 10:00 AM EAT_"
            try:
                send_telegram(error_message)
                print("✓ Error notification sent to Telegram")
            except:
                print("✗ Failed to send error notification")
        
        raise
