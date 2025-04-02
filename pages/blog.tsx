// pages/blog.tsx
import React from 'react';

const blogPosts = [
    {
        id: 1,
        title: 'Unremovable Watermark Sistemi Neden Gerekli?',
        date: '2025-03-31',
        content: 'Yapay zekalar artık görselleri saniyeler içinde analiz edip watermarkları silebiliyor. Ancak bizim sistemimiz, bu duruma karşı radikal bir çözüm sunuyor...'
    },
    {
        id: 2,
        title: 'Gölge ve Gradyan ile AI Kandırmak',
        date: '2025-03-28',
        content: 'Watermarkı kaldırmak isteyen yapay zekalar genellikle görselin düz renkli alanlarına odaklanır. Ancak biz gölge, noise ve gradyanları kullanarak bu alanları karmaşıklaştırıyoruz...'
    }
];

export default function BlogPage() {
    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#111', color: '#eee' }}>
            <h1>Blog</h1>
            {blogPosts.map((post) => (
                <div key={post.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #444', paddingBottom: '1rem' }}>
                    <h2>{post.title}</h2>
                    <p style={{ fontSize: '0.9rem', color: '#aaa' }}>{post.date}</p>
                    <p style={{ marginTop: '0.5rem' }}>{post.content}</p>
                </div>
            ))}
        </div>
    );
}
