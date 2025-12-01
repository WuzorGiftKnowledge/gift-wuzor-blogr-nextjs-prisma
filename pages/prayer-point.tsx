// pages/prayer-point.tsx

import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';

const PrayerPoint: React.FC = () => {
  const [prayerPoint, setPrayerPoint] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const body = { 
        prayerPoint, 
        name: name || undefined,
        email: email || undefined,
      };
      
      const response = await fetch('/api/prayer-point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit prayer point');
      }

      setMessage({ type: 'success', text: 'Thank you! Your prayer point has been submitted successfully. We will be praying for you.' });
      
      // Reset form
      setPrayerPoint('');
      setName('');
      setEmail('');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (error) {
      console.error(error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'An error occurred while submitting your prayer point. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Submit Prayer Point
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Share your prayer requests with us. We'll be praying for you and standing with you in faith.
            </p>
          </div>

          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          <form onSubmit={submitData} className="space-y-6">
            {/* Prayer Point Field */}
            <div>
              <label htmlFor="prayerPoint" className="block text-sm font-semibold text-gray-700 mb-2">
                Prayer Point <span className="text-red-500">*</span>
              </label>
              <textarea
                id="prayerPoint"
                required
                rows={8}
                onChange={(e) => setPrayerPoint(e.target.value)}
                placeholder="Share your prayer point here... What would you like us to pray about?"
                value={prayerPoint}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-y min-h-[150px] text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </label>
                <input
                  id="name"
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  value={name}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Email <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  value={email}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 space-y-4 sm:space-y-0">
              <button
                type="submit"
                disabled={!prayerPoint.trim() || isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-pink-600"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Prayer Point'
                )}
              </button>
              <button
                type="button"
                onClick={() => Router.push('/')}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                or Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PrayerPoint;
