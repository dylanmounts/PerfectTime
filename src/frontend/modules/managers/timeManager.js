/**
 * timeManager.js - Manages time synchronization for PerfectTime.org.
 *
 * This module defines a TimeManager class responsible for synchronizing the clock
 * with backend timeserver to ensure accuracy. It fetches the perfect time from the
 * time server's API and calculates the offset from the user's local time.
 */


class TimeManager {
    constructor() {
        this.perfectTimeEndpoint = 'https://perfecttime.org/api/time'
        this.perfectTime = null;
        this.userTime = null;
        this.timeOffset = null;
    }

    /**
     * Fetches the perfect time from the time server and calculates the time offset.
     *
     * This function tries to fetch the current time from the backend time server. In case
     * of an error, it falls back to the local system time and sets the time offset to zero.
     */
    async fetchPerfectTime() {
        try {
            const response = await fetch(this.perfectTimeEndpoint);
            const data = await response.json();
            this.perfectTime = new Date(data.time);
            this.userTime = new Date();
            this.timeOffset = this.perfectTime - this.userTime;
        } catch (error) {
            console.error('Error fetching perfect time:', error);
            this.perfectTime = new Date();
            this.timeOffset = 0;
        }
    }

    /**
     * Calculates and returns the current corrected time.
     *
     * This method returns the current time perfected by the time offset. If something went
     * wrong and the offset isn't available it returns the local system time.
     *
     * @returns {Date} The current corrected time.
     */
    getCurrentTime() {
        if (!this.perfectTime) {
            return new Date();
        }
        const corrected_now = Date.now() + this.timeOffset;
        return new Date(corrected_now);
    }
}

export const timeManager = new TimeManager();
