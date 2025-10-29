const mongoose = require('mongoose');
require('dotenv').config();

// User schema (matching your server.cjs)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

async function promoteToAdmin(username) {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`User '${username}' not found`);
      return;
    }
    
    user.admin = true;
    await user.save();
    
    console.log(`User '${username}' has been promoted to admin`);
    console.log('User details:', {
      username: user.username,
      admin: user.admin
    });
    
  } catch (error) {
    console.error('Error promoting user to admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    const users = await User.find({}, 'username admin');
    
    console.log('All users:');
    users.forEach(user => {
      console.log(`- ${user.username} (admin: ${user.admin})`);
    });
    
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Check command line arguments
const command = process.argv[2];
const username = process.argv[3];

if (command === 'promote' && username) {
  promoteToAdmin(username);
} else if (command === 'list') {
  listUsers();
} else {
  console.log('Usage:');
  console.log('  node admin-tools.js list                  - List all users');
  console.log('  node admin-tools.js promote <username>    - Promote user to admin');
  console.log('');
  console.log('Examples:');
  console.log('  node admin-tools.js list');
  console.log('  node admin-tools.js promote john_doe');
}