import React, {useRef} from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Layout from '../../components/Layout';
import Router from 'next/router';
import { PostProps } from '../../components/Post';
import { useSession } from 'next-auth/react';
import {prisma} from '../../lib/prisma';
import { toPng } from 'html-to-image';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: post,
  };
};

// Use relative URLs or ensure HTTPS
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin (ensures HTTPS in production)
    return window.location.origin;
  }
  // Server-side: use environment variable or default
  return process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_LURL || '';
};

async function publishPost(id: number): Promise<void> {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}/api/publish/${id}`;
  await fetch(url, {
    method: 'PUT',
  });
  await Router.push('/');
}

async function deletePost(id: number): Promise<void> {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}/api/post/${id}`;
  await fetch(url, {
    method: 'DELETE',
  });
  Router.push('/');
}

const GetPost: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  const postRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  if (status === "loading") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  const downloadPostAsImage = async (format: 'whatsapp' | 'facebook' = 'facebook') => {
    if (!exportRef.current) return;

    const dimensions = {
      whatsapp: { width: 1080, height: 1920 },
      facebook: { width: 1200, height: 630 }
    };

    const dims = dimensions[format];
    const isWhatsApp = format === 'whatsapp';

    // Update template based on format
    const template = exportRef.current.querySelector(`.export-${format}`) as HTMLElement;
    if (!template) return;

    // Hide other format
    const otherFormat = exportRef.current.querySelector(`.export-${format === 'whatsapp' ? 'facebook' : 'whatsapp'}`) as HTMLElement;
    if (otherFormat) otherFormat.style.display = 'none';
    template.style.display = 'block';

    try {
      const dataUrl = await toPng(template, {
        width: dims.width,
        height: dims.height,
        quality: 1.0,
        pixelRatio: 2,
      });

      // Show both again
      template.style.display = 'block';
      if (otherFormat) otherFormat.style.display = 'block';

      const link = document.createElement('a');
      link.download = `${props.title.replace(/[^a-z0-9]/gi, '_')}_${format}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
      // Show both again on error
      template.style.display = 'block';
      if (otherFormat) otherFormat.style.display = 'block';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/">
          <a className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium mb-6 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Feed
          </a>
        </Link>

        {/* Main Post Card */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 md:p-12">
            <div className="flex items-center mb-6">
              {props.author && (
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl mr-4 shadow-lg">
                  {props.author.name?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
              <div>
                {props.author && (
                  <p className="text-white/90 text-sm font-medium mb-1">
                    {props.author.name || 'Anonymous'}
                  </p>
                )}
                <p className="text-white/70 text-xs">
                  {props.published ? 'Published' : 'Draft'}
                </p>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {title}
            </h1>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            <div ref={postRef} className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed markdown-content">
                <ReactMarkdown 
                  source={props.content}
                />
              </div>
            </div>
            <style jsx global>{`
              .markdown-content {
                line-height: 1.75;
              }
              .markdown-content h1,
              .markdown-content h2,
              .markdown-content h3,
              .markdown-content h4 {
                font-weight: 700;
                color: #111827;
                margin-top: 2rem;
                margin-bottom: 1rem;
              }
              .markdown-content h1 {
                font-size: 2.25rem;
              }
              .markdown-content h2 {
                font-size: 1.875rem;
              }
              .markdown-content h3 {
                font-size: 1.5rem;
              }
              .markdown-content p {
                margin-bottom: 1.25rem;
                color: #374151;
              }
              .markdown-content a {
                color: #4F46E5;
                text-decoration: none;
              }
              .markdown-content a:hover {
                text-decoration: underline;
              }
              .markdown-content strong {
                font-weight: 700;
                color: #111827;
              }
              .markdown-content code {
                background-color: #F3F4F6;
                color: #7C3AED;
                padding: 0.125rem 0.375rem;
                border-radius: 0.25rem;
                font-size: 0.875em;
              }
              .markdown-content pre {
                background-color: #111827;
                color: #F9FAFB;
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin: 1.5rem 0;
              }
              .markdown-content pre code {
                background-color: transparent;
                color: inherit;
                padding: 0;
              }
              .markdown-content blockquote {
                border-left: 4px solid #4F46E5;
                padding-left: 1rem;
                margin: 1.5rem 0;
                font-style: italic;
                color: #4B5563;
              }
              .markdown-content ul,
              .markdown-content ol {
                margin: 1.25rem 0;
                padding-left: 1.75rem;
              }
              .markdown-content li {
                margin: 0.5rem 0;
                color: #374151;
              }
              .markdown-content img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                margin: 1.5rem 0;
              }
            `}</style>

            {/* Author Footer */}
            {props.author && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {props.author.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-lg">
                      {props.author.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Author
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadPostAsImage('facebook')}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Facebook Post
                </button>
                <button
                  onClick={() => downloadPostAsImage('whatsapp')}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  WhatsApp Status
                </button>
              </div>

              {!props.published && userHasValidSession && postBelongsToUser && (
                <button
                  onClick={() => publishPost(props.id)}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Publish Post
                </button>
              )}

              {userHasValidSession && postBelongsToUser && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                      deletePost(props.id);
                    }
                  }}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Post
                </button>
              )}
            </div>
          </div>
        </article>

        {/* Related Posts or Navigation */}
        <div className="mt-12 text-center">
          <Link href="/">
            <a className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              View All Posts
            </a>
          </Link>
        </div>
      </div>

      {/* Hidden Export Templates */}
      <div ref={exportRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '1200px', height: '1920px' }}>
        {/* Facebook Post Template (1200x630) */}
        <div
          className="export-facebook"
          style={{
            width: '1200px',
            height: '630px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: '#ffffff',
            boxSizing: 'border-box',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {/* Header with Logo and Title */}
          <div>
            <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/logo.jpg"
                  alt="Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                  WORD and Prayer Network
                </div>
                {props.author && (
                  <div style={{ fontSize: '16px', opacity: 0.9 }}>
                    {props.author.name || 'Anonymous'}
                  </div>
                )}
              </div>
            </div>
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                lineHeight: '1.2',
                margin: 0,
                marginBottom: '30px',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Content Preview */}
          <div
            style={{
              fontSize: '24px',
              lineHeight: '1.6',
              opacity: 0.95,
              maxHeight: '200px',
              overflow: 'hidden',
              textShadow: '0 1px 5px rgba(0,0,0,0.2)',
            }}
          >
            {props.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: props.content
                    .substring(0, 300)
                    .replace(/\n/g, '<br/>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>'),
                }}
              />
            ) : (
              <p>Read the full post on WORD and Prayer Network</p>
            )}
            {props.content && props.content.length > 300 && (
              <span style={{ fontSize: '20px', opacity: 0.8 }}>...</span>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: '600' }}>
              wordandprayernetwork.com
            </div>
            <div style={{ fontSize: '16px', opacity: 0.9 }}>
              Sharing Faith, Building Community
            </div>
          </div>
        </div>

        {/* WhatsApp Status Template (1080x1920) */}
        <div
          className="export-whatsapp"
          style={{
            width: '1080px',
            height: '1920px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            padding: '80px 60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: '#ffffff',
            boxSizing: 'border-box',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {/* Header */}
          <div>
            <div style={{ marginBottom: '60px', display: 'flex', alignItems: 'center', gap: '30px' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  background: '#ffffff',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/logo.jpg"
                  alt="Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>
                  WORD and Prayer Network
                </div>
                {props.author && (
                  <div style={{ fontSize: '24px', opacity: 0.9 }}>
                    {props.author.name || 'Anonymous'}
                  </div>
                )}
              </div>
            </div>
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                lineHeight: '1.2',
                margin: 0,
                marginBottom: '50px',
                textShadow: '0 3px 15px rgba(0,0,0,0.3)',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Content */}
          <div
            style={{
              fontSize: '36px',
              lineHeight: '1.8',
              opacity: 0.95,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            {props.content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: props.content
                    .substring(0, 500)
                    .replace(/\n/g, '<br/>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>'),
                }}
              />
            ) : (
              <p>Read the full post on WORD and Prayer Network</p>
            )}
            {props.content && props.content.length > 500 && (
              <span style={{ fontSize: '32px', opacity: 0.8 }}>...</span>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              marginTop: '40px',
              paddingTop: '40px',
              borderTop: '3px solid rgba(255,255,255,0.3)',
            }}
          >
            <div style={{ fontSize: '28px', fontWeight: '600' }}>
              wordandprayernetwork.com
            </div>
            <div style={{ fontSize: '24px', opacity: 0.9 }}>
              Sharing Faith, Building Community
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GetPost;
