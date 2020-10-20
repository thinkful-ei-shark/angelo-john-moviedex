require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Movies = require('./movies-data-small.json');

console.log(process.env.API_TOKEN);

const app = express();

app.use(morgan("common"));
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
  res.json('');

}

app.get("/movies", handleGetMovies);

const PORT = 8000;

app.listen(PORT, () => {
    console.log('Your server is listening on port 8000!')
});