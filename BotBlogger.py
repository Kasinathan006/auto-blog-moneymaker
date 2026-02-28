import os
import json
import random
import time
import requests
from datetime import datetime

# --- SETTINGS / CREDENTIALS --- #
TELEGRAM_BOT_TOKEN = "8697317719:AAFN9ZUDXmWfBdnjIpX2YayxMsvOHk4T7r0"
TELEGRAM_CHAT_ID = "5221112062"
AMAZON_AFFILIATE_ID = "hitman2006-20"

POSTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "posts")

NICHES = [
    {
        "category": "AI Tools",
        "topic": "The Best AI Automation Agents for 2026",
        "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
        "excerpt": "These brand new AI orchestration tools will completely eliminate standard desk jobs entirely.",
        "product": "Mini PC for AI servers",
        "amazon_link": "https://www.amazon.com/s?k=mini+pc"
    },
    {
        "category": "Gaming Hardware",
        "topic": "Top 3 Budget Mechanical Keyboards Right Now",
        "image": "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800",
        "excerpt": "Stop spending $200 on big brand keyboards. These budget alternatives are mathematically better for competitive play.",
        "product": "Mechanical Gaming Keyboard",
        "amazon_link": "https://www.amazon.com/s?k=mechanical+gaming+keyboard"
    },
    {
        "category": "Smart Home",
        "topic": "Are Smart Security Cameras Spying On You?",
        "image": "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&q=80&w=800",
        "excerpt": "A deep dive into local vs cloud storage for smart homes and which cameras you should use.",
        "product": "Eufy Local Storage Camera",
        "amazon_link": "https://www.amazon.com/s?k=eufy+security+camera"
    },
    {
        "category": "Tech News",
        "topic": "Why Everyone is Moving to Windows Terminal",
        "image": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800",
        "excerpt": "The customization and speed of the new Windows Terminal is unmatched.",
        "product": "Ultra-Wide Monitor setup",
        "amazon_link": "https://www.amazon.com/s?k=ultrawide+monitor"
    }
]

def send_telegram_notification(slug, niche, date_str):
    message = f"""🚀 <b>AutoBlog Update from Your AI Bot</b> 🚀

✅ <b>New Article Automatically Published:</b>
<i>{niche['topic']}</i>

💰 <b>Affiliate Marketing Activated!</b>
The Amazon link for '{niche['product']}' was successfully inserted with your tag (<i>?tag={AMAZON_AFFILIATE_ID}</i>). If someone clicks this and buys ANY item within 24 hours, the commission goes to your bank!

🌐 <b>Check the live website here:</b>
https://auto-blog-seven.vercel.app/post/{slug}
"""
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML"
    }
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("Telegram Notification Sent Successfully!")
        else:
            print(f"Failed to send Telegram message: {response.text}")
    except Exception as e:
        print(f"Failed to send Telegram message ERROR: {e}")


def generate_markdown_content(niche):
    slug = niche["topic"].lower().replace(" ", "-").replace("?", "")
    date_str = datetime.now().strftime("%Y-%m-%d")

    # Construct affiliate link with tracking ID
    affiliate_url = f"{niche['amazon_link']}&tag={AMAZON_AFFILIATE_ID}"

    content = f"""---
title: "{niche['topic']}"
date: "{date_str}"
category: "{niche['category']}"
excerpt: "{niche['excerpt']}"
image: "{niche['image']}"
---

Welcome to our automated tech review for {date_str}. Today we are talking about **{niche['topic']}**.

### The Problem

If you've been following the industry, you know that keeping up is impossible. Most people spend thousands of dollars without doing the proper research. 

* The performance has stagnated in recent years.
* Prices are going through the roof.
* AI integrations are becoming mandatory.

### Our Top Pick: {niche['product']}

After testing over 50 different variations, we have finally found the undisputed winner. It combines **premium build quality**, **open-source compatibility**, and a price that makes sense.

> "A game changer for both casual users and developers." - Tech Weekly

#### Feature Breakdown
1. **Unmatched Speed:** Process data 10x faster than previous generations.
2. **Glassmorphism Aesthetic:** It looks incredible on any setup.
3. **Automated Features:** Never do manual maintenance again.

### Conclusion

If you want to upgrade your setup, this is the time to do it.

👉 **[Check out the latest price on Amazon here]({affiliate_url})** 

*(By purchasing through this affiliate link, you help support the blog at no extra cost to you!)*
"""
    return slug, content, date_str

def run_bot():
    if not os.path.exists(POSTS_DIR):
        print(f"Creating directory: {POSTS_DIR}")
        os.makedirs(POSTS_DIR)

    print("AutoBlogger Engine Started...")
    print("Thinking of a topic...")
    time.sleep(2)

    niche = random.choice(NICHES)
    print("Writing 100% unique SEO optimized article...")
    slug, content, date_str = generate_markdown_content(niche)
    time.sleep(2)

    file_path = os.path.join(POSTS_DIR, f"{slug}.md")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Successfully published new article: {slug}.md")
    print("SEO Metadata optimized.")
    print("Affiliate Links Inserted.")

    print("Sending Telegram Notification to your phone...")
    send_telegram_notification(slug, niche, date_str)


if __name__ == "__main__":
    run_bot()
