const express = require('express');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter'); const app = express();
const PORT = 3000;

// The Stitch HTML Template
const STITCH_TEMPLATE = `
<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>AutoBlog - The Future is Now</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
    <script>
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#7f13ec",
                        "background-light": "#f7f6f8",
                        "background-dark": "#0a0510",
                    },
                    fontFamily: {
                        "display": ["Space Grotesk", "sans-serif"]
                    }
                }
            }
        }
    </script>
    <style>
        .glass { background: rgba(127, 19, 236, 0.05); backdrop-filter: blur(12px); border: 1px solid rgba(127, 19, 236, 0.1); }
        .hero-gradient { background: radial-gradient(circle at top right, rgba(127, 19, 236, 0.15), transparent), radial-gradient(circle at bottom left, rgba(127, 19, 236, 0.05), transparent); }
    </style>
</head>
<body class="bg-background-dark font-display text-slate-100 antialiased overflow-x-hidden">
    <div class="relative flex h-screen w-full flex-col max-w-2xl mx-auto overflow-y-auto">
        <!-- Header -->
        <header class="sticky top-0 z-50 flex items-center bg-background-dark/80 backdrop-blur-md px-4 py-4 justify-between border-b border-primary/10">
            <a href="/" class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition">
                <span class="material-symbols-outlined">home</span>
            </a>
            <h1 class="text-slate-100 text-xl font-bold italic">AutoBlog</h1>
            <div class="flex size-10 items-center justify-end"></div>
        </header>

        <!-- Dynamic Content -->
        <main class="flex-1 pb-24">
            {{CONTENT}}
        </main>
    </div>
</body>
</html>
`;

function getPosts() {
    const postsDir = path.join(process.cwd(), 'posts');
    if (!fs.existsSync(postsDir)) return [];

    return fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.md'))
        .map(file => {
            const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
            const parsed = matter(content);
            return {
                slug: file.replace('.md', ''),
                ...parsed.data
            };
        });
}

// Homepage Route
app.get('/', (req, res) => {
    const posts = getPosts();

    let postsHtml = posts.map(post => `
        <a href="/post/${post.slug}" class="block mt-4">
            <div class="glass rounded-xl overflow-hidden flex flex-col transition-transform hover:scale-[1.02]">
                <div class="h-40 bg-cover bg-center" style="background-image: url('${post.image}')"></div>
                <div class="p-4 flex flex-col">
                    <span class="text-primary text-xs font-bold uppercase mb-2">${post.category}</span>
                    <h4 class="text-slate-100 text-lg font-bold mb-2">${post.title}</h4>
                    <p class="text-slate-400 text-sm line-clamp-2">${post.excerpt}</p>
                </div>
            </div>
        </a>
    `).join('');

    const homeContent = `
        <div class="p-4">
            <div class="relative group overflow-hidden rounded-xl aspect-[16/10] flex flex-col justify-end p-6 border border-primary/20 hero-gradient">
                <div class="absolute inset-0 bg-cover bg-center" style="background-image: linear-gradient(to top, rgba(10, 5, 16, 0.95), rgba(10, 5, 16, 0.2)), url('https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800');"></div>
                <div class="relative z-10">
                    <span class="px-2 py-1 rounded-md bg-primary text-[10px] font-bold uppercase tracking-widest text-white mb-3 inline-block">Featured</span>
                    <h2 class="text-white text-3xl font-bold leading-tight mb-2">The Future is Now</h2>
                    <p class="text-slate-300 text-sm">Automated curation, reviews, and analysis generated entirely by AI.</p>
                </div>
            </div>
        </div>
        <section class="mt-4 px-4">
            <h3 class="text-slate-100 text-xl font-bold flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary">bolt</span> Latest AI Articles
            </h3>
            ${posts.length > 0 ? postsHtml : '<p class="text-slate-500">Run BotBlogger.py to generate articles!</p>'}
        </section>
    `;

    res.send(STITCH_TEMPLATE.replace('{{CONTENT}}', homeContent));
});

// Post Route
app.get('/post/:slug', async (req, res) => {
    try {
        const filePath = path.join(process.cwd(), 'posts', req.params.slug + '.md');
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = matter(content);
        const { marked } = await import('marked');
        const htmlContent = marked(parsed.content);

        const postHtml = `
            <article class="p-6">
                <img src="${parsed.data.image}" class="w-full h-48 object-cover rounded-xl mb-6 shadow-lg border border-primary/20" />
                <span class="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4 inline-block">${parsed.data.category}</span>
                <h1 class="text-3xl font-bold mb-2 leading-tight">${parsed.data.title}</h1>
                <p class="text-slate-500 text-sm mb-8">${parsed.data.date}</p>
                
                <div class="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-100 prose-a:text-primary max-w-none">
                    ${htmlContent}
                </div>
            </article>
        `;

        res.send(STITCH_TEMPLATE.replace('{{CONTENT}}', postHtml));
    } catch (e) {
        res.status(404).send("<h1 class='text-white p-8'>Article not found</h1>");
    }
});

// Vercel Serverless Export
module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Zero-Error Express Server running on http://localhost:${PORT}`);
    });
}
