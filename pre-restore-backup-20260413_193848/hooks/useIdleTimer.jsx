import { useEffect, useState } from 'react';
export const useIdleTimer = (timeout) => {
  const [isIdle, setIsIdle] = useState(false);
  useEffect(() => {
    let timer;
    const reset = () => { setIsIdle(false); clearTimeout(timer); timer = setTimeout(() => setIsIdle(true), timeout); };
    window.addEventListener('mousemove', reset); window.addEventListener('keydown', reset);
    reset();
    return () => { clearTimeout(timer); window.removeEventListener('mousemove', reset); window.removeEventListener('keydown', reset); };
  }, [timeout]);
  return { isIdle };
};
