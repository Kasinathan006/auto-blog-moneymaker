import os
from BotBlogger import generate_markdown_content, NICHES
import re

def update_all_posts():
    for niche in NICHES:
        print(f"Generating for {niche['topic']}")
        slug, content, date_str = generate_markdown_content(niche)
        
        file_path = os.path.join("posts", f"{slug}.md")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Saved to {file_path}")

update_all_posts()
