const Screen = require('../models/screen');
const Schedule = require('../models/schedule');
const BookedSeat = require('../models/bookedSeat');

const ScreenController = {
    // done and checked
    createScreen: async (req, res) => {
        try {
            const { scheduleId, time } = req.body;

            const screenExists = await Screen.exists({ scheduleId, time });
            if (screenExists) {
                return res.status(400).json({ error: 'Screen already exists' });
            }

            const schedule = await Schedule.findById(scheduleId);
            if (!schedule || !schedule.time.includes(time)) {
                return res.status(400).json({ error: 'Invalid schedule time' });
            }

            const screen = new Screen({
                scheduleId,
                time,
                seatArray: Array.from({ length: 5 }, () => Array(8).fill(0)).concat([Array(4).fill(0)]),
            });

            await screen.save();

            res.status(201).json({ message: 'Screen list created successfully', schedule, screen });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating screen' });
        }
    },

    getScreen: async (req, res) => {
        try {
            const screenId = req.params.id;
            let screen = await Screen.findById(screenId);

            if (!screen) {
                const schedule = await Schedule.findById(screen.scheduleId);
                if (!schedule || !schedule.time.includes(screen.time)) {
                    return res.status(400).json({ error: 'Invalid schedule time' });
                }

                screen = new Screen({
                    scheduleId: screen.scheduleId,
                    time: screen.time,
                    seatArray: Array.from({ length: 5 }, () => Array(8).fill(0)).concat([Array(4).fill(0)]),
                });

                await screen.save();
            }

            res.status(200).json(screen);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving screen' });
        }
    },

    // done but not checked
    getScreenBy: async (req, res) => {
        try {
            const { scheduleId, time } = req.query;
            const screen = await Screen.find(scheduleId, time);
            if (!screen) {
                return res.status(404).json({ error: 'Screen not found' });
            }

            res.status(200).json(screen);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving screen' });
        }
    },

    // done but not checked
    setBookedSeat: async (req, res) => {
        try {
            const screenId = req.params.id;
            const coordinates = req.body;

            const screen = await Screen.findById(screenId);
            if (!screen) {
                return res.status(404).json({ error: 'Screen not found' });
            }

            const bookedList = [];
            for (const coordinate of coordinates) {
                const [row, column] = coordinate;
                if (
                    row >= 0 &&
                    row < screen.seatArray.length &&
                    column >= 0 &&
                    column < screen.seatArray[row].length
                ) {
                    screen.seatArray[row][column] = 1;
                    const type = column == screen.seatArray.length - 1 ? 2 : 1;
                    const bookedSeat = new BookedSeat({ screenId: screen._id, coordinate, seatType: type }); // Set screenId
                    await bookedSeat.save();
                    bookedList.push(bookedSeat);
                }
            }

            await screen.save();

            res.status(200).json({ message: 'Booked seats updated successfully', screen, bookedList });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error setting booked seats' });
        }
    },

    deleteBookedSeat: async (req, res) => {
        const bookedSeatId = req.params.bookedSeatId;
        try {
            await BookedSeat.findOneAndDelete(bookedSeatId);
            res.status(200).json({ message: "Booked seat deleted successfully" })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error when deleting booked seats' });
        }
    },

    clearAllBookedSeatOfScreen: async (req, res) => {
        try {
            const screenId = req.params.screenId;

            // Find all booked seats for the given screenId
            const bookedSeats = await BookedSeat.find({ screenId });
            const screen = await Screen.findById(screenId);
            if (bookedSeats.length === 0) {
                return res.status(404).json({ error: 'No booked seats found for the screen' });
            }

            // Clear all booked seats by setting the seatArray to 0
            screen.seatArray = screen.seatArray.map(row => row.map(seat => 0));
            await screen.save();

            // Delete all the found booked seats
            const deleteResult = await BookedSeat.deleteMany({ screenId });

            res.status(200).json({ message: 'Booked seats cleared successfully', deletedCount: deleteResult.deletedCount });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error clearing booked seats' });
        }
    },

    resetSeatArray: async (req, res) => {
        try {
            const screenId = req.params.screenId;
            const screen = await Screen.findById(screenId);
            // Clear all booked seats by setting the seatArray to 0
            screen.seatArray = screen.seatArray.map(row => row.map(seat => 0));
            await screen.save();

            res.status(200).json({ message: 'Reset seat array successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error clearing booked seats' });
        }
    }
}

module.exports = ScreenController;
