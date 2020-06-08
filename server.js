var chance = require('chance').Chance();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/csit314_db";
var Flickr = require('flickr-sdk');
var flickr = new Flickr('365e7e62eb2d307f5af3414068be1000');

// Connect to MongoDB
MongoClient.connect(url, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log("Connected to Database"))
    .catch(err => console.error("An error has occured", err));

// Flickr API
flickr.photos.getInfo({
    photo_id: 25825763 // sorry, @dokas
}).then(function (res) {
    console.log('yay!', res.body);
}).catch(function (err) {
    console.error('bonk', err);
});



// Limitations if we use Booking.com
// https://chancejs.com/location/province.html
// Note, currently support for country is limited to: 'ca', 'it'.

// Limitations to OMDB
// Very limited Nodejs API, only has a search/get feature for 1 specific movie per query.

// Decide to use Flickr
// API Key: 365e7e62eb2d307f5af3414068be1000
// https://github.com/flickr/flickr-sdk
