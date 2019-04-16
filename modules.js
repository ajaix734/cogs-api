//Core and External modules

exports.express = require('express')
exports.session = require('express-session')
exports.body_parser = require('body-parser')
exports.compression = require('compression')
exports.morgan = require('morgan')
exports.cors = require('cors')
exports.helmet = require('helmet')
exports._ = require('lodash')
exports.mysql = require('mysql')
exports.mysql2 = require('mysql2')
exports.cron = require('node-cron')
exports.uuid = require('uuid/v1')
exports.mysql_store = require('express-mysql-session')(this.session)
exports.cookie_parser = require('cookie-parser')
// exports.sessionStore = new this.mysql_store({
//     host: '13.251.255.12',
//     port: 3306,
//     user: 'jai',
//     pass: 'Jai7&@#',
//     db: 'cogs',
//     clearExpired: true,
//     checkExpirationInterval: 900000,
//     expiration: 86400000,
//     endConnectionOnClose: true,
//     charset: 'utf8mb4_bin',
//     schema: {
//         tableName: 'sessions',
//         columnNames: {
//             session_id: 'session_id',
//             expires: 'expires',
//             data: 'data'
//         }
//     }
// }, require('./connection').scm_root)
//File modules

exports.connections = require('./connection')
exports.sqls = require('./read_query')
exports.session_config = require('./session_config')
exports.routes = require('./routes')
exports.functions = require('./logic')
exports.nativeFunctions = require('./logic_native')
exports.creds = require('./creds')
exports.cron_job = require('./cron-mod')
// exports.cron_job = require('./cron-mod-new')