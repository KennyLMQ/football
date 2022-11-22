import { Pool } from "pg";

const connectionString = process.env.DATABASE_LOGIN_URL;

export const pool = new Pool({ connectionString });
