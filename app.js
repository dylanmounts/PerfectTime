const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8100;
const hostname = process.env.HOSTNAME || '127.0.0.1';
const isWebApp = process.env.IS_WEB_APP === 'true';
const allowedOrigins = ['https://perfecttime.org', 'https://www.perfecttime.org'];

let timeServer;
if (isWebApp) {
    timeServer = require('./src/backend/timeServer');
}

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Endpoint to get the perfect time
app.use('/api/time', function(req, res) {
    let sourceOrigin = req.headers.origin;

    // Fallback to Referer if Origin is not present
    if (!sourceOrigin) {
        const referer = req.headers.referer;
        if (referer) {
            sourceOrigin = new URL(referer).origin;
        }
    }

    if (allowedOrigins.includes(sourceOrigin)) {
        res.setHeader('Access-Control-Allow-Origin', sourceOrigin);
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

if (isWebApp) {
    // Initial backend time synchronization with NTP server
    timeServer.updateTimeFromNTP();

    // Update time from NTP server every 10 minutes
    setInterval(timeServer.updateTimeFromNTP, 10 * 60 * 1000);
}
