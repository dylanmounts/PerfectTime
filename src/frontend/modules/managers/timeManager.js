/**
 * timeManager.js - Manages time synchronization for PerfectTime.org.
 *
 * This module defines a TimeManager class responsible for synchronizing the clock
 * with backend timeserver to ensure accuracy. It fetches the perfect time from the
 * time server's API and calculates the offset from the user's local time.
 */

import { CapacitorHttp } from '@capacitor/core';

import { TIME_ENDPOINT } from "../constants";
import { language, useTwentyFourHour } from "../clock/clockUpdater"


class TimeManager {
    constructor() {
        this.timeOffset = null;
        this.currentTime = null;
        this.currentTimeStr = null;
        this.nextTimeStr = null;
        this.fetchPerfectTime();
    }

    /**
     * Fetches the perfect time from the time server and calculates the time offset.
     */
    async fetchPerfectTime() {
        try {
            const options = {
                url: TIME_ENDPOINT,
                headers: { 'Referer': 'https://perfecttime.org' }
            };
            const startTime = Date.now();
            const response = await CapacitorHttp.request({ ...options, method: 'GET' });
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
        } finally {
            this.getCurrentTime();
        }
    }

    /**
     * Calculates and returns the current corrected time perfected by the current offset.
     *
     * @returns {Date} The current corrected time.
     */
    getCurrentTime() {
        if (this.timeOffset === null) {
            const serverTime = new Date();
            this.currentTime = serverTime;
            return serverTime;
        }

        const currentTime = new Date(Date.now() + this.timeOffset);
        if (!this.currentTimeStr || !this.nextTimeStr) {
            this.currentTimeStr = this.generateTimeString(currentTime);
            this.prepareNextTimeString(currentTime);
        } else {
            this.currentTimeStr = this.nextTimeStr;
            this.prepareNextTimeString(currentTime);
        }

        this.currentTime = currentTime;
        return currentTime;
    }

    /**
     * Asynchronously prepares the string representation of the next second's time.
     *
     * @param {Date} currentTime The current time from which the next time string is calculated.
     */
    async prepareNextTimeString(currentTime) {
        const nextTime = new Date(currentTime.getTime() + 1000);
        this.nextTimeStr = await this.generateTimeStringAsync(nextTime);
    }

    /**
     * Asynchronously generates a string representation of the provided time.
     * 
     * @param {Date} time The time to be formatted into a string.
     * @returns {Promise<string>} A promise that resolves with the formatted time string.
     */
    async generateTimeStringAsync(time) {
        return new Promise(resolve => {
            let digitalTime = time.toLocaleTimeString(language, {
                hour12: !useTwentyFourHour,
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit'
            });
            digitalTime = digitalTime.replace(/^24/, '00');

            resolve(`\u007C\u200B${digitalTime}\u200B\u007C`);
        });
    }

    /**
     * Generates a string representation of the provided time, intended for immediate display.
     *
     * @param {Date} time The time to be formatted into a string.
     * @returns {string} The formatted time string.
     */
    generateTimeString(time) {
        let digitalTime = time.toLocaleTimeString(language, {
            hour12: !useTwentyFourHour,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        });
        digitalTime = digitalTime.replace(/^24/, '00');

        return `\u007C\u200B${digitalTime}\u200B\u007C`;
    }
}

export const timeManager = new TimeManager();
