const express = require('express');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const app = express();
const port = process.env.PERFECT_PORT || 8100;
const hostname = process.env.PERFECT_HOSTNAME || '127.0.0.1';
const isWebApp = process.env.PERFECT_WEB_APP === 'true';
const allowedOrigins = ['https://perfecttime.org', 'https://www.perfecttime.org'];

if (isWebApp) {
    const timeServer = require('./src/backend/timeServer');

    const apiLimiter = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
    });
    
    app.set('trust proxy', 1)

    // Endpoint to get the perfect time
    app.use('/api/time', apiLimiter, (req, res) => {
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

    app.use('/privacy', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist/policies/privacy.txt'))
    });

    // Initial backend time synchronization with NTP server
    timeServer.updateTimeFromNTP();

    // Update time from NTP server every 10 minutes
    setInterval(timeServer.updateTimeFromNTP, 10 * 60 * 1000);
}

// Pass the IS_WEB_APP environment variable before serving index.html
app.use((req, res, next) => {
    if (req.method === 'GET' && (req.path === '/' || !req.path.includes('.'))) {
        let html = fs.readFileSync(path.join(__dirname, 'dist/index.html'), 'utf8');
        html = html.replace('<!--ENV_VARIABLES-->', `<script>window.IS_WEB_APP = ${isWebApp};</script>`);
        res.send(html);
    } else {
        next();
    }
});

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Start the server
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
