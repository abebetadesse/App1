/* eslint-disable no-unused-vars */
// Mock data for development
export const mockUsers = {
  admin: {
    id: '1',
    email: 'admin@tham.com',
    name: 'Admin User',
    role: 'admin',
    profileCompletion: 100
  },
  client: {
    id: '2',
    email: 'client@tham.com',
    name: 'Demo Client',
    role: 'client',
    profileCompletion: 85
  },
  profileOwner: {
    id: '3',
    email: 'provider@tham.com',
    name: 'Demo Provider',
    role: 'profile_owner',
    profileCompletion: 90,
    professionalRank: 4,
    serviceCategory: 'IT',
    hourlyRate: 75
  }
};

export const mockConnections = [
  {
    id: '1',
    clientId: '2',
    profileOwnerId: '3',
    clientName: 'Demo Client',
    profileOwnerName: 'Demo Provider',
    serviceCategory: 'IT',
    connectionDate: new Date('2024-01-15'),
    status: 'successful',
    called: true,
    calledAt: new Date('2024-01-16'),
    clientRating: 5
  }
];

export const mockCourses = [
  {
    id: '1',
    courseName: 'Web Development Fundamentals',
    category: 'IT',
    difficultyLevel: 'beginner',
    durationHours: 40,
    progress: 100,
    status: 'completed',
    finalGrade: 95
  },
  {
    id: '2',
    courseName: 'Advanced React Patterns',
    category: 'IT',
    difficultyLevel: 'advanced',
    durationHours: 30,
    progress: 60,
    status: 'in_progress',
    finalGrade: null
  }
];