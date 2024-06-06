new Vue({
    el: '#app',
    data: {
        initialTime: 20, // Default initial time
        incrementTime: 5, // Default increment time
        offsetTime: 0,
        infusionCount: 1,
        timeRemaining: 0,
        timerRunning: false,
        selectedPreset: "",
        showSettings: true,
        presets: [
            {name: 'White', waterTemp: 85, amount: 3.5, firstInfusion: 20, additionalInfusions: 10},
            {name: 'Green', waterTemp: 80, amount: 3, firstInfusion: 15, additionalInfusions: 3},
            {name: 'Yellow', waterTemp: 85, amount: 3.5, firstInfusion: 15, additionalInfusions: 5},
            {name: 'Oolong (strip)', waterTemp: 99, amount: 4.5, firstInfusion: 20, additionalInfusions: 5},
            {name: 'Oolong (ball)', waterTemp: 99, amount: 6, firstInfusion: 25, additionalInfusions: 5},
            {name: 'Black (small leaf)', waterTemp: 90, amount: 4.5, firstInfusion: 10, additionalInfusions: 5},
            {name: 'Black (large leaf)', waterTemp: 95, amount: 4, firstInfusion: 15, additionalInfusions: 5},
            {name: 'Dark (raw)', waterTemp: 95, amount: 5, firstInfusion: 10, additionalInfusions: 3},
            {name: 'Dark (ripe)', waterTemp: 99, amount: 5, firstInfusion: 10, additionalInfusions: 5}
        ],
        positivePercentageAdjustments: [10, 25, 50],
        negativePercentageAdjustments: [10, 25, 50].reverse(),
        beepWarning: new Audio('./audio/sonar_low.mp3'),
        beepEnd: new Audio('./audio/sonar_high.mp3'),
        beepWarningPlayed: false,
        worker: null,
    },
    computed: {
        nextInfusionTime() {
            const baseTime = this.initialTime + this.incrementTime * (this.infusionCount - 1);
            return baseTime + this.offsetTime;
        },
        storedSettings() {
            return JSON.parse(localStorage.getItem('customSettings'));
        }
    },
    watch: {
        async selectedPreset(newValue) {
            if (newValue) {
                this.initialTime = newValue.firstInfusion;
                this.incrementTime = newValue.additionalInfusions;
            } else if (this.storedSettings) {
                this.initialTime = this.storedSettings.initialTime;
                this.incrementTime = this.storedSettings.incrementTime;
            }
            await this.resetTimer();
        },
        offsetTime() {
            if (!this.timerRunning) {
                this.timeRemaining = parseFloat(this.nextInfusionTime.toFixed(1));
                this.updateDisplay();
            }
        },
        async infusionCount() {
            await this.resetTimer();
        },
    },
    methods: {
        /**
         * Updates the document title to display the remaining time.
         */
        updateDisplay() {
            document.title = `🍵 ${Math.round(this.timeRemaining)} - Gong Fu Tea Timer`;
        },
        /**
         * Resets the timer, clearing any intervals and setting `timeRemaining` to `nextInfusionTime`.
         */
        async resetTimer() {
            this.worker.postMessage({command: 'reset', payload: {initialTime: this.nextInfusionTime}});
            this.timerRunning = false;
            this.updateDisplay();
        },
        /**
         * Toggles the timer between start and stop states.
         */
        async toggleStartStop() {
            if (this.timerRunning) {
                await this.stopTimer();
            } else {
                await this.startTimer();
            }
        },
        /**
         * Starts the timer, decrementing `timeRemaining` at regular intervals.
         */
        async startTimer() {
            this.timerRunning = true;
            this.worker.postMessage({command: 'start', payload: {initialTime: this.timeRemaining}});
        },
        /**
         * Stops the timer.
         */
        async stopTimer() {
            this.timerRunning = false;
            this.worker.postMessage({command: 'stop'});
        },
        /**
         * Moves to the previous infusion if possible and resets the timer.
         */
        async previousInfusion() {
            if (this.infusionCount > 1) {
                this.infusionCount--;
                localStorage.setItem('infusionCount', this.infusionCount);
                await this.resetTimer();
            }
        },
        /**
         * Skips to the next infusion and resets the timer.
         */
        async skipInfusion() {
            this.infusionCount++;
            localStorage.setItem('infusionCount', this.infusionCount);
            await this.resetTimer();
        },
        /**
         * Confirms the current settings and resets the session.
         */
        async confirmSettings() {
            const customSettings = {
                initialTime: this.initialTime,
                incrementTime: this.incrementTime
            };
            localStorage.setItem('customSettings', JSON.stringify(customSettings));
            this.showSettings = false;
            this.infusionCount = 1;
            localStorage.setItem('infusionCount', this.infusionCount);
            await this.resetTimer();
        },
        /**
         * Returns to settings, discarding the current session.
         */
        backToSettings() {
            if (confirm('Are you sure you want to discard the current session and return to settings?')) {
                if (this.worker) this.worker.terminate();
                this.offsetTime = 0;
                localStorage.removeItem('infusionCount');
                this.showSettings = true;
                document.title = "🍵 Gong Fu Tea Timer";
            }
        },
        /**
         * Adjusts the offset time by a given percentage.
         * @param {number} percentage - The percentage to adjust the offset time by.
         */
        adjustOffsetByPercentage(percentage) {
            if (!this.timerRunning) {
                this.offsetTime = (this.incrementTime * percentage) / 100;
                this.timeRemaining = parseFloat(this.nextInfusionTime.toFixed(1));
                this.updateDisplay();
            }
        },
        /**
         * Loads the session data from the local storage and initializes the timer.
         */
        async loadSession() {
            const storedInfusionCount = localStorage.getItem('infusionCount');
            if (storedInfusionCount !== null) {
                this.infusionCount = parseInt(storedInfusionCount);
                this.showSettings = false;
            }
            if (this.storedSettings) {
                this.initialTime = this.storedSettings.initialTime;
                this.incrementTime = this.storedSettings.incrementTime;
            }
            await this.resetTimer();
        },
        /**
         * Handles messages received from the Web Worker.
         * @param {MessageEvent} e - The message event from the Web Worker.
         */
        async handleWorkerMessage(e) {
            const {command, timeRemaining} = e.data;
            if (command === 'tick') {
                this.timeRemaining = timeRemaining;
                this.updateDisplay();
                if (this.timeRemaining <= 4 && !this.beepWarningPlayed) {
                    await this.beepWarning.play();
                    this.beepWarningPlayed = true;
                }
            } else if (command === 'end') {
                await this.beepEnd.play();
                this.beepWarningPlayed = false;
                this.infusionCount++;
                this.initialTime += this.offsetTime;
                this.offsetTime = 0;
                localStorage.setItem('infusionCount', this.infusionCount);
                await this.resetTimer();
            } else if (command === 'reset') {
                this.timeRemaining = timeRemaining;
                this.beepWarningPlayed = false;
                this.updateDisplay();
            }
        },
    },
    async mounted() {
        this.worker = new Worker('./timerWorker.js');
        this.worker.onmessage = await this.handleWorkerMessage;
        await this.beepWarning.load();
        await this.beepEnd.load();
        await this.loadSession();
    },
});
