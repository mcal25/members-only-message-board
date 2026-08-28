import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pg;

// Database connection string — update credentials/database name if needed
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

if (process.env.DB_USER == null) {console.error('Missing connection string')};

const users = [
  // Admin & Member
  { firstname: 'Alice', lastname: 'Smith', email: 'a@test.com', password: '123', is_member: true, is_admin: true },
  { firstname: 'Bob', lastname: 'Jones', email: 'b@test.com', password: '123', is_member: true, is_admin: true },

  // Regular Members (not admins)
  { firstname: 'Charlie', lastname: 'Brown', email: 'c@test.com', password: '123', is_member: true, is_admin: false },
  { firstname: 'Diana', lastname: 'Prince', email: 'd@test.com', password: '123', is_member: true, is_admin: false },
  { firstname: 'Evan', lastname: 'Wright', email: 'e@test.com', password: '123', is_member: true, is_admin: false },
  { firstname: 'Fiona', lastname: 'Gallagher', email: 'f@test.com', password: '123', is_member: true, is_admin: false },

  // Non-Members / Neither (registered, but pending or public status)
  { firstname: 'George', lastname: 'Clark', email: 'g@test.com', password: '123', is_member: false, is_admin: false },
  { firstname: 'Hannah', lastname: 'Abbott', email: 'h@test.com', password: '123', is_member: false, is_admin: false },
  { firstname: 'Ian', lastname: 'Malcolm', email: 'i@test.com', password: '123', is_member: false, is_admin: false },
  { firstname: 'Julia', lastname: 'Roberts', email: 'j@test.com', password: '123', is_member: false, is_admin: false },
];

const messages = [
  { title: 'Welcome Everyone!', text: 'Welcome to the members-only club portal.', user_index: 0 }, // Alice
  { title: 'Database Update', text: 'We just updated table permissions.', user_index: 1 },         // Bob
  { title: 'Secret Recipe', text: 'The secret ingredient is extra butter.', user_index: 2 },       // Charlie
  { title: 'Hello World', text: 'First post on the new platform!', user_index: 3 },               // Diana
  { title: 'Pending Approval', text: 'Can someone verify my membership status?', user_index: 6 }   // George
];

async function main() {
  console.log('Connecting to database...');
  const client = new Client({ connectionString });
  await client.connect();

  try {
    console.log('Inserting users...');
    const insertedUserIds = [];

    for (const user of users) {
      const res = await client.query(
        `INSERT INTO users (firstname, lastname, email, password, membership_status, admin_status)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO NOTHING
         RETURNING id;`,
        [user.firstname, user.lastname, user.email, user.password, user.is_member, user.is_admin]
      );

      if (res.rows.length > 0) {
        insertedUserIds.push(res.rows[0].id);
      } else {
        // Handle case where user already existed
        const existing = await client.query('SELECT id FROM users WHERE email = $1', [user.email]);
        insertedUserIds.push(existing.rows[0].id);
      }
    }

    console.log(`Populated ${insertedUserIds.length} users.`);

    console.log('Inserting sample messages...');
    for (const msg of messages) {
      const authorId = insertedUserIds[msg.user_index];
      await client.query(
        `INSERT INTO messages (title, text, user_id)
         VALUES ($1, $2, $3);`,
        [msg.title, msg.text, authorId]
      );
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

main();