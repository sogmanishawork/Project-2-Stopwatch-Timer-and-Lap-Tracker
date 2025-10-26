// Enhanced Theme Toggle
const toggleButton = document.getElementById('toggle-theme');
const body = document.body;

// Check if user has a saved preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.className = savedTheme;
    updateToggleButton(savedTheme);
} else {
    body.classList.add('dark-mode');
    updateToggleButton('dark-mode');
}

toggleButton.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        updateToggleButton('light-mode');
        localStorage.setItem('theme', 'light-mode');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        updateToggleButton('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    }
});

function updateToggleButton(theme) {
    if (theme === 'dark-mode') {
        toggleButton.innerHTML = '☀️ Toggle Day Mode';
    } else {
        toggleButton.innerHTML = '🌙 Toggle Night Mode';
    }
}

// Rest of your existing JavaScript code below...




// Stopwatch Logic
let stopwatchInterval = null;
let stopwatchTime = 0;
let stopwatchRunning = false;

const stopwatchDisplay = document.getElementById('stopwatch-display');
const startStopwatchBtn = document.getElementById('start-stopwatch');
const stopStopwatchBtn = document.getElementById('stop-stopwatch');
const resetStopwatchBtn = document.getElementById('reset-stopwatch');
const lapStopwatchBtn = document.getElementById('lap-stopwatch');

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}

function formatTimeShort(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function updateStopwatchDisplay() {
    stopwatchDisplay.textContent = formatTime(stopwatchTime);
}

function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        const startTime = Date.now() - stopwatchTime;
        
        stopwatchInterval = setInterval(() => {
            stopwatchTime = Date.now() - startTime;
            updateStopwatchDisplay();
        }, 10);
        
        startStopwatchBtn.textContent = 'Resume';
    }
}

function stopStopwatch() {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
}

function resetStopwatch() {
    stopStopwatch();
    stopwatchTime = 0;
    updateStopwatchDisplay();
    startStopwatchBtn.textContent = 'Start';
}

function addLap() {
    if (stopwatchTime === 0) return;
    
    const lapList = document.getElementById('lap-list');
    const noLaps = lapList.querySelector('.no-laps');
    if (noLaps) noLaps.remove();
    
    const lapCount = lapList.querySelectorAll('.lap-item').length + 1;
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.innerHTML = `
        <span><strong>Lap ${lapCount}</strong></span>
        <span>${formatTime(stopwatchTime)}</span>
    `;
    
    lapList.insertBefore(lapItem, lapList.firstChild);
}

startStopwatchBtn.addEventListener('click', startStopwatch);
stopStopwatchBtn.addEventListener('click', stopStopwatch);
resetStopwatchBtn.addEventListener('click', resetStopwatch);
lapStopwatchBtn.addEventListener('click', addLap);

// Timer Logic
let timerInterval = null;
let timerTime = 0;
let timerTotalTime = 0;
let timerRunning = false;

const timerDisplay = document.getElementById('timer-display');
const timerMinutesInput = document.getElementById('timer-minutes');
const timerSecondsInput = document.getElementById('timer-seconds');
const setTimerBtn = document.getElementById('set-timer');
const startTimerBtn = document.getElementById('start-timer');
const stopTimerBtn = document.getElementById('stop-timer');
const resetTimerBtn = document.getElementById('reset-timer');
const timerProgressBar = document.getElementById('timer-progress-bar');
const timerSound = document.getElementById('timer-sound');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');

function updateTimerDisplay() {
    timerDisplay.textContent = formatTimeShort(timerTime);
    
    if (timerTotalTime > 0) {
        const progress = ((timerTotalTime - timerTime) / timerTotalTime) * 100;
        timerProgressBar.style.width = `${progress}%`;
    }
}

function setTimer() {
    const minutes = parseInt(timerMinutesInput.value) || 0;
    const seconds = parseInt(timerSecondsInput.value) || 0;
    
    timerTime = (minutes * 60 + seconds) * 1000;
    timerTotalTime = timerTime;
    updateTimerDisplay();
    timerProgressBar.style.width = '0%';
}

function startTimer() {
    if (timerTime === 0) {
        showNotification('Please set a timer first!', '#f44336');
        return;
    }
    
    if (!timerRunning) {
        timerRunning = true;
        const startTime = Date.now();
        const initialTime = timerTime;
        
        timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            timerTime = Math.max(0, initialTime - elapsed);
            updateTimerDisplay();
            
            if (timerTime === 0) {
                stopTimer();
                showNotification('⏰ Timer Complete!', '#4CAF50');
                playTimerSound();
            }
        }, 10);
    }
}

function stopTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    timerTime = timerTotalTime;
    updateTimerDisplay();
    timerProgressBar.style.width = '0%';
}

function playTimerSound() {
    timerSound.play().catch(e => console.log('Audio play failed:', e));
}

function showNotification(message, color = '#4CAF50') {
    notificationText.textContent = message;
    notification.style.background = color;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

setTimerBtn.addEventListener('click', setTimer);
startTimerBtn.addEventListener('click', startTimer);
stopTimerBtn.addEventListener('click', stopTimer);
resetTimerBtn.addEventListener('click', resetTimer);

// Lap Tracker
const clearLapsBtn = document.getElementById('clear-laps');
const exportLapsBtn = document.getElementById('export-laps');

function clearLaps() {
    const lapList = document.getElementById('lap-list');
    lapList.innerHTML = '<p class="no-laps">No laps recorded yet</p>';
}

function exportLaps() {
    const lapList = document.getElementById('lap-list');
    const lapItems = lapList.querySelectorAll('.lap-item');
    
    if (lapItems.length === 0) {
        showNotification('No laps to export!', '#f44336');
        return;
    }
    
    let csv = 'Lap Number,Time\n';
    lapItems.forEach((item, index) => {
        const lapNum = lapItems.length - index;
        const time = item.querySelector('span:last-child').textContent;
        csv += `Lap ${lapNum},${time}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lap-tracker-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('✅ Laps exported successfully!', '#4CAF50');
}

clearLapsBtn.addEventListener('click', clearLaps);
exportLapsBtn.addEventListener('click', exportLaps);

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    switch(e.key.toLowerCase()) {
        case 's':
            if (stopwatchRunning) {
                stopStopwatch();
            } else {
                startStopwatch();
            }
            break;
        case 'r':
            resetStopwatch();
            break;
        case 'l':
            addLap();
            break;
        case 't':
            if (timerRunning) {
                stopTimer();
            } else {
                startTimer();
            }
            break;
    }
});



