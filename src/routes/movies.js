const express = require('express');

const movieController = require('../controllers/movieController');
// const auth = require('../middleware/auth');
const uploadImage = require('../utils/uploadImage');
const uploadMiddleware = require('../utils/uploadMiddleware');

const router = new express.Router();


router.post('/', movieController.createMovie);
router.post('/photo/:id', uploadMiddleware, uploadImage, movieController.uploadMovieImage);
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.patch('/:id', movieController.updateById);
router.delete('/:id', movieController.deleteById);
router.post('/upload', uploadMiddleware, movieController.uploadMovies);

module.exports = router;