var User = require('../model/model.js').User;
var AccessToken = require('../model/model.js').AccessToken;
var Client = require('../model/model.js').Client;

/*
RESTful API specification

/api/users            GET  Get all the users.
/api/users            POST  Create a user.
/api/users/:username  GET Get a single user.
/api/users/:username  PUT Update a user with new info.
/api/users/:username  DELETE  Delete a bear.
*/

/*
 API Route
*/
var express = require('express');
var router = express.Router();

// middleware
router.use(function(req, res, next){
  // TODO: fill up middleware work here, e.g. extra logging for analytics and statistics
  console.log("/api router is being accessed");

  //Add next() to indicate to our application that it should continue to the other routes.
  //This is important because our application would stop at this middleware without it.
  next();
});

// APIs
router.route('/users')

      // create a user (accessed via POST http://localhost:3000/api/users)
      .post(function(req, res){
        var user = new User();
        user.email = req.body.email;
        user.username = req.body.username;
        user.created = Data.now;

        // save the user and check for errors
        user.save(function(err){
          if(err)
            res.send(err);
          res.json({message:"user created"});
        });
      });

// export current router
module.exports = router;