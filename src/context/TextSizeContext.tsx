'use client';

import { createContext, useContext, useState } from 'react';

interface TextSizeContextType {
  textSize: 'small' | 'medium' | 'large';
  setTextSize: (size: 'small' | 'medium' | 'large') => void;
}

const TextSizeContext = createContext<TextSizeContextType>({
  textSize: 'medium',
  setTextSize: () => {},
});

export const TextSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');

  return (
    <TextSizeContext.Provider value={{ textSize, setTextSize }}>
      {children}
    </TextSizeContext.Provider>
  );
};

export const useTextSize = () => useContext(TextSizeContext);