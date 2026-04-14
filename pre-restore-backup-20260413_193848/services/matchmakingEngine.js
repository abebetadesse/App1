// Mock profile owners database
const mockProfiles = [
  { id: 1, name: 'Alice Johnson', category: 'Web Development', experience: 5, hourlyRate: 75, skills: ['React', 'Node'], rating: 4.9, coursesCompleted: 8, trustScore: 92 },
  { id: 2, name: 'Bob Smith', category: 'AI/ML', experience: 8, hourlyRate: 120, skills: ['Python', 'TensorFlow'], rating: 4.8, coursesCompleted: 12, trustScore: 95 },
  { id: 3, name: 'Carol White', category: 'Design', experience: 4, hourlyRate: 60, skills: ['Figma', 'UI'], rating: 4.7, coursesCompleted: 5, trustScore: 88 }
];

export const getTopMatches = (filters) => {
  let scored = mockProfiles.map(profile => {
    let score = profile.trustScore / 100;
    if (filters.category && profile.category !== filters.category) score *= 0.7;
    if (filters.minExp && profile.experience < parseInt(filters.minExp)) score *= 0.8;
    if (filters.maxRate && profile.hourlyRate > parseInt(filters.maxRate)) score *= 0.8;
    if (filters.skills) {
      const skillMatch = profile.skills.some(s => s.toLowerCase().includes(filters.skills.toLowerCase()));
      if (!skillMatch) score *= 0.6;
    }
    return { ...profile, matchScore: Math.round(score * 100) };
  });
  return scored.sort((a,b) => b.matchScore - a.matchScore).slice(0, 10);
};

export const getRecommendations = (userId) => getTopMatches({});
