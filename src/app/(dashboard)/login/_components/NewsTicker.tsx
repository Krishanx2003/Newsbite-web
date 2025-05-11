import React, { useEffect, useRef } from 'react';

const newsItems = [
  "Bitcoin surges to all-time high 🚀",
  "New AI breakthrough in healthcare 🏥",
  "Gen Z driving sustainable fashion trends 👕",
  "Tech giants announce metaverse collaboration 🌐",
  "Climate summit yields promising results 🌱",
  "Space tourism bookings reach record numbers 🚀",
  "Remote work becomes permanent for major companies 💻",
  "NFT market shows signs of recovery 📈",
];

const NewsTicker: React.FC = () => {
  const tickerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const tickerElement = tickerRef.current;
    if (!tickerElement) return;
    
    const tickerContent = tickerElement.querySelector('.ticker-content');
    if (!tickerContent) return;
    
    // Clone the ticker content to create a seamless loop
    tickerElement.appendChild(tickerContent.cloneNode(true));
    
  }, []);
  
  return (
    <div 
      ref={tickerRef}
      className="w-full overflow-hidden bg-gray-800 rounded-lg py-2"
    >
      <div className="ticker-content inline-block whitespace-nowrap animate-ticker">
        {newsItems.map((item, index) => (
          <span key={index} className="inline-block px-4 text-gray-300">
            {item} <span className="text-gray-500 mx-2">|</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;