// Filename: src/hooks/useUnmountEffect.ts

import { useEffect, useRef } from 'react';

/**
 * Custom hook that runs a callback function only when the component unmounts,
 * not on re-renders or dependency changes.
 *
 * @param callback Function to execute on component unmount
 */
export const useUnmountEffect = (callback: () => void): void => {
  // Use a ref to store the callback to avoid dependency changes
  const callbackRef = useRef(callback);

  // Update the ref if callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // This effect will run only on unmount
  useEffect(() => {
    // Return a cleanup function with no setup
    return () => {
      // Execute the latest callback from the ref
      callbackRef.current();
    };
  }, []); // Empty dependency array means it only runs on mount/unmount
};
