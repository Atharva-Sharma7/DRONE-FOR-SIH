import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useOfflineDetect() {
  const setOffline = useAppStore((state) => state.setOffline);

  useEffect(() => {
    function handleOnline() {
      setOffline(false);
    }
    function handleOffline() {
      setOffline(true);
    }

    if (typeof window !== 'undefined') {
      setOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [setOffline]);
}
