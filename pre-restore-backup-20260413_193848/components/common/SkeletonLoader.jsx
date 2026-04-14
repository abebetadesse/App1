import React from 'react';
import ContentLoader from 'react-content-loader';

export const CardSkeleton = () => (
  <ContentLoader viewBox="0 0 400 160" className="w-full">
    <rect x="0" y="0" rx="8" ry="8" width="400" height="160" />
  </ContentLoader>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-2">
    {[...Array(rows)].map((_, i) => (
      <ContentLoader key={i} viewBox="0 0 800 40" className="w-full">
        <rect x="0" y="0" rx="4" ry="4" width="800" height="40" />
      </ContentLoader>
    ))}
  </div>
);
