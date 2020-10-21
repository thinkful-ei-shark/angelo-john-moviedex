require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const helmet = require("helmet")
const Movies = require("./movies-data-small.json")
// console.log(process.env.API_TOKEN);
const app = express();

app.use(morgan("common"))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization")
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" })
  }

  //move to the next middleware
  next()
})

app.get("/movies", function handleGetMovies(req, res) {
  let response = Movies;
  //genre country avg vote
  if (req.query.genre) {
    response = response.filter((movie) =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }
  if (req.query.country) {
    response = response.filter((movie) =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
  }
  if (req.query.avg_vote) {
    response = response.filter(
      (movie) => parseFloat(movie.avg_vote) >= parseFloat(req.query.avg_vote)
    )
  }
  res.json(response)
})

const PORT = 8000;

app.listen(PORT, () => {
  console.log("Your server is listening on port 8000!")
})
