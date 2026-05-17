const env = {
    PORT: parseInt(process.env.PORT ?? '3000'),
    MYSQL_HOST: process.env.MYSQL_HOST ?? '',
    MYSQL_USER: process.env.MYSQL_USER ?? '',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ?? '',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE ?? '',
    MYSQL_PORT: parseInt(process.env.MYSQL_PORT ?? '3306'),
    NODE_ENV: process.env.NODE_ENV ?? 'development',
}

export default env
