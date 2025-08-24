const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'study-secret', resave: false, saveUninitialized: false }));

// In-memory user store
const users = [
  { email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { email: 'alice@example.com', password: 'password123', role: 'user' },
  { email: 'bob@example.com', password: 'password123', role: 'user' }
];

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/login');
  }
  next();
}

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.render('login', { error: 'Invalid credentials' });
  }
  req.session.user = { email: user.email, role: user.role };
  // Initialize user session data
  req.session.modulesCompleted = [];
  req.session.tasks = [];
  req.session.hours = { Mon: 1, Tue: 2, Wed: 1, Thu: 3, Fri: 2, Sat: 0, Sun: 4 };
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);
  req.session.endDate = endDate;
  res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.get('/dashboard', requireLogin, (req, res) => {
  const daysRemaining = Math.max(0, Math.ceil((new Date(req.session.endDate) - new Date()) / (1000 * 60 * 60 * 24)));
  res.render('dashboard', {
    user: req.session.user,
    hours: req.session.hours,
    modulesCompleted: req.session.modulesCompleted,
    tasks: req.session.tasks,
    daysRemaining
  });
});

app.get('/study-plan', requireLogin, (req, res) => {
  const modules = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    note: `Sample notes for module ${i + 1}`,
    done: req.session.modulesCompleted.includes(i + 1)
  }));
  res.render('study-plan', { modules });
});

app.post('/complete-module', requireLogin, (req, res) => {
  const id = parseInt(req.body.id, 10);
  if (!req.session.modulesCompleted.includes(id)) {
    req.session.modulesCompleted.push(id);
  }
  res.redirect('/study-plan');
});

app.post('/tasks', requireLogin, (req, res) => {
  const { text } = req.body;
  const id = Date.now();
  req.session.tasks.push({ id, text, done: false });
  res.redirect('/dashboard');
});

app.post('/tasks/:id/complete', requireLogin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = req.session.tasks.find(t => t.id === id);
  if (task) {
    task.done = true;
  }
  res.redirect('/dashboard');
});

// Admin routes
app.get('/admin', requireAdmin, (req, res) => {
  res.render('admin', { users, error: null });
});

app.post('/admin/add', requireAdmin, (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.render('admin', { users, error: 'User already exists' });
  }
  users.push({ email, password, role: 'user' });
  res.redirect('/admin');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Study Tracker running on port ${port}`));

