// Interactive Seat Map & Real-Time Polling JS
document.addEventListener("DOMContentLoaded", function () {
  const seatButtons = document.querySelectorAll(".seat-btn.available");
  let selectedSeats = new Set();

  seatButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const seatId = this.dataset.seatId;
      if (selectedSeats.has(seatId)) {
        selectedSeats.delete(seatId);
        this.classList.remove("selected");
      } else {
        selectedSeats.add(seatId);
        this.classList.add("selected");
      }
      updateTotal();
    });
  });

  function updateTotal() {
    const totalEl = document.getElementById("selected-total-amount");
    const countEl = document.getElementById("selected-seat-count");
    if (countEl) countEl.textContent = selectedSeats.size;
  }
});
