import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { fetchBlogPostBySlug } from '../../integrations/supabase/client';
import SEO from '../../components/SEO';
import type { BlogPost } from '../../integrations/supabase/types';
import DOMPurify from 'dompurify';

import { BlogLayout } from '../../components/BlogLayout';
import HeaderPublic from '@/components/HeaderPublic';
import Footer from '@/components/Footer';
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
    // Redirect to 404 page which has proper noindex and 404 status
    return <Navigate to="/404" replace />;
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
      'name': 'StockFlow'
    }
  };
  return (
    <BlogLayout
      title={post.title}
    >
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description}
        image={post.og_image}
        url={canonicalUrl}
        structuredData={structuredData}
      />
      <HeaderPublic />  
      <div className="mt-8">
        <p className="text-gray-600 text-sm mb-4">
          {new Date(post.date_published).toLocaleDateString('nl-BE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} • door {'StockFlow'}
        </p>
  <div className="prose prose-lg prose-blue" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content, { 
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel']
  }) }} />
      </div>
      <Footer />
    </BlogLayout>
  );
}
