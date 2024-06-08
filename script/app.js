new Vue({
    el: '#app',
    data: {
        infusionCount: 1,
        initialTime: 20, // Default initial time
        incrementTime: 5, // Default increment time
        offsetTime: 0,
        timeRemaining: 0,
        timerRunning: false,
        selectedPreset: "",
        showSettings: true,
        beepWarningPlayed: false,
        timerWorker: null,
        beepEnd: new Audio('./audio/sonar_high.mp3'),
        beepWarning: new Audio('./audio/sonar_low.mp3'),
        positivePercentageAdjustments: [10, 25, 50],
        negativePercentageAdjustments: [10, 25, 50].reverse(),  // Reverse the array to display the buttons in the correct order
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
    },
    computed: {
        /**
         * Calculates the infusion time based on the initial time, increment time, and offset time.
         */
        infusionTime() {
            const baseTime = this.initialTime + this.incrementTime * (this.infusionCount - 1);
            return baseTime + this.offsetTime;
        },
        /**
         * Returns the settings stored in local storage.
         */
        storedSettings() {
            return JSON.parse(localStorage.getItem('settings'));
        }
    },
    watch: {
        /**
         * Watches for changes to the selected preset and updates the initial and increment times accordingly.
         */
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
        /**
         * Watches for changes to the infusion count and persists the new value to local storage.
         */
        infusionCount(newValue) {
            const storedSettings = this.storedSettings;
            storedSettings.infusionCount = newValue;
            this.persistSettings(storedSettings);
        },
        /**
         * Watches for changes to the initial time and persists the new value to local storage.
         */
        initialTime(newValue) {
            const storedSettings = this.storedSettings;
            storedSettings.initialTime = newValue;
            this.persistSettings(storedSettings);
        },
        /**
         * Watches for changes to the increment time and persists the new value to local storage.
         */
        incrementTime(newValue) {
            const storedSettings = this.storedSettings;
            storedSettings.incrementTime = newValue;
            this.persistSettings(storedSettings);
        },
    },
    methods: {
        /**
         * Updates the document title to display the remaining time.
         */
        updateWindowTitle() {
            document.title = `${Math.round(this.timeRemaining)} - Gong Fu Tea Timer`;
        },
        /**
         * Toggles the timer between start and stop states.
         */
        async toggleStartStop() {
            if (!this.timerRunning) {
                await this.startTimer();
            } else {
                await this.resetTimer();
            }
        },
        /**
         * Starts the timer with the current `timeRemaining`.
         */
        async startTimer() {
            this.timerWorker.postMessage({command: 'start', payload: {initialTime: this.timeRemaining}});
        },
        /**
         * Stops the timer without resetting the `timeRemaining`.
         */
        async stopTimer() {
            this.timerWorker.postMessage({command: 'stop', payload: {initialTime: this.timeRemaining}});
        },
        /**
         * Resets the timer to the current `infusionTime`.
         */
        async resetTimer() {
            this.timerWorker.postMessage({command: 'reset', payload: {initialTime: this.infusionTime}});
        },
        /**
         * Moves to the previous infusion if possible and resets the timer.
         */
        async previousInfusion() {
            if (this.infusionCount > 1) {
                this.infusionCount--;
                await this.resetTimer();
            }
        },
        /**
         * Skips to the next infusion and resets the timer.
         */
        async nextInfusion() {
            this.infusionCount++;
            await this.resetTimer();
        },
        /**
         * Adjusts the offset time by a given percentage.
         * @param {number} percentage - The percentage to adjust the offset time by.
         */
        adjustOffsetByPercentage(percentage) {
            if (!this.timerRunning) {
                this.offsetTime = (this.incrementTime * percentage) / 100;
                this.timeRemaining = parseFloat(this.infusionTime.toFixed(1));
                this.updateWindowTitle();
            }
        },
        /**
         * Confirms the current settings and initializes the session.
         */
        async confirmSettings() {
            this.showSettings = false;

            this.infusionCount = 1;
            this.offsetTime = 0;

            const settings = {
                infusionCount: this.infusionCount,
                initialTime: this.initialTime,
                incrementTime: this.incrementTime,
            };
            this.persistSettings(settings);

            await this.resetTimer();
        },
        /**
         * Returns to settings, discarding the current session from local storage.
         */
        backToSettings() {
            if (confirm('Are you sure you want to discard the current session and return to settings?')) {
                this.showSettings = true;

                localStorage.removeItem('settings');

                document.title = "Gong Fu Tea Timer";
            }
        },
        /**
         * Loads the session data from the local storage and initializes the timer.
         */
        async loadSession() {
            if (this.storedSettings) {
                this.showSettings = false;
                this.infusionCount = this.storedSettings.infusionCount;
                this.initialTime = this.storedSettings.initialTime;
                this.incrementTime = this.storedSettings.incrementTime;
            }
            await this.resetTimer();
        },
        /**
         * Persists the settings to local storage.
         * @param {object} storedSettings - The settings to persist.
         */
        persistSettings(storedSettings) {
            localStorage.setItem('settings', JSON.stringify(storedSettings));
        },
        /**
         * Handles messages received from the Web Worker running the timer.
         * Steps to handle the message:
         * 1. Update the timerRunning and timeRemaining properties.
         * 2. Update the window title to display the remaining time.
         * 3. Play the warning beep if the timer is almost up OR play the end beep if the timer ended.
         * 4. Move to the next infusion if the timer ended.
         *
         * @param {MessageEvent} event - The message event from the Web Worker.
         */
        async handleWorkerMessage(event) {
            const {command, timeRemaining} = event.data;

            switch (command) {
                case 'tick':
                    this.timerRunning = true;
                    this.timeRemaining = timeRemaining;

                    this.updateWindowTitle();

                    if (this.timeRemaining <= 5 && !this.beepWarningPlayed) {
                        this.beepWarningPlayed = true;
                        await this.beepWarning.play();
                    }

                    break;
                case 'end':
                    this.initialTime += this.offsetTime;
                    this.offsetTime = 0;

                    await this.beepEnd.play();

                    // This also resets the timer via a web worker event
                    await this.nextInfusion();

                    break;
                case 'reset':
                    this.timerRunning = false;
                    this.timeRemaining = timeRemaining;

                    this.updateWindowTitle();

                    this.beepWarningPlayed = false;

                    break;
            }
        },
    },
    async mounted() {
        this.timerWorker = new Worker('./script/timerWorker.js');
        this.timerWorker.onmessage = await this.handleWorkerMessage;

        await this.beepWarning.load();
        await this.beepEnd.load();

        await this.loadSession();
    },
});
