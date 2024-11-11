'use client'
import React, { useState, useEffect } from 'react';
import LoadMegaLoadinging from '../components/loading/MegaLoading';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    () => clearTimeout(timer);

    router.push('/start-journey')
    return
  }, []);

  return (
    <div>
      {isLoading && <LoadMegaLoadinging />}
    </div>
  );
};

export default Page;
