const express = require('express'); 

const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const uploadImage = require('../utils/uploadImage');
const uploadMiddleware = require('../utils/uploadMiddleware');

const router = new express.Router();

// routes list for user
router.post('/register', userController.createUser);
router.post('/photo/:id', auth.user, uploadMiddleware, uploadImage, userController.uploadProfileImage);
router.post('/login', userController.loginUser);
router.post('/logout',  auth.user, userController.logoutUser);
router.post('/logoutAll', auth.admin, userController.logoutAll);
router.get('/', auth.admin, userController.getAllUser);
router.get('/me', auth.user, userController.userInfo);
router.get('/:id', auth.admin, userController.getUserInfoById);
router.patch('/me', auth.user, userController.updateUser);
router.patch('/:id', auth.admin, userController.updateById);
router.delete('/me', auth.user, userController.deleteMe);
router.delete('/:id', auth.admin, userController.deleteById);
router.patch('/role/:id', auth.admin, userController.addRole);

module.exports = router;