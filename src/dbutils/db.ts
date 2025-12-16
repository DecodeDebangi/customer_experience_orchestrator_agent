// PostgreSQL database utilities
// Install 'pg' package to use: npm install pg @types/pg

let pool: any = null;
let pg: any = null;

// Try to load pg module
try {
  pg = require('pg');
} catch (error) {
  console.warn('PostgreSQL (pg) module not installed. Database functions will not work.');
  console.warn('To use database features, run: npm install pg @types/pg');
}

// Lazy initialization of pool (called when first query is made)
function getPool() {
  if (!pool && pg) {
    console.log('🔌 Initializing PostgreSQL connection pool...');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Port: ${process.env.DB_PORT}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   User: ${process.env.DB_USER}`);
    
    pool = new pg.Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: Number(process.env.DB_PORT) || 5432,
    });
  }
  return pool;
}

export async function runQuery<T = any>(
  queryText: string,
  params: any[] = [],
): Promise<T[]> {
  const pool = getPool();
  
  if (!pool) {
    throw new Error('PostgreSQL pool not initialized. Install pg package: npm install pg @types/pg');
  }

  const client = await pool.connect();

  try {
    const result = await client.query(queryText, params);
    console.log('Query executed:', result.rowCount, 'rows');
    return result.rows;
  } catch (error) {
    console.error('Postgres Query Error:', error);
    throw error;
  } finally {
    client.release();
  }
}
