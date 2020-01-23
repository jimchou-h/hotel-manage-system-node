var express = require('express');
var cookieParser = require('cookie-parser');
var createError = require('http-errors');

const commonRouter = require('./routes/common')
const adminRouter = require('./routes/admin')
const cleanerRouter = require('./routes/cleaner')
const frontRouter = require('./routes/front')
const logisticsRouter = require('./routes/logistics')
const managerRouter = require('./routes/manager')
const customerRouter = require('./routes/customer')
const waiterRouter = require('./routes/waiter')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

var app = express();

// 设置跨域请求
app.all('*', (req, res, next) => {
  var origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token');
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE');
  next()
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
app.use(session({
  secret: 'Hjz_202006',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

app.use('/api', commonRouter);
app.use('/api/admin', adminRouter);
app.use('/api/cleaner', cleanerRouter);
app.use('/api/front', frontRouter);
app.use('/api/logistics', logisticsRouter);
app.use('/api/manager', managerRouter);
app.use('/api/waiter', waiterRouter);
app.use('/api/customer', customerRouter);

app.use(function (req, res, next) {
  next(createError(404));
});



module.exports = app;