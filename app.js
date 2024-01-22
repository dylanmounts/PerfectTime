const express = require('express');
const path = require('path');
const timeServer = require('./src/backend/timeServer');

const app = express();
const port = process.env.PORT || 8100;
const hostname = process.env.HOSTNAME || '127.0.0.1';
const allowedOrigins = ['https://perfecttime.org', 'https://www.perfecttime.org'];

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Endpoint to get the perfect time
app.use('/api/time', function(req, res) {
    const origin = req.headers.origin;

    if (!origin || allowedOrigins.includes(origin)) {
        // Set the Access-Control-Allow-Origin header to the origin of the request,
        // or to 'https://perfecttime.org' if the origin is not present
        res.setHeader('Access-Control-Allow-Origin', origin || 'https://perfecttime.org');
    } else {
        res.status(403).send('Access Denied');
        return;
    }

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
