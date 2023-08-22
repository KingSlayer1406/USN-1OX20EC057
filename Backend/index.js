const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000; // You can change this to any port you prefer

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// GET request handler
app.get('/trains', async(req, res) => {
 let cs={
  "companyName": "Train Central",
  "clientID": "af2afbc6-1909-404a-a34b-d3d9bcc00bfd",
  "clientSecret": "OdANVLTUjsQCqRuN",
  "ownerName": "Rahul",
  "ownerEmail": "Shashankshekhar0814@gmail.com",
  "rollNo": "USN:1OX20EC057"
}
let res1=await axios.post("http://20.244.56.144/train/auth",cs)
// console.log(res1.data)
let access_token=res1.data.access_token;
let axiosConfig = {
	headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json',
  },
};
let res2=await axios.get("http://20.244.56.144/train/trains",axiosConfig)
console.log(res2.data)
let data=res2.data;
const currentTime = new Date();

const calculateAdjustedDepartureTime = (departureTime, delay) => {
  const adjustedDepartureTime = new Date(currentTime);
  adjustedDepartureTime.setHours(departureTime.Hours, departureTime.Minutes + delay, departureTime.Seconds);
  return adjustedDepartureTime;
};

// Sort the data based on multiple criteria
const sortedData = data.sort((a, b) => {
  // Sort by ascending price
  const priceComparison = a.price.sleeper - b.price.sleeper;

  // Sort by descending available sleeper seats
  const sleeperSeatsComparison = b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;

  // Sort by descending adjusted departure time (after considering delays)
  const adjustedDepartureTimeA = calculateAdjustedDepartureTime(a.departureTime, a.delayedBy);
  const adjustedDepartureTimeB = calculateAdjustedDepartureTime(b.departureTime, b.delayedBy);
  const departureTimeComparison = adjustedDepartureTimeB - adjustedDepartureTimeA;

  // Order of comparison: Price -> Sleeper Seats -> Adjusted Departure Time
  return priceComparison || sleeperSeatsComparison || departureTimeComparison;
});
	res.json(sortedData)
	
});

// POST request handler
app.post('/', (req, res) => {
  const requestData = req.body;
  res.json({ message: 'Received POST request', data: requestData });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
