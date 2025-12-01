import React from "react"
import { GetServerSideProps } from 'next';
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import Link from "next/link";
import Image from "next/image";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Props = {
  feed: PostProps[];
  testimonies: Array<{
    id: number;
    testimony: string;
    name: string | null;
    createdAt: string;
  }>;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const [feed, testimonies] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: { name: true },
        },
      },
      take: 6,
      orderBy: {
        id: 'desc',
      },
    }),
    prisma.testimony.findMany({
      where: { approved: true },
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        testimony: true,
        name: true,
        createdAt: true,
      },
    }),
  ]);
  
  // Convert Date objects to strings for JSON serialization
  const serializedTestimonies = testimonies.map(testimony => ({
    ...testimony,
    createdAt: testimony.createdAt.toISOString(),
  }));
  
  return { props: { feed, testimonies: serializedTestimonies } };
};

const LandingPage: React.FC<Props> = ({ feed, testimonies }) => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 text-center">
          <div className="mb-8 flex justify-center">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <Image
                src="/logo.jpg"
                alt="WORD and Prayer Network Logo"
                width={300}
                height={100}
                className="h-20 w-auto object-contain"
                priority
              />
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Sharing Faith, Building Community
          </p>
          <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto">
            Join our community to share testimonies, submit prayer points, and grow together in faith.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/testimony">
              <a className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-all shadow-lg transform hover:scale-105">
                Share Your Testimony
              </a>
            </Link>
            <Link href="/prayer-point">
              <a className="px-8 py-4 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-all shadow-lg transform hover:scale-105">
                Submit Prayer Point
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How We Serve You
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three powerful ways to connect, share, and grow in your faith journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Testimonies */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Share Testimonies</h3>
              <p className="text-gray-600 mb-6">
                Share how God has been working in your life. Your testimony can inspire and encourage others in their faith journey.
              </p>
              <Link href="/testimony">
                <a className="text-indigo-600 font-semibold hover:text-indigo-700 inline-flex items-center">
                  Share Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </Link>
            </div>

            {/* Feature 2 - Prayer Points */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Prayer Points</h3>
              <p className="text-gray-600 mb-6">
                Submit your prayer requests. Our community will stand with you in prayer, lifting your needs before God.
              </p>
              <Link href="/prayer-point">
                <a className="text-purple-600 font-semibold hover:text-purple-700 inline-flex items-center">
                  Submit Request
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </Link>
            </div>

            {/* Feature 3 - Community */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Faith Community</h3>
              <p className="text-gray-600 mb-6">
                Connect with believers, read inspiring posts, and grow together in faith through shared experiences and wisdom.
              </p>
              <Link href="/api/auth/signin">
                <a className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center">
                  Join Community
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Testimonies Section */}
      {testimonies.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Latest Testimonies
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Inspiring stories of faith and God's work in our community
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {testimonies.map((testimony) => (
                <div
                  key={testimony.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {testimony.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {testimony.name || 'Anonymous'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed line-clamp-4">
                    {testimony.testimony}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/testimonies">
                <a className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg">
                  See More Testimonies
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      {feed.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Recent Posts
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Latest insights and teachings from our community
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {feed.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => window.location.href = `/p/${post.id}`}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {post.author?.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {post.author?.name || 'Anonymous'}
                        </p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {post.content?.substring(0, 150)}...
                    </p>
                    <div className="flex items-center text-indigo-600 font-medium text-sm">
                      Read more
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Share Your Faith?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join our community today and be part of a network that supports, prays, and grows together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/testimony">
              <a className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-all shadow-lg">
                Share Your Story
              </a>
            </Link>
            <Link href="/prayer-point">
              <a className="px-8 py-4 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-all shadow-lg border-2 border-white">
                Request Prayer
              </a>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default LandingPage
