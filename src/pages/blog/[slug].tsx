import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogPostBySlug } from '../../integrations/supabase/client';
import SEO from '../../components/SEO';
import type { BlogPost } from '../../integrations/supabase/types';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        if (!slug) return;
        console.log('Fetching blog post with slug:', slug);
        const data = await fetchBlogPostBySlug(slug);
        console.log('Fetched blog post:', data);
        if (!data || !data.published) {
          console.log('Blog post not found or not published');
          setError('Blogpost niet gevonden');
          return;
        }
        setPost(data);
      } catch (err) {
        setError('Er is een fout opgetreden bij het laden van de blogpost');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return <div>Laden...</div>;
  }

  if (error || !post) {
    return <div>{error || 'Blogpost niet gevonden.'}</div>;
  }

  const canonicalUrl = `https://www.stockflow.be/blog/${post.slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.meta_description,
    'image': post.og_image,
    'url': canonicalUrl,
    'mainEntityOfPage': canonicalUrl,
    'datePublished': post.date_published || '',
    'author': {
      '@type': 'Person',
      'name': post.author || 'StockFlow'
    }
  };
  return (
    <>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description}
        image={post.og_image}
        url={canonicalUrl}
        structuredData={structuredData}
      />
      <article className="prose mx-auto p-4">
        <h1>{post.title}</h1>
        <div>{post.content}</div>
      </article>
    </>
  );
}
