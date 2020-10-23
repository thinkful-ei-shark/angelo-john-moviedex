require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const helmet = require("helmet")
const Movies = require("./movies-data-small.json")
const PORT = process.env.PORT || 8000

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
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

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

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
  console.log(`Server listening at http://localhost:${PORT}`)
})
