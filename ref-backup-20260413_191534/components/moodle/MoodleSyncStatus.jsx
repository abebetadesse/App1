import React from 'react';
import { useMoodleSync } from '../../contexts/MoodleSyncContext';
export default function MoodleSyncStatus() {
  const { lastSync, isSyncing } = useMoodleSync();
  return (
    <div className="small text-muted text-end p-2">
      {isSyncing ? '🔄 Syncing Moodle...' : lastSync ? `📚 Last sync: ${new Date(lastSync).toLocaleString()}` : '📚 Moodle ready'}
    </div>
  );
}
