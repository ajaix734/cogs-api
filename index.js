const modules = require('./modules')
const app = modules.express()

app.use(modules.cookie_parser())
app.use(modules.morgan('dev'))
app.use(modules.body_parser.urlencoded({ extended: false }))
app.use(modules.body_parser.json())
app.use(modules.cors())
app.use(modules.compression())
app.use(modules.helmet())
app.use(modules.session({ name: 'session_ID', secret: 'Bi$$DS@@J&a&i&*', resave: false, saveUninitialized: true, cookie: { maxAge: 60000 } }))

modules.cron_job.schedule;

app.get('/api-super/:date', modules.routes.main_route)
app.get('/api-normal/:date/:name', modules.routes.test_route)
app.get('/api-revenue-super/:date', modules.routes.main_route_revenue)
app.get('/api-revenue-normal/:date/:name', modules.routes.test_route_revenue)
app.get('/health', modules.routes.health)
app.post('/login', modules.routes.testLogin)
app.get('/logout', modules.routes.logout)

app.listen(process.env.PORT || 7777, () => console.log(`App listening on port ${process.env.PORT || 7777}`))