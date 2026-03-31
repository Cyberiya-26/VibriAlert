
let intervalId;
let stopTimeout;
let countdownTimer;

let isRunning = false;
let remainingTime = 0; // seconds
let totalDurationSet = false;

function getVibrationPattern(intensity) {
    if (intensity === "low") return [200, 100, 200];
    if (intensity === "medium") return [400, 200, 400];
    if (intensity === "high") return [800, 200, 800];
}

function startVibration() {
    let intervalMin = parseInt(document.getElementById("interval").value);
    let durationHr = parseInt(document.getElementById("duration").value);
    let intensity = document.getElementById("intensity").value;

    if ((!intervalMin || intervalMin <= 0) || (!durationHr || durationHr <= 0 && !totalDurationSet)) {
        alert("Enter valid interval and duration");
        return;
    }

    let pattern = getVibrationPattern(intensity);

    let intervalMs = intervalMin * 60 * 1000;

    // First start
    if (!totalDurationSet) {
        remainingTime = durationHr * 3600;
        totalDurationSet = true;
    }

    isRunning = true;
    document.getElementById("status").innerText = "Status: Running";

    // 🔁 Interval vibration (NO nested loops now)
    intervalId = setInterval(() => {
        if (isRunning && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }, intervalMs);

    // ⏱ Auto stop
    stopTimeout = setTimeout(() => {
        stopVibration(true);
        alert("Time completed!");
    }, remainingTime * 1000);

    // ⏳ Countdown
    countdownTimer = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;

            let h = Math.floor(remainingTime / 3600);
            let m = Math.floor((remainingTime % 3600) / 60);
            let s = remainingTime % 60;

            document.getElementById("status").innerText =
                `Running - Time left: ${h}h ${m}m ${s}s`;
        }
    }, 1000);
}

function stopVibration(auto = false) {
    isRunning = false;

    clearInterval(intervalId);
    clearTimeout(stopTimeout);
    clearInterval(countdownTimer);

    navigator.vibrate(0); // stops vibration instantly

    if (!auto) {
        document.getElementById("status").innerText =
            `Paused - Time left: ${formatTime(remainingTime)}`;
    } else {
        document.getElementById("status").innerText = "Completed";
        totalDurationSet = false;
        remainingTime = 0;
    }
}

function formatTime(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
}
