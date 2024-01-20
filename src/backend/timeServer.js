/**
 * timeServer.js - Manages time synchronization with an NTP server to maintain the pefect time.
 *
 * This module is responsible for fetching the current time from an NTP server and 
 * providing an accurate (perfect) time to the frontend.
 */

const ntpClient = require('ntp-client');

let lastNTPTime = new Date();
let lastSyncTime = Date.now();

/**
 * Updates the backend server's time from the NTP server.
 */
function updateTimeFromNTP() {
    ntpClient.getNetworkTime("pool.ntp.org", 123, (err, date) => {
        if (err) {
            console.error("Error updating time from NTP:", err);
            return;
        }
        lastSyncTime = Date.now();
        lastNTPTime = date;
        console.log("Time updated from NTP:", lastNTPTime);
    });
}

/**
 * Calculates and returns the perfect time.
 * 
 * This function computes the current time based on the last synchronized NTP time
 * and the time elapsed since the last synchronization.
 * 
 * @returns {Date} The current time adjusted for any lag since the last NTP sync.
 */
function getPerfectTime() {
    const timeSinceLastSync = Date.now() - lastSyncTime;
    const perfectTime = new Date(lastNTPTime.getTime() + timeSinceLastSync);
    return perfectTime;
}

module.exports = {
    getPerfectTime,
    updateTimeFromNTP
};
