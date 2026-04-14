import React, { forwardRef } from 'react';
const QuickActionsPanel = forwardRef((props, ref) => (
  <div ref={ref} className="quick-actions-panel">Quick Actions</div>
));
QuickActionsPanel.displayName = 'QuickActionsPanel';
export default QuickActionsPanel;
