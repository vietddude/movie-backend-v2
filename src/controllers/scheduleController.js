const Schedule = require('../models/schedule');
const Theatres = require('../utils/theatres');
const Showtime = require('../models/showtime');
const fs = require('fs');

const scheduleController = {
    // done and checked
    addSchedule: async (req, res) => {
        try {
            const { showtimeId, date, theatre, time } = req.body;
            const errors = [];

            if (!showtimeId || !date || !theatre || !time) {
                errors.push('Invalid data');
            }

            const showtimeExists = await Showtime.exists({ _id: showtimeId });
            if (!showtimeExists) {
                errors.push('Invalid showtimeId');
            }

            // Check if the theater exists
            const theatreExists = Theatres.includes(theatre);
            if (!theatreExists) {
                errors.push('Invalid theater');
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            }

            const [year, month, day] = date.split('/').map(Number);
            const scheduleDate = new Date(year, month - 1, day);
            scheduleDate.setHours(scheduleDate.getHours() + 7); // Add GMT+7 offset

            let scheduleTimes = [];
            if (Array.isArray(time)) {
                // If time is an array, use the array directly
                scheduleTimes = time;
            } else {
                // If time is a single value, convert it to an array
                scheduleTimes.push(time);
            }

            const existingSchedule = await Schedule.findOne({
                showtimeId,
                date: scheduleDate,
                theatre,
                time: { $in: scheduleTimes },
            });

            if (existingSchedule) {
                return res.status(409).json({ error: 'Schedule already exists' });
            }

            const schedule = await Schedule.create({
                showtimeId,
                date: scheduleDate,
                theatre,
                time: scheduleTimes,
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
    getByscheduleId: async (req, res) => {
        try {
            const scheduleId = req.params.id;
            const schedules = await Schedule.find({ scheduleId });
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
            'scheduleId',
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
                const currentDate = new Date();
                const dates = await Schedule.distinct('date', { showtimeId, theatre, date: { $gte: currentDate } });
                const formattedDates = dates.map(date => {
                    const dateString = new Date(date).toISOString().split("T")[0];
                    console.log(dateString);
                    return dateString;
                });
                res.status(200).json(formattedDates);
            } else if (showtimeId && theatre && date && !timeSlot) {
                const parsedDate = new Date(date); // Convert date parameter to Date object
                const times = await Schedule.distinct('time', { showtimeId, theatre, date: parsedDate });
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
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // Read the uploaded file
            const fileData = fs.readFileSync(file.path, 'utf-8');
            let schedules = JSON.parse(fileData);

            fs.unlinkSync(file.path);

            // Check if any of the schedules already exist in the database
            const existingSchedules = await Schedule.find({
                $or: schedules.map((schedule) => ({
                    showtimeId: schedule.showtimeId,
                    date: schedule.date,
                    theatre: schedule.theatre,
                })),
            });

            if (existingSchedules.length > 0) {
                const existingSchedulesMsg = existingSchedules
                    .map(
                        (schedule) =>
                            `Showtime ID ${schedule.showtimeId} already has a schedule on ${schedule.date} at ${schedule.theatre}`
                    )
                    .join(', ');
                return res
                    .status(400)
                    .json({ error: `The following schedules already exist: ${existingSchedulesMsg}` });
            }

            // Add schedules to the database
            const modifiedSchedules = schedules.map((schedule) => {
                const [year, month, day] = schedule.date.split('/').map(Number);
                const scheduleDate = new Date(year, month - 1, day);
                scheduleDate.setHours(scheduleDate.getHours() + 7); // Add GMT+7 offset

                return {
                    ...schedule,
                    date: scheduleDate,
                };
            });

            // Add schedules to the database
            const createdSchedules = await Schedule.insertMany(modifiedSchedules);

            // Send response
            res.status(201).json({ message: 'Schedules added successfully', createdSchedules });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error adding schedules' });
        }
    },

    getAllSchedules: async (req, res) => {
        try {
            const schedules = await Schedule.find();
            res.status(200).json(schedules);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving schedules' });
        }
    },

    getSchedulesByShowtime: async (req, res) => {
        try {
            const { showtimeId } = req.params;
            const schedules = await Schedule.find({ showtimeId });
            res.status(200).json(schedules);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving schedules' });
        }
    },

    getSchedulesByDateRange: async (req, res) => {
        try {
            const { start, end } = req.query;
            const startDate = new Date(start);
            const endDate = new Date(end);

            const schedules = await Schedule.find({
                'showtime.dateRange.start': { $gte: startDate },
                'showtime.dateRange.end': { $lte: endDate }
            });

            res.status(200).json(schedules);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving schedules' });
        }
    },

    getScheduleByTheatre: async (req, res) => {
        try {
            const { theatre, start, end } = req.query;
            const startDate = new Date(start);
            const endDate = new Date(end);

            const schedules = await Schedule.find({
                theatre,
                'showtime.dateRange.start': { $gte: startDate },
                'showtime.dateRange.end': { $lte: endDate }
            });
            res.status(200).json(schedules);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving schedules' });
        }
    }

}

module.exports = scheduleController;