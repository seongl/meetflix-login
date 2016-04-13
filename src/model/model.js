
var mongoose = require('../db/mongoose.js');
var Schema   = mongoose.Schema;

/*
DB objects:

User – a user who has a name, password hash and a salt.
Client – a client application which requests access on behalf of a user, has a name and a secret code.
AccessToken – token (type of bearer), issued to the client application, limited by time.
*/

// User
// We might not have User credentials for meetflix, but only use tokens
// In case we decide to use user credentials for us, below can be used.
// example:
//  username: poby
//  email: poby@meetflix.org
//  create: 01/01/2001

var UserSchema = new Schema({
	// email is primary user identifier
		email: {
        type: String,
        unique: true,
        required: true
    },
	// username is like nickname in case user does not want to use eamil
    username: {
        type: String,
        unique: true,
        required: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});
// compile a schema into model.
var UserModel = mongoose.model('User', UserSchema);

// AccessToken
var AccessTokenSchema = new Schema({
    userObjId: {
        type: String,
        required: true
    },
    // clientId can be different depending on which 3rd party server is used.
    // e.g. facebook vs linkedin
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});
var AccessTokenMode = mongoose.model('AccessToken', AccessTokenSchema);

// Client app registration information
// exmaple:
//  name: facebook
//  clientId: 24132w3423
//  clientSecret: afefad324fs

var ClientSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
});
// compile a schema into model.
var ClientModel = mongoose.model('Client', ClientSchema);

module.exports.User = UserModel;
module.exports.Client = ClientModel;
module.exports.AccessToken = AccessTokenModel;
