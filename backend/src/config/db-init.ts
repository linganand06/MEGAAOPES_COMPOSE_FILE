import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const runSqlFile = async (connection: mysql.Connection, filePath: string) => {
    const sql = fs.readFileSync(filePath, 'utf-8');
    const statements = sql.split(/;\s*$/m);
    for (const statement of statements) {
        if (statement.length > 0) {
            await connection.query(statement);
        }
    }
};

export const ensureDatabaseInitialized = async () => {
    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    };

    let connection: mysql.Connection | undefined;
    let retries = 5;

    while (retries > 0) {
        try {
            connection = await mysql.createConnection({
                ...dbConfig,
                multipleStatements: true,
            });
            console.log('Successfully connected to the database for initialization check.');
            break; 
        } catch (error) {
            retries--;
            console.error('Failed to connect to the database for initialization. Retrying...', error);
            if (retries === 0) {
                console.error('Could not connect to the database after multiple retries. Aborting initialization.');
                process.exit(1);
            }
            await sleep(5000);
        }
    }

    if (!connection) {
        console.error('Database connection could not be established.');
        process.exit(1);
    }

    try {
        // Check if the 'deals' table exists
        const [rows] = await connection.query("SHOW TABLES LIKE 'deals';");

        if ((rows as any[]).length === 0) {
            console.log("'deals' table not found. Initializing database schema and seeding data...");

            // Run schema file
            const schemaPath = path.join(__dirname, '../../sql/schema.sql');
            await runSqlFile(connection, schemaPath);
            console.log('Schema initialized.');

            // Run seed file
            const seedPath = path.join(__dirname, '../../sql/seed.sql');
            await runSqlFile(connection, seedPath);
            console.log('Data seeded.');
        } else {
            console.log("'deals' table already exists. Skipping database initialization.");
        }
    } catch (error) {
        console.error('Error during database initialization:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Initialization connection closed.');
        }
    }
};
