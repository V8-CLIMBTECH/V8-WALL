// Firebase init (уже подключено в HTML)
const db = firebase.firestore();
let routes = [];

async function loadRoutes() {
  const snapshot = await db.collection("routes").get();
  routes = snapshot.docs.map(doc => doc.data());
  populateFilters();
  displayRoutes();
}

function populateFilters() {
  const sectorSelect = document.getElementById('sectorSelect');
  const difficultySelect = document.getElementById('difficultySelect');
  const authorSelect = document.getElementById('authorSelect');
  const dateSelect = document.getElementById('dateSelect');

  const sectors = new Set(routes.map(r => r.sector).filter(Boolean));
  const difficulties = new Set(routes.map(r => r.difficulty).filter(Boolean));
  const authors = new Set(routes.map(r => r.author).filter(Boolean));
  const dates = new Set(routes.map(r => r.date).filter(Boolean));

  sectors.forEach(s => sectorSelect.innerHTML += `<option value="${s}">${s}</option>`);
  difficulties.forEach(d => difficultySelect.innerHTML += `<option value="${d}">${d}</option>`);
  authors.forEach(a => authorSelect.innerHTML += `<option value="${a}">${a}</option>`);
  dates.forEach(d => dateSelect.innerHTML += `<option value="${d}">${d}</option>`);
}

function filterRoutes() {
  const sector = document.getElementById('sectorSelect').value;
  const difficulty = document.getElementById('difficultySelect').value;
  const author = document.getElementById('authorSelect').value;
  const date = document.getElementById('dateSelect').value;
  const routeList = document.getElementById('routeDetails');

  const filtered = routes.filter(r =>
    (sector === 'all' || r.sector === sector) &&
    (difficulty === 'all' || r.difficulty === difficulty) &&
    (author === 'all' || r.author === author) &&
    (date === 'all' || r.date === date)
  );

  if (filtered.length === 0) {
    routeList.innerHTML = '<p>Нет подходящих маршрутов.</p>';
    return;
  }

  routeList.innerHTML = filtered.map(r => `
    <div>
      <h3>${r.name}</h3>
      <p><strong>Сектор:</strong> ${r.sector}</p>
      <p><strong>Сложность:</strong> ${r.difficulty}</p>
      <p><strong>Автор:</strong> ${r.author}</p>
      <p><strong>Дата:</strong> ${r.date || '—'}</p>
    </div>
  `).join('');
}

function displayRoutes() {
  filterRoutes();
}

window.addEventListener("DOMContentLoaded", () => {
  loadRoutes();
  for (let i = 1; i <= 12; i++) {
    const sector = document.getElementById(`sector${i}`);
    if (sector) {
      sector.style.cursor = 'pointer';
      sector.addEventListener('click', () => {
        document.getElementById('sectorSelect').value = `Сектор ${i}`;
        filterRoutes();
      });
    }
  }
});