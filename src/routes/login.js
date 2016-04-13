/*
 * login server main application
 */
var express = require('express');
var config = require("../publicConfig.js");

/*
 login Routes
 */
var router = express.Router();
/*
 * OAuth
 */
var oauth2 = require('simple-oauth2')({
    clientID: config.FACEBOOK_CLIENT_ID,
    clientSecret: config.FACEBOOK_CLIENT_SECRET,
    site: config.FACEBOOK_URL,
    tokenPath: '/oauth/access_token',
    authorizationPath: config.FACEBOOK_AUTH_PATH
});

// Authorization uri definition
var authorization_uri = oauth2.authCode.authorizeURL({
  redirect_uri: 'http://www.meetflix.org/login/callback',
  scope: 'public_profile',
  state: '!@#$'
});

// Initial page redirecting to Github
router.get('/auth', function (req, res) {
    res.redirect(authorization_uri);
});

// Callback service parsing the authorization token and asking for the access token
router.get('/callback', function (req, res) {
  console.log("callback is called " + req.query.code);
  var code = req.query.code;

  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://www.meetflix.org/login/callback'
  }, saveToken);

  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); }
    token = oauth2.accessToken.create(result);
    console.log("saveToken :" + token);
    res.send('login successful. <br><a href="http://www.meetflix.org"> back to Meetflix');
  }
});

module.exports = router;
