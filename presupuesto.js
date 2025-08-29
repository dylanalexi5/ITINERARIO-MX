// presupuesto.js
// Datos iniciales
const datosPresupuesto = {
  restanteCOP: 648911,
  aumentoCOP: 250000,
  totalCOP: 898911,
  dias: 7,
  promedioCOP: 128415,
  promedioMXN: 591,
  cambio: 217,
  colchonCOP: 315796,
  totalGastosCOP: 583115,
  totalGastosMXN: 1755,
  totalPanamaUSD: 47,
  totalPanamaCOP: 202100,
  personas: 5
};

const gastosDiarios = [
  { dia: 'Jueves, 25 de septiembre', lugar: 'CDMX', totalMXN: 250, totalCOP: 54250 },
  { dia: 'Viernes, 26 de septiembre', lugar: 'Teotihuacán', totalMXN: 390, totalCOP: 84630 },
  { dia: 'Sábado, 27 de septiembre', lugar: 'CDMX y Vuelo a Cancún', totalMXN: 225, totalCOP: 48825 },
  { dia: 'Domingo, 28 de septiembre', lugar: 'Chichén Itzá y Cenotes', totalMXN: 600, totalCOP: 130200 },
  { dia: 'Lunes, 29 de septiembre', lugar: 'Playa en Cancún', totalMXN: 270, totalCOP: 58590 },
  { dia: 'Martes, 30 de septiembre', lugar: 'Compras en Cancún', totalMXN: 220, totalCOP: 47740 },
  { dia: 'Miércoles, 1 de octubre', lugar: 'Panamá', totalUSD: 47, totalCOP: 202100 }
];

// Render resumen
function renderResumen() {
  const div = document.getElementById('resumen-presupuesto');
  div.innerHTML = `
    <div class="mb-2 text-lg font-bold text-teal-700">Presupuesto General por Persona</div>
    <table class="w-full text-sm mb-4">
      <tr><td class="font-semibold">Dinero restante después de vuelos:</td><td class="text-right">$${datosPresupuesto.restanteCOP.toLocaleString()} COP</td></tr>
      <tr><td class="font-semibold">Dinero a aumentar:</td><td class="text-right">$${datosPresupuesto.aumentoCOP.toLocaleString()} COP</td></tr>
      <tr><td class="font-semibold">Total disponible para gastos en destino:</td><td class="text-right">$${datosPresupuesto.totalCOP.toLocaleString()} COP</td></tr>
      <tr><td class="font-semibold">Número de días de viaje:</td><td class="text-right">${datosPresupuesto.dias}</td></tr>
      <tr><td class="font-semibold">Promedio diario para gastos por persona:</td><td class="text-right">$${datosPresupuesto.promedioCOP.toLocaleString()} COP</td></tr>
      <tr><td class="font-semibold">Equivalente en Pesos Mexicanos (MXN):</td><td class="text-right">~$${datosPresupuesto.promedioMXN} MXN/día (1 MXN ≈ ${datosPresupuesto.cambio} COP)</td></tr>
      <tr><td class="font-semibold">Colchón para imprevistos:</td><td class="text-right">$${datosPresupuesto.colchonCOP.toLocaleString()} COP</td></tr>
    </table>
    <div class="text-xs text-stone-500 mb-2">Este promedio nos da un buen margen para planificar con cuidado.</div>
  `;
}

// Render desglose
function renderDesglose() {
  const div = document.getElementById('desglose-gastos');
  let html = '<table class="w-full text-sm"><tr class="bg-teal-50"><th>Día</th><th>Lugar</th><th>Total MXN</th><th>Total COP</th></tr>';
  gastosDiarios.forEach(g => {
    html += `<tr><td>${g.dia}</td><td>${g.lugar}</td><td>${g.totalMXN ? '$'+g.totalMXN : '$'+g.totalUSD+' USD'}</td><td>$${g.totalCOP.toLocaleString()} COP</td></tr>`;
  });
  html += '</table>';
  div.innerHTML = html;
}

function renderTotales() {
  const div = document.getElementById('totales-gastos');
  let totalCOP = gastosDiarios.reduce((acc, g) => acc + (g.totalCOP || 0), 0);
  let totalMXN = gastosDiarios.slice(0,6).reduce((acc, g) => acc + (g.totalMXN || 0), 0);
  let totalCOPGrupo = totalCOP * (datosPresupuesto.personas || 5);
  let totalMXNGrupo = totalMXN * (datosPresupuesto.personas || 5);
  div.innerHTML = `<p><b>Total por persona:</b> $${totalCOP.toLocaleString()} COP / $${totalMXN} MXN</p>
  <p><b>Total para ${(datosPresupuesto.personas || 5)} personas:</b> $${totalCOPGrupo.toLocaleString()} COP / $${totalMXNGrupo} MXN</p>`;
}

// Render gráfico
function renderGrafico() {
  const ctx = document.getElementById('grafico-gastos').getContext('2d');
  const labels = gastosDiarios.map(g => g.dia.split(',')[1].trim());
  const dataCOP = gastosDiarios.map(g => g.totalCOP);
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Gasto Diario (COP)',
        data: dataCOP,
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

// Render mapa offline
function renderMapa(tipo = 'mx') {
  const mapaDiv = document.getElementById('mapa');
  // Eliminar el mapa anterior si existe
  if (mapaDiv._leaflet_map) {
    mapaDiv._leaflet_map.remove();
    mapaDiv._leaflet_map = null;
  }
  mapaDiv.innerHTML = '';
  let map;
  if (tipo === 'mx') {
    map = L.map('mapa').setView([19.4326, -99.1332], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    L.marker([19.4326, -99.1332]).addTo(map).bindPopup('Ciudad de México');
    L.marker([21.1619, -86.8515]).addTo(map).bindPopup('Cancún');
  } else if (tipo === 'cancun') {
    map = L.map('mapa').setView([21.1619, -86.8515], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    L.marker([21.1619, -86.8515]).addTo(map).bindPopup('Cancún');
  }
  mapaDiv._leaflet_map = map;
}

function setFormValues() {
  document.getElementById('input-restante').value = datosPresupuesto.restanteCOP;
  document.getElementById('input-aumentar').value = datosPresupuesto.aumentoCOP;
  document.getElementById('input-promedio').value = datosPresupuesto.promedioCOP;
  document.getElementById('input-colchon').value = datosPresupuesto.colchonCOP;
  document.getElementById('input-cambio').value = datosPresupuesto.cambio;

  // Actualizar en tiempo real al cambiar cualquier input
  const inputs = document.querySelectorAll('#form-presupuesto input');
  inputs.forEach(input => {
    input.addEventListener('input', actualizarPresupuesto);
  });
}


function mostrarRuta() {
  const origen = document.getElementById('origen').value;
  const destino = document.getElementById('destino').value;
  const iframe = document.getElementById('iframe-mapa');
  const info = document.getElementById('info-ruta');
  if(origen && destino) {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origen)}&destination=${encodeURIComponent(destino)}`;
    iframe.src = url;
    iframe.style.display = 'block';
    info.innerHTML = `<a href="${url}" target="_blank">Abrir ruta en Google Maps</a>`;
  } else {
    iframe.style.display = 'none';
    info.innerHTML = '<span style="color:red">Debes ingresar origen y destino.</span>';
  }
}

// Actualizar tipo de cambio
function actualizarPresupuesto() {
  datosPresupuesto.restanteCOP = parseInt(document.getElementById('input-restante').value) || 0;
  datosPresupuesto.aumentoCOP = parseInt(document.getElementById('input-aumentar').value) || 0;
  datosPresupuesto.totalCOP = datosPresupuesto.restanteCOP + datosPresupuesto.aumentoCOP;
  datosPresupuesto.promedioCOP = parseInt(document.getElementById('input-promedio').value) || 0;
  datosPresupuesto.colchonCOP = parseInt(document.getElementById('input-colchon').value) || 0;
  datosPresupuesto.cambio = parseInt(document.getElementById('input-cambio').value) || 217;
  datosPresupuesto.promedioMXN = Math.round(datosPresupuesto.promedioCOP / datosPresupuesto.cambio);
  renderResumen();
  renderDesglose();
  renderTotales();
  renderGrafico();
}

// Inicializar todo
window.onload = function() {
  setFormValues();
  renderResumen();
  renderDesglose();
  renderTotales();
  renderGrafico();
  renderMapa('mx');
  // Selector de mapa offline
  const selector = document.createElement('div');
  selector.className = 'mb-2 flex gap-2';
  selector.innerHTML = `
    <button id="btn-mapa-mx" class="bg-teal-600 text-white px-3 py-1 rounded">México</button>
    <button id="btn-mapa-cancun" class="bg-amber-500 text-white px-3 py-1 rounded">Cancún</button>
  `;
  document.getElementById('mapa').parentElement.prepend(selector);
  document.getElementById('btn-mapa-mx').onclick = () => renderMapa('mx');
  document.getElementById('btn-mapa-cancun').onclick = () => renderMapa('cancun');
};
