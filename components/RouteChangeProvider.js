'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Spinner from '@/components/Spinner';

const RouteChangeContext = createContext(false);

export function useRouteChanging() {
  return useContext(RouteChangeContext);
}

export default function RouteChangeProvider({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <RouteChangeContext.Provider value={loading}>
      {children}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/75">
          <Spinner />
        </div>
      )}
    </RouteChangeContext.Provider>
  );
}