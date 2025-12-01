import React, { useState, useEffect } from 'react';
import Layout from '../../../../components/Layout';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface PrayerPoint {
  id: number;
  prayerPoint: string;
  name: string | null;
  email: string | null;
  approved: boolean;
  createdAt: string;
}

const PendingPrayerPoints: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [prayerPoints, setPrayerPoints] = useState<PrayerPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }
    fetchPrayerPoints();
  }, [session, status]);

  const fetchPrayerPoints = async () => {
    try {
      const response = await fetch('/api/prayer-point/pending');
      if (response.status === 403) {
        router.push('/');
        return;
      }
      const data = await response.json();
      setPrayerPoints(data.prayerPoints || []);
    } catch (error) {
      console.error('Error fetching prayer points:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, approved: boolean) => {
    setProcessing(id);
    try {
      const response = await fetch('/api/prayer-point/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved }),
      });

      if (response.ok) {
        setPrayerPoints(prayerPoints.filter(p => p.id !== id));
      } else {
        alert('Error updating prayer point');
      }
    } catch (error) {
      console.error('Error approving prayer point:', error);
      alert('Error approving prayer point');
    } finally {
      setProcessing(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Pending Prayer Points
          </h1>
          <p className="text-gray-600 text-lg">
            Review and approve prayer points submitted by users
          </p>
        </div>

        {prayerPoints.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <p className="text-gray-600 text-lg">No pending prayer points. All caught up! 🎉</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {prayerPoints.map((prayerPoint) => (
              <div
                key={prayerPoint.id}
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100"
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {prayerPoint.name?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {prayerPoint.name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {prayerPoint.email || 'No email provided'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(prayerPoint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg mb-6 whitespace-pre-wrap">
                  {prayerPoint.prayerPoint}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(prayerPoint.id, true)}
                    disabled={processing === prayerPoint.id}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {processing === prayerPoint.id ? (
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
                    onClick={() => handleApprove(prayerPoint.id, false)}
                    disabled={processing === prayerPoint.id}
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

export default PendingPrayerPoints;

