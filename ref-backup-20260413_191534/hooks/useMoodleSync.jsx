import React from "react";
/* eslint-disable no-unused-vars */
// hooks/useMoodleSync.js
import { useState, useEffect, useCallback } from 'react';
import { moodleApi } from '../services/moodle';

export const useMoodleSync = (userId) => {
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [progress, setProgress] = useState(0);
  const [lastSync, setLastSync] = useState(null);
  const [error, setError] = useState(null);

  const syncCourses = useCallback(async () => {
    if (!userId) return;
    
    setSyncStatus('syncing');
    setError(null);
    setProgress(0);
    
    try {
      // Link Moodle account if not already linked
      setProgress(20);
      await moodleApi.linkAccount(userId);
      
      // Sync course progress
      setProgress(60);
      const courses = await moodleApi.syncUserProgress(userId);
      
      // Update ranking based on new course data
      setProgress(80);
      await moodleApi.updateRanking(userId);
      
      setProgress(100);
      setSyncStatus('success');
      setLastSync(new Date());
    } catch (err) {
      setError(err.message);
      setSyncStatus('error');
    }
  }, [userId]);

  // Auto-sync on component mount and every 5 minutes
  useEffect(() => {
    if (userId) {
      syncCourses();
      const interval = setInterval(syncCourses, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [userId, syncCourses]);

  return {
    syncStatus,
    progress,
    lastSync,
    error,
    syncCourses,
    isSyncing: syncStatus === 'syncing'
  };
};
export default useMoodleSync;