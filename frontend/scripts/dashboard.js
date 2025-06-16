document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("viewedProgramsContainer");
  const viewed = JSON.parse(localStorage.getItem("viewedPrograms")) || [];

  if (!container) return;

  if (viewed.length === 0) {
    container.innerHTML = "<p class='text-muted'>You haven’t viewed any programs yet.</p>";
    return;
  }

  container.innerHTML = viewed.map(p => `
    <div class="col-md-4 mb-4">
      <div class="card h-100">
        <img src="${p.image}" class="card-img-top" alt="${p.title}">
        <div class="card-body">
          <h5 class="card-title">${p.title}</h5>
          <p class="card-text">${p.description}</p>
          <a href="${p.link}" class="btn btn-outline-primary">View Again</a>
        </div>
      </div>
    </div>
  `).join('');
});
