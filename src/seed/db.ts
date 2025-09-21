import { loadYamlConfig } from '@/conf/conf';
import { schemas } from '@/endpoints/drizzle/schemas';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const queryClient = new Pool({
  connectionString: loadYamlConfig().database.url,
  max: 1,
});

export const db = drizzle(queryClient, {
  schema: schemas,
});
