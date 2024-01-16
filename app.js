const express = require('express');
const path = require('path');
const timeServer = require('./src/backend/timeServer');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/time', (req, res) => {
    const currentTime = timeServer.getPerfectTime();
    res.json({ time: currentTime });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
    console.log(`App server running on port ${port}`);
});
