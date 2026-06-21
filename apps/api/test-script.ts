import { db, workspaces, workspaceSdkKeys } from '@layers/database';
import { eq } from 'drizzle-orm';

async function main() {
  try {
    const res = await db.select().from(workspaceSdkKeys).limit(1);
    console.log("Success:", res);
  } catch (err) {
    console.error("DB Error:", err);
  }
  process.exit(0);
}
main();
