module.exports = {
    db: {
        mysql: {
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'frizhub-auth'
        }
    },
    jwtSecret: 'password',
    client_url: 'http://localhost:3004/',
    env: 'development',
   
}