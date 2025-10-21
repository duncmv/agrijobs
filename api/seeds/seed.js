/* eslint-disable no-console */
const path = require('path');
const assert = require('assert');

// Load .env (try root, then local)
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
} catch {}
try {
  require('dotenv').config();
} catch {}

const { connect, disconnect } = require('../src/db');
const {
  User,
  Profile,
  EmployerOrg,
  Job,
  Application,
  Message,
} = require('../src/models');

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function ensureIndexes() {
  await Promise.all([
    User.syncIndexes(),
    Profile.syncIndexes(),
    EmployerOrg.syncIndexes(),
    Job.syncIndexes(),
    Application.syncIndexes(),
    Message.syncIndexes(),
  ]);
}

async function clearSeedData() {
  await Promise.all([
    Message.deleteMany({ isSeedData: true }),
    Application.deleteMany({ isSeedData: true }),
    Job.deleteMany({ isSeedData: true }),
    EmployerOrg.deleteMany({ isSeedData: true }),
    Profile.deleteMany({ isSeedData: true }),
    User.deleteMany({ isSeedData: true }),
  ]);
}

function geoPoint(lng, lat) {
  return { type: 'Point', coordinates: [lng, lat] };
}

async function seed() {
  console.log('Connecting to MongoDB...');
  await connect();
  console.log('Connected. Ensuring indexes...');
  await ensureIndexes();

  console.log('Clearing previous seed data...');
  await clearSeedData();

  console.log('Seeding users...');
  const users = await User.create([
    { email: 'admin@example.com', passwordHash: 'hashed_admin', roles: ['admin'], isSeedData: true },
    { email: 'employer1@example.com', passwordHash: 'hashed_emp1', roles: ['employer'], isSeedData: true },
    { email: 'employer2@example.com', passwordHash: 'hashed_emp2', roles: ['employer'], isSeedData: true },
    { email: 'candidate1@example.com', passwordHash: 'hashed_cand1', roles: ['candidate'], isSeedData: true },
    { email: 'candidate2@example.com', passwordHash: 'hashed_cand2', roles: ['candidate'], isSeedData: true },
  ]);

  const [admin, employer1, employer2, candidate1, candidate2] = users;

  console.log('Seeding profiles...');
  const profiles = await Profile.create([
    {
      user: candidate1._id,
      firstName: 'Alice',
      lastName: 'Anderson',
      headline: 'Full-Stack Developer',
      summary: 'Experienced in Node.js, React, and cloud-native development.',
      skills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'Docker'],
      location: geoPoint(-122.4194, 37.7749), // SF
      city: 'San Francisco',
      region: 'CA',
      country: 'USA',
      links: { github: 'https://github.com/alice', linkedin: 'https://linkedin.com/in/alice' },
      isSeedData: true,
    },
    {
      user: candidate2._id,
      firstName: 'Bob',
      lastName: 'Brown',
      headline: 'Data Engineer',
      summary: 'Specializes in data pipelines and analytics.',
      skills: ['Python', 'Airflow', 'Spark', 'SQL', 'AWS'],
      location: geoPoint(-74.006, 40.7128), // NYC
      city: 'New York',
      region: 'NY',
      country: 'USA',
      links: { github: 'https://github.com/bob', linkedin: 'https://linkedin.com/in/bob' },
      isSeedData: true,
    },
  ]);

  console.log('Seeding organizations...');
  const orgs = await EmployerOrg.create([
    {
      name: 'Acme Corporation',
      slug: slugify('Acme Corporation'),
      website: 'https://acme.example.com',
      industry: 'Technology',
      size: '201-500',
      description: 'Innovative solutions for modern problems.',
      headquarters: geoPoint(-118.2437, 34.0522), // LA
      regions: ['CA', 'NY', 'Remote'],
      ownerUser: employer1._id,
      hrManagerUsers: [employer1._id],
      testimonials: [
        { authorName: 'Alice A.', text: 'Great culture and challenging problems.', rating: 5 },
      ],
      isSeedData: true,
    },
    {
      name: 'Globex Inc',
      slug: slugify('Globex Inc'),
      website: 'https://globex.example.com',
      industry: 'Finance',
      size: '501-1000',
      description: 'Global financial services provider.',
      headquarters: geoPoint(-0.1276, 51.5074), // London
      regions: ['UK', 'EU', 'Remote'],
      ownerUser: employer2._id,
      hrManagerUsers: [employer2._id],
      testimonials: [
        { authorName: 'Bob B.', text: 'Strong growth and supportive team.', rating: 4 },
      ],
      isSeedData: true,
    },
  ]);

  const [acme, globex] = orgs;

  console.log('Seeding jobs...');
  const jobs = await Job.create([
    {
      title: 'Senior Full-Stack Engineer',
      description: 'Build end-to-end features using Node.js and React.',
      employmentType: 'full-time',
      remote: true,
      employerOrg: acme._id,
      createdBy: employer1._id,
      location: geoPoint(-122.4194, 37.7749),
      city: 'San Francisco',
      region: 'CA',
      country: 'USA',
      skills: ['JavaScript', 'Node.js', 'React', 'GraphQL'],
      salaryMin: 140000,
      salaryMax: 180000,
      currency: 'USD',
      status: 'open',
      isSeedData: true,
    },
    {
      title: 'Data Engineer',
      description: 'Design and maintain data pipelines and ETL processes.',
      employmentType: 'full-time',
      remote: false,
      employerOrg: globex._id,
      createdBy: employer2._id,
      location: geoPoint(-0.1276, 51.5074),
      city: 'London',
      region: 'London',
      country: 'UK',
      skills: ['Python', 'Airflow', 'Spark', 'AWS'],
      salaryMin: 70000,
      salaryMax: 90000,
      currency: 'GBP',
      status: 'open',
      isSeedData: true,
    },
    {
      title: 'Frontend Engineer (React)',
      description: 'Create stunning UI with React and Tailwind.',
      employmentType: 'contract',
      remote: true,
      employerOrg: acme._id,
      createdBy: employer1._id,
      location: geoPoint(-118.2437, 34.0522),
      city: 'Los Angeles',
      region: 'CA',
      country: 'USA',
      skills: ['React', 'TypeScript', 'TailwindCSS'],
      salaryMin: 70,
      salaryMax: 100,
      currency: 'USD/hour',
      status: 'open',
      isSeedData: true,
    },
  ]);

  const [job1, job2, job3] = jobs;

  console.log('Seeding applications...');
  const applications = await Application.create([
    {
      job: job1._id,
      applicantUser: candidate1._id,
      profile: profiles[0]._id,
      coverLetter: 'I have extensive experience building full-stack apps.',
      resumeUrl: 'https://files.example.com/resumes/alice.pdf',
      status: 'submitted',
      isSeedData: true,
    },
    {
      job: job2._id,
      applicantUser: candidate2._id,
      profile: profiles[1]._id,
      coverLetter: 'Data pipelines are my passion and expertise.',
      resumeUrl: 'https://files.example.com/resumes/bob.pdf',
      status: 'review',
      isSeedData: true,
    },
  ]);

  console.log('Seeding messages...');
  await Message.create([
    {
      fromUser: employer1._id,
      toUser: candidate1._id,
      employerOrg: acme._id,
      job: job1._id,
      application: applications[0]._id,
      body: 'Hi Alice, thanks for applying! When are you available for an interview?',
      isSeedData: true,
    },
    {
      fromUser: candidate1._id,
      toUser: employer1._id,
      employerOrg: acme._id,
      job: job1._id,
      application: applications[0]._id,
      body: 'Thanks for reaching out! I am available next week.',
      isSeedData: true,
    },
  ]);

  console.log('Running assertions...');
  const [userCount, profileCount, orgCount, jobCount, appCount, msgCount] = await Promise.all([
    User.countDocuments({ isSeedData: true }),
    Profile.countDocuments({ isSeedData: true }),
    EmployerOrg.countDocuments({ isSeedData: true }),
    Job.countDocuments({ isSeedData: true }),
    Application.countDocuments({ isSeedData: true }),
    Message.countDocuments({ isSeedData: true }),
  ]);

  assert(userCount >= 5, 'Expected at least 5 seeded users');
  assert(profileCount >= 2, 'Expected at least 2 seeded profiles');
  assert(orgCount >= 2, 'Expected at least 2 seeded organizations');
  assert(jobCount >= 3, 'Expected at least 3 seeded jobs');
  assert(appCount >= 2, 'Expected at least 2 seeded applications');
  assert(msgCount >= 2, 'Expected at least 2 seeded messages');

  // index checks (basic)
  const userIndexes = await User.collection.indexes();
  const hasEmailUnique = userIndexes.some((i) => i.key && i.key.email === 1 && i.unique);
  assert(hasEmailUnique, 'User.email unique index missing');

  const jobIndexes = await Job.collection.indexes();
  const hasJobGeo = jobIndexes.some((i) => i.key && i.key.location === '2dsphere');
  assert(hasJobGeo, 'Job.location 2dsphere index missing');

  console.log('Seed completed successfully.');
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnect();
  });
