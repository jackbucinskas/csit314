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
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = "mongodb://localhost:27017/";
const dbName = 'csit314';
//const client = new MongoClient(url, {useNewUrlParser: true});
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

// Import Flickr API to conduct Tests
/*
    IMPORTANT: Rename .env.example to .env and place your API Key inside OR
    Replace 'process.env.FLICKR_API_KEY' with your API Key
 */
var Flickr = require('flickr-sdk');
var flickr = new Flickr(process.env.FLICKR_API_KEY);

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

var oauth = new Flickr.OAuth(
  process.env.FLICKR_CONSUMER_KEY, //add to .env
  process.env.FLICKR_CONSUMER_SECRET
);

var oauthToken, tokenSecret, oauthVerifier

oauth.request('http://localhost:27017/oauth/callback').then(function (res) {
  console.log('Nice Success!');
  console.log('oauth token:', res.body.oauth_token);
  oauthToken = res.body.oauth_token;
  console.log('oauth token secret:', res.body.oauth_token_secret);
  tokenSecret = res.body.oauth_token_secret;
  console.log('oauth verifier:', res.body.oauth_callback_confirmed);
  oauthVerifier = res.body.oauth_callback_confirmed;
}).catch(function (err) {
  console.error('Big oof!', err);
});

console.log('auth var =', oauthToken);

/*
var url2 = oauth.authorizeUrl(requestToken); // "https://www.flickr.com/services/oauth..."
 
res.setHeader("Location", url2);
res.statusCode = 302;
res.end();
*/

/*
  flickr.test.login().then(function (res) {
    console.log('yay!', res.body);
  }).catch(function (err) {
    console.error('bonk', err);
  });
*/
/*
oauth.verify(oauthToken, oauthVerifier, tokenSecret).then(function (res) {
  console.log('oauth token:', res.body.oauth_token);
  console.log('oauth token secret:', res.body.oauth_token_secret);
}).catch(function (err) {
  console.log('bonk', err);
});
*/

//oauth_callback_confirmed=true&oauth_token=72157714646442871-276e7683c7651033&oauth_token_secret=f044ad1c18cab8c3

