const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server/db.json');
const middlewares = jsonServer.defaults();

// CORS middleware
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

server.use(jsonServer.bodyParser);
server.use(middlewares);

// Login endpoint
server.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email, password);
  const user = router.db.get('users').find(u => u.email === email && u.password === password).value();
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({ token: 'mock-jwt-token', user: userWithoutPassword });
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

// Register endpoint
server.post('/api/auth/register', (req, res) => {
  const { email, name, role, password } = req.body;
  const existing = router.db.get('users').find(u => u.email === email).value();
  if (existing) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const newUser = {
    id: Date.now(),
    email,
    name,
    role: role || 'client',
    password: password || 'password123',
    createdAt: new Date().toISOString()
  };
  router.db.get('users').push(newUser).write();
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ token: 'mock-jwt-token', user: userWithoutPassword });
});

// Forgot password endpoint
server.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = router.db.get('users').find(u => u.email === email).value();
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email' });
  }
  // Generate a simple token (in production use crypto)
  const token = Math.random().toString(36).substring(2, 15);
  console.log(`Reset token for ${email}: ${token}`);
  res.json({ message: 'Reset instructions sent', token });
});

// Validate reset token
server.get('/api/auth/validate-reset-token/:token', (req, res) => {
  res.json({ valid: true });
});

// Reset password
server.post('/api/auth/reset-password/:token', (req, res) => {
  const { password } = req.body;
  res.json({ success: true });
});

server.use('/api', router);
server.listen(3001, () => console.log('✅ Server running on http://localhost:3001'));
