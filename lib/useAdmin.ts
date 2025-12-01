import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function useAdmin() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (status === 'loading' || !session) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/admin-check');
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin || false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [session, status]);

  return { isAdmin, loading };
}

