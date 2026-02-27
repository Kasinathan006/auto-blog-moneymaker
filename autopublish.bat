@echo off
cd /d "C:\Users\mohan\Downloads\auto-blog"
echo Starting AutoBlog Daily Generation...
python BotBlogger.py
echo Deploying to Vercel...
call npx vercel --prod --yes
echo AutoBlog Task Completed!
