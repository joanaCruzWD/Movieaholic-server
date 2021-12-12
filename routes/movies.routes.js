const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite.model');

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

//POST /api/movie/favorite
router.post('/api/movie/favorite', isAuthenticated, async (req, res, next) => {
    try {
        const { movieId } = req.body;
        const userId = req.payload._id

        //Check if there is already this movie in the favorites list
        const foundedFavorite = await Favorite.findOne({ _id: movieId });

        if (!foundedFavorite) {
            await Favorite.create({
                _id: movieId,
                userId: userId,
            })
            res.status(201).json();
        } else {
            const checkedId = foundedFavorite.userId.find(id => id === userId)
            if (!checkedId) {
                await Favorite.findOneAndUpdate(
                    { _id: movieId },
                    { $push: { userId: userId } }
                )
                res.status(201).json();
            } else {
                res.status(400).json();
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

//GET /api/movie/favorite
router.get('/api/favorite', isAuthenticated, async (req, res, next) => {
    try {
        const userId = req.payload._id
        const favoritesList = await Favorite.find({ userId: userId });
        console.log(favoritesList);

        const allFavorites = await Promise.all(favoritesList.map(async (favorite) => {
            const response = await axios.get(`${apiURL}/${favorite._id}${apiKey}`);
            const favoriteDetails = response.data;

            return {
                title: favoriteDetails.title,
                voteAverage: favoriteDetails.vote_average,
                id: favoriteDetails.id,
                posterPath: favoriteDetails.poster_path,
                overview: favoriteDetails.overview,
                releaseDate: favoriteDetails.release_date,
                popularity: favoriteDetails.popularity
            }
        }))
        res.status(200).json(allFavorites);
        console.log(allFavorites);
    } catch (error) {
        res.status(500).json(error);
    }
})

//GET /favorite/movieDetails/:moviesId
router.get('/api/favorite/:favoriteId', isAuthenticated, async (req, res, next) => {
    try {
        const { favoriteId } = req.params;

        const response = await axios.get(`${apiURL}/${favoriteId}${apiKey}`);
        const detailFavorite = response.data;

        const favoriteMovieDetails = {
            title: detailFavorite.title,
            voteAverage: detailFavorite.vote_average,
            id: detailFavorite.id,
            posterPath: detailFavorite.poster_path,
            overview: detailFavorite.overview,
            releaseDate: detailFavorite.release_date,
            popularity: detailFavorite.popularity
        }
        console.log('favoriteMovieDetails', favoriteMovieDetails);
        res.status(200).json(favoriteMovieDetails);

    } catch (error) {
        res.status(500).json(error);
    }
})

//DELETE /api/movie/favorite/:favoriteId
router.delete('/api/favorite/:favoriteId', isAuthenticated, async (req, res, next) => {
    try {

        const { favoriteId } = req.params;
        const userId = req.payload._id
        //Check if there is already this movie in the favorites list
        const foundedFavorite = await Favorite.findOne({ _id: favoriteId });
        if (!foundedFavorite) {
            res.status(404).json();
        } else {
            const checkedId = foundedFavorite.userId.find(id => id === userId)
            if (checkedId) {
                await Favorite.findOneAndUpdate(
                    { _id: favoriteId },
                    { $pull: { userId: userId } }
                )
                res.status(201).json();
            } else {
                res.status(400).json();
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})


module.exports = router;
