const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    session: 0,
};

let interval


const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
    const {
        action
    } = mainButton.dataset;
    if (action === 'start') {
        startTimer();
    } else {
        stopTimer();
    }
});


//Create a listener for the buttons
const modeButtons = document.querySelector('#js-mode-buttons')
modeButtons.addEventListener('click', handleMode)

function handleMode(event) {
    const {
        mode
    } = event.target.dataset
    if (!mode) {
        return
    }

    switchMode(mode)
    stopTimer();
}

function switchMode(mode) {
    //Adds new feature to the object timer which is the working mode
    timer.mode = mode;
    //Adds new feature to the object timer which is the time of the timer
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    };

    document
        .querySelectorAll('button[data-mode]')
        .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;

    updateClock();
}

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return {
        total,
        minutes,
        seconds,
    };
}

function startTimer() {
    let {
        total
    } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    if (timer.mode === 'pomodoro') timer.sessions++;

    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    interval = setInterval(function () {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();
        total = timer.remainingTime.total;
        if (total <= 0) {
            clearInterval(interval);
            switch (timer.mode) {
                case 'pomodoro':
                    if (timer.sessions % timer.longBreakInterval === 0) {
                        switchMode('longBreak');
                    } else {
                        switchMode('shortBreak');
                    }
                    break;
                default:
                    switchMode('pomodoro');
            }
            startTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);

    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
}

function updateClock() {
    const {
        remainingTime
    } = timer;

    //Padding of the number to keep it consistent 
    // 8:00 --> 08:00 or (Keep it the same)12:00 --> 12:00
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');

    min.textContent = minutes;
    sec.textContent = seconds;
}

document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
});