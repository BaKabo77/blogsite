import session from 'express-session';
import MySQLStore from 'express-mysql-session';

// Il faut passer la session en argument à MySQLStore
const MySQLStoreSession = MySQLStore(session);

const options = {
    host: 'localhost',
    database: 'blogdb',
    user: 'root',
    password: 'root',
    port: 3306,

    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    },

    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000
};

// Création du store en utilisant MySQLStoreSession
const sessionStore = new MySQLStoreSession(options);

// Configuration du middleware session
const sessionMiddleware = session({
    secret: 'votre_secret_tres_long',
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 86400000,
        sameSite: 'lax'
    },
    name: 'sessionId'
});

export default sessionMiddleware;