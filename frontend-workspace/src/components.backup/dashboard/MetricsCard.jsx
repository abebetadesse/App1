import React from "react";
import React from 'react';
import { Card } from 'react-bootstrap';
export default React.memo(function MetricsCard({ title, value, icon, trend }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div><h6 className="text-muted mb-2">{title}</h6><h2 className="mb-0">{value}</h2>{trend && <small className={trend > 0 ? 'text-success' : 'text-danger'}>{trend > 0 ? `+${trend}%` : `${trend}%`}</small>}</div>
          <div className="display-6">{icon}</div>
        </div>
      </Card.Body>
    </Card>
  );
}
});
