export const initializeMoodleSync = async () => {
  console.log('Moodle sync initialized');
  return { synced: false };
};

export const syncMoodleCourses = async () => {
  console.log('Syncing Moodle courses...');
  return [];
};

export const getMoodleStatus = () => {
  return { linked: false, lastSync: null };
};

export default { initializeMoodleSync, syncMoodleCourses, getMoodleStatus };
