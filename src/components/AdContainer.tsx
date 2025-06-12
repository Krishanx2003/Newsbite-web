'use client';

import AdSense from './AdSense';

interface AdContainerProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  className?: string;
}

export default function AdContainer({ position, className = '' }: AdContainerProps) {
  const getAdSlot = () => {
    switch (position) {
      case 'top':
        return 'YOUR-TOP-AD-SLOT';
      case 'middle':
        return 'YOUR-MIDDLE-AD-SLOT';
      case 'bottom':
        return 'YOUR-BOTTOM-AD-SLOT';
      case 'sidebar':
        return 'YOUR-SIDEBAR-AD-SLOT';
      default:
        return '';
    }
  };

  const getAdFormat = () => {
    switch (position) {
      case 'sidebar':
        return 'vertical';
      default:
        return 'auto';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <AdSense
            adSlot={getAdSlot()}
            adFormat={getAdFormat()}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
} 