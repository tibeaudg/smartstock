import React from 'react';
import blogposts from '../lib/blogposts.json';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function BlogListPage() {
  const posts = blogposts.filter(p => p.published);

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
              <p className="text-gray-600">{post.seo.metaDescription}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
