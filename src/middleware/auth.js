const jwt = require('jsonwebtoken');
const User = require('../models/user');

const user = async (req, res, next) => {
  try {
    const token = req.header('Tokens').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'mySecret');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next(); 
  } catch (e) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

const admin = async (req, res, next) => {
  try {
    const token = req.header('Tokens').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'mySecret');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user || user.role !== 'admin') throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Please authenticate, dont tryna be an admin' });
  }
};

const manager = async (req, res, next) => {
  try {
    const token = req.header('Tokens').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'mySecret');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user || user.role !== 'manager') throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: 'This action requires manager!' });
  }
};


module.exports = { user, manager, admin};
