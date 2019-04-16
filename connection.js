// const mysql = require('./modules').mysql
const mysql = require('./modules').mysql2
const creds = require('./creds')

exports.ideamed = mysql.createPool({
    host: creds.ideamed.host,
    user: creds.ideamed.user,
    password: creds.ideamed.pass,
    database: creds.ideamed.db,
    port: creds.ideamed.port,
    dateStrings: true,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

exports.local = mysql.createPool({
    host: creds.local.host,
    user: creds.local.user,
    password: creds.local.pass,
    database: creds.local.db,
    port: creds.local.port,
    dateStrings: true,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

exports.scm_root = mysql.createPool({
    host: creds.scm_root.host,
    user: creds.scm_root.user,
    password: creds.scm_root.pass,
    database: creds.scm_root.db,
    port: creds.scm_root.port,
    dateStrings: true,
    insecureAuth: true,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

exports.scm_public = mysql.createPool({
    host: creds.scm_public.host,
    user: creds.scm_public.user,
    password: creds.scm_public.pass,
    database: creds.scm_public.db,
    port: creds.scm_public.port,
    dateStrings: true,
    multipleStatements: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})