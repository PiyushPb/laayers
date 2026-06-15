import { client } from './index';

async function resetDb() {
  console.log('Resetting database (dropping schema public)...');
  try {
    await client`DROP SCHEMA public CASCADE;`;
    await client`CREATE SCHEMA public;`;
    await client`GRANT ALL ON SCHEMA public TO postgres;`;
    await client`GRANT ALL ON SCHEMA public TO public;`;
    console.log('Database reset successfully. Run "pnpm db:push" or "pnpm db:migrate" to recreate tables.');
  } catch (err) {
    console.error('Error resetting database:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

resetDb();
