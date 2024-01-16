const ntpClient = require('ntp-client');

let lastNTPTime = new Date();
let lastSyncTime = Date.now();

function updateTimeFromNTP() {
    ntpClient.getNetworkTime("pool.ntp.org", 123, (err, date) => {
        if (err) {
            console.error("Error updating time from NTP:", err);
            return;
        }
        lastNTPTime = date;
        lastSyncTime = Date.now();
        console.log("Time updated from NTP:", lastNTPTime);
    });
}

function getPerfectTime() {
    const now = Date.now();
    const timeSinceLastSync = now - lastSyncTime;
    return new Date(lastNTPTime.getTime() + timeSinceLastSync);
}

module.exports = {
    getPerfectTime,
    updateTimeFromNTP
};
