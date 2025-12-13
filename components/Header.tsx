import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from 'next-auth/react';
import Logo from './Logo';
import Dropdown from './Dropdown';
import { useAdmin } from '../lib/useAdmin';

const Header: React.FC = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname || router.pathname.startsWith(pathname + '/');

  const { data: session, status } = useSession();
  const { isAdmin } = useAdmin();

  return (
    <header className="bg-white shadow-md border-b border-indigo-100 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0 min-w-0">
            <Link href="/" className="flex items-center space-x-1 md:space-x-2 hover:opacity-80 transition-opacity min-w-0">
              <Logo size="sm" />
              <span className="hidden sm:inline text-base md:text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
                WORD and Prayer Network
              </span>
              <span className="sm:hidden text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                WAPNetwork
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive('/') && router.pathname === '/'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Feed
            </Link>
            <Dropdown
              label="Testimony"
              isActive={router.pathname.startsWith('/testimony') || router.pathname.startsWith('/admin/testimony')}
              items={[
                {
                  label: 'Share Testimony',
                  href: '/testimony',
                  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
                },
                {
                  label: 'View Testimonies',
                  href: '/testimonies',
                  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
                },
                ...(isAdmin ? [{
                  label: 'Pending Approval',
                  href: '/admin/testimony/pending',
                  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                }] : []),
              ]}
            />
            <Dropdown
              label="Prayer Point"
              isActive={router.pathname.startsWith('/prayer-point') || router.pathname.startsWith('/admin/prayer-point')}
              items={[
                {
                  label: 'Submit Prayer Point',
                  href: '/prayer-point',
                  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
                },
                {
                  label: 'View Prayer Points',
                  href: '/prayer-points',
                  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
                },
                ...(isAdmin ? [{
                  label: 'Pending Approval',
                  href: '/admin/prayer-point/pending',
                  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                }] : []),
              ]}
            />
            {session && (
              <>
                <Link
                  href="/drafts"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive('/drafts')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  My Drafts
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin/users"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive('/admin/users')
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Manage Users
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Side - Auth (Desktop) */}
          <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
            {status === "loading" ? (
              <div className="text-gray-500 text-xs">Loading...</div>
            ) : !session ? (
              <Link href="/api/auth/signin" className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap">
                Log in
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="hidden lg:block text-sm">
                  <span className="font-medium text-gray-700">{session.user.name}</span>
                  <span className="text-gray-500 mx-1">•</span>
                  <span className="text-xs text-gray-500">{session.user.email}</span>
                </div>
                <Link href="/create" className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm whitespace-nowrap">
                  New Post
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Log out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {session && (
              <Link href="/create" className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Collapsible */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 pb-4">
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  router.pathname === '/'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Feed
              </Link>
              
              {/* Testimony Section */}
              <div className="space-y-1 pl-3 border-l-2 border-indigo-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-1">Testimony</p>
                <Link href="/testimony" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                  Share Testimony
                </Link>
                <Link href="/testimonies" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  View Testimonies
                </Link>
                {isAdmin && (
                  <Link href="/admin/testimony/pending" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Pending Approval
                  </Link>
                )}
              </div>

              {/* Prayer Point Section */}
              <div className="space-y-1 pl-3 border-l-2 border-purple-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-1">Prayer Point</p>
                <Link href="/prayer-point" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  Submit Prayer Point
                </Link>
                <Link href="/prayer-points" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  View Prayer Points
                </Link>
                {isAdmin && (
                  <Link href="/admin/prayer-point/pending" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Pending Approval
                  </Link>
                )}
              </div>

              {/* User Section */}
              {session && (
                <>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="px-3 py-2 mb-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Account</p>
                      <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/drafts"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/drafts')
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      My Drafts
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/users"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive('/admin/users')
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Manage Users
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}

              {/* Login Button for Non-authenticated */}
              {!session && status !== "loading" && (
                <Link
                  href="/api/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors text-center"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
