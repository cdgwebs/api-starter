const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const mongoose = require('mongoose');

const userRouter = require('./routes/user.route');

const cookieSession = require('cookie-session');

const app = express();

const port = 3000;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/user', userRouter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Cookie Store in Session
app.set('trust proxy', 1);
/* // Can be used for storing session variables
    if (!request.session.visitCount) {
        request.session.visitCount = 0;
    }
    request.session.visitCount += 1;
    console.log(`Visit count is: ${request.session.visitCount}`);
*/
app.use(
    cookieSession({
        name: 'session',
        keys: ['ofhjadsdgoihaig', 'asdkfhaddoifh'],
    })
);

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => {
    // Just to log the root path
    console.log(`Home directory: ${path.join(__dirname, './static')}`);
    console.log(`Express server listening on port ${port}`);
    console.log(`Production Mongo Connection ${process.env.PRODUCTION_DB_DSN}`);
    console.log(`Development Mongo Connection ${process.env.DEVELOPMENT_DB_DSN}`);
    console.log(`Test Mongo Connection ${process.env.TEST_DB_DSN}`);
});

const uri = `${process.env.TEST_DB_DSN}`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

module.exports = () => {
    return app;
};