const createError = require('http-errors');
const express = require('express');
const app = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const user_router = require("./routes/user.route");
const admin_router = require("./routes/admin.route");
const institute_router = require("./routes/institute.route");
const qari_router = require("./routes/qari.route");
const student_router = require("./routes/student.route");
const report_router = require("./routes/report.route");
const booking_router = require("./routes/booking.route");

const {ReE} = require("../utils/helpers");

require('../utils/db.js');

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-auth-token');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Expose-Headers', 'x-auth-token');
  next();
});

app.use(logger('dev'));
app.use(express.json({limit: '16mb'}));
app.use(express.urlencoded({ limit: '16mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('../utils/passport.init');

app.use('/users', user_router);
app.use('/admins', admin_router);
app.use('/institutes', institute_router);
app.use('/qaris', qari_router);
app.use('/students', student_router);
app.use('/reports', report_router);
app.use('/bookings', booking_router);

app.use(function(err, req, res, next) {
  if(err.name === 'UnauthorizedError') {
    ReE(res, err, 422);
    logger.error(err);
    return;
  }
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end();
});

module.exports = app;