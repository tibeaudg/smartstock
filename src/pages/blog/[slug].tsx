import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogPostBySlug } from '../../integrations/supabase/client';
import SEO from '../../components/SEO';
import type { BlogPost } from '../../integrations/supabase/types';
import { useBlogAnalytics } from '../../hooks/useBlogAnalytics';

import { BlogLayout } from '../../components/BlogLayout';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track analytics for this blog post
  const { timeOnPage, pageLoadTime } = useBlogAnalytics({ 
    slug: slug || '', 
    blogPostId: post?.id 
  });

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
      <div className="mt-8">
        <p className="text-gray-600 text-sm mb-4">
          {new Date(post.date_published).toLocaleDateString('nl-BE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} • door {'StockFlow'}
        </p>
  <div className="prose prose-lg prose-blue" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </BlogLayout>
  );
}
