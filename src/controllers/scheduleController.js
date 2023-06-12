const Schedule = require('../models/schedule');
const Showtime = require('../models/showtime');
const theatres = require('../utils/theatres')

const scheduleController = {
    // done and checked
    addSchedule: async (req, res) => {
        try {
            const { showtimeId, date, theatre, time } = req.body;
            const errors = [];

            if (!showtimeId || !date || !theatre || !time) {
                errors.push('Invalid data');
            }

            const showtimeIdExists = await Showtime.exists({ _id: showtimeId });
            if (!showtimeIdExists) {
                errors.push('Invalid showtimeId');
            }

            // Check if the theater exists
            const theatreExists = theatres.includes(theatre);
            if (!theatreExists) {
                errors.push('Invalid theater');
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const [year, month, day] = date.split('/').map(Number);
            const scheduleDate = new Date(year, month - 1, day);
            scheduleDate.setHours(scheduleDate.getHours() + 7); // Add GMT+7 offset

            const schedule = await Schedule.create({
                showtimeId,
                date: scheduleDate,
                theatre,
                time,
            });

            res.status(201).json(schedule);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating schedule' });
        }
    },

    // done and checked
    getByShowtimeIdAndDate: async (req, res) => {
        try {
            const { showtimeId, date } = req.query; // Retrieve from req.query instead of req.body

            const [year, month, day] = date.split('/').map(Number);
            const scheduleDate = new Date(year, month - 1, day);
            scheduleDate.setHours(scheduleDate.getHours() + 7); // Add GMT+7 offset

            const schedules = await Schedule.find({
                showtimeId,
                date: { $eq: scheduleDate },
            });

            res.status(200).json(schedules);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving schedule' });
        }
    },

    // done and checked
    getByShowtimeId: async (req, res) => {
        try {
            const showtimeId = req.params.id;
            const schedules = await Schedule.find({ showtimeId });
            res.status(200).json(schedules);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving schedule' });
        }
    },


    updateById: async (req, res) => {
        const scheduleId = req.params.id;
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'showtimeId',
            'date',
            'theatre',
            'time'
        ];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates!' });
        }

        try {
            const schedule = await Schedule.findByIdAndUpdate(scheduleId, req.body, { new: true });

            if (!schedule) {
                return res.status(404).json({ error: 'Schedule not found' });
            }

            res.status(200).json({ status: "Updated schedule!", schedule });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating schedule' });
        }
    },

    deleteById: async (req, res) => {
        try {
            const scheduleId = req.params.id;
            if (!scheduleId) {
                return res.status(404).json({ error: 'Invalid scheduleId' });
            }
            const schedule = await Schedule.findByIdAndDelete(scheduleId);
            if (schedule != null) {
                res.status(200).json({ message: 'Schedule deleted successfully' });
            } else {
                res.status(404).json({ error: 'Schedule not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting schedule' });
        }
    },

    findTheatre: async (req, res) => {
        try {
            const { showtimeId, theatre, date, timeSlot } = req.query;

            if (showtimeId && !theatre && !date && !timeSlot) {
                const theatres = await Schedule.distinct('theatre', { showtimeId });
                res.status(200).json(theatres);
            } else if (showtimeId && theatre && !date && !timeSlot) {
                const dates = await Schedule.distinct('date', { showtimeId, theatre });
                res.status(200).json(dates);
            } else if (showtimeId && theatre && date && !timeSlot) {
                const times = await Schedule.distinct('time', { showtimeId, theatre, date });
                res.status(200).json(times);
            } else {
                throw new Error('Invalid parameters');
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving theatre list' });
        }
    },

    addScheduleFile: async (req, res) => {

    }
}

module.exports = scheduleController;