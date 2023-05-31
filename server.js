const express = require('express');
const path = require("path");
const ejs = require("ejs");
var bodyParser = require('body-parser');


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000
const hostname = 'localhost'

const numRows = 10;
const seatsPerRow = [7, 7, 7, 7, 7, 7, 7, 7, 7, 3];
let Booked = [];

app.get('/', (req, res,) => {
    res.render('main');
})

app.post('/seat-bookings', (req, res) => {
    const bookedSetsList = bookSeats(parseInt(req.body.numSeatsRequired))
    return res.json({ bookedSetsList, Message: `Booked seats: ${bookedSetsList.join(", ")}` })
})

app.get('/seat-booked', (req, res) => {
    return res.json({ Booked })
})

app.get('/clear-bookings', (req, res) => {
    Booked = []
    seatAvailability()
    return res.json({ Booked })
})


// seat availability
const seatMatrix = new Array(numRows);
function seatAvailability() {
    for (let i = 0; i < numRows; i++) {
        seatMatrix[i] = new Array(seatsPerRow[i]).fill(true);
    }
}
seatAvailability()

// Check seats are available in a row
function checkConsecutiveSeats(row, numSeats) {
    const seats = seatMatrix[row];
    for (let i = 0; i <= seats.length - numSeats; i++) {
        let j;
        for (j = 0; j < numSeats; j++) {
            if (!seats[i + j]) {
                break;
            }
        }
        if (j === numSeats) {
            return i;
        }
    }
    return -1;
}

// Book seates 
function bookSeats(numSeats) {
    let seatsBooked = [];
    for (let row = 0; row < numRows; row++) {
        const seatIndex = checkConsecutiveSeats(row, numSeats);
        if (seatIndex !== -1) {
            for (let i = 0; i < numSeats; i++) {
                seatMatrix[row][seatIndex + i] = false;
                const seatNumber = seatIndex + i + 1;
                const seat = { row: row + 1, seat: seatNumber };
                Booked.push(seat);
                seatsBooked.push(`R${seat.row}-S${seat.seat}`);
            }
            break;
        }
    }
    return seatsBooked;
}


app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});



