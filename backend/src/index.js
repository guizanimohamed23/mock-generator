const http = require('http');
const { connectToDatabase } = require('./config/db');
const app = require('./app');
const User = require('./models/User');

const PORT = process.env.PORT || 5000;

async function start() {
  await connectToDatabase();
  // Seed default admin if no users exist
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Passw0rd!',
      role: 'Backend',
    });
    console.log('Seeded default admin user: admin@example.com / Passw0rd!');
  }
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});


