import React, { createContext, useContext, useState } from 'react';
const MoodleSyncContext = createContext({});
export const useMoodleSync = () => useContext(MoodleSyncContext);
export const MoodleSyncProvider = ({ children }) => {
  const [lastSync, setLastSync] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLinked, setIsLinked] = useState(true);
  const syncMoodleData = async () => { setIsSyncing(true); setTimeout(() => { setLastSync(new Date()); setIsSyncing(false); }, 1000); };
  return <MoodleSyncContext.Provider value={{ lastSync, isSyncing, isLinked, syncMoodleData }}>{children}</MoodleSyncContext.Provider>;
};
