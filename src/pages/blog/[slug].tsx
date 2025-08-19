import React from 'react';
import { useParams } from 'react-router-dom';
import blogposts from '../../lib/blogposts.json';
import SEO from '../../components/SEO';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogposts.find(p => p.slug === slug && p.published);

  if (!post) {
    return <div>Blogpost niet gevonden.</div>;
  }

  const canonicalUrl = `https://www.stockflow.be/blog/${post.slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.seo.metaDescription,
    'image': post.seo.ogImage,
    'url': canonicalUrl,
    'mainEntityOfPage': canonicalUrl,
    'datePublished': post.datePublished || '',
    'author': {
      '@type': 'Person',
      'name': post.author || 'StockFlow'
    }
  };
  return (
    <>
      <SEO
        title={post.seo.metaTitle}
        description={post.seo.metaDescription}
        image={post.seo.ogImage}
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
