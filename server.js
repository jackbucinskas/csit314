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

// Data Validation/Checking
const assert = require('assert');

// Import MongoDB for logging results
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const dbName = 'csit314';
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

    db.createCollection("results", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
    });

    const collection = db.collection('reports');

    // Flickr Photo Search API Call
    // Randomize search text and print "Searching for: Random Animal"
    var animal_tag = chance.animal().toString();
    console.log("Searching for: " + animal_tag);

    // Query 1
    function query1() {
        flickr.photos.search({
            text: animal_tag,
            min_upload_date: '2020-01-01', // YYYY-MM-DD
            max_upload_date: '2020-02-01'
        }).then(function (res) {
            console.log('Successful API Call 1', res.body);
            console.log('Saving to ' + url + dbName + '\n');
            db.collection("results").insertOne(res.body);
        }).catch(function (err) {
            console.error('Something Went Wrong', err);
        });
    }

    // Query 2
    function query2() {
        flickr.photos.search({
            text: animal_tag,
            min_upload_date: '2020-01-01',
            max_upload_date: '2020-03-01'
        }).then(function (res) {
            console.log('Successful API Call 2', res.body);
            console.log('Saving to ' + url + dbName + '\n');
            db.collection("results").insertOne(res.body);
        }).catch(function (err) {
            console.error('Something Went Wrong', err);
        });
    }

    // Query 3
    function query3() {
        flickr.photos.search({
            text: animal_tag,
            min_upload_date: '2020-01-01',
            max_upload_date: '2020-04-01'
        }).then(function (res) {
            console.log('Successful API Call 3', res.body);
            console.log('Saving to ' + url + dbName + '\n');
            db.collection("results").insertOne(res.body);
        }).catch(function (err) {
            console.error('Something Went Wrong', err);
        });
    }

    // Conduct Flickr Search API Call
    query1();
    setTimeout(query2, 1000);
    setTimeout(query3, 2000);

});