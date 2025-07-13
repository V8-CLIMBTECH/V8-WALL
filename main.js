
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdqfvEN83Y-19bbH6z0RxK1W6dHrWZ7Q_IIXCYKJ9vXCTfA1rVo5bRSqBfjw0wC1w3z3Bp2wyFV6_o/pub?output=csv";
let routes = [];

async function loadCSV() {
  const response = await fetch(CSV_URL);
  const text = await response.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(',');
  routes = lines.slice(1).map(line => {
    const data = line.split(',');
    const row = {};
    headers.forEach((h, i) => {
      const value = data[i]?.trim();
      if (h.includes('Название')) row.name = value;
      else if (h.includes('Сектор')) row.sector = value;
      else if (h.includes('Сложность')) row.difficulty = value;
      else if (h.includes('Автор')) row.author = value;
    });
    if (data[0]) {
      const [date] = data[0].split(' ');
      row.date = date;
    }
    return row;
  });
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
  loadCSV();
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
