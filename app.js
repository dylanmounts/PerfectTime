const express = require('express');
const path = require('path');
const timeServer = require('./src/backend/timeServer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || '127.0.0.1';

app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/time', (req, res) => {
    const currentTime = timeServer.getPerfectTime();
    res.json({ time: currentTime });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

timeServer.updateTimeFromNTP();
setInterval(timeServer.updateTimeFromNTP, 15 * 60 * 1000);
