/*
 * authentication / RESTful API server main application
 */

// application configuration and defines
import config from "./src/publicConfig" ;
var express = require('express'),
    app = express();
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var rootRoute = require('./src/routes/root.js');
var loginRoute = require('./src/routes/login.js');
var apiRoute = require('./src/routes/api.js');

app.use('/', rootRoute);
app.use('/login', loginRoute);
app.use('/api', apiRoute);

app.listen(3000);

console.log('Authentication/RESTful-API server started on port 3000');
