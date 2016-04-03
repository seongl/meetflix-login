/*
DB objects:

User – a user who has a name, password hash and a salt.
Client – a client application which requests access on behalf of a user, has a name and a secret code.
AccessToken – token (type of bearer), issued to the client application, limited by time.
*/

// User
// We might not have User credentials for meetflix, but only use tokens
// In case we decide to use user credentials for us, below can be used.
/*
var User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});
*/

// Client
var Client = new Schema({
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
var ClientModel = mongoose.model('Client', Client);

// AccessToken
var AccessToken = new Schema({
    userId: {
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
var AccessTokenMode = mongoose.model('AccessToken', AccessToken);

//module.exports.UserModel = UserModel;
module.exports.ClientModel = ClientModel;
module.exports.AccessTokenModel = AccessTokenModel;
