const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./models/Booking');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
}).then(async () => {
    console.log("Connected to DB");
    const bookings = await Booking.find({});
    console.log("Total bookings:", bookings.length);
    bookings.forEach(b => {
        console.log(`ID: ${b._id}, UserID: ${b.userId}, Email: ${b.userEmail}, Name: ${b.fullName}`);
    });
    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});
