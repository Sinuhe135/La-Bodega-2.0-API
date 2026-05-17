import mysql from 'mysql2/promise'
import env from './env'

const pool = mysql.createPool({
    host: env.MYSQL_HOST,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    port: env.MYSQL_PORT,
    connectionLimit: 10,
})

export default pool
