const express = require('express');
const router = express.Router();
const Movie = require('../models/movie.model');
const mongoose = require('mongoose');
const axios = require('axios');
const { isAuthenticated } = require("./../middleware/jwt.middleware");

const apiKey = '?api_key=d131d9c2e1e71a17ab471e5e07730c7c'
const apiURL = 'https://api.themoviedb.org/3/movie';
const getPopularURL = `${apiURL}/popular${apiKey}`
const searchURL = `https://api.themoviedb.org/3/search/movie${apiKey}&query=`


//GET /popularMovies
router.get('/api/popularMovies', isAuthenticated, async (req, res, next) => {
    try {
        const response = await axios.get(`${getPopularURL}`);
        const moviesList = response.data;

        const movies = moviesList.results.map(movie => ({
            title: movie.title,
            voteAverage: movie.vote_average,
            id: movie.id,
            posterPath: movie.poster_path,
            releaseDate: movie.release_date,
            popularity: movie.popularity
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
            overview: details.overview,
            releaseDate: details.release_date,
            popularity: details.popularity
        }

        res.status(200).json(movieDetails);
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET /api/movies/search/:query
router.get('/api/movies/search/:query', isAuthenticated, async (req, res, next) => {
    try {
        const { query } = req.params;
        const response = await axios.get(`${searchURL}${query}`);
        const searchedMovieList = response.data;
        console.log(searchedMovieList);
        const movies = searchedMovieList.results.map(movie => ({
            title: movie.title,
            voteAverage: movie.vote_average,
            id: movie.id,
            posterPath: movie.poster_path,
            releaseDate: movie.release_date,
            popularity: movie.popularity
        }))
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;
