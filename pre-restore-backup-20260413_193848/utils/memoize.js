import React from 'react';
export const memoize = (Component) => React.memo(Component, (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});
