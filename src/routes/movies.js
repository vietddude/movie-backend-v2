const express = require('express');

const movieController = require('../controllers/movieController');
const auth = require('../middleware/auth');
const uploadImage = require('../utils/uploadImage');
const uploadMiddleware = require('../utils/uploadMiddleware');

const router = new express.Router();

// Search movies
router.get('/search', movieController.searchMovie);

// Create a new movie
router.post('/', auth.manager, movieController.createMovie);

// Upload movie photo
router.post('/photo/:id', auth.manager, uploadMiddleware, uploadImage, movieController.uploadMovieImage);

// Get all movies
router.get('/', auth.manager, movieController.getAllMovies);

// Get a movie by ID
router.get('/:id', auth.manager, movieController.getMovieById);

// Update a movie by ID
router.patch('/:id', auth.manager, movieController.updateById);

// Delete a movie by ID
router.delete('/:id', auth.manager, movieController.deleteById);

// Upload multiple movies
router.post('/upload', auth.manager, uploadMiddleware, movieController.uploadMovies);

module.exports = router;