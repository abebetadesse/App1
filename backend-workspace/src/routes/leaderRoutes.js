import express from 'express';
const router = express.Router();

// Mock leader/team data
let teams = [
  { id: 1, name: 'Development Team', leaderId: 101, memberCount: 8 },
  { id: 2, name: 'Sales Team', leaderId: 102, memberCount: 5 },
  { id: 3, name: 'Marketing Team', leaderId: 103, memberCount: 6 },
];

let teamMembers = [
  { id: 1, teamId: 1, userId: 201, role: 'developer', joinedAt: '2023-06-01' },
  { id: 2, teamId: 1, userId: 202, role: 'developer', joinedAt: '2023-07-15' },
  { id: 3, teamId: 2, userId: 203, role: 'sales_executive', joinedAt: '2023-08-20' },
];

let tasks = [
  { id: 1, teamId: 1, title: 'Implement User Authentication', status: 'in_progress', priority: 'high' },
  { id: 2, teamId: 1, title: 'Fix Bug in Dashboard', status: 'completed', priority: 'medium' },
  { id: 3, teamId: 2, title: 'Monthly Sales Report', status: 'pending', priority: 'low' },
];

// Middleware to check if user is a leader
const isLeader = (req, res, next) => {
  const leaderId = parseInt(req.headers['x-user-id'] || req.session.userId || '0');
  const isUserLeader = teams.some(team => team.leaderId === leaderId);
  
  if (isUserLeader) {
    req.leaderId = leaderId;
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Leader privileges required.',
    });
  }
};

// Apply leader middleware to all routes
router.use(isLeader);

// GET /api/leader/teams
router.get('/teams', (req, res) => {
  const leaderTeams = teams.filter(team => team.leaderId === req.leaderId);
  
  res.json({
    success: true,
    message: 'Leader teams retrieved',
    data: {
      teams: leaderTeams.map(team => ({
        ...team,
        members: teamMembers.filter(member => member.teamId === team.id),
        taskCount: tasks.filter(task => task.teamId === team.id).length,
      })),
      totalTeams: leaderTeams.length,
      totalMembers: teamMembers.filter(member => 
        leaderTeams.some(team => team.id === member.teamId)
      ).length,
    },
  });
});

// GET /api/leader/team/:teamId
router.get('/team/:teamId', (req, res) => {
  const team = teams.find(t => t.id === parseInt(req.params.teamId));
  
  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found',
    });
  }
  
  if (team.leaderId !== req.leaderId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this team',
    });
  }
  
  const teamTasks = tasks.filter(task => task.teamId === team.id);
  const members = teamMembers.filter(member => member.teamId === team.id);
  
  res.json({
    success: true,
    message: 'Team details retrieved',
    data: {
      team,
      members,
      tasks: teamTasks,
      stats: {
        totalMembers: members.length,
        tasksByStatus: {
          pending: teamTasks.filter(t => t.status === 'pending').length,
          in_progress: teamTasks.filter(t => t.status === 'in_progress').length,
          completed: teamTasks.filter(t => t.status === 'completed').length,
        },
      },
    },
  });
});

// GET /api/leader/tasks
router.get('/tasks', (req, res) => {
  const leaderTeams = teams.filter(team => team.leaderId === req.leaderId);
  const leaderTeamIds = leaderTeams.map(team => team.id);
  const leaderTasks = tasks.filter(task => leaderTeamIds.includes(task.teamId));
  
  const { status, priority, teamId } = req.query;
  
  let filteredTasks = [...leaderTasks];
  
  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }
  
  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }
  
  if (teamId) {
    filteredTasks = filteredTasks.filter(task => task.teamId === parseInt(teamId));
  }
  
  res.json({
    success: true,
    message: 'Leader tasks retrieved',
    data: {
      tasks: filteredTasks,
      stats: {
        total: filteredTasks.length,
        byStatus: {
          pending: filteredTasks.filter(t => t.status === 'pending').length,
          in_progress: filteredTasks.filter(t => t.status === 'in_progress').length,
          completed: filteredTasks.filter(t => t.status === 'completed').length,
        },
        byPriority: {
          high: filteredTasks.filter(t => t.priority === 'high').length,
          medium: filteredTasks.filter(t => t.priority === 'medium').length,
          low: filteredTasks.filter(t => t.priority === 'low').length,
        },
      },
    },
  });
});

// POST /api/leader/tasks
router.post('/tasks', (req, res) => {
  const { teamId, title, description, priority = 'medium', assignedTo } = req.body;
  
  if (!teamId || !title) {
    return res.status(400).json({
      success: false,
      message: 'Team ID and title are required',
    });
  }
  
  // Verify the team belongs to the leader
  const team = teams.find(t => t.id === parseInt(teamId) && t.leaderId === req.leaderId);
  if (!team) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to create tasks for this team',
    });
  }
  
  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    teamId: parseInt(teamId),
    title,
    description,
    priority,
    assignedTo: assignedTo || null,
    status: 'pending',
    createdAt: new Date().toISOString(),
    createdBy: req.leaderId,
  };
  
  tasks.push(newTask);
  
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: newTask,
  });
});

// PUT /api/leader/tasks/:taskId
router.put('/tasks/:taskId', (req, res) => {
  const taskId = parseInt(req.params.taskId);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }
  
  // Verify the task belongs to a team led by this leader
  const task = tasks[taskIndex];
  const team = teams.find(t => t.id === task.teamId && t.leaderId === req.leaderId);
  
  if (!team) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to modify this task',
    });
  }
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  
  res.json({
    success: true,
    message: 'Task updated successfully',
    data: tasks[taskIndex],
  });
});

// POST /api/leader/team/:teamId/members
router.post('/team/:teamId/members', (req, res) => {
  const teamId = parseInt(req.params.teamId);
  const { userId, role = 'member' } = req.body;
  
  const team = teams.find(t => t.id === teamId && t.leaderId === req.leaderId);
  if (!team) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to add members to this team',
    });
  }
  
  // Check if member already exists
  const existingMember = teamMembers.find(
    member => member.teamId === teamId && member.userId === userId
  );
  
  if (existingMember) {
    return res.status(400).json({
      success: false,
      message: 'Member already exists in the team',
    });
  }
  
  const newMember = {
    id: teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1,
    teamId,
    userId,
    role,
    joinedAt: new Date().toISOString().split('T')[0],
  };
  
  teamMembers.push(newMember);
  team.memberCount += 1;
  
  res.status(201).json({
    success: true,
    message: 'Member added to team',
    data: newMember,
  });
});

// DELETE /api/leader/team/:teamId/members/:memberId
router.delete('/team/:teamId/members/:memberId', (req, res) => {
  const teamId = parseInt(req.params.teamId);
  const memberId = parseInt(req.params.memberId);
  
  const team = teams.find(t => t.id === teamId && t.leaderId === req.leaderId);
  if (!team) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to remove members from this team',
    });
  }
  
  const memberIndex = teamMembers.findIndex(
    member => member.teamId === teamId && member.id === memberId
  );
  
  if (memberIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Member not found in team',
    });
  }
  
  const removedMember = teamMembers.splice(memberIndex, 1)[0];
  team.memberCount -= 1;
  
  res.json({
    success: true,
    message: 'Member removed from team',
    data: removedMember,
  });
});

export default router;