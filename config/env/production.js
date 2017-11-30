module.exports = {
    db: {
        mysql: {
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'database'
        }
    },
    jwtSecret: 'friz' + (Math.floor(Math.random() * 1000000)) + 'hub',
    client_url: '',
    env: 'production',
    
}