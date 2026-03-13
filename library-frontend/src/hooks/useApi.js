import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls with loading and error states
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (dependencies.length > 0) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute, refetch: execute };
};

// Hook for async operations with retry functionality
export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (operation, maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setLoading(true);
        setError(null);
        const result = await operation();
        return result;
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      } finally {
        if (attempt === maxRetries) {
          setLoading(false);
        }
      }
    }
    
    setError(lastError.message || 'Operation failed after retries');
    throw lastError;
  }, []);

  return { loading, error, execute };
};

// Hook for form submission with validation
export const useFormSubmission = (submitFunction, validateFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Validate form data
      if (validateFunction) {
        const validationError = validateFunction(formData);
        if (validationError) {
          throw new Error(validationError);
        }
      }
      
      await submitFunction(formData);
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.message || 'Submission failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [submitFunction, validateFunction]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return { loading, error, success, submit, reset };
};
