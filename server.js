/*
    Jack Bucinskas
    jb182@uowmail.edu.au
    5814583

    Group 2 - Project Part II
 */

// Allow .env files to work
require('dotenv').config();

// Import Chance Library for Random Test Generation
var chance = require('chance').Chance();

// Import MongoDB for logging results
//const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
//const url = "mongodb://localhost:27017/";
const dbName = 'csit314';
//const client = new MongoClient(url, {useNewUrlParser: true});
//const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

// Import Flickr API to conduct Tests
/*
    IMPORTANT: Rename .env.example to .env and place your API Key inside OR
    Replace 'process.env.FLICKR_API_KEY' with your API Key
 */
var Flickr = require('flickr-sdk');
var flickr = new Flickr(process.env.FLICKR_API_KEY);

/*
// Connect to MongoDB
client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // After insert documents, close connection
    insertDocuments(db, function() {
        client.close();
    });
});

const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('reports');
    // Insert some documents
    collection.insertMany([
        {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}
*/
/*
 //Flickr API
 flickr.photos.getInfo({
     photo_id: 25825763 // sorry, @dokas
 }).then(function (res) {
     console.log('yay!', res.body);
 }).catch(function (err) {
     console.error('bonk', err);
 });
*/

 //flickr.stats.getTotalViews({})
/*
 var flickr = new Flickr(Flickr.OAuth.createPlugin(
    process.env.FLICKR_CONSUMER_KEY,
    process.env.FLICKR_CONSUMER_SECRET,
    process.env.FLICKR_OAUTH_TOKEN,
    process.env.FLICKR_OAUTH_TOKEN_SECRET
  ));
*/  

var http = require('http');
var parse = require('url').parse;

var oauth = new Flickr.OAuth(
	process.env.FLICKR_CONSUMER_KEY,
	process.env.FLICKR_CONSUMER_SECRET
);

var db = {
	users: new Map(),
	oauth: new Map()
};

function getRequestToken(req, res) {
	oauth.request('http://localhost:3000/oauth/callback').then(function (_res) {
		var requestToken = _res.body.oauth_token;
		var requestTokenSecret = _res.body.oauth_token_secret;

		// store the request token and secret in the database
		db.oauth.set(requestToken, requestTokenSecret);

		// redirect the user to flickr and ask them to authorize your app.
		// perms default to "read", but you may specify "write" or "delete".
		res.statusCode = 302;
		res.setHeader('location', oauth.authorizeUrl(requestToken, 'write'));
		res.end();

	}).catch(function (err) {
		res.statusCode = 400;
		res.end(err.message);
	});
}

function verifyRequestToken(req, res, query) {
	var requestToken = query.oauth_token;
	var oauthVerifier = query.oauth_verifier;

	// retrieve the request secret from the database
	var requestTokenSecret = db.oauth.get(requestToken);

	oauth.verify(requestToken, oauthVerifier, requestTokenSecret).then(function (_res) {
		var userNsid = _res.body.user_nsid;
		var oauthToken = _res.body.oauth_token;
		var oauthTokenSecret = _res.body.oauth_token_secret;
		var flickr;

		// store the oauth token and secret in the database
		db.users.set(userNsid, {
			oauthToken: oauthToken,
			oauthTokenSecret: oauthTokenSecret
		});

		// we no longer need the request token and secret so we can delete them
		db.oauth.delete(requestToken);

		// log our oauth token and secret for debugging
		console.log('oauth token:', oauthToken);
		console.log('oauth token secret:', oauthTokenSecret);

		// create a new Flickr API client using the oauth plugin
		flickr = new Flickr(oauth.plugin(
			oauthToken,
			oauthTokenSecret
		));

		// make an API call on behalf of the user
    flickr.test.login().pipe(res);
    
    var upload = new Flickr.Upload(auth, __dirname + '/upload.png', {
      title: 'Works on MY machine!'
    });
    
    // this is a request instance, so we can just call .then()
    // to kick off the request.
    
    upload.then(function (res) {
      console.log('res', res.body);
    }).catch(function (err) {
      console.log('err', err);
    });

	}).catch(function (err) {
		res.statusCode = 400;
		res.end(err.message);
  });
  

}


http.createServer(function (req, res) {
	var url = parse(req.url, true);

	switch (url.pathname) {
	case '/':
		return getRequestToken(req, res);
	case '/oauth/callback':
		return verifyRequestToken(req, res, url.query);
	default:
		res.statusCode = 404;
		res.end();
  }
  

}).listen(3000, function () {
	console.log('Open your browser to http://localhost:3000');
});

