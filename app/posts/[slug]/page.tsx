import { getPostData, getAllPostSlugs } from '../../../lib/posts';
import Link from 'next/link';

export async function generateStaticParams() {
    const paths = getAllPostSlugs();
    return paths.map((path) => ({
        slug: path.params.slug,
    }));
}

export default async function Post(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const postData = await getPostData(params.slug);

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <Link href="/" className="text-purple-400 hover:text-purple-300 transition-colors mb-8 inline-block font-medium">
                &larr; Back to Home
            </Link>

            <article className="glass-panel p-8 md:p-12 mt-6">
                <header className="mb-10 text-center">
                    <div className="inline-block px-3 py-1 bg-purple-900/40 text-purple-300 font-semibold text-sm rounded-full tracking-wider border border-purple-500/30 mb-6">
                        {postData.category}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                        {postData.title}
                    </h1>
                    <time className="text-gray-400 font-medium">{postData.date}</time>
                </header>

                {postData.image && (
                    <div className="w-full h-80 md:h-96 relative mb-12 rounded-xl overflow-hidden border border-gray-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={postData.image}
                            alt={postData.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}

                <div
                    className="prose prose-invert prose-lg max-w-none prose-a:text-rose-400 hover:prose-a:text-rose-300 prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
                />
            </article>

            {/* Affiliate Disclaimer */}
            <div className="mt-12 text-center text-gray-500 text-sm glass-panel p-6 border-transparent border-t-purple-900/50 block">
                <p>Disclaimer: This article may contain affiliate links. If you purchase through these links, we may earn a commission at no additional cost to you.</p>
            </div>
        </div>
    );
}
