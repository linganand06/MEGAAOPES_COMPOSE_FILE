import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'crm_user',
    password: process.env.DB_PASSWORD || 'crmpassword123',
    database: process.env.DB_DATABASE || 'crm',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
