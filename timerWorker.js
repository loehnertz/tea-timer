let timerInterval;
let timeRemaining;

/**
 * Reacts to messages to the Web Worker and starts, stops, or resets the timer.
 * @param {Object} event - The message event.
 */
self.onmessage = function (event) {
    const {command, payload} = event.data;

    switch (command) {
        case 'start':
            startTimer(payload);
            break;
        case 'stop':
            stopTimer();
            break;
        case 'reset':
            resetTimer(payload);
            break;
    }
};

/**
 * Starts the timer with the given initial time.
 * @param initialTime - The initial time to start the timer with.
 */
function startTimer({initialTime}) {
    timeRemaining = initialTime;
    timerInterval = setInterval(() => {
        timeRemaining = parseFloat((timeRemaining - 0.1).toFixed(1));
        if (timeRemaining <= 0) {
            timeRemaining = 0;
            clearInterval(timerInterval);
            self.postMessage({command: 'end', timeRemaining});
        } else {
            self.postMessage({command: 'tick', timeRemaining});
        }
    }, 100);
}

/**
 * Stops the timer by pausing it.
 */
function stopTimer() {
    clearInterval(timerInterval);
}

/**
 * Resets the timer to the given initial time.
 * @param initialTime - The initial time to reset the timer to.
 */
function resetTimer({initialTime}) {
    clearInterval(timerInterval);
    timeRemaining = initialTime;
    self.postMessage({command: 'reset', timeRemaining});
}
