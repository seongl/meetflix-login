var User = require('../model/model.js').User;

/*
RESTful API specification

/api/users            GET  Get all the users.
/api/users            POST  Create a user.
/api/users/:username  GET Get a single user.
/api/users/:username  PUT Update a user with new info.
/api/users/:username  DELETE  Delete a bear.
*/

var util = require('util');

/*
 API Route
*/
var express = require('express');
var router = express.Router();

// middleware
router.use(function(req, res, next){
  // TODO: fill up middleware work here, e.g. extra logging for analytics and statistics
  console.log("/api router is being accessed with request:" + req.body);
  console.log(util.inspect(req.body));


  //Add next() to indicate to our application that it should continue to the other routes.
  //This is important because our application would stop at this middleware without it.
  next();
});

// APIs

// create a user (accessed via POST http://localhost:3000/api/users)
router.route('/users')
      .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
      })
      .post(function(req, res){

        var user = new User();
        //console.log(req.body.email);
        //console.log(req.body.username);
        user.email = req.body.email;
        user.username = req.body.username;
        user.created = Date();

        // save the user and check for errors
        user.save(function(err){
          if(err)
            res.send(err);
          res.json({message:"user created"});
        });
      });

router.route('/users/:username')
      .get(function(req, res) {
        User.findById(req.params.username, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
      })




// export current router
module.exports = router;
