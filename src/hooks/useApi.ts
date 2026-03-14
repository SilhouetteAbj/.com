import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export const useApi = <T,>(initialState?: Partial<UseApiState<T>>) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialState?.data || null,
    isLoading: false,
    error: null,
    ...initialState,
  });

  const execute = useCallback(
    async (
      apiCall: () => Promise<T>,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: any) => void;
      }
    ) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const result = await apiCall();
        setState((prev) => ({ ...prev, data: result, isLoading: false }));
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
        options?.onError?.(error);
        throw error;
      }
    },
    []
  );

  return {
    ...state,
    execute,
    reset: () => setState({ data: null, isLoading: false, error: null }),
  };
};
