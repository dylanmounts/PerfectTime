/**
 * timeManager.js - Manages time synchronization for PerfectTime.org.
 *
 * This module defines a TimeManager class responsible for synchronizing the clock
 * with backend timeserver to ensure accuracy. It fetches the perfect time from the
 * time server's API and calculates the offset from the user's local time.
 */

import { CapacitorHttp } from '@capacitor/core';

import { TIME_ENDPOINT } from "../constants";


class TimeManager {
    constructor() {
        this.perfectTime = null;
        this.timeOffset = null;
    }

    /**
     * Fetches the perfect time from the time server and calculates the time offset.
     *
     */
    async fetchPerfectTime() {
        try {
            const options = {
                url: TIME_ENDPOINT,
                headers: { 'Referer': 'https://perfecttime.org' }
            };
            const startTime = Date.now();
            const response = await CapacitorHttp.request({ ...options, method: 'GET' })
            const endTime = Date.now();
            const roundTripTime = endTime - startTime;

            const data = response.data;
            this.perfectTime = new Date(data.time).getTime();
            const deviceTime = startTime + roundTripTime / 2;

            this.timeOffset = this.perfectTime - deviceTime;
        } catch (error) {
            console.error("Error fetching perfect time: ", error);
            if (this.timeOffset === null) {
                this.timeOffset = 0;
            }
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

        const currentTime = new Date(Date.now() + this.timeOffset);
        return currentTime;
    }
}

export const timeManager = new TimeManager();
