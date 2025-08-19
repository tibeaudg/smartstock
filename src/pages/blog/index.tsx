import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { fetchBlogPosts } from '../../integrations/supabase/client';
import type { BlogPost } from '../../integrations/supabase/types';

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
    <>
      <SEO
        title="Blog | StockFlow"
        description="Lees de nieuwste blogposts over voorraadbeheer en optimalisatie."
        url="https://www.stockflow.be/blog"
      />
      <section className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id}>
              <Link to={`/blog/${post.slug}`} className="text-xl font-semibold text-blue-600 hover:underline">
                {post.title}
              </Link>
              <p className="text-gray-600">{post.meta_description}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
