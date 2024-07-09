import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    host: "localhost",
    database: "world",
    port: 5432,
    user: "postgres",
    password: "12345"
})

export default pool;