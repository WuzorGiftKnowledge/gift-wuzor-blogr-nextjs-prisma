import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

interface Testimony {
  id: number;
  testimony: string;
  name: string | null;
  email: string | null;
  createdAt: string;
}

const Testimonies: React.FC = () => {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTestimonies();
  }, [page]);

  const fetchTestimonies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/testimony/approved?page=${page}&limit=20`);
      const data = await response.json();
      setTestimonies(data.testimonies || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching testimonies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Approved Testimonies
          </h1>
          <p className="text-gray-600 text-lg">
            Read inspiring testimonies from our community members
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : testimonies.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-gray-600 text-lg">No approved testimonies yet.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-8">
              {testimonies.map((testimony) => (
                <div
                  key={testimony.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 border border-gray-100"
                >
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimony.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {testimony.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(testimony.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {testimony.testimony}
                  </p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Testimonies;

