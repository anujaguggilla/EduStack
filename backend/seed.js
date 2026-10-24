require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const Material = require('./models/Material');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Material.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create users
    const faculty = await User.create({
      name: 'Dr. Rajesh Kumar',
      email: 'faculty@edustack.com',
      password: 'faculty123',
      role: 'faculty'
    });

    const student1 = await User.create({
      name: 'Priya Sharma',
      email: 'student@edustack.com',
      password: 'student123',
      role: 'student'
    });

    const student2 = await User.create({
      name: 'Arjun Patel',
      email: 'arjun@edustack.com',
      password: 'arjun123',
      role: 'student'
    });

    console.log('✓ Created users');

    // Create courses
    const course1 = await Course.create({
      name: 'Data Structures',
      subject: 'Computer Science',
      description: 'Comprehensive course on data structures and algorithms',
      faculty: faculty._id
    });

    const course2 = await Course.create({
      name: 'Database Management Systems',
      subject: 'Computer Science',
      description: 'Introduction to relational databases and SQL',
      faculty: faculty._id
    });

    const course3 = await Course.create({
      name: 'Web Development',
      subject: 'Computer Science',
      description: 'Full-stack web development with modern technologies',
      faculty: faculty._id
    });

    console.log('✓ Created courses');

    // Create materials
    const materials = [
      {
        fileName: 'Introduction to Arrays',
        fileType: 'PDF',
        subject: 'Computer Science',
        module: 'Module 1',
        topic: 'Arrays',
        course: course1._id,
        uploadedBy: faculty._id,
        downloadCount: 45,
        usefulCount: 28,
        fileSize: '2.3 MB',
        feedback: [
          {
            student: student1._id,
            studentName: 'Priya Sharma',
            comment: 'Very clear explanation of array concepts!',
            date: new Date('2025-10-20')
          },
          {
            student: student2._id,
            studentName: 'Arjun Patel',
            comment: 'Helpful examples included',
            date: new Date('2025-10-22')
          }
        ],
        uploadDate: new Date('2025-10-15')
      },
      {
        fileName: 'Linked Lists Implementation',
        fileType: 'PPT',
        subject: 'Computer Science',
        module: 'Module 2',
        topic: 'Linked Lists',
        course: course1._id,
        uploadedBy: faculty._id,
        downloadCount: 38,
        usefulCount: 22,
        fileSize: '4.1 MB',
        feedback: [
          {
            student: student1._id,
            studentName: 'Priya Sharma',
            comment: 'Good visualizations of pointers',
            date: new Date('2025-10-25')
          }
        ],
        uploadDate: new Date('2025-10-18')
      },
      {
        fileName: 'Stack and Queue',
        fileType: 'DOC',
        subject: 'Computer Science',
        module: 'Module 3',
        topic: 'Linear Data Structures',
        course: course1._id,
        uploadedBy: faculty._id,
        downloadCount: 41,
        usefulCount: 25,
        fileSize: '1.8 MB',
        feedback: [],
        uploadDate: new Date('2025-10-20')
      },
      {
        fileName: 'Practice Problems Set 1',
        fileType: 'ZIP',
        subject: 'Computer Science',
        module: 'Module 1',
        topic: 'Practice',
        course: course1._id,
        uploadedBy: faculty._id,
        downloadCount: 52,
        usefulCount: 35,
        fileSize: '5.2 MB',
        feedback: [
          {
            student: student2._id,
            studentName: 'Arjun Patel',
            comment: 'Great practice problems for exam prep',
            date: new Date('2025-10-28')
          }
        ],
        uploadDate: new Date('2025-10-22')
      },
      {
        fileName: 'SQL Basics',
        fileType: 'PDF',
        subject: 'Computer Science',
        module: 'Module 1',
        topic: 'SQL',
        course: course2._id,
        uploadedBy: faculty._id,
        downloadCount: 47,
        usefulCount: 31,
        fileSize: '3.2 MB',
        feedback: [
          {
            student: student1._id,
            studentName: 'Priya Sharma',
            comment: 'Perfect introduction to SQL queries',
            date: new Date('2025-10-16')
          }
        ],
        uploadDate: new Date('2025-10-12')
      },
      {
        fileName: 'Normalization Concepts',
        fileType: 'PPT',
        subject: 'Computer Science',
        module: 'Module 2',
        topic: 'Database Design',
        course: course2._id,
        uploadedBy: faculty._id,
        downloadCount: 33,
        usefulCount: 19,
        fileSize: '3.8 MB',
        feedback: [],
        uploadDate: new Date('2025-10-25')
      },
      {
        fileName: 'ER Diagrams Tutorial',
        fileType: 'PDF',
        subject: 'Computer Science',
        module: 'Module 1',
        topic: 'ER Model',
        course: course2._id,
        uploadedBy: faculty._id,
        downloadCount: 29,
        usefulCount: 18,
        fileSize: '2.7 MB',
        feedback: [
          {
            student: student2._id,
            studentName: 'Arjun Patel',
            comment: 'Step-by-step ER diagram examples',
            date: new Date('2025-11-02')
          }
        ],
        uploadDate: new Date('2025-10-28')
      },
      {
        fileName: 'HTML CSS Fundamentals',
        fileType: 'PDF',
        subject: 'Computer Science',
        module: 'Module 1',
        topic: 'Frontend',
        course: course3._id,
        uploadedBy: faculty._id,
        downloadCount: 56,
        usefulCount: 40,
        fileSize: '4.5 MB',
        feedback: [
          {
            student: student1._id,
            studentName: 'Priya Sharma',
            comment: 'Excellent resource for beginners',
            date: new Date('2025-10-14')
          },
          {
            student: student2._id,
            studentName: 'Arjun Patel',
            comment: 'Covers all basics thoroughly',
            date: new Date('2025-10-15')
          }
        ],
        uploadDate: new Date('2025-10-10')
      },
      {
        fileName: 'JavaScript ES6 Features',
        fileType: 'PPT',
        subject: 'Computer Science',
        module: 'Module 2',
        topic: 'JavaScript',
        course: course3._id,
        uploadedBy: faculty._id,
        downloadCount: 44,
        usefulCount: 27,
        fileSize: '3.4 MB',
        feedback: [
          {
            student: student1._id,
            studentName: 'Priya Sharma',
            comment: 'Modern JS features explained well',
            date: new Date('2025-10-20')
          }
        ],
        uploadDate: new Date('2025-10-16')
      },
      {
        fileName: 'Node.js Backend Setup',
        fileType: 'DOC',
        subject: 'Computer Science',
        module: 'Module 3',
        topic: 'Backend',
        course: course3._id,
        uploadedBy: faculty._id,
        downloadCount: 36,
        usefulCount: 23,
        fileSize: '2.9 MB',
        feedback: [],
        uploadDate: new Date('2025-11-01')
      }
    ];

    const createdMaterials = await Material.insertMany(materials);
    console.log('✓ Created materials');

    // Update courses with material IDs
    await Course.findByIdAndUpdate(course1._id, {
      $push: { materials: { $each: createdMaterials.slice(0, 4).map(m => m._id) } }
    });
    await Course.findByIdAndUpdate(course2._id, {
      $push: { materials: { $each: createdMaterials.slice(4, 7).map(m => m._id) } }
    });
    await Course.findByIdAndUpdate(course3._id, {
      $push: { materials: { $each: createdMaterials.slice(7, 10).map(m => m._id) } }
    });

    console.log('✓ Updated courses with materials');
    console.log('\n========================================');
    console.log('✓ Database seeded successfully!');
    console.log('========================================');
    console.log('\nDemo Accounts:');
    console.log('Faculty: faculty@edustack.com / faculty123');
    console.log('Student: student@edustack.com / student123');
    console.log('Student: arjun@edustack.com / arjun123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
