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
        this.timeOffset = null;
        this.fetchPerfectTime();
    }

    /**
     * Fetches the perfect time from the time server and calculates the time offset.
     *
     */
    async fetchPerfectTime() {
        try {
            const startTime = new Date().getTime();
            const response = await fetch(TIME_ENDPOINT);
            const endTime = new Date().getTime();
            const roundTripTime = endTime - startTime;
    
            const data = await response.json();
            const perfectTime = new Date(data.time).getTime() + roundTripTime / 2;
            const deviceTime = startTime + roundTripTime / 2;

            this.timeOffset = perfectTime - deviceTime;
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
        if (this.timeOffset === null) {
            return new Date();
        }

        const deviceTime = new Date().getTime();
        return new Date(deviceTime + this.timeOffset);
    }
}

export const timeManager = new TimeManager();
