import { useEffect, useState } from "react";

export function useDebouncedValue<T>(inputValue: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(inputValue), delay);
    return () => clearTimeout(timeout);
  }, [inputValue, delay]);

  return debouncedValue;
}

export const useDelayedValue = (delay?: number) => {
  const [showValue, setShowValue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setShowValue(true),
      delay === undefined ? 500 : delay
    );
    return () => clearTimeout(timer);
  });

  return showValue;
};

export const useCyclicValue = (start: number, end: number, pause?: number) => {
  const [value, setValue] = useState(start);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((v) => (v + 1) % (end + 1));
    }, pause || 200);
    return () => clearInterval(interval);
  });

  return value;
};

export interface PersistedStateProps {
  getItem?: (key: string) => unknown;
  setItem?: (key: string, value: unknown) => void;
}

export function usePersistedState<T>(
  props: PersistedStateProps,
  key: string,
  initialValue: T
) {
  const { getItem, setItem } = props;

  // Initialise state with the persisted value or the initial value
  const [state, setState] = useState<T>(() => {
    return (getItem && (getItem(key) as T)) ?? initialValue;
  });

  // Use a debounced value to avoid excessive writes
  const debouncedState = useDebouncedValue(state, 500);

  // Update the persisted state when the debounced state changes
  useEffect(() => {
    if (setItem) setItem(key, debouncedState);
  }, [setItem, key, debouncedState]);

  // Clear the persisted state when the component unmounts
  useEffect(() => {
    return () => {
      if (setItem) setItem(key, null);
    };
  }, [setItem, key]);

  return [state, setState] as const;
}
