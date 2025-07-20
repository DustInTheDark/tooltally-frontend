'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Spinner from './Spinner';

const NavigationContext = createContext({
  isLoading: false,
  startLoading: () => {},
  push: () => {},
});

export function NavigationProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When the route or query parameters change, hide the loader
    setIsLoading(false);
  }, [pathname, searchParams?.toString()]);

  const startLoading = () => setIsLoading(true);

  const push = (url) => {
    const currentUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    if (url === currentUrl) return;
    startLoading();
    router.push(url);
  };

  return (
    <NavigationContext.Provider value={{ isLoading, startLoading, push }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/75">
          <Spinner />
        </div>
      )}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}