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
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/csit314_db";

// Import Flickr API to conduct Tests
/*
    IMPORTANT: Rename .env.example to .env and place your API Key inside OR
    Replace 'process.env.FLICKR_API_KEY' with your API Key
 */
var Flickr = require('flickr-sdk');
var flickr = new Flickr(process.env.FLICKR_API_KEY);

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

