import { db, queryClient } from '@/seed/db';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';

async function createAdmin() {
  await db.transaction(async (tx) => {
    await tx.execute(sql`set local search_path to nihilog, public;`);

    await tx.execute(sql`
      insert into user_info (
        user_nm,
        eml_addr,
        encpt_pswd,
        user_role
      )
      values (
        ${'admin'},
        ${'anikai7556@gmail.com'},
        ${await bcrypt.hash('IU0516jej081*', 10)},
        ${'ADMIN'}
      );
    `);
  });
}

createAdmin()
  .then(async () => {
    console.log('admin created');
    await queryClient.end();
  })
  .catch(async (error) => {
    console.log('admin creation failed', error);
    await queryClient.end();

    process.exit(1);
  });
