/*
 * login server main application
 */

// application configuration and defines
var config = require("./src/publicConfig.js");
var express = require('express'),
    app = express();

var rootRoute = require('./src/routes/root.js');
var loginRoute = require('./src/routes/login.js');
var apiRoute = require('./src/routes/api.js');

app.use('/', rootRoute);
app.use('/login', loginRoute);
app.use('/api', apiRoute);
app.listen(3000);

console.log('Express server started on port 3000');
