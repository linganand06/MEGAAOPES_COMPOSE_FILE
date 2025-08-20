import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
const runSqlFile = async (connection: mysql.Connection, filePath: string) => {
    const sql = fs.readFileSync(filePath, 'utf-8');
    const statements = sql.split(/;\s*$/m);
    for (const statement of statements) {
        if (statement.length > 0) {
            try {
                await connection.query(statement);
            } catch (error: any) {
                // Ignore "Duplicate key name" errors, which can happen if the schema is already applied.
                if (error.code === 'ER_DUP_KEYNAME') {
                    console.log(`Ignoring idempotent error: ${error.sqlMessage}`);
                } else {
                    throw error;
                }
            }
        }
    }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initializeDatabase = async (retries = 5) => {
    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    };

    while (retries > 0) {
        try {
            const connection = await mysql.createConnection({
                ...dbConfig,
                multipleStatements: true,
            });
            console.log('Successfully connected to the database.');
            return connection;
        } catch (error) {
            retries--;
            console.error('Failed to connect to the database. Retrying...', error);
            if (retries === 0) {
                throw error;
            }
            await sleep(5000); // Wait for 5 seconds before retrying
        }
    }
    throw new Error('Could not connect to the database after multiple retries.');
};

const run = async () => {
    const connection = await initializeDatabase();

    try {
        console.log('Initializing database...');

        // Run schema file
        const schemaPath = path.join(__dirname, '../../sql/schema.sql');
        await runSqlFile(connection, schemaPath);
        console.log('Schema initialized.');

        // Check if deals table is empty
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM deals');
        const count = (rows as any)[0].count;

        if (count === 0) {
            console.log('Deals table is empty, seeding data...');
            // Run seed file
            const seedPath = path.join(__dirname, '../../sql/seed.sql');
            await runSqlFile(connection, seedPath);
            console.log('Data seeded.');
        } else {
            console.log('Deals table is not empty, skipping seed.');
        }

        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    } finally {
        await connection.end();
    }
};

run();
