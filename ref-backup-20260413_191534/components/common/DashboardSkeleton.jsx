import React from 'react';
import SkeletonLoader from './SkeletonLoader';
export default function DashboardSkeleton() {
  return (
    <div className="container mt-4">
      <div className="placeholder-glow"><h1 className="placeholder col-4"></h1></div>
      <div className="row mt-4"><SkeletonLoader type="card" count={4} /></div>
    </div>
  );
}
