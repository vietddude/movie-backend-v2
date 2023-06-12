const slides = require('../utils/slides');

const otherController = {
    getSlides: async (req, res) => {
        try {
            res.status(200).json(slides)
        } catch (error) {
            console.log(error);
            res.status(500).json({error: "Internal server error"})
        }
    }
}

module.exports = otherController;