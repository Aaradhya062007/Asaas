// Movies Dynamic Filter AJAX JS
document.addEventListener("DOMContentLoaded", function () {
  const filterForm = document.getElementById("movie-filter-form");
  if (!filterForm) return;

  const inputs = filterForm.querySelectorAll("select, input");
  inputs.forEach((input) => {
    input.addEventListener("change", function () {
      const formData = new FormData(filterForm);
      const params = new URLSearchParams(formData);

      fetch(`/api/filter-count/?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          const badge = document.getElementById("match-count-badge");
          if (badge && data.count !== undefined) {
            badge.textContent = `${data.count} Movies Found`;
          }
        });
    });
  });
});
