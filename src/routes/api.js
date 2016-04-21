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
  console.log(util.inspect(req.params));
  console.log(util.inspect(req));


  //Add next() to indicate to our application that it should continue to the other routes.
  //This is important because our application would stop at this middleware without it.
  next();
});

// APIs

// create a user (accessed via POST http://localhost:3000/api/users)

router.route('/users')
      // get all users
      .get(function(req, res) {
        console.log("/user route called");
        User.find({username:req.params.username}, function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
      });
/*
// :xxx notation은 한 uri당 한개만 사용가능. 즉, 여러개를 식별할수 없다.
router.route('/users/:id')
      .get(function(req, res) {
        User.findById(req.params.id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
      });
*/

router.route('/users/:email')
      .get(function(req, res) {
        console.log("/user/:email route called");
        User.find({email:req.params.email}, function(err, user){
          if (err)
              res.send(err);
          res.json(user);
        });
      });

// export current router
module.exports = router;
