'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Spinner from './Spinner';

const NavigationContext = createContext({
  isLoading: false,
  startLoading: () => {},
  push: () => {},
});

export function NavigationProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When the route changes complete, hide the loader
    setIsLoading(false);
  }, [pathname]);

  const startLoading = () => setIsLoading(true);

  const push = (url) => {
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