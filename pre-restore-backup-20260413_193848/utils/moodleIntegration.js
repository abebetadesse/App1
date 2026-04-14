export const initializeMoodleSync = async () => {
  console.log('Moodle sync initialized');
};

export const syncMoodleCourses = async () => {
  console.log('Syncing Moodle courses...');
  return [];
};

export const getMoodleStatus = () => ({
  linked: false,
  lastSync: null,
});

export default { initializeMoodleSync, syncMoodleCourses, getMoodleStatus };
