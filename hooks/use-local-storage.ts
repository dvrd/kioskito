import { useEffect, useState } from 'react';

const isServer = typeof window === 'undefined';

export const useLocalStorage = <T>(key: string, initialValue: T): { value: T } => {
  const [storedValue, setStoredValue] = useState<T>(() => initialValue);

  const initialize = (): T => {
    if (isServer) {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) as T : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  };

  useEffect(() => {
    if (!isServer) {
      setStoredValue(initialize());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue = (value: T | ((value: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const storedValueProxy = new Proxy({ value: storedValue }, {
    set: (_, __, value) => {
      setValue(value);
      return true;
    },
    get: (_, prop) => {
      if (prop === 'value') {
        const item = window.localStorage.getItem(key);
        const value = item ? JSON.parse(item) as T : storedValue;
        return value;
      }
    }
  });

  return storedValueProxy;
}
