import { useState, useEffect } from 'react';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const storedKey = localStorage.getItem('replicate_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const updateApiKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('replicate_api_key', newKey);
  };

  return { apiKey, updateApiKey };
};