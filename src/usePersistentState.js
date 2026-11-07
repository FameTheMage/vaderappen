import { useEffect, useState } from 'react';

export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch {
      /* ignorera */
    }
    return typeof initial === 'function' ? initial() : initial;
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignorera */
    }
  }, [key, value]);
  return [value, setValue];
}
