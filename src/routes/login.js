var express  = require('express');
var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;
var config   = require("../publicConfig.js");
var User = require('../model/model.js').User;


// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.

// 억세스 토큰, refresh token을 받음 -> verify function불림
passport.use(new facebookStrategy({
    clientID: config.FACEBOOK_CLIENT_ID,
    clientSecret: config.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://auth.meetflix.org/login/facebook/return',
    enableProof: false,
    profileFields: ['id', 'name', 'emails', 'displayName', 'about', 'gender']
 },
  // verify callback
  // The verify callback must call cb providing a user to complete authentication.
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.

    // 여기서 dataBase에 연결하는 코드를 넣는다.


    /*
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
    */
    console.log(profile);
    User.findOne({ email: profile.email }, function (err, user) {
        if (err) { console.log("error happened");}
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            oauth: [{ provider: 'facebook',
                      accesstoken: accessToken,
                      refreshtoken: refreshToken
                    }],
            photo: "https://graph.facebook.com/v2.6/" + profile.id + "/picture" + "?width=200&height=200" + "&access_token=" + accessToken
          })
          user.save(function (err) {
            if (err) console.log(err)
          })
        }
        else {
          console.log("user is already signed up");
        }
      })
    return cb(null, profile);
  }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*
 login Routes
 */
var router = express.Router();

// middleware
router.use(function(req, res, next){
  // fill up middleware work here
  // - 1) extra logging for analytics and statistics
  // - 2) session handling
  console.log("/login router is being accessed with request:" + req.body);

  if(req.session && req.session.user){
    User.findOne({email: req.session.user.email}, function(err, user){
      if(user){
          req.user = user;
          delete req.user.oauth; // delete the oauth information from the session
          req.session.user = user; //refresh session value
          req.locals.user = user;
      }
    });
  }
  //Add next() to indicate to our application that it should continue to the other routes.
  //This is important because our application would stop at this middleware without it.
  next();
});

/*
router.route('/login')
      .get(function(req, res){
            console.log("/login accessed");
            res.json({message:"hello login"});
            //res.render('login');
          });
*/

// 이게 실제로 facebookStrategy를 통해서 facebook에 authentication을 request하는 부분.
// 즉 /login/facebook을 GET하면 facebook authentication request가 시작된다.
router.route('/login/facebook')
      .get(passport.authenticate('facebook', {scope: ['email']}));

// facebook authentication이 끊나고 돌아오는 url.
// facebook strategy에 이 url을 알려주어야 한다.
router.route('/login/facebook/return')
      .get(passport.authenticate('facebook', { failureRedirect: '/login' }),
          function(req, res) {
            console.log("facebook returned");
            res.cookie('foo', 'bar');
            res.redirect('http://www.meetflix.org');
        });

router.route('/logout')
      .get(function(req, res){
        req.session.reset();
        res.redirect('http://www.meetflix.org');
      });
/*
app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });
*/

module.exports = router;
