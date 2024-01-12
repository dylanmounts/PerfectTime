const express = require('express');
const ntpClient = require('ntp-client');

const app = express();
const port = 3000;

app.get('/time', (req, res) => {
    ntpClient.getNetworkTime("pool.ntp.org", 123, function(err, date) {
        if(err) {
            console.error(err);
            return res.status(500).send("Error fetching NTP time");
        }

        res.json({ time: date });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
