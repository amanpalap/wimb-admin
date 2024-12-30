'use client'
import React, { useState, useEffect } from 'react';
import LoadMegaLoadinging from '../components/loading/MegaLoading';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push('/start-journey');
    }, 2000);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, [router]); // Add `router` to the dependency array

  return (
    <div>
      {isLoading && <LoadMegaLoadinging />}
    </div>
  );
};

export default Page;
