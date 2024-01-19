/**
 * timeManager.js - Manages time synchronization for PerfectTime.org.
 *
 * This module defines a TimeManager class responsible for synchronizing the clock
 * with backend timeserver to ensure accuracy. It fetches the perfect time from the
 * time server's API and calculates the offset from the user's local time.
 */


import { TIME_ENDPOINT } from "../constants";

class TimeManager {
    constructor() {
        this.timeOffset = 0;
    }

    /**
     * Fetches the perfect time from the time server and calculates the time offset.
     *
     * This function tries to fetch the current time from the backend time server. In case
     * of an error, it falls back to the local system time and sets the time offset to zero.
     */
    async fetchPerfectTime() {
        try {
            const startTime = new Date();
            const response = await fetch(TIME_ENDPOINT);
            const endTime = new Date();
    
            const data = await response.json();
            const perfectTime = new Date(data.time);
    
            const latency = endTime - startTime;
    
            this.timeOffset = perfectTime - new Date() + latency;
        } catch (error) {
            console.error('Error fetching perfect time:', error);
            this.timeOffset = 0;
        }
    }

    /**
     * Calculates and returns the current corrected time perfected by the current offset.
     *
     * @returns {Date} The current corrected time.
     */
    getCurrentTime() {
        const corrected_now = Date.now() + this.timeOffset;
        return new Date(corrected_now);
    }
}

export const timeManager = new TimeManager();
