const express = require('express');
const path = require('path');
const timeServer = require('./src/backend/timeServer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || '127.0.0.1';

app.use(cors());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Endpoint to get the perfect time
app.get('/api/time', (req, res) => {
    const currentTime = timeServer.getPerfectTime();
    res.json({ time: currentTime });
});

// Serve the main index.html for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start the server
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// Initial backend time synchronization with NTP server
timeServer.updateTimeFromNTP();

// Update time from NTP server every 15 minutes
setInterval(timeServer.updateTimeFromNTP, 15 * 60 * 1000);
