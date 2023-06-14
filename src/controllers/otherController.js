const slides = require('../utils/slides');
const theatres = require('../utils/theatres');
const otherController = {
    getSlides: async (req, res) => {
        try {
            res.status(200).json(slides)
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" })
        }
    },

    getTheatres: async (req, res) => {
        try {
            res.status(200).json(theatres);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" })
        }
    }
}

module.exports = otherController;