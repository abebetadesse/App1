import { useEffect, useState } from 'react';
export const useMemoryStatus = () => {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  useEffect(() => {
    if ('deviceMemory' in navigator) setIsLowEndDevice(navigator.deviceMemory < 4);
  }, []);
  return { isLowEndDevice };
};
