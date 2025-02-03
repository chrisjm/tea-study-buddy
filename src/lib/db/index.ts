import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema/index';

const client = createClient({
  url: process.env.DB_FILE_NAME ?? 'file:tea-study-buddy.db',
});

export const db = drizzle(client, { schema });
