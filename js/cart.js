const modoSwitch = document.getElementById('modoSwitch'); // Switch de modo claro/oscuro
const modoIcono = document.getElementById("modoIcono");

function actualizarIconoModo(modo) {
  if (modo === 'oscuro') {
    modoIcono.textContent = '🌙';
  } else {
    modoIcono.textContent = '🌞';
  }
}
// Al cargar la página
window.addEventListener('load', () => {
  const modoGuardado = localStorage.getItem('modo');
  if (modoGuardado === 'oscuro') {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    modoSwitch.checked = true;
  } else {
    document.body.classList.add('light-mode');
  }
  actualizarIconoModo(modoGuardado || 'claro'); 
});

// Al cambiar el switch
modoSwitch.addEventListener('change', () => {
  if (modoSwitch.checked) {
    document.body.classList.replace('light-mode', 'dark-mode');
    localStorage.setItem('modo', 'oscuro');
    actualizarIconoModo('oscuro'); 
  } else {
    document.body.classList.replace('dark-mode', 'light-mode');
    localStorage.setItem('modo', 'claro');
    actualizarIconoModo('claro');
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("cart-table-body");
  const carrito = JSON.parse(localStorage.getItem("carritoProductos")) || [];

  if (carrito.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Tu carrito está vacío.</td></tr>`;
    return;
  }

  tbody.innerHTML = carrito.map(p => `
    <tr>
      <td><img src="${p.image}" alt="${p.name}" width="80" class="img-thumbnail"></td>
      <td>${p.name}</td>
      <td>${p.cost} <span class="currency">${p.currency}</span></td>
      <td>
        <input type="number" class="form-control quantity" value="${p.quantity}" min="1" style="width:70px;">
      </td>
      <td class="subtotal">${p.cost * p.quantity} <span class="currency">${p.currency}</span></td>
    </tr>
  `).join('');
});

