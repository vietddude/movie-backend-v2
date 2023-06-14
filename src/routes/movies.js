const express = require('express');

const movieController = require('../controllers/movieController');
const auth = require('../middleware/auth');
const uploadImage = require('../utils/uploadImage');
const uploadMiddleware = require('../utils/uploadMiddleware');

const router = new express.Router();


router.post('/', auth.manager, movieController.createMovie);
router.post('/photo/:id', auth.manager, uploadMiddleware, uploadImage, movieController.uploadMovieImage);
router.get('/', auth.manager, movieController.getAllMovies);
router.get('/:id', auth.manager, movieController.getMovieById);
router.patch('/:id', auth.manager, movieController.updateById);
router.delete('/:id', auth.manager, movieController.deleteById);
router.post('/upload', auth.manager, uploadMiddleware, movieController.uploadMovies);

module.exports = router;