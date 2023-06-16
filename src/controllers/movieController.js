const Movie = require('../models/movie');
const Showtime = require('../models/showtime');
const fs = require('fs');

const movieController = {
    createMovie: async (req, res) => {
        const movie = new Movie(req.body);
        try {
            const movieExists = await Movie.exists({ title: req.body.title });
            if (movieExists) {
                return res.status(409).json({error: 'Movie already exists'});
            }
            await movie.save();
            res.status(201).json({status: "success", movie});
        } catch (e) {
            res.status(400).json({error: e.message});
        }
    },
    
    uploadMovieImage: async (req, res, next) => {
        const { file } = req;
        const movieId = req.params.id;
        try {
          if (!file) {
            const error = new Error('Please upload a file');
            error.httpStatusCode = 400;
            return next(error);
          }
          const movie = await Movie.findById(movieId);
          if (!movie) return res.sendStatus(404);
      
          await movie.updateOne({ image: req.image });
          res.status(201).json({ movie, image: req.image });
        } catch (e) {
          console.log(e);
          res.sendStatus(400).send(e);
        }
    },

    getAllMovies: async (req, res) => {
      try {
        const movies = await Movie.find({});
    
        const moviesWithShowtimeIds = await Promise.all(
          movies.map(async (movie) => {
            const showtime = await Showtime.findOne({ movieId: movie._id });
            const showtimeId = showtime ? showtime._id : null;
            
            return { ...movie.toObject(), showtimeId };
          })
        );
    
        res.status(200).json(moviesWithShowtimeIds);
      } catch (error) {
        res.status(500).json({ error: 'Error retrieving movies' });
      }
    },
    
    getMovieById: async (req, res) => {
        const _id = req.params.id;

        try {
            const movie = await Movie.findById(_id);
            if (!movie) return res.status(404).json({eror: 'Movie does not exist'});
            return res.status(200).json(movie);
        } catch (e ) {
            return res.status(400).json({error: e.message});
        }
    },

    updateById: async (req, res) => {
        const _id = req.params.id;
        const updates = Object.keys(req.body);
        const allowedUpdates = [
          'title',
          'image',
          'language',
          'genre',
          'director',
          'cast',
          'description',
          'duration',
          'rating'
        ];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
      
        if (!isValidOperation) return res.status(400).json({ error: 'Invalid updates!' });
      
        try {
          const movie = await Movie.findById(_id);
          updates.forEach((update) => (movie[update] = req.body[update]));
          await movie.save();
          return !movie ? res.status(404).json({error: 'Movie does not exists'}) : res.status(200).json(movie);
        } catch (e) {
          return res.status(400).json({error: e.message});
        }
    },

    deleteById: async (req, res) => {
        const _id = req.params.id;
        try {
          const movie = await Movie.findByIdAndDelete(_id);
          return !movie ? res.status(404).json({error: 'Movie does not exists'}) : res.status(200).json({ message: 'Movie deleted!'});
        } catch (e) {
          return res.status(400).json({error: e.message});
        }
    },

    uploadMovies: async (req, res) => {
      try {
        const file = req.file;
        if (!file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Read the uploaded file
        const fileData = fs.readFileSync(file.path, 'utf-8');
        const movies = JSON.parse(fileData);
        
        await fs.unlinkSync(file.path);
          
        // Check if any of the movies already exist in the database
        const existingMovies = await Movie.find({ title: { $in: movies.map(movie => movie.title) } });
        if (existingMovies.length > 0) {
          const existingTitles = existingMovies.map(movie => movie.title).join(', ');
          return res.status(400).json({ error: `The following movies already exist: ${existingTitles}` });
        }

        // Add movies to the database
        const createdMovies = await Movie.insertMany(movies);
    
        // Send response
        res.status(201).json({ message: 'Movies added successfully', createdMovies });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding movies' });
      }
    },
    
    searchMovie: async (req, res) => {
      const { title } = req.query;
    
      try {
        const movies = await Movie.find({ title: { $regex: title, $options: 'i' } }).select('title');
        const movieTitles = movies.map(movie => movie.title);
        res.status(200).json(movieTitles);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    
}

module.exports = movieController;