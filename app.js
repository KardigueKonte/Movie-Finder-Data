// import files and packages up here, you want const and var first
const axios = require('axios').default;
const express = require('express')
const app = express()
const cache = {};
var movieData = {};
const dotenv = require('dotenv').config(); 

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter        

//	Server should log each request using morgan's dev format
var morgan = require('morgan');
app.use(morgan('dev'));

//Server should respond to GET requests to / route the top spots page Server should respond with a status code of 200
app.get('/', function(req, res) {
    if (req.query.i || req.query.t) { // i= imdb id, t= movie title
        let key = req.url; // e.g., '/?i=tt3896198' or '/?t=baby%20driver'
        if (cache[key]) {
            res.send(cache[key]);
        } else {
            let apiKey = process.env.API_KEY; // fallback for tests
            let params = { ...req.query, apiKey: apiKey };
            axios.get('http://www.omdbapi.com', { params })
                .then(response => {
                    movieData = response.data;
                    cache[key] = movieData;
                    res.send(movieData);
                })
                .catch(err => {
                    console.error(err);
                    res.status(200).end();
                });
        }
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Top Movie Spots</h1>');
    }
});
//Server should respond to GET requests to /?i=tt3896198 with movie data and Server should respond to GET requests to /?i=tt3896198 by returning movie data from its local cache, without making a new request to the OMDb API.
//Server should respond to GET requests to /?t=baby%20driver with movie data
//Server should respond to GET requests to /?t=baby%20driver by returning movie data from its local cache, without making a new request to the OMDb API.
// finally export the express application
module.exports = app;
