const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

const requireProfileOwner = (req, res, next) => {
  if (req.user.role !== 'profile_owner') {
    return res.status(403).json({ error: 'Profile owner access required' });
  }
  
  // Additional check: ensure user owns the profile they're accessing
  if (req.params.id && req.params.id !== req.user.profileOwnerId) {
    return res.status(403).json({ error: 'Access to this profile denied' });
  }
  
  next();
};

const requireClient = (req, res, next) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ error: 'Client access required' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};