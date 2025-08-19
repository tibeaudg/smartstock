import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { fetchBlogPosts } from '../../integrations/supabase/client';
import type { BlogPost } from '../../integrations/supabase/types';

import { BlogLayout } from '../../components/BlogLayout';

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await fetchBlogPosts();
        setPosts(data.filter(p => p.published));
      } catch (err) {
        setError('Er is een fout opgetreden bij het laden van de blogposts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  if (loading) {
    return <div>Laden...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <BlogLayout
      title="Blog | StockFlow"
    >
      <SEO
        title="Blog | StockFlow"
        description="Lees de nieuwste blogposts over voorraadbeheer en optimalisatie."
        url="https://www.stockflow.be/blog"
      />
      <div className="grid gap-8">
        {posts.map(post => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-transform hover:scale-[1.02] hover:shadow-lg">
            {post.og_image && (
              <img 
                src={post.og_image} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <Link to={`/blog/${post.slug}`} className="block">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-4">{post.meta_description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <time dateTime={post.date_published}>
                  {new Date(post.date_published).toLocaleDateString('nl-BE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span className="mx-2">•</span>
                <span>{post.author || 'StockFlow'}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </BlogLayout>
  );
}
