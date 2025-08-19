import React, { useState } from 'react';
import blogposts from '../lib/blogposts.json';

export default function AdminCMS() {
  const [posts, setPosts] = useState(blogposts);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', content: '', metaTitle: '', metaDescription: '', ogImage: '', published: false });

  const handleEdit = (post) => {
    setEditing(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      metaTitle: post.seo.metaTitle,
      metaDescription: post.seo.metaDescription,
      ogImage: post.seo.ogImage,
      published: post.published
    });
  };

  const handleSave = () => {
    const updatedPosts = posts.map(p => p.id === editing ? {
      ...p,
      title: form.title,
      slug: form.slug,
      content: form.content,
      seo: {
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        ogImage: form.ogImage
      },
      published: form.published
    } : p);
    setPosts(updatedPosts);
    setEditing(null);
  };

  const handleAdd = () => {
    const newPost = {
      id: Date.now().toString(),
      title: form.title,
      slug: form.slug,
      content: form.content,
      seo: {
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        ogImage: form.ogImage
      },
      published: form.published
    };
    setPosts([...posts, newPost]);
    setForm({ title: '', slug: '', content: '', metaTitle: '', metaDescription: '', ogImage: '', published: false });
  };

  return (
    <div>
      <h2>Blogpost CMS</h2>
      <form>
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
        <textarea placeholder="Content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
        <input placeholder="Meta Title" value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} />
        <input placeholder="Meta Description" value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} />
        <input placeholder="OG Image" value={form.ogImage} onChange={e => setForm({ ...form, ogImage: e.target.value })} />
        <label>
          Published
          <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
        </label>
        {editing ? (
          <button type="button" onClick={handleSave}>Save</button>
        ) : (
          <button type="button" onClick={handleAdd}>Add</button>
        )}
      </form>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <strong>{post.title}</strong> ({post.slug})
            <button onClick={() => handleEdit(post)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
