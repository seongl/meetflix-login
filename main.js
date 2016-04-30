/*
 * authentication / RESTful API server main application
 */

// application configuration and defines
import config from "./src/publicConfig" ;
var express = require('express'),
    app = express();
var passport = require('passport');
var bodyParser = require('body-parser');
var rootRoute = require('./src/routes/root.js');
var loginRoute = require('./src/routes/login.js');
var apiRoute = require('./src/routes/api.js');


// App configurations
// configure app to use bodyParser(). this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'unguessable',
                                     resave: true,
                                     saveUninitialized: true}));
// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());


// route settings
//app.use('/', rootRoute);
app.use('/', loginRoute);
app.use('/api', apiRoute);

// now, listen!
app.listen(3000);

// error handlers
/*
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
*/
console.log('Authentication/RESTful-API server started on port 3000');
