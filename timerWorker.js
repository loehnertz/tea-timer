let timerInterval;
let timeRemaining;

self.onmessage = function (e) {
    const {command, payload} = e.data;

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

function startTimer({initialTime}) {
    timeRemaining = initialTime;
    timerInterval = setInterval(() => {
        timeRemaining = parseFloat((timeRemaining - 0.1).toFixed(1));
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timeRemaining = 0;
            self.postMessage({command: 'end', timeRemaining});
        } else {
            self.postMessage({command: 'tick', timeRemaining});
        }
    }, 100);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer({initialTime}) {
    clearInterval(timerInterval);
    timeRemaining = initialTime;
    self.postMessage({command: 'reset', timeRemaining});
}
