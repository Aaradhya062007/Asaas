// Payment Countdown Timer & Form Dispatcher JS
document.addEventListener("DOMContentLoaded", function () {
  const timerElement = document.getElementById("hold-countdown");
  if (!timerElement) return;

  let seconds = parseInt(timerElement.dataset.seconds || "120", 10);

  const countdown = setInterval(() => {
    if (seconds <= 0) {
      clearInterval(countdown);
      alert("Your 2-minute seat hold expired. Please select your seats again.");
      window.location.reload();
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timerElement.textContent = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
      seconds--;
    }
  }, 1000);
});
