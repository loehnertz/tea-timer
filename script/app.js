new Vue({
    el: '#app',
    data: {
        infusionCount: 1,
        initialTime: 20, // Default initial time
        incrementTime: 5, // Default increment time
        offsetTime: 0,
        timeRemaining: 0,
        timerRunning: false,
        timerProgressPercent: 0,
        timerProgressBarColor: 'is-primary',
        selectedPreset: '',
        showSettings: true,
        beepWarningPlayed: false,
        wakeLockActive: false,
        wakeLock: null,
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
            {name: 'Dark (ripe)', waterTemp: 99, amount: 5, firstInfusion: 10, additionalInfusions: 5},
        ],
        chineseTeaProverbs: [
            "一日无茶苦，长年无茶老。 (A day without tea is bitter; a lifetime without tea is unbearable.)",
            "茶余酒后事。 (Talks over tea can continue even after the wine is finished.)",
            "茶不饮不知味。 (You won't know the real taste of tea until you drink it.)",
            "茶香以静制。 (The fragrance of tea is best appreciated in tranquility.)",
            "水为茶之母。 (Water is the mother of tea.)",
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
        selectedPreset(newValue) {
            if (newValue) {
                this.initialTime = newValue.firstInfusion;
                this.incrementTime = newValue.additionalInfusions;
            } else if (this.storedSettings) {
                this.initialTime = this.storedSettings.initialTime;
                this.incrementTime = this.storedSettings.incrementTime;
            }
            this.resetTimer();
        },
        /**
         * Watches for changes to the infusion count and persists the new value to local storage.
         */
        infusionCount(newValue) {
            if (!newValue || this.showSettings) return;

            const storedSettings = this.storedSettings;
            storedSettings.infusionCount = newValue;
            this.persistSettings(storedSettings);
        },
        /**
         * Watches for changes to the initial time and persists the new value to local storage.
         */
        initialTime(newValue) {
            if (!newValue || this.showSettings) return;

            const storedSettings = this.storedSettings;
            storedSettings.initialTime = newValue;
            this.persistSettings(storedSettings);
        },
        /**
         * Watches for changes to the increment time and persists the new value to local storage.
         */
        incrementTime(newValue) {
            if (!newValue || this.showSettings) return;

            const storedSettings = this.storedSettings;
            storedSettings.incrementTime = newValue;
            this.persistSettings(storedSettings);
        },
        /**
         * Watches for changes to the offset time and updates the time remaining.
         */
        offsetTime() {
            this.timeRemaining = parseFloat(this.infusionTime.toFixed(1));
        },
        /**
         * Watches for changes to the time remaining and updates the window title.
         */
        timeRemaining() {
            this.updateWindowTitle();
        },
        /**
         * Watches for changes to the timer running state and requests or releases the wake lock accordingly.
         */
        async timerRunning(isRunning) {
            if (isRunning) {
                await this.requestWakeLock();
            } else {
                await this.releaseWakeLock();
            }
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
        toggleStartStop() {
            if (!this.timerRunning) {
                this.startTimer();
            } else {
                this.resetTimer();
            }
        },
        /**
         * Starts the timer with the current `timeRemaining`.
         */
        startTimer() {
            this.timerWorker.postMessage({command: 'start', payload: {initialTime: this.timeRemaining}});
        },
        /**
         * Stops the timer without resetting the `timeRemaining`.
         */
        stopTimer() {
            this.timerWorker.postMessage({command: 'stop', payload: {initialTime: this.timeRemaining}});
        },
        /**
         * Resets the timer to the current `infusionTime`.
         */
        resetTimer() {
            this.timerWorker.postMessage({command: 'reset', payload: {initialTime: this.infusionTime}});
        },
        /**
         * Moves to the previous infusion if possible and resets the timer.
         */
        previousInfusion() {
            if (this.infusionCount > 1) {
                this.infusionCount--;
                this.resetTimer();
            }
        },
        /**
         * Skips to the next infusion and resets the timer.
         */
        nextInfusion() {
            this.infusionCount++;
            this.resetTimer();
        },
        /**
         * Adjusts the offset time by a given percentage.
         * @param {number} percentage - The percentage to adjust the offset time by.
         */
        adjustOffsetByPercentage(percentage) {
            this.offsetTime = (this.incrementTime * percentage) / 100;
        },
        /**
         * Calculates the elapsed time as a percentage.
         *
         * @param {number} currentTime - The current time in a consistent unit of measure.
         * @param {number} totalTime - The total time in the same unit as currentTime.
         * @return {number} The percentage of time elapsed.
         */
        calculateTimeElapsed(currentTime, totalTime) {
            if (totalTime === 0) {
                // Avoid division by zero, and if totalTime is zero, we consider it as 100% completed.
                console.error('Total time cannot be zero.');
                return 100;
            }

            if (currentTime > totalTime) {
                // If current time exceeds total time, cap the percentage at 100%
                return 100;
            }

            return (currentTime / totalTime) * 100;
        },
        /**
         * Confirms the current settings and initializes the session.
         */
        confirmSettings() {
            this.infusionCount = 1;
            this.offsetTime = 0;

            const settings = {
                infusionCount: this.infusionCount,
                initialTime: this.initialTime,
                incrementTime: this.incrementTime,
            };
            this.persistSettings(settings);

            this.resetTimer();

            this.showSettings = false;
        },
        /**
         * Confirms the return to settings and discards the current session.
         */
        confirmBackToSettings() {
            if (confirm('Are you sure you want to discard the current session and return to settings?')) {
                this.backToSettings();
            }
        },
        /**
         * Returns to settings, discarding the current session from local storage.
         */
        backToSettings() {
            localStorage.removeItem('settings');

            document.title = 'Gong Fu Tea Timer';

            this.showSettings = true;
        },
        /**
         * Loads the session data from the local storage and initializes the timer.
         */
        loadSession() {
            if (this.storedSettings) {
                this.showSettings = false;
                this.infusionCount = this.storedSettings.infusionCount;
                this.initialTime = this.storedSettings.initialTime;
                this.incrementTime = this.storedSettings.incrementTime;
            }
            this.resetTimer();
        },
        /**
         * Persists the settings to local storage.
         * Reloads the page if the settings are invalid.
         * @param {object} settings - The settings to persist.
         */
        persistSettings(settings) {
            if (!settings || settings.infusionCount < 1 || settings.initialTime < 1 || settings.incrementTime < 1) {
                this.backToSettings();
                location.reload();
                return;
            }
            localStorage.setItem('settings', JSON.stringify(settings));
        },
        /**
         * Requests a wake lock to prevent the screen from sleeping.
         */
        async requestWakeLock() {
            if (this.wakeLockActive) return;
            try {
                this.wakeLock = await navigator.wakeLock.request('screen');
                this.wakeLock.addEventListener('release', () => {
                    this.wakeLockActive = false;
                });
                this.wakeLockActive = true;
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        },
        /**
         * Releases the wake lock if it is active to allow the screen to sleep.
         */
        async releaseWakeLock() {
            if (this.wakeLock !== null) {
                await this.wakeLock.release();
                this.wakeLock = null;
                this.wakeLockActive = false;
            }
        },
        /**
         * Returns a random Chinese tea proverb.
         */
        getRandomTeaProverb() {
            const index = Math.floor(Math.random() * this.chineseTeaProverbs.length);
            return this.chineseTeaProverbs[index];
        },
        /**
         * Handles keydown events for the timer.
         * @param {KeyboardEvent} event - The keydown event.
         */
        handleKeydown(event) {
            switch (event.code) {
                case 'Space':
                    event.preventDefault();
                    this.toggleStartStop();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    this.previousInfusion();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    this.nextInfusion();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (!this.timerRunning) {
                        this.offsetTime += 1;
                    }
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    if (!this.timerRunning) {
                        if (this.offsetTime > 0) {
                            this.offsetTime -= 1;
                        }
                    }
                    break;
                case 'Backspace':
                    event.preventDefault();
                    this.confirmBackToSettings();
                    break;
            }
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

            this.timerProgressPercent = this.calculateTimeElapsed(this.infusionTime - timeRemaining, this.infusionTime);

            switch (command) {
                case 'tick':
                    this.timerRunning = true;

                    this.timeRemaining = timeRemaining;

                    if (this.timeRemaining <= 5 && !this.beepWarningPlayed) {
                        this.beepWarningPlayed = true;
                        this.timerProgressBarColor = 'is-warning';
                        await this.beepWarning.play();
                    }

                    break;
                case 'end':
                    this.initialTime += this.offsetTime;
                    this.offsetTime = 0;

                    await this.beepEnd.play();

                    // This also resets the timer via a web worker event
                    this.nextInfusion();

                    console.log(`Enjoy your tea: ${this.getRandomTeaProverb()}`);

                    break;
                case 'reset':
                    this.timerRunning = false;

                    this.timeRemaining = timeRemaining;

                    this.timerProgressBarColor = 'is-primary';
                    this.beepWarningPlayed = false;

                    break;
            }
        },
    },
    async mounted() {
        this.timerWorker = new Worker('./script/timerWorker.js');
        this.timerWorker.onmessage = async (e) => await this.handleWorkerMessage(e);

        this.loadSession();

        window.addEventListener('keydown', (e) => this.handleKeydown(e));

        this.$el.classList.remove('is-hidden');
    },
    async beforeDestroy() {
        window.removeEventListener('keydown', (e) => this.handleKeydown(e));

        await this.releaseWakeLock();
    },
});
