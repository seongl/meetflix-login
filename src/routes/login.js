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
    callbackURL: 'https://auth.meetflix.org/login/facebook/return',
    enableProof: false,
    profileFields: ['id', 'name', 'emails', 'displayName', 'about', 'gender']
}, function(accessToken, refreshToken, profile, cb) {
    console.log("passport middleware ------------");
    //console.log(profile);
    User.findOne({ email: profile.emails[0].value }, function (err, user) {
	if (err) { 
	    console.log("/error happened");
	    return cb(err);
	}
	if (!user) {
	    console.log("new user");
            var newuser = new User({
		id: profile.id,
		name: profile.displayName,
		email: profile.emails[0].value,
		oauth: [{ provider: 'facebook',
			  accesstoken: accessToken,
			  refreshtoken: refreshToken
			}],
		photo: "https://graph.facebook.com/v2.6/" + profile.id + "/picture" + "?width=200&height=200" + "&access_token=" + accessToken
            })
            newuser.save(function (err) {
		if (err) console.log(err)
		return cb(null, newuser);
	    })
        } else {
            console.log("user is already signed up");
	    console.log(user);
	    // if call user, not profile, some error happnes.
	    return cb(null, user);
        }
    })
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
    console.log("serialize user:", user);
    /* what is set here will appear as passport. e.g
      passport: {user: _id} }
     */
    cb(null, user._id);
});

passport.deserializeUser(function(_id, cb) {
    console.log("deserialize id:", userid);
    //User.findOnd({id: userid}, function(err, user) {
    User,findById(_id, function(err, user) {
	//if(user) { console.log("user found by id at deserialized"); }
	//else { console.log("user not found by id at deserialized"); }
	cb(null, user);
    });
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
    console.log("/login router is being accessed with request:");
    console.log("req.session:", req.session);

    if(req.session && req.session.passport && req.session.passport.user){
	console.log("user id: ", req.session.passport.user);
	User.findById(req.session.passport.user, function(err, user){
	    if(user){
		console.log("user found :", user.name);; 
	    }else{
		console.log("user not found");
	    }
	});
    }else{
	console.log("no session from req");
    }
    //Add next() to indicate to our application that it should continue to the other routes.
    //This is important because our application would stop at this middleware without it.
    next();
});

// 이게 실제로 facebookStrategy를 통해서 facebook에 authentication을 request하는 부분.
// 즉 /login/facebook을 GET하면 facebook authentication request가 시작된다.
router
    .route('/login/facebook')
    .get(passport.authenticate('facebook', {scope: ['email']}));

// facebook authentication이 끊나고 돌아오는 url.
// facebook strategy에 이 url을 알려주어야 한다.
router
    .route('/login/facebook/return')
    .get(passport.authenticate('facebook', 
			       {failureRedirect: '/login/facebook'}),
	 function(req, res) {
	     // when authentication is successful
	     console.log("/login/facebook/return router");
	     console.log("req.user:", req.user);
	     console.log("req.session:", req.session);

	     res.cookie('user.id', req.session.passport.user, 
			{domain:'.meetflix.org', secure:true, httpOnly:true}).send();
	     res.redirect("https://www.meetflix.org");
	 });

router
    .route('/logout')
    .get(function(req, res){
	console.log("/logout router");
	req.logout();
	res.redirect('https://www.meetflix.org');
    });

router
    .route('/profile')
    .get(isLoggedIn, function(req, res) {
	console.log("profile route ----");
	if(req.session && req.session.passport && req.session.passport.user) {
	    User.findById(req.session.passport.user, function(err, user) {
		if(err) console.log("no user found for profile");
		if(user){
		    //res.json(user); // too much information. figure out only what is necessary 
		    res.json({photo:user.photo, name:user.name});
		} else {
		    res.json({"user":"not found"});
		}
	    });
	}
    });

// Route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    console.log("isLoggedin");
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    console.log("not logged in");
    res.redirect('https://www.meetflix.org');
}

module.exports = router;
