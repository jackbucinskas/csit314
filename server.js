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
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

// Import Flickr API to conduct Tests
/*
    IMPORTANT: Rename .env.example to .env and place your API Key inside OR
    Replace 'process.env.FLICKR_API_KEY' with your API Key
 */
var Flickr = require('flickr-sdk');
var flickr = new Flickr(process.env.FLICKR_API_KEY);

// Connect to MongoDB
// client.connect(function(err) {
//     assert.equal(null, err);
//     console.log("Connected successfully to server");
//
//     const db = client.db(dbName);
//
//     // After insert documents, close connection
//     insertDocuments(db, function() {
//         client.close();
//     });
// });
//
// const insertDocuments = function(db, callback) {
//     // Get the documents collection
//     const collection = db.collection('reports');
//     // Insert some documents
//     collection.insertMany([
//         {a : 1}, {a : 2}, {a : 3}
//     ], function(err, result) {
//         assert.equal(err, null);
//         assert.equal(3, result.result.n);
//         assert.equal(3, result.ops.length);
//         console.log("Inserted 3 documents into the collection");
//         callback(result);
//     });
// }

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
    }).catch(function (err) {
        console.error('Something Went Wrong', err);
    });
}

query1();
setTimeout(query2, 1000);
setTimeout(query3, 1000);

