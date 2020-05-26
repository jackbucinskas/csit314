//var mongo = require('mongodb');
var chance = require('chance').Chance();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/csit314_db";

MongoClient.connect(url, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log("Connected to Database"))
    .catch(err => console.error("An error has occured", err));

var country1 = chance.country()
var state1 = chance.state({ full: true, country: country1})

console.log(country1 + " " + state1);

// Limitations
// https://chancejs.com/location/province.html
// Note, currently support for country is limited to: 'ca', 'it'.
//var city1 = chance.province({country: country1, full: true});