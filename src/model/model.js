
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
    username: {
        type: String,
        unique: false,
        required: false
    },
    created: {
        type: Date,
        default: Date.now
    },
		oauth: [{
				name: {
					type: String,
					unique: true,
					required: true
				},
				accesstoken: {
					type: String,
					unique: true,
					required: true
				},
				expires: {
					type: Date,
					default: Date.now
				}
		}]
});
// compile a schema into model.
var UserModel = mongoose.model('User', UserSchema);

module.exports.User = UserModel;
