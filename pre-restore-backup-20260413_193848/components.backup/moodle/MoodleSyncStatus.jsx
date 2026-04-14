import React, { forwardRef } from 'react';
import { useMoodleSync } from '../../contexts/MoodleSyncContext';
const MoodleSyncStatus = forwardRef((props, ref) {
  const { lastSync, isSyncing } = useMoodleSync();
  return (
    <div className="small text-muted text-end p-2">
      {isSyncing ? '🔄 Syncing Moodle...' : lastSync ? `📚 Last sync: ${new Date(lastSync).toLocaleString()}` : '📚 Moodle ready'}
    </div>
  );
}
MoodleSyncStatus.displayName = 'MoodleSyncStatus';
