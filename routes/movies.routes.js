const express = require('express');
const router = express.Router();
const Movie = require('../models/movie.model');
const mongoose = require('mongoose');
const axios = require('axios');
const { isAuthenticated } = require("./../middleware/jwt.middleware");

const apiKey = '?api_key=d131d9c2e1e71a17ab471e5e07730c7c'
const apiURL = 'https://api.themoviedb.org/3/movie';
const getPopularURL = `${apiURL}/popular${apiKey}`

//GET /popularMovies
router.get('/api/popularMovies', isAuthenticated, async (req, res, next) => {
    try {
        const response = await axios.get(`${getPopularURL}`);
        const moviesList = response.data;

        const movies = moviesList.results.map(movie => ({
            title: movie.title,
            voteAverage: movie.vote_average,
            id: movie.id,
            posterPath: movie.poster_path
        }))

        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET /myMoviesList/:moviesId

router.get('/api/movie/:movieId', isAuthenticated, async (req, res, next) => {
    try {
        const { movieId } = req.params;
        console.log('movieId', movieId);
        const response = await axios.get(`${apiURL}/${movieId}${apiKey}`);
        const details = response.data;

        const movieDetails = {
            title: details.title,
            voteAverage: details.vote_average,
            id: details.id,
            posterPath: details.poster_path,
            budget: details.budget,
            overview: details.overview
        }

        res.status(200).json(movieDetails);
    } catch (error) {
        res.status(500).json(error);
    }
})



module.exports = router;
