const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('./db/mongoose');

const port = process.env.PORT || 8000;

//Routes
const userRouter = require('./routes/users');
const screenRouter = require('./routes/screens');
const movieRouter = require('./routes/movies');
const scheduleRouter = require('./routes/schedules');
const showtimeRouter = require('./routes/showtimes');
const reservationRouter = require('./routes/reservations');
// const ticketRouter = require('./routes/tickets');
const otherRouter = require('./routes/others');


const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('common'));
app.disable('x-powered-by');

// react stuff
app.use("/v1/users", userRouter);
app.use("/v1/screens", screenRouter);
app.use("/v1/movies", movieRouter);
app.use("/v1/schedules", scheduleRouter);
app.use("/v1/showtimes", showtimeRouter);
app.use("/v1/reservations", reservationRouter);
// app.use("/v1/tickets", ticketRouter);
app.use("/v1/", otherRouter);

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
//   });
 
app.listen(port, () => console.log(`app is running on port: ${port}`));