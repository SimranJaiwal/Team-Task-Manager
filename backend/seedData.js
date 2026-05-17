const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/team-task-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin'
    });

    const memberUser = await User.create({
      username: 'member',
      email: 'member@test.com',
      password: 'member123',
      role: 'member'
    });

    console.log('Created test users');

    // Create test projects
    const project1 = await Project.create({
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      owner: adminUser._id,
      members: [adminUser._id, memberUser._id],
      status: 'active',
      endDate: new Date('2026-06-30')
    });

    const project2 = await Project.create({
      name: 'Mobile App Development',
      description: 'Build cross-platform mobile application',
      owner: adminUser._id,
      members: [adminUser._id],
      status: 'active',
      endDate: new Date('2026-08-15')
    });

    const project3 = await Project.create({
      name: 'Database Migration',
      description: 'Migrate legacy database to new system',
      owner: memberUser._id,
      members: [memberUser._id, adminUser._id],
      status: 'in-progress',
      endDate: new Date('2026-05-30')
    });

    console.log('Created test projects');

    // Create test tasks for Project 1
    await Task.create([
      {
        title: 'Design Homepage Mockup',
        description: 'Create wireframes and high-fidelity mockups for homepage',
        project: project1._id,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        status: 'completed',
        priority: 'high',
        dueDate: new Date('2026-05-10')
      },
      {
        title: 'Implement Navigation',
        description: 'Build responsive navigation component',
        project: project1._id,
        assignedTo: memberUser._id,
        createdBy: adminUser._id,
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2026-05-20')
      },
      {
        title: 'Write Content',
        description: 'Create and edit website content',
        project: project1._id,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        status: 'pending',
        priority: 'medium',
        dueDate: new Date('2026-05-25')
      },
      {
        title: 'SEO Optimization',
        description: 'Implement SEO best practices',
        project: project1._id,
        assignedTo: memberUser._id,
        createdBy: adminUser._id,
        status: 'pending',
        priority: 'low',
        dueDate: new Date('2026-05-15')
      }
    ]);

    // Create test tasks for Project 2
    await Task.create([
      {
        title: 'Setup React Native',
        description: 'Initialize React Native project structure',
        project: project2._id,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        status: 'completed',
        priority: 'high',
        dueDate: new Date('2026-05-05')
      },
      {
        title: 'Design App Screens',
        description: 'Create UI designs for all app screens',
        project: project2._id,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2026-06-01')
      },
      {
        title: 'Implement Authentication',
        description: 'Build user authentication system',
        project: project2._id,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        status: 'pending',
        priority: 'high',
        dueDate: new Date('2026-06-15')
      }
    ]);

    // Create test tasks for Project 3
    await Task.create([
      {
        title: 'Analyze Legacy Database',
        description: 'Document existing database structure',
        project: project3._id,
        assignedTo: memberUser._id,
        createdBy: memberUser._id,
        status: 'completed',
        priority: 'high',
        dueDate: new Date('2026-05-01')
      },
      {
        title: 'Create Migration Scripts',
        description: 'Write scripts to migrate data',
        project: project3._id,
        assignedTo: memberUser._id,
        createdBy: memberUser._id,
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2026-05-20')
      },
      {
        title: 'Test Migration',
        description: 'Run migration on test environment',
        project: project3._id,
        assignedTo: adminUser._id,
        createdBy: memberUser._id,
        status: 'pending',
        priority: 'high',
        dueDate: new Date('2026-05-25')
      }
    ]);

    console.log('Created test tasks');

    console.log('\n=== Seed Data Successfully Created ===');
    console.log('Users:');
    console.log(`  - Admin: admin@test.com / admin123`);
    console.log(`  - Member: member@test.com / member123`);
    console.log('\nProjects: 3');
    console.log('Tasks: 10');
    console.log('\nYou can now login with these credentials to test the application!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
