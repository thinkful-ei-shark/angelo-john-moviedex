require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require('helmet');
const Movies = require('./movies-data-small.json');

console.log(process.env.API_TOKEN);

const app = express();

app.use(morgan("common"));
app.use(helmet());
app.use(cors());
app.use(function validateBearerToken(req, res, next) {

const apiToken = process.env.API_TOKEN
const authToken = req.get('Authorization')

//   console.log("validate bearer token middleware");

  if(!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request'})
  }
 
  //move to the next middleware
  next();
});

function handleGetMovies(req, res) {
    let response = Movies;
//genre country avg_vote
    if(req.query.genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase() === req.query.genre.toLowerCase())
    }
    if(req.query.country) {
        response = response.filter(movie =>
            movie.country.toLowerCase() === req.query.country.toLowerCase())
    }
    if(req.query.avg_vote) {
        response = response.filter(movie => 
            parseInt(movie.avg_vote) >= parseInt(req.query.avg_vote))
    }
  res.json(response);

}

app.get("/movies", handleGetMovies);

const PORT = 8000;

app.listen(PORT, () => {
    console.log('Your server is listening on port 8000!')
});