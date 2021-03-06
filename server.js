//Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
//Requiring Technews and Comment models
var Comments = require("./models/Comments.js");
var Technews = require("./models/Technews.js");
//Scraping Tools
var request = require("request");
var cheerio = require("cheerio");
// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");

mongoose.Promise = Promise;

// Initialize Express
var app = express();
// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));
var port = process.env.PORT || 3000;
console.log("port:"+port);
//Database configuration with mongoose
mongoose.connect("mongodb://heroku_ccqbl3hs:j50o1k7ee9pjb0rf7bqcfs7ks9@ds151137.mlab.com:51137/heroku_ccqbl3hs");
var db = mongoose.connection;

//Show any mongoose errors
db.on("error",function(error){
	console.log("Mongoose Error: ",error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//Routes
// Simple index route
app.get("/", function(req, res) {
  console.log("inside get /");
  res.send(index.html);
});

app.get("/scrape",function(req,res){
  console.log("inside /scrape");
	// Make a request call to grab the HTML body from the site of your choice
	request('http://www.technewsworld.com/', function (error, response, html) {

		// Load the HTML into cheerio and save it to a variable
	  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
	  var $ = cheerio.load(html);

	  // Select each instance of the HTML body that you want to scrape
	  // NOTE: Cheerio selectors function similarly to jQuery's selectors, 
	  // but be sure to visit the package's npm page to see how it works
	  $('div.story-list ').each(function(i, element){
	  	 // Save an empty result object
	  	 console.log("i",element[i]);
	      var result = {};
	      result.title = $(this).find("div.title>a").text();
	      result.titleLink = "http://www.technewsworld.com"+$(this).find("div.title"). find('a').attr("href");
	   	  result.imageLink = "http://www.technewsworld.com"+$(this).find("div.image").find('a').children().attr("src");
	      result.teaser =$(this).find("div.teaser").text();
	       result.upsert= true;
	      // Using our Article model, create a new entry
	      // This effectively passes the result object to the entry (and the title and link)
	      var entry = new Technews(result);
	      // Now, save that entry to the db
        entry.save(result,function(err, doc) {
	        // Log any errors
	        if (err) {
	          console.log(err);
	        }
	        // Or log the doc
	        else {
	         // console.log(doc);
	        }
	      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

// This will get the articles we scraped from the mongoDB
app.get("/technews", function(req, res) {
  console.log("inside /technews");
  // Grab every doc in the Articles array
  Technews.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
   //   console.log("doc:"+JSON.stringify(doc));
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
app.get("/technews/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Technews.findOne({ "_id": req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    // now, execute our query
    .exec(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise, send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
});

// Create a new note or replace an existing note
app.post("/technews/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Comments(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Technews.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});


app.post("/technews/:noteId/delete",function(req,res){

  var newNote = new Comments(req.body);

  console.log("body:"+JSON.stringify(req.params));

  Comments.findByIdAndRemove(
    { _id: req.params.noteId },
    function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      else {
        // Or send the document to the browser
        res.send(doc);
      }
  });
}); // end of - app.post("/technews/:noteId/delete

// Listen on port 3000
app.listen(port, function() {
  console.log("App running on port:"+port+"!");
});
