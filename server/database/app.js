/* jshint esversion: 5 */

var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
var port = 3030;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON files
var reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
var dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// Connect to MongoDB
mongoose.connect("mongodb://mongo_db:27017/", { 'dbName': 'dealershipsDB' });

var Reviews = require('./review');
var Dealerships = require('./dealership');

// Populate the database
try {
  Reviews.deleteMany({}).then(function () {
    Reviews.insertMany(reviews_data.reviews);
  });
  Dealerships.deleteMany({}).then(function () {
    Dealerships.insertMany(dealerships_data.dealerships);
  });
} catch (error) {
  console.error('Error populating the database:', error);
}

// Express route to home
app.get('/', function (req, res) {
  res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', function (req, res) {
  Reviews.find().then(function (documents) {
    res.json(documents);
  }).catch(function (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  });
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', function (req, res) {
  Reviews.find({ dealership: req.params.id }).then(function (documents) {
    res.json(documents);
  }).catch(function (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  });
});

// Express route to fetch all dealerships
app.get('/fetchDealers', function (req, res) {
  Dealerships.find().then(function (dealers) {
    res.json(dealers);
  }).catch(function (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  });
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', function (req, res) {
  Dealerships.find({ state: req.params.state }).then(function (stateDealers) {
    res.json(stateDealers);
  }).catch(function (error) {
    res.status(500).json({ error: 'Error fetching dealerships by state' });
  });
});

// Express route to fetch dealer by a particular ID
app.get('/fetchDealer/:id', function (req, res) {
  Dealerships.findOne({ id: parseInt(req.params.id) }).then(function (dealer) {
    if (dealer) {
      res.json([dealer]);
    } else {
      res.status(404).json({ error: 'Dealership not found' });
    }
  }).catch(function (error) {
    res.status(500).json({ error: 'Error fetching dealership by ID' });
  });
});

// Express route to insert review
app.post('/insert_review', bodyParser.json(), function (req, res) {
  Reviews.find().sort({ id: -1 }).then(function (documents) {
    var new_id = documents[0].id + 1;

    var review = new Reviews({
      "id": new_id,
      "name": req.body.name,
      "dealership": req.body.dealership,
      "review": req.body.review,
      "purchase": req.body.purchase,
      "purchase_date": req.body.purchase_date,
      "car_make": req.body.car_make,
      "car_model": req.body.car_model,
      "car_year": req.body.car_year
    });

    review.save().then(function (savedReview) {
      res.json(savedReview);
    }).catch(function (error) {
      console.error(error);
      res.status(500).json({ error: 'Error inserting review' });
    });
  }).catch(function (error) {
    res.status(500).json({ error: 'Error finding reviews for ID generation' });
  });
});

// Start the Express server
app.listen(port, function () {
  console.log("Server is running on http://localhost:" + port);
});
