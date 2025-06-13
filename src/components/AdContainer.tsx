import React from 'react';
import Script from 'next/script';

interface AdContainerProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  className?: string;
  hasContent?: boolean;
}

const AdContainer: React.FC<AdContainerProps> = ({ position, className = '', hasContent = true }) => {
  // Don't render ads if there's no content
  if (!hasContent) {
    return null;
  }

  const adSlotId = `ad-slot-${position}`;
  const adClient = 'ca-pub-3778747736249937';
  const adFormat = position === 'sidebar' ? 'auto' : 'rectangle';

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlotId}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
      <Script
        id={`adsbygoogle-init-${position}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({});
          `,
        }}
      />
    </div>
  );
};

export default AdContainer; 