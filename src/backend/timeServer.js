const express = require('express');
const ntpClient = require('ntp-client');

const app = express();
const port = 7133;

let lastNTPTime = new Date(); // Time of the last successful NTP sync
let lastSyncTime = Date.now(); // Timestamp when the last NTP sync occurred

export function updateTimeFromNTP() {
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

// Function to get the current, accurate time
export function getPerfectTime() {
    const now = Date.now();
    const timeSinceLastSync = now - lastSyncTime;
    const currentTime = new Date(lastNTPTime.getTime() + timeSinceLastSync);
    return currentTime;
}
