#!/usr/bin/env python3
"""
Quick test script to verify Telegram bot credentials.
Run: python test_telegram.py
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")

print("🔍 Testing Telegram Bot Configuration\n")

# Check if credentials exist
print("1. Checking environment variables...")
if not TOKEN:
    print("   ❌ TELEGRAM_TOKEN is missing")
else:
    print(f"   ✅ TELEGRAM_TOKEN exists (length: {len(TOKEN)})")

if not CHAT_ID:
    print("   ❌ CHAT_ID is missing")
else:
    print(f"   ✅ CHAT_ID: {CHAT_ID}")

if not TOKEN or not CHAT_ID:
    print("\n❌ Cannot proceed without credentials")
    print("\nTo fix:")
    print("1. Create .env file with:")
    print("   TELEGRAM_TOKEN=your_bot_token")
    print("   CHAT_ID=your_chat_id")
    exit(1)

# Test bot info
print("\n2. Testing bot connection...")
try:
    resp = requests.get(f"https://api.telegram.org/bot{TOKEN}/getMe", timeout=10)
    if resp.status_code == 200:
        bot_info = resp.json()
        if bot_info.get("ok"):
            bot = bot_info["result"]
            print(f"   ✅ Bot connected: @{bot.get('username')}")
            print(f"   Bot name: {bot.get('first_name')}")
        else:
            print(f"   ❌ Bot API error: {bot_info}")
    else:
        print(f"   ❌ HTTP {resp.status_code}: {resp.text}")
except Exception as e:
    print(f"   ❌ Connection failed: {e}")
    exit(1)

# Test sending a message
print("\n3. Sending test message...")
try:
    test_msg = "🧪 Test message from FocusLock\n\nIf you see this, your bot is working!"
    resp = requests.post(
        f"https://api.telegram.org/bot{TOKEN}/sendMessage",
        data={
            "chat_id": CHAT_ID,
            "text": test_msg,
            "parse_mode": "Markdown"
        },
        timeout=15
    )
    if resp.status_code == 200:
        print("   ✅ Test message sent successfully!")
        print("\n✅ All checks passed! Your Telegram bot is configured correctly.")
    else:
        print(f"   ❌ Failed to send message:")
        print(f"   HTTP {resp.status_code}: {resp.text}")
        print("\n💡 Common issues:")
        print("   - Wrong CHAT_ID (get it from @userinfobot)")
        print("   - Bot not started (send /start to your bot first)")
        print("   - Bot blocked by user")
except Exception as e:
    print(f"   ❌ Request failed: {e}")
    exit(1)
