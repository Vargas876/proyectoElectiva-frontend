// Crear un hook personalizado: src/hooks/useAsync.js
import { useCallback, useState } from 'react';

export const useAsync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async (asyncFunction) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      throw err;
    }
  }, []);
  
  return { loading, error, execute };
};