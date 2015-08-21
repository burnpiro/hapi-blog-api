module.exports = {
    product: {
        name: 'Hapi Blog API'
    },
    server: {
        host: '10.10.30.130',
        port: 8080
    },
    database: {
        host: '127.0.0.1',
        port: 27017,
        db: 'blog',
        username: '',
        password: ''
    },
    scopes: [
        'admin',
        'user'
    ],
    security: {
        workFactor: 11
    },
    token: {
        privateKey: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
        tokenExpire: 60*60*24 // 1 day
    },
    publicFolder: './public',
    uploadFolder: '/uploads',
    MixFolder: './public/uploads',
    MixInsideFolder: './public/uploads/',
    defaultValues: {
        author: 'Kemal Erdem'
    }
};
