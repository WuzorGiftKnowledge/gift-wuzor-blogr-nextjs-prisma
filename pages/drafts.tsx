// pages/drafts.tsx

import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import Post, { PostProps } from '../components/Post';
import { useSession, getSession } from 'next-auth/react';
import { prisma } from '../lib/prisma';
import Link from 'next/link';
import Router from 'next/router';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const session = await getSession({ req });

    // If no session is found, return an empty drafts array
    if (!session || !session.user?.email) {
      return { props: { drafts: [] } };
    }

    // Fetch drafts from the database
    const drafts = await prisma.post.findMany({
      where: {
        author: { email: session.user.email },
        published: false,
      },
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return { props: { drafts } };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);

    // Return empty drafts on error to prevent build failure
    return { props: { drafts: [] } };
  }
};

type Props = {
  drafts: PostProps[];
};

const Drafts: React.FC<Props> = (props) => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
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

  if (!session) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">You need to be authenticated to view your drafts.</p>
            <Link href="/api/auth/signin" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
              Log in
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                My Drafts
              </h1>
              <p className="text-gray-600">
                {props.drafts.length === 0 
                  ? 'No drafts yet. Create your first draft to get started!'
                  : `You have ${props.drafts.length} ${props.drafts.length === 1 ? 'draft' : 'drafts'}`
                }
              </p>
            </div>
            <Link href="/create" className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center whitespace-nowrap">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Draft
            </Link>
          </div>
        </div>

        {/* Drafts List */}
        {props.drafts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Drafts Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start writing by creating your first draft. Your drafts will appear here before you publish them.
            </p>
            <Link href="/create" className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
              Create Your First Draft
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {props.drafts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-1"
                onClick={() => Router.push(`/p/${post.id}`)}
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {post.author?.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {post.author?.name || 'Anonymous'}
                        </p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          Draft
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h2>
                  
                  {post.content && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.content.substring(0, 200)}
                      {post.content.length > 200 && '...'}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-indigo-600 font-medium text-sm">
                      <span>Click to edit</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Drafts;
