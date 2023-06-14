const express = require('express');
const auth = require('../middleware/auth');
const showtimeController = require('../controllers/showtimeController');
const uploadMiddleware = require('../utils/uploadMiddleware');
const router = new express.Router();


router.post('/', auth.manager, showtimeController.createShowtime);
router.get('/', showtimeController.getAllShowtimes);
router.get('/now-showing', showtimeController.getNowShowing);
router.get('/upcoming', showtimeController.getUpcoming);
router.get('/id/:id', showtimeController.getShowtimeById);
router.get('/search', showtimeController.search); // Move the search route above the catch-all route
router.get('/:url', showtimeController.getShowtimeByUrl);
router.patch('/:id', auth.manager, showtimeController.updateShowtimeById);
router.delete('/:id', auth.manager, showtimeController.deleteShowtimeById);
router.post('/upload', auth.manager, uploadMiddleware, showtimeController.uploadShowtimes);
router.delete('/', auth.manager, showtimeController.deleteShowtimes);
module.exports = router;