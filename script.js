
// Global variables
let intervalTimer;
let vibrationTimer;
let isRunning = false;


// Vibration patterns
function getVibrationPattern(intensity) {
    if (intensity === "low") return [200, 100, 200];
    if (intensity === "medium") return [400, 200, 400];
    if (intensity === "high") return [800, 300, 800];
}


// Start function
function startVibration() {

    let intervalMin = parseFloat(document.getElementById("interval").value);
    let intensity = document.getElementById("intensity").value;
    let startTime = document.getElementById("startTime").value;
    let endTime = document.getElementById("endTime").value;

    if (!intervalMin || intervalMin <= 0 || !startTime || !endTime) {
        alert("Enter valid inputs");
        return;
    }

    let intervalMs = intervalMin * 60 * 1000; // minutes → ms
    let pattern = getVibrationPattern(intensity);

    isRunning = true;

    document.getElementById("status").innerText = "Status: Waiting for next alert...";

    // Main interval loop
    intervalTimer = setInterval(() => {

        let now = new Date();

        let start = new Date();
        let end = new Date();

        let [sh, sm] = startTime.split(":");
        let [eh, em] = endTime.split(":");

        start.setHours(sh, sm, 0);
        end.setHours(eh, em, 0);

        // Only trigger if within time range
        if (now >= start && now <= end && isRunning) {

            // Start continuous vibration
            startContinuousVibration(pattern);

        }

    }, intervalMs);
}


// Function to start continuous vibration
function startContinuousVibration(pattern) {

    document.getElementById("status").innerText = "Status: Vibrating... Press STOP";

    // Prevent multiple loops
    clearInterval(vibrationTimer);

    vibrationTimer = setInterval(() => {
        if (navigator.vibrate && isRunning) {
            navigator.vibrate(pattern);
        }
    }, 800); // repeat vibration every 0.8 sec
}


// STOP function
function stopVibration() {

    // Stop vibration ONLY (not interval timer)
    clearInterval(vibrationTimer);

    if (navigator.vibrate) {
        navigator.vibrate(0);
    }

    document.getElementById("status").innerText = "Status: Waiting for next alert...";
}


// OPTIONAL: Full reset (if you want separate button)
function fullStop() {
    isRunning = false;

    clearInterval(intervalTimer);
    clearInterval(vibrationTimer);

    if (navigator.vibrate) {
        navigator.vibrate(0);
    }

    document.getElementById("status").innerText = "Status: Stopped";
}
