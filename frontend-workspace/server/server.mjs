import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, 'db.json'));
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

// Custom auth endpoints
server.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({ token: 'mock-jwt-token', user: userWithoutPassword });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

server.post('/api/auth/register', (req, res) => {
  const { email, name, role } = req.body;
  const users = router.db.get('users').value();
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).json({ error: 'User exists' });
  const newUser = { id: Date.now(), email, name, role, password: 'password', createdAt: new Date().toISOString() };
  router.db.get('users').push(newUser).write();
  const { password, ...userWithoutPassword } = newUser;
  res.json({ token: 'mock-jwt-token', user: userWithoutPassword });
});

server.post('/api/auth/logout', (req, res) => res.json({ success: true }));

server.post('/api/client/search', (req, res) => {
  const profiles = router.db.get('profiles').value();
  res.json(profiles);
});

server.get('/api/client/recommendations', (req, res) => {
  const profiles = router.db.get('profiles').value();
  res.json(profiles.slice(0, 3));
});

server.get('/api/admin/users', (req, res) => res.json(router.db.get('users').value()));
server.get('/api/admin/analytics', (req, res) => res.json(router.db.get('analytics').value()));
server.get('/api/admin/announcements', (req, res) => res.json(router.db.get('announcements').value()));
server.get('/api/admin/badges', (req, res) => res.json(router.db.get('badges').value()));
server.get('/api/admin/categories', (req, res) => res.json(router.db.get('categories').value()));

server.use('/api', router);
server.listen(3001, () => console.log('✅ JSON Server running on http://localhost:3001'));
