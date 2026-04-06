// Global variables
let intervalId;
let vibrationLoopId;
let countdownId;

let isRunning = false;
let remainingTime = 0;


// Vibration patterns
function getVibrationPattern(intensity) {
    if (intensity === "low") return [200, 100, 200];
    if (intensity === "medium") return [400, 200, 400];
    if (intensity === "high") return [800, 300, 800];
}


// Start function
function startVibration() {

    let interval = parseInt(document.getElementById("interval").value);
    let intensity = document.getElementById("intensity").value;
    let startTime = document.getElementById("startTime").value;
    let endTime = document.getElementById("endTime").value;

    if (!interval || interval <= 0 || !startTime || !endTime) {
        alert("Enter all valid inputs");
        return;
    }

    let pattern = getVibrationPattern(intensity);
    isRunning = true;

    document.getElementById("status").innerText = "Status: Running";

    // Start countdown
    startCountdown(interval);

    // Main interval loop
    intervalId = setInterval(() => {

        let now = new Date();

        let start = new Date();
        let end = new Date();

        let [sh, sm] = startTime.split(":");
        let [eh, em] = endTime.split(":");

        start.setHours(sh, sm, 0);
        end.setHours(eh, em, 0);

        if (now >= start && now <= end && isRunning) {

            // Continuous vibration loop
            vibrationLoopId = setInterval(() => {
                if (navigator.vibrate && isRunning) {
                    navigator.vibrate(pattern);
                }
            }, 700);

            // Stop vibration after interval
            setTimeout(() => {
                clearInterval(vibrationLoopId);
            }, interval * 1000);
        }

        // Restart countdown every interval
        startCountdown(interval);

    }, interval * 1000);
}


// Countdown function
function startCountdown(seconds) {

    clearInterval(countdownId);

    remainingTime = seconds;

    updateCountdownDisplay();

    countdownId = setInterval(() => {
        remainingTime--;

        updateCountdownDisplay();

        if (remainingTime <= 0) {
            clearInterval(countdownId);
        }
    }, 1000);
}


// Update countdown on screen
function updateCountdownDisplay() {
    document.getElementById("countdown").innerText =
        "Next vibration in: " + remainingTime + " sec";
}


// Stop function
function stopVibration() {
    isRunning = false;

    clearInterval(intervalId);
    clearInterval(vibrationLoopId);
    clearInterval(countdownId);

    if (navigator.vibrate) {
        navigator.vibrate(0);
    }

    document.getElementById("status").innerText = "Status: Stopped";
    document.getElementById("countdown").innerText = "";
}
