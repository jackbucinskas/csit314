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
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    db.createCollection("query_results", function (err) {
        if (err) throw err;
        console.log("Collection created!");
    });


    // Flickr Photo Search API Call
    // Queries - Section 1
    // Randomize search text and print "Searching for: Random Animal"
    var animal_tag = chance.animal().toString();
    console.log("Searching for: " + animal_tag);
    var totals = [];

    // Query 1.1
    function query1() {
        flickr.photos.search({
            text: animal_tag,
            min_upload_date: '2020-01-01', // YYYY-MM-DD
            max_upload_date: '2020-02-01'
        }).then(function (res) {
            console.log('Successful API Call 1.1', res.body);
            console.log('Saving to ' + url + dbName + '\n');
            totals.push(res.body.photos.total); //add total number of results to array
            db.collection("query_results").insertOne(res.body);
        }).catch(function (err) {
            console.error('Something Went Wrong', err);
        });
    }

    // Query 1.2
    function query2() {
        flickr.photos.search({
            text: animal_tag,
            min_upload_date: '2020-01-01',
            max_upload_date: '2020-03-01'
        }).then(function (res) {
            console.log('Successful API Call 1.2', res.body);
            console.log('Saving to ' + url + dbName + '\n');
            totals.push(res.body.photos.total);
            db.collection("query_results").insertOne(res.body);
        }).catch(function (err) {
            console.error('Something Went Wrong', err);
        });
    }

    // Query 1.3
    function query3() {
        flickr.photos.search({
            text: animal_tag,
            min_upload_date: '2020-01-01',
            max_upload_date: '2020-04-01'
        }).then(function (res) {
            console.log('Successful API Call 1.3', res.body);
            console.log('Saving to ' + url + dbName + '\n');
            totals.push(res.body.photos.total);
            db.collection("query_results").insertOne(res.body);
        }).catch(function (err) {
            console.error('Something Went Wrong', err);
        });
    }


    // Queries - Section 2
    var random_id = chance.integer({min: 0, max: 100});
    // Query 2.1
    var posted_date, taken_date

    function query2_1() {
        flickr.photos.getRecent({ //get most recent public posts
            per_page: 100, //limit to 100 results per page
            page: 1 //search on page 1
        }).then(function (res) {
            console.log("Successful API Call 2.1", res.body);
            var photo_id = res.body.photos.photo[random_id].id; //use random integer initilised above for id index

            flickr.photos.getInfo({ //get info on particular post
                photo_id: photo_id
            }).then(function (res) {
                posted_date = res.body.photo.dates.posted;
                var myDate = new Date(res.body.photo.dates.taken);
                taken_date = myDate.getTime() / 1000.0; //convert date
                console.log('Saving to ' + url + dbName + '\n');
                db.collection("query_results").insertOne(res.body); //save results to database
            }).catch(function (err) {
                console.error('Something Went Wrong', err);
            });

        }).catch(function (err) {
            console.error('Something Went Wrong', err);
        });
    }

    // Test function
    function testQueries1(totalsArray) {
        var pass;
        console.log("--- Tests ---\n");

        console.log("-Section 1 Queries-");
        console.log("-Test 1-");
        console.log("Is (Query 1 total < Query 2 total < Query 3 total) true?")
        console.log("Query 1 total =", totalsArray[0]);
        console.log("Query 2 total =", totalsArray[1]);
        console.log("Query 3 total =", totalsArray[2]);

        pass = totalsArray[0] < totalsArray[1] < totalsArray[2];
        console.log("Section 1 - Test 1 pass:", pass);


        console.log("\n\n-Test 2-");
        console.log("Is (Query 1 total < Query 3 total) true?")
        console.log("Query 1 total =", totalsArray[0]);
        console.log("Query 3 total =", totalsArray[2]);

        pass = totalsArray[0] < totalsArray[2];
        console.log("Section 1 - Test 2 pass:", pass);


        console.log("\n\n-Section 2 Queries-");
        console.log("-Test 1-");
        console.log("Is date taken before date posted?")

        var postedDate = new Date(posted_date * 1000);
        var takenDate = new Date(taken_date * 1000);

        console.log("Date taken:", takenDate.toGMTString());
        console.log("Date posted:", postedDate.toGMTString());

        pass = posted_date > taken_date;
        console.log("Section 2 pass:", pass);

        process.exit();
    }

    // Conduct Flickr Search API Call
    query1();
    setTimeout(query2, 1000);
    setTimeout(query3, 2000);

    // Run Query 2
    setTimeout(query2_1, 3000);

    //Run test
    setTimeout(testQueries1, 5000, totals);

});
