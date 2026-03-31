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

# Optimized problem domains for high-potential startup ideas (2026)
# Focus: AI-enabled solutions, emerging markets (Kenya/Africa), scalable business models
PROBLEM_DOMAINS = [
    # 1. Small Business Operations & Management
    {
        "who": "Small business owners, solopreneurs, and freelancers trying to scale their ventures profitably",
        "pain": "They juggle invoicing, client communication, bookkeeping, inventory, and marketing manually across 5-10 scattered tools. Cash flow tracking is a nightmare, client follow-ups get missed, tax compliance is stressful, and they have no clear view of profitability per service or product. Every admin task eats hours that could be spent on growth.",
        "gap": "There's no affordable, AI-powered business operating system that unifies money management, client relations, inventory, and operations in one place while providing intelligent insights and automation without requiring technical skills or expensive consultants.",
        "impact": "They lose 20-30% revenue through poor cash flow visibility and missed opportunities, waste 15+ hours weekly on repetitive admin tasks, make bad business decisions from incomplete data, and risk business failure from financial mismanagement and burnout."
    },
    
    # 2. Sales, Marketing & Growth
    {
        "who": "Founders, sales teams, and growth marketers trying to generate and convert leads consistently at scale",
        "pain": "They manually track prospects across spreadsheets, struggle with follow-up timing across channels, can't personalize outreach at scale, and have zero visibility into what messaging actually converts. Lead scoring is pure guesswork, pipeline forecasting is wildly inaccurate, attribution is impossible, and 70% of leads go cold from poor nurturing.",
        "gap": "There's no intelligent, affordable sales platform that automates personalized multi-channel outreach, scores leads using behavioral AI, optimizes follow-up timing, provides clear attribution from first touch to closed deal, and integrates seamlessly with existing tools without enterprise pricing.",
        "impact": "They waste 60-70% of hard-won leads through poor follow-up, spend 10+ hours weekly on manual data entry and list management, consistently miss revenue targets due to inaccurate forecasting, and burn marketing budget on channels that don't actually drive sales."
    },
    
    # 3. Content Creation & Creator Economy
    {
        "who": "Content creators, influencers, YouTubers, and TikTokers trying to grow audience and build sustainable income",
        "pain": "They struggle to maintain consistent posting schedules across platforms, can't identify what content actually performs, waste hours on editing and repurposing, have no system for brand partnerships, and struggle to diversify income beyond platform ads. Content ideas dry up, analytics are overwhelming, and monetization feels like constant guesswork.",
        "gap": "There's no AI-powered creator platform that generates content ideas from trends, automates editing and repurposing across formats, tracks cross-platform performance with actionable insights, connects creators with relevant brand partnerships, and recommends diversified monetization strategies based on audience data.",
        "impact": "They lose followers due to inconsistent posting, waste 20+ hours weekly on editing and admin, miss viral opportunities and lucrative brand deals, struggle to convert audience into sustainable full-time income, and burn out from the content treadmill."
    },
    
    # 4. AI-Powered Software Development
    {
        "who": "Indie developers, software engineers, and small dev teams building products and tools with limited resources",
        "pain": "They waste 40% of time on repetitive boilerplate code and setup, struggle with deployment complexity and DevOps, can't afford expensive dev tools and infrastructure, have inconsistent code quality without proper review, accumulate technical debt while rushing features, and lack clear paths from idea to production-ready product.",
        "gap": "There's no affordable, integrated AI development platform that generates production-quality boilerplate, provides intelligent code review and refactoring suggestions, handles deployment complexity automatically, maintains quality standards, and helps solo developers ship at team velocity.",
        "impact": "They spend 40-50% of time on non-feature work, ship buggy code due to lack of review and testing, struggle with scaling and performance issues in production, burn out trying to maintain quality while moving fast, and lose competitive advantage to better-resourced teams."
    },
    
    # 5. E-commerce & D2C Brands
    {
        "who": "E-commerce sellers, D2C brands, and online store owners managing inventory and orders across multiple platforms",
        "pain": "They manually track stock across marketplaces (Shopify, Amazon, social), respond to customer queries on 5+ channels, struggle with shipping logistics and returns, have no clear view of profitability per product or channel, can't predict inventory needs, and waste hours on repetitive customer service messages.",
        "gap": "There's no unified, AI-powered commerce platform that syncs inventory in real-time across all channels, centralizes customer communication with smart automation, provides clear profit analytics per SKU, predicts optimal stock levels, and automates routine customer service without losing the personal touch.",
        "impact": "They oversell products causing customer complaints and refunds, waste 15+ hours weekly on repetitive messages, lose money on unprofitable items they keep restocking, face cash flow crises from poor inventory planning, and can't scale beyond current capacity without expensive hires."
    },
    
    # 6. Education, EdTech & Reskilling
    {
        "who": "Students, professionals, corporate trainers, and lifelong learners trying to acquire and teach skills effectively in a rapidly changing job market",
        "pain": "They're overwhelmed by scattered learning resources, can't track meaningful progress beyond course completion, struggle with engagement and retention in online learning, have no way to verify actual skill mastery, don't know what skills to learn next for career goals, and teachers can't personalize at scale or prove learning outcomes.",
        "gap": "There's no adaptive AI learning platform that personalizes content based on learning style and goals, tracks true skill mastery through practical application (not just quizzes), provides AI tutoring for stuck moments, recommends optimal learning paths based on career goals and market demand, and helps educators scale personalized instruction.",
        "impact": "They waste months on ineffective learning methods and irrelevant skills, struggle with retention and real-world application, can't prove competence to employers beyond certificates, teachers burn out trying to personalize for every student, and the skills gap continues widening despite massive EdTech investment."
    },
    
    # 7. Health & Wellness
    {
        "who": "Health-conscious individuals, fitness enthusiasts, and wellness seekers trying to improve physical and mental wellbeing sustainably",
        "pain": "They're lost in conflicting diet and fitness advice, can't stick to workout plans that don't adapt to their life, track progress inconsistently across multiple apps, ignore mental health and sleep until crisis hits, and generic fitness apps don't account for injuries, preferences, or real-life constraints. Personal trainers and nutritionists are too expensive for ongoing support.",
        "gap": "There's no adaptive AI wellness system that combines personalized nutrition based on biometrics and preferences, progressive fitness plans that adjust to performance and constraints, mental health check-ins with intervention suggestions, sleep optimization, and sustainable habit formation based on behavioral science and individual goals.",
        "impact": "They waste money on ineffective programs and supplements, yo-yo between fitness phases losing progress, develop chronic health problems from neglect, feel constant guilt and anxiety about unmet wellness goals, and never achieve sustainable healthy habits."
    },
    
    # 8. Mental Health & Therapy
    {
        "who": "Individuals struggling with anxiety, depression, stress, and therapists managing client care and practice operations",
        "pain": "They can't afford traditional therapy ($100-300/session), wait weeks for appointments, struggle to find the right therapist match, have zero support between weekly sessions when they need it most, and therapists juggle HIPAA-compliant notes, scheduling, insurance billing, and client progress tracking across disconnected systems while trying to provide quality care.",
        "gap": "There's no accessible, affordable mental health platform that provides AI-powered daily check-ins and coping tools, matches users with therapists based on needs and communication style using smart algorithms, offers evidence-based between-session support, and helps therapists manage practice operations compliantly while serving more people.",
        "impact": "They suffer in silence due to cost and access barriers ($200B global treatment gap), experience preventable crises without support, and therapists burn out from 15+ hours weekly on admin burden while serving far fewer people than they could, perpetuating the global mental health crisis."
    },
    
    # 9. Personal Finance & Fintech
    {
        "who": "Individuals, young professionals, and underserved populations (especially in emerging markets like Kenya) trying to build wealth and achieve financial security",
        "pain": "They track expenses manually or not at all, can't visualize long-term financial goals, struggle to optimize savings and investments across accounts, miss tax-saving opportunities, have no access to affordable credit or financial advice, face high remittance fees, and feel constant anxiety about money and retirement readiness.",
        "gap": "There's no holistic AI financial coach that aggregates all accounts (including mobile money), projects retirement scenarios with real-time adjustments, recommends tax optimizations and savings strategies, identifies wasteful spending patterns, provides affordable micro-investing and credit access, and offers personalized wealth-building guidance based on income, goals, and local context.",
        "impact": "They miss wealth-building opportunities and pay thousands in unnecessary fees and taxes, make suboptimal financial decisions from incomplete information, remain excluded from formal financial systems, feel constant anxiety about money, and risk not achieving financial independence or security."
    },
    
    # 10. Sustainability & Climate Tech
    {
        "who": "Green businesses, eco-conscious consumers, and companies trying to reduce environmental impact and achieve climate goals",
        "pain": "They want to make sustainable choices but can't verify environmental claims (greenwashing is rampant), struggle to measure carbon footprint accurately across operations, find sustainable alternatives expensive or hard to source, have no clear actionable path to carbon neutrality, and can't prove environmental impact to stakeholders and customers.",
        "gap": "There's no transparent, AI-powered sustainability platform that verifies environmental claims with data, calculates accurate carbon footprints across scope 1-3 emissions, recommends cost-effective sustainable alternatives with ROI analysis, connects buyers with verified green suppliers, tracks progress toward climate goals, and generates credible impact reports.",
        "impact": "They unknowingly support greenwashing and contribute to climate crisis despite good intentions, overpay for fake sustainability certifications, can't prove environmental impact to investors and customers, miss significant cost savings from efficiency improvements, and face increasing regulatory and reputational risks."
    },
    
    # 11. Family & Parenting
    {
        "who": "Parents, caregivers, and families managing household operations, children's development, and family wellbeing",
        "pain": "They coordinate school activities, medical appointments, meal planning, and budgets across multiple apps while trying to track kids' academic progress, screen time, emotional wellbeing, and developmental milestones. Everything feels urgent, nothing gets proper attention, guilt is constant, and family members aren't aligned on schedules and responsibilities.",
        "gap": "There's no family operating system that centralizes schedules with smart conflict resolution, automates meal planning and grocery lists based on preferences and nutrition, tracks child development milestones with age-appropriate activity recommendations, manages shared expenses transparently, and provides gentle reminders and insights for better family coordination.",
        "impact": "They miss important appointments and developmental milestones, feel constantly overwhelmed and guilty, struggle with work-life balance and parental burnout, waste money on duplicate purchases and unused subscriptions, and worry they're failing their children due to disorganization and lack of quality time."
    },
    
    # 12. Travel, Tourism & Hospitality
    {
        "who": "Travelers, digital nomads, hotels, and tour operators trying to plan and deliver better, more authentic travel experiences",
        "pain": "They spend 10+ hours researching destinations across scattered sources, can't find authentic local experiences beyond tourist traps, struggle with language barriers and logistics, have no personalized recommendations based on interests and budget, and hotels and tour operators can't compete with big OTA platforms, losing 20-30% to commissions and having no direct customer relationships.",
        "gap": "There's no intelligent AI travel platform that provides personalized itineraries based on interests and real-time conditions, connects travelers with verified local guides and authentic experiences, handles real-time translation and logistics seamlessly, and helps small hospitality businesses compete with OTAs through direct booking tools, CRM, and dynamic pricing.",
        "impact": "They waste precious vacation time on poor planning and tourist traps, overpay for mediocre experiences, miss authentic cultural connections, and small hospitality businesses lose 20-30% revenue to platform commissions, struggle with occupancy optimization, and risk closure competing with big platforms."
    },
    
    # 13. Real Estate & PropTech
    {
        "who": "Real estate agents, property investors, landlords, and homebuyers navigating complex property transactions and management",
        "pain": "They juggle property listings, client communications, market analysis, document signing, and lead generation across disconnected platforms. Leads fall through cracks, market timing is guesswork, property management is chaotic with maintenance requests in texts and emails, rent collection is manual, and investment decisions lack data-driven insights.",
        "gap": "There's no unified AI proptech platform that combines listing management, intelligent market analysis with price predictions, client CRM with automated follow-ups, digital document handling, automated rent collection and maintenance tracking, and predictive analytics for property investment decisions based on local market data.",
        "impact": "They lose deals to more organized competitors, miss optimal buying/selling windows costing thousands, waste 15+ hours weekly on manual follow-ups and coordination, lose rental income from poor management and vacancies, and make costly investment mistakes from incomplete or outdated market data."
    },
    
    # 14. Logistics & Supply Chain
    {
        "who": "E-commerce businesses, distributors, small logistics companies, and farmers (especially in Africa) managing supply chain and deliveries",
        "pain": "They manually coordinate shipments across carriers, have zero real-time visibility into inventory location and condition, struggle with route optimization wasting fuel and time, face unexpected delays without proactive alerts, can't accurately predict delivery times to customers, and lose products to theft and spoilage due to poor tracking.",
        "gap": "There's no affordable AI logistics platform that provides real-time tracking across all carriers and modes, optimizes routes using traffic and weather data, predicts delays before they happen with alternative solutions, automates carrier selection based on cost and reliability, integrates seamlessly with e-commerce and ERP systems, and works in emerging markets with limited infrastructure.",
        "impact": "They waste 20-30% on inefficient routing and fuel costs, lose customers due to poor delivery experience and missed promises, can't scale operations beyond current capacity, face cash flow crises from inventory visibility gaps, and lose significant revenue to theft, spoilage, and failed deliveries."
    },
    
    # 15. Agriculture Tech (Agritech)
    {
        "who": "Smallholder farmers, agribusinesses, and agritech startups (especially in Kenya and Africa) trying to modernize agriculture and improve yields",
        "pain": "They wrestle with unpredictable weather destroying crops, market price volatility eating profits, limited access to quality inputs and credit, poor supply chain visibility leading to post-harvest losses, lack of data for informed planting decisions, can't access buyers directly, and pest/disease detection happens too late. Record-keeping is non-existent, blocking access to credit and insurance.",
        "gap": "There's no integrated AI agritech platform that combines hyper-local weather forecasts and alerts, real-time market prices and buyer connections, input sourcing and credit access, farm management with IoT sensors and satellite imagery, pest/disease detection via image recognition, yield prediction, digital record-keeping for credit access, and direct buyer marketplace.",
        "impact": "They lose 30-40% of harvests to preventable issues (pests, weather, disease), sell crops 20-30% below market rate due to poor timing and middlemen, struggle with food security and poverty, remain trapped in subsistence farming, can't access credit or insurance without records, and miss the agricultural revolution happening globally."
    },
    
    # 16. Food Service & Restaurant Operations
    {
        "who": "Restaurant owners, cloud kitchens, and food service managers trying to run profitable operations in a low-margin industry",
        "pain": "They struggle with inventory management leading to 20-30% food waste, staff scheduling chaos causing over/understaffing, online orders from 5+ platforms, table reservations and waitlists, customer feedback scattered everywhere, and have no clear view of dish profitability or customer preferences. Menu pricing is guesswork, and they can't compete with chain restaurant efficiency.",
        "gap": "There's no affordable, integrated AI restaurant management system that handles inventory with waste tracking and auto-ordering, smart staff scheduling based on predicted demand, unified online ordering across all platforms, reservation management with waitlist optimization, customer engagement and feedback analysis, and provides clear profitability analytics per dish with menu optimization recommendations.",
        "impact": "They lose 20-30% revenue through food waste and theft, poor scheduling costs thousands monthly in labor, miss online orders losing customers to competitors, can't compete with chain efficiency and data-driven decisions, make menu decisions that hurt profitability, and risk closure in an industry with 60% failure rate."
    },
    
    # 17. HR, Recruiting & Talent Management
    {
        "who": "HR teams, recruiters, and growing companies trying to find, hire, and retain top talent in a competitive market",
        "pain": "They manually screen hundreds of resumes wasting days, struggle to assess cultural fit and soft skills, can't track candidate experience leading to drop-offs, lose top talent to faster competitors, have no data on what makes employees stay or leave, onboarding is chaotic and inconsistent, and retention is pure guesswork with exit interviews providing insights too late.",
        "gap": "There's no intelligent AI talent platform that automates resume screening with bias reduction, assesses cultural fit through behavioral analysis and simulations, tracks and optimizes candidate experience, speeds up hiring with automated scheduling and communication, predicts flight risk with early intervention recommendations, and provides data-driven retention strategies.",
        "impact": "They lose top candidates to faster competitors (best talent is off market in 10 days), waste thousands on bad hires that leave within 6 months, struggle with 20-30% annual turnover, can't scale hiring to support growth, have no insight into why good people leave, and face massive costs from constant recruiting and training."
    },
    
    # 18. Cybersecurity & Privacy
    {
        "who": "Small businesses, freelancers, and individuals trying to protect themselves from cyber threats and data breaches",
        "pain": "They don't know where their vulnerabilities are, can't afford enterprise security tools ($10K+/year), struggle with password management across 50+ accounts, have no backup strategy risking total data loss, don't understand compliance requirements (GDPR, etc.), and one breach could destroy their business, reputation, or personal finances. Ransomware attacks are rising 150% year-over-year.",
        "gap": "There's no affordable, automated AI cybersecurity platform for non-technical users that continuously scans for vulnerabilities with fix guidance, manages passwords and 2FA seamlessly, automates encrypted backups, monitors for breaches and identity theft, provides clear compliance guidance and automation, and offers cyber insurance integration.",
        "impact": "They lose everything to ransomware attacks (average $200K cost), face lawsuits and fines from data breaches, waste thousands and weeks recovering from incidents, lose customer trust permanently, risk business closure from a single security failure, and live with constant anxiety about the next attack."
    },
    
    # 19. LegalTech
    {
        "who": "Lawyers, small law firms, and legal freelancers managing cases, clients, and compliance requirements",
        "pain": "They manually track case deadlines across multiple courts risking malpractice, client communications are scattered across email/text/calls, billable hours go unrecorded losing 20-30% revenue, document versions are chaos, missing a single deadline can mean malpractice suits and bar complaints, legal research is time-consuming and expensive ($500+/month), and contract review takes hours.",
        "gap": "There's no affordable, bar-compliant AI case management system for solo practitioners that automates deadline tracking with court calendar integration and alerts, captures billable time automatically, manages documents with version control and e-signature, provides AI-powered legal research and contract analysis, and generates client communications and reports.",
        "impact": "They risk malpractice and bar complaints from missed deadlines, lose 20-30% revenue from unbilled hours and write-offs, waste 10+ hours weekly on admin work instead of billable client work, pay thousands annually for legal research databases, can't scale their practice beyond current capacity, and face constant stress and burnout."
    },
    
    # 20. Consulting & Professional Coaching
    {
        "who": "Consultants, coaches, agencies, and professional service providers delivering expertise to multiple clients",
        "pain": "They struggle with session scheduling across timezones, client onboarding is manual and inconsistent taking hours per client, progress tracking is scattered across tools, resource delivery is ad-hoc, invoicing is delayed losing cash flow, can't demonstrate clear ROI leading to churn, and each client relationship requires repetitive manual management. They can't scale beyond 10-15 active clients.",
        "gap": "There's no unified AI platform for service-based professionals that automates the entire client lifecycle from lead capture to onboarding to delivery to invoicing, tracks outcomes and ROI automatically with visual reports, provides client portals for self-service, suggests personalized recommendations based on client data, and enables scaling to 50+ clients without additional overhead.",
        "impact": "They can't scale beyond 10-15 clients hitting an income ceiling, waste 15-20 hours weekly on repetitive admin tasks, struggle to demonstrate value leading to 30-40% annual churn, lose revenue from delayed invoicing and poor follow-up, burn out from manual client management, and leave money on the table from inability to serve more clients."
    },
    
    # 21. Pet Care Services
    {
        "who": "Pet owners, groomers, sitters, trainers, and veterinary clinics managing pet care and services",
        "pain": "They manually manage bookings across phone/text/email, pet profiles and medical records are scattered or on paper, owner communications are chaotic, emergency contacts and special instructions get lost risking pet safety, vaccination records are incomplete, payment collection is awkward and delayed, and finding trusted, available pet care is stressful for owners.",
        "gap": "There's no comprehensive AI pet care ecosystem that handles service booking with availability matching, complete digital pet health records accessible to all providers, owner-provider communication with automated updates and photos, payment processing with subscription options, and connects pet owners with verified, reviewed, available care providers based on pet needs and location.",
        "impact": "They risk pet safety and health from lost medical information and instructions, lose bookings due to poor organization and slow responses, struggle with payment collection and cash flow, can't scale services beyond current capacity, face liability from incomplete records, and pet owners face constant anxiety and poor care quality for their family members."
    },
    
    # 22. Creative Tools (Photo/Video/Design)
    {
        "who": "Photographers, videographers, designers, and creative agencies managing projects and client deliverables",
        "pain": "They juggle client inquiries across channels, project briefs get lost, asset management is chaos (where's that file?), editing workflows are manual and repetitive, revision requests are endless and unstructured, file delivery is clunky, invoicing is delayed, and clients don't understand the creative process leading to scope creep. They waste hours searching for assets and managing feedback.",
        "gap": "There's no unified AI creative operations platform that handles client onboarding and brief management, asset organization with AI tagging and search, collaborative editing with structured feedback tools, automated file delivery with client galleries, streamlined invoicing with usage rights tracking, and AI-powered editing assistance for repetitive tasks.",
        "impact": "They lose bookings due to slow responses and unprofessional processes, waste 10+ hours weekly searching for assets and managing scattered feedback, struggle with endless revision cycles killing profitability, miss payment follow-ups losing cash flow, can't scale beyond a few simultaneous projects, and burn out from administrative overhead instead of creative work."
    },
    
    # 23. Elder Care & Aging Tech
    {
        "who": "Seniors, family caregivers, and elder care facilities trying to ensure safety and quality of life for aging adults",
        "pain": "They worry constantly about medication adherence (leading to 125K deaths/year), fall detection and emergency response, social isolation accelerating cognitive decline, wandering and safety, coordinating care across family members and professionals is chaotic, and seniors resist intrusive monitoring that makes them feel helpless and strips dignity. Care facilities struggle with staff coordination and compliance.",
        "gap": "There's no dignified AI elder care platform that monitors health passively through non-intrusive smart home sensors, reminds about medications gently with adherence tracking, detects falls and emergencies with automatic alerts, facilitates family coordination with care updates, provides cognitive exercises and social connection opportunities, and helps facilities manage care plans and compliance efficiently.",
        "impact": "They face preventable medical emergencies and hospitalizations costing thousands, medication errors cause 125K+ deaths annually, social isolation accelerates cognitive decline and depression, family caregivers burn out from constant worry and coordination (40+ hours/week unpaid), seniors lose independence prematurely, and care facilities face liability and compliance issues."
    },
    
    # 24. Event & Experience Management
    {
        "who": "Event organizers, corporate event planners, and community builders managing gatherings and experiences",
        "pain": "They cobble together registration forms, email lists, payment collection, and attendee communication using 5+ disconnected tools. Last-minute changes become nightmares, attendee engagement drops off after registration, networking is left to chance missing the main value, measuring event success and ROI is guesswork, and they can't build lasting community beyond single events.",
        "gap": "There's no end-to-end AI event platform that handles registration with smart ticketing and pricing, automated reminders and updates, AI-powered attendee matching for networking based on interests and goals, real-time updates via mobile app, engagement tracking and gamification, post-event follow-up with community building, and clear ROI analytics for sponsors and stakeholders.",
        "impact": "They lose 30-40% of registered attendees to poor communication and engagement, struggle with low networking satisfaction (the main reason people attend), waste 20+ hours on manual coordination and last-minute changes, can't prove ROI to sponsors losing future funding, can't build lasting community beyond single events, and miss opportunities to create recurring revenue from engaged communities."
    },
    
    # 25. Local Services Marketplace
    {
        "who": "Local service providers (plumbers, electricians, tutors, cleaners, handymen) and customers trying to find and book trusted services",
        "pain": "Providers rely on word-of-mouth and expensive middleman platforms (taking 20-30% commission), struggle with online visibility and professional booking systems, lose clients to more tech-savvy competitors, have irregular income and cash flow issues, and customers can't find trusted, available, affordable local services easily, facing long wait times and quality uncertainty.",
        "gap": "There's no local services marketplace platform designed for emerging markets that handles discovery with verified reviews and background checks, professional booking and scheduling, transparent pricing, secure payments with flexible options (mobile money, installments), and helps service providers build their business with CRM, invoicing, and marketing tools without high commissions.",
        "impact": "Providers remain dependent on expensive middleman platforms losing 20-30% of income, struggle with irregular income and can't scale beyond immediate network, miss potential clients due to poor online presence, and customers waste hours finding trusted services, overpay for mediocre work, face safety concerns, and have no recourse for poor service quality."
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
    
    # Map keywords to domain names (optimized for 2026 startup domains)
    if 'small business' in who or 'solopreneur' in who or 'freelancer' in who:
        return "Small Business Operations & Management"
    elif 'sales' in who or 'marketer' in who or 'founder' in who or 'growth' in who:
        return "Sales, Marketing & Growth"
    elif 'content creator' in who or 'influencer' in who or 'youtuber' in who or 'tiktoker' in who:
        return "Content Creation & Creator Economy"
    elif 'developer' in who or 'indie' in who or 'software engineer' in who or 'dev team' in who:
        return "AI-Powered Software Development"
    elif 'e-commerce' in who or 'd2c' in who or 'online store' in who:
        return "E-commerce & D2C Brands"
    elif 'student' in who or 'teacher' in who or 'trainer' in who or 'learner' in who or 'professional' in who and 'reskilling' in who:
        return "Education, EdTech & Reskilling"
    elif 'health' in who or 'fitness' in who or 'wellness' in who:
        return "Health & Wellness"
    elif 'mental health' in who or 'therapist' in who or 'anxiety' in who or 'depression' in who:
        return "Mental Health & Therapy"
    elif 'finance' in who or 'fintech' in who or 'investor' in who or 'wealth' in who or 'underserved' in who:
        return "Personal Finance & Fintech"
    elif 'sustainability' in who or 'green' in who or 'eco-conscious' in who or 'climate' in who or 'carbon' in who:
        return "Sustainability & Climate Tech"
    elif 'parent' in who or 'family' in who or 'caregiver' in who:
        return "Family & Parenting"
    elif 'travel' in who or 'hotel' in who or 'tour operator' in who or 'nomad' in who or 'hospitality' in who:
        return "Travel, Tourism & Hospitality"
    elif 'real estate' in who or 'agent' in who or 'landlord' in who or 'property' in who or 'proptech' in who:
        return "Real Estate & PropTech"
    elif 'logistics' in who or 'supply chain' in who or 'distributor' in who or 'delivery' in who:
        return "Logistics & Supply Chain"
    elif 'farm' in who or 'agri' in who or 'agritech' in who:
        return "Agriculture Tech (Agritech)"
    elif 'restaurant' in who or 'food service' in who or 'cloud kitchen' in who:
        return "Food Service & Restaurant Operations"
    elif 'hr' in who or 'recruiter' in who or 'talent' in who or 'hiring' in who:
        return "HR, Recruiting & Talent Management"
    elif 'cybersecurity' in who or 'security' in who or 'breach' in who or 'cyber threat' in who or 'privacy' in who:
        return "Cybersecurity & Privacy"
    elif 'legal' in who or 'law' in who or 'attorney' in who or 'lawyer' in who:
        return "LegalTech"
    elif 'consultant' in who or 'coach' in who or 'agency' in who or 'professional service' in who:
        return "Consulting & Professional Coaching"
    elif 'pet' in who or 'groomer' in who or 'sitter' in who or 'veterinary' in who:
        return "Pet Care Services"
    elif 'photographer' in who or 'videographer' in who or 'designer' in who or 'creative' in who:
        return "Creative Tools (Photo/Video/Design)"
    elif 'senior' in who or 'elder' in who or 'aging' in who or 'elderly' in who:
        return "Elder Care & Aging Tech"
    elif 'event organizer' in who or 'event planner' in who:
        return "Event & Experience Management"
    elif 'service provider' in who or 'plumber' in who or 'electrician' in who or 'tutor' in who or 'cleaner' in who or 'handyman' in who:
        return "Local Services Marketplace"
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
