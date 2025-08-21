import React, { useState, useEffect } from 'react';
import { fetchBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost, getBlogAnalyticsSummary } from '../integrations/supabase/client';
import { RichTextEditor } from './RichTextEditor';

export default function AdminCMS() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    ogImage: '',
    published: true,
    datePublished: new Date().toISOString().slice(0, 10),
    author: 'Admin'
  });
  
  const handleContentChange = (newContent: string) => {
    setForm(prev => ({ ...prev, content: newContent }));
  };

  useEffect(() => {
    fetchBlogPosts().then(setPosts).catch(console.error);
    getBlogAnalyticsSummary().then(setAnalytics).catch(console.error);
  }, []);

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/--+/g, '-');
    setForm(form => ({
      ...form,
      title,
      slug,
      metaTitle: title,
      metaDescription: `Lees meer over ${title} op StockFlow.`
    }));
  };

  const handleEdit = (post: any) => {
    setEditing(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      metaTitle: post.meta_title,
      metaDescription: post.meta_description,
      ogImage: post.og_image || '',
      published: post.published || false,
      datePublished: post.date_published || new Date().toISOString().slice(0, 10),
      author: 'Admin'
    });
  };

  const handleSave = async () => {
    try {
      if (editing) {
        const updated = await updateBlogPost(editing, {
          title: form.title,
          slug: form.slug,
          content: form.content,
          meta_title: form.metaTitle,
          meta_description: form.metaDescription,
          og_image: form.ogImage,
          published: form.published,
          date_published: form.datePublished,
          author: form.author
        });
        setPosts(posts.map(p => p.id === editing ? updated : p));
        setEditing(null);
      } else {
        const newPost = await addBlogPost({
          title: form.title,
          slug: form.slug,
          content: form.content,
          meta_title: form.metaTitle,
          meta_description: form.metaDescription,
          og_image: form.ogImage,
          published: form.published,
          date_published: form.datePublished,
          author: form.author
        });
        setPosts([...posts, newPost]);
      }
      setForm({
        title: '',
        slug: '',
        content: '',
        metaTitle: '',
        metaDescription: '',
        ogImage: '',
        published: true,
        datePublished: new Date().toISOString().slice(0, 10),
        author: 'Admin'
      });
    } catch (err) {
      alert('Failed to ' + (editing ? 'update' : 'add') + ' post: ' + (err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Weet je zeker dat je deze post wil verwijderen?')) return;
    try {
      const deleted = await deleteBlogPost(id);
      // Verwijder lokaal
      setPosts(prev => prev.filter(p => p.id !== id));
      // Optioneel: feedback tonen
      console.log('Blogpost verwijderd', deleted[0]?.id || id);
    } catch (err) {
      alert('Verwijderen mislukt: ' + (err as Error).message);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Blogpost CMS</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 1px 4px #eee' }}>
        <input 
          className="cms-input" 
          placeholder="Title" 
          value={form.title} 
          onChange={e => handleTitleChange(e.target.value)} 
          required 
        />
        <input 
          className="cms-input" 
          placeholder="Slug" 
          value={form.slug} 
          onChange={e => setForm({ ...form, slug: e.target.value })} 
          required 
        />
        <RichTextEditor 
          content={form.content}
          onChange={handleContentChange}
        />
        <input 
          className="cms-input" 
          placeholder="Meta Title" 
          value={form.metaTitle} 
          onChange={e => setForm({ ...form, metaTitle: e.target.value })} 
        />
        <input 
          className="cms-input" 
          placeholder="Meta Description" 
          value={form.metaDescription} 
          onChange={e => setForm({ ...form, metaDescription: e.target.value })} 
        />
        <input 
          className="cms-input hidden" 
          placeholder="OG Image URL" 
          value={form.ogImage} 
          onChange={e => setForm({ ...form, ogImage: e.target.value })} 
        />
        <input 
          className="cms-input hidden" 
          placeholder="Author" 
          value={form.author} 
          onChange={e => setForm({ ...form, author: e.target.value })} 
        />
        <input 
          className="cms-input hidden" 
          type="date" 
          value={form.datePublished} 
          onChange={e => setForm({ ...form, datePublished: e.target.value })} 
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            type="submit" 
            style={{ 
              background: '#007bff', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: 4,
              flex: 1
            }}
          >
            {editing ? 'Save Changes' : 'Add Post'}
          </button>
          {editing && (
            <button 
              type="button" 
              onClick={() => {
                setEditing(null);
                setForm({
                  title: '',
                  slug: '',
                  content: '',
                  metaTitle: '',
                  metaDescription: '',
                  ogImage: '',
                  published: true,
                  datePublished: new Date().toISOString().slice(0, 10),
                  author: 'StockFlow'
                });
              }}
              style={{ 
                background: '#6c757d', 
                color: '#fff', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: 4 
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Quick Analytics Summary */}
      {analytics.length > 0 && (
        <div style={{ marginTop: 40, marginBottom: 20 }}>
          <h3>Quick Analytics Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                {analytics.reduce((sum, item) => sum + item.total_views, 0)}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>Total Views</div>
            </div>
            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                {analytics.reduce((sum, item) => sum + item.unique_visitors, 0)}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>Unique Visitors</div>
            </div>
            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                {posts.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>Total Posts</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 40 }}>
        <h3>All Blogposts</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map(post => (
            <li key={post.id} style={{ background: '#fff', marginBottom: 12, padding: 16, borderRadius: 8, boxShadow: '0 1px 4px #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong>{post.title}</strong> 
                <span style={{ color: '#888' }}>({post.slug})</span>
                {(() => {
                  const postAnalytics = analytics.find(a => a.slug === post.slug);
                  return postAnalytics ? (
                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                      👁️ {postAnalytics.total_views} views • 👤 {postAnalytics.unique_visitors} unique visitors
                      {postAnalytics.avg_time_on_page_seconds && (
                        <span> • ⏱️ {Math.round(postAnalytics.avg_time_on_page_seconds)}s avg time</span>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => handleEdit(post)} 
                  style={{ 
                    background: '#ffc107', 
                    color: '#333', 
                    border: 'none', 
                    padding: '6px 12px', 
                    borderRadius: 4 
                  }}
                >
                  Edit
                </button>
                <a 
                  href={`/blog/${post.slug}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    background: '#007bff', 
                    color: '#fff', 
                    padding: '6px 12px', 
                    borderRadius: 4, 
                    textDecoration: 'none' 
                  }}
                >
                  View
                </a>
                <button 
                  onClick={() => handleDelete(post.id)} 
                  style={{ 
                    background: '#dc3545', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '6px 12px', 
                    borderRadius: 4 
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
