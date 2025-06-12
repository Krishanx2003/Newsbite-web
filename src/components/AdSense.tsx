'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
}

export default function AdSense({ adSlot, adFormat = 'auto', style, className }: AdSenseProps) {
  const [isAdBlocked, setIsAdBlocked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if ads are blocked
    const checkAdBlock = async () => {
      try {
        const response = await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
          method: 'HEAD',
          mode: 'no-cors',
        });
        setIsAdBlocked(false);
      } catch (error) {
        setIsAdBlocked(true);
      }
    };

    checkAdBlock();
  }, []);

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading AdSense:', error);
    }
  }, []);

  if (isAdBlocked) {
    return null;
  }

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      <ins
        className={`adsbygoogle ${className || ''}`}
        style={{
          display: 'block',
          textAlign: 'center',
          ...style,
        }}
        data-ad-client="YOUR-AD-CLIENT-ID" // Replace with your AdSense client ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
      {!isLoaded && (
        <div className="w-full h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
      )}
    </>
  );
} 