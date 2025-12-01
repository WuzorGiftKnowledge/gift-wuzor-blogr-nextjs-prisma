import React, { useState, useEffect } from 'react';
import Layout from '../../../../components/Layout';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface Testimony {
  id: number;
  testimony: string;
  name: string | null;
  email: string | null;
  approved: boolean;
  createdAt: string;
}

const PendingTestimonies: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }
    fetchTestimonies();
  }, [session, status]);

  const fetchTestimonies = async () => {
    try {
      const response = await fetch('/api/testimony/pending');
      if (response.status === 403) {
        router.push('/');
        return;
      }
      const data = await response.json();
      setTestimonies(data.testimonies || []);
    } catch (error) {
      console.error('Error fetching testimonies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, approved: boolean) => {
    setProcessing(id);
    try {
      const response = await fetch('/api/testimony/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved }),
      });

      if (response.ok) {
        setTestimonies(testimonies.filter(t => t.id !== id));
      } else {
        alert('Error updating testimony');
      }
    } catch (error) {
      console.error('Error approving testimony:', error);
      alert('Error approving testimony');
    } finally {
      setProcessing(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Pending Testimonies
          </h1>
          <p className="text-gray-600 text-lg">
            Review and approve testimonies submitted by users
          </p>
        </div>

        {testimonies.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-gray-600 text-lg">No pending testimonies. All caught up! 🎉</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {testimonies.map((testimony) => (
              <div
                key={testimony.id}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100"
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
                      {testimony.email || 'No email provided'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(testimony.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6 whitespace-pre-wrap">
                  {testimony.testimony}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(testimony.id, true)}
                    disabled={processing === testimony.id}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {processing === testimony.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleApprove(testimony.id, false)}
                    disabled={processing === testimony.id}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PendingTestimonies;

