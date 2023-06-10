const User = require('../models/user');


const userController = {
    // create user
    createUser: async (req, res) => {
        try {
            const {username, password, name, email, phone, role, gender, address, birthday} = req.body;
            const userExists = await User.findOne({username});
            const emailExists = await User.findOne({email});
            const phoneExists = await User.findOne({phone});

            if (role) 
                return res.status(409).json({error: 'You cannot set role property.'});
            if (userExists) 
                return res.status(409).json({error: 'User already exists'});
            if (emailExists) 
                return res.status(409).json({error: 'This email has been used'});
            if (phoneExists)
                return res.status(409).json({error: 'This phone number has been used'});

            const newUser = new User({
                username,
                password,
                name, 
                email,
                phone,
                gender,
                address,
                birthday
            });
            await newUser.save();
            // const token = await newUser.generateAuthToken();
            res.status(201).json({message: 'User created successfully'});
        } catch (e) {
            console.log(e);
            res.status(400).json({error: e.message});
        }
    },

    // upload profile image by id
    uploadProfileImage: async (req, res, next) => {
        const { file } = req;
        const userId = req.params.id;
        try {
          if (!file) {
            const error = new Error('Please upload a file');
            error.httpStatusCode = 400;
            return next(error);
          }
          const user = await User.findById(userId);
          if (!user) return res.sendStatus(404);
          await user.updateOne({ imageurl: req.imageurl });
          res.status(200).json({ user, imageurl: req.imageurl });
        } catch (e) {
          console.log(e);
          res.status(400).json({error: e.message});
        }
    },

    // login user
    loginUser: async (req, res) => {
        try {
            const user = await User.findByCredentials(req.body.username, req.body.password);
            const token = await user.generateAuthToken();
            res.status(201).json({user, token});
        } catch (e) {
            console.log(e);
            res.status(400).json({error: 'Wrong username or password'});
        }
    },

    // logout user 
    logoutUser: async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token;
            });

            await req.user.save();
            res.status(200).json({message: 'Logged out'});
        } catch(e) {
            res.status(400).json({error: e.message});
        }
    },

    // logout all devices (only admin)
    logoutAll: async (req, res) => {
        try {
            req.user.tokens = [];
            await req.user.save();
            res.status(200).json({message: 'Logged out all devices'});
        } catch(e) {
            res.status(400).json({error: e.message});
        }
    },

    // get all user
    getAllUser: async (req, res) => {
        if (req.user.role !== 'admin') 
            return res.status(400).json({
                error: 'Only the god can see all the users!'
            });
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch(e) {
            res.status(400).json({error: e.message});
        }
    },

    // get this user's info
    userInfo: async (req, res) => {
        try {
            res.status(200).json(req.user);
        } catch (e) {
            console.log(e)
            res.status(400).json({error: e.message});
        }
    },

    // get user by id only for admin
    getUserInfoById: async(req, res) => {
        if (req.user.role !== 'admin') 
            return res.status(400).json({
                error: 'Only the god can see the user'
            });
        const _id = req.params.id;
        try {
            const user = await User.findById(_id);
            if (!user) return res.status(404).json({error: 'Cannot find user'});
            res.status(200).json(user);
        } catch (e) {
            res.status(400).json({error: e.message});
        }
    },

    // edit/update user
    updateUser: async (req, res) => {
        const updates = Object.keys(req.body);
        const allowedUpdate = ['name', 'phone', 'username', 'email', 'password', 'gender', 'address', 'birthday'];
        const isValidOperation = updates.every(updates => allowedUpdate.includes(updates));
        if (!isValidOperation) 
            return res.status(400).json({error: 'Invalid update'});
        try {
            const {user} = req;
            updates.forEach((update) => (user[update] = req.body[update]));
            await user.save();
            res.status(200).json(user);
        } catch (e) {
            res.status(400).json({error: e.message});
        }
    },

    // admin can update user by id
    updateById: async (req, res) => {
        if (req.user.role !== 'admin')
            return res.status(400).json(
                {error: 'Only the god can update user'}
            );
        
        const _id = req.params.id;
        const updates = Object.keys(req.body);
        const allowedUpdate = ['name', 'phone', 'username', 'email', 'password', 'gender', 'address', 'birthday'];
        const isValidOperation = updates.every(updates => allowedUpdate.includes(updates));
        if (!isValidOperation) 
            return res.status(400).json({error: 'Invalid update'});
        try {
            const {user} = req;
            updates.forEach((update) => (user[update] = req.body[update]));
            await user.save();
            res.status(200).json(user);
        } catch (e) {
            res.status(400).json({error: e.message});
        }
    },

    // delete by id
    deleteById: async (req, res) => {
        if (req.user.role !== 'admin')
            return res.status(400).json({
                error: 'Only the god can delete user'
            });

        const id = req.params.id;

        try {
            const user = await User.findByIdAndDelete(id);
            if (!user)
                return res.status(404).json({error: 'Cannot delete user'});
        
            res.status(200).json({message: 'User deleted'});
        } catch (e) {
            res.status(400).json({error :e.message});
        }
    },

    // delete user (admin not allowed)
    deleteMe: async (req, res) => {
        if (req.user.role !== 'admin')
            return res.status(400).json({
                error: 'You cannot delete yourself'
            });
        try {
            await req.user.remove();
            res.status(200).json(req.user);
        } catch(e) {
            res.status(400).json({error: e.message});
        }
    },

    // add role (only admin allowed)
    addRole: async (req, res) => {
        try {
          const { user } = req;
          if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Only admins can add roles.' });
          }
          const _id = req.params.id;
          const allowedUpdates = ['role'];
          const updates = Object.keys(req.body);
          const isValidOperation = updates.every(update => allowedUpdates.includes(update));
          if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid update' });
          }
          const updatedUser = await User.findByIdAndUpdate(_id, req.body, { new: true });
          if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
          }
          res.status(200).json(updatedUser);
        } catch (e) {
          console.error(e);
          res.status(500).json({ error: 'Server error' });
        }
    }
};      

module.exports = userController;