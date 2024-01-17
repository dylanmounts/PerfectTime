class TimeManager {
    constructor() {
        this.perfectTimeEndpoint = 'https://perfecttime.org/api/time'
        this.perfectTime = null;
        this.userTime = null;
        this.timeOffset = null;
    }

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

    getCurrentTime() {
        if (!this.perfectTime) {
            return new Date();
        }
        const corrected_now = Date.now() + this.timeOffset;
        return new Date(corrected_now);
    }
}

export const timeManager = new TimeManager();
