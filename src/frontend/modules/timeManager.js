class TimeManager {
    constructor() {
        this.initialTime = null;
        this.userTime = null;
        this.timeOffset = null;
    }

    async fetchInitialTime(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.initialTime = new Date(data.time);
            this.userTime = new Date();
            this.timeOffset = this.initialTime - this.userTime;
        } catch (error) {
            console.error('Error fetching initial time:', error);
            this.initialTime = new Date();
            this.timeOffset = 0;
        }
    }

    getCurrentTime() {
        if (!this.initialTime) {
            return new Date();
        }
        const corrected_now = Date.now() + this.timeOffset;
        return new Date(corrected_now);
    }
}

export const timeManager = new TimeManager();
