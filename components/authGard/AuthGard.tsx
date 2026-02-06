"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const creds = localStorage.getItem('userCredentials');
      if (!creds) {
        router.replace('/login');
      } else {
        setIsAuthorized(true);
      }
      setIsMounted(true);
    };

    checkAuth();
  }, [router]);

  // Return null or a loader until the client-side check is done
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Only render children if authorized
  return isAuthorized ? <>{children}</> : null;
}