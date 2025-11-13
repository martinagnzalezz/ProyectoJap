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
  const tbody   = document.getElementById("cart-table-body");
  let carrito   = JSON.parse(localStorage.getItem("carritoProductos")) || [];

  if (carrito.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted">
          Tu carrito está vacío.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = carrito.map(p => `
    <tr data-id="${p.id}">
      <td><img src="${p.image}" alt="${p.name}" width="80" class="img-thumbnail"></td>
      <td>${p.name}</td>
      <td data-price="${p.cost}">${p.cost} <span class="currency">${p.currency}</span></td>
      <td>
        <input type="number" class="form-control quantity" value="${p.quantity}" min="1" style="width:70px;">
      </td>
      <td class="subtotal"> ${(p.cost * p.quantity).toFixed(2)} <span class="currency">${p.currency}</span> </td>
      <td> <button class="btn btn-sm btn-outline-danger remove-item">❌</button></td>
    </tr>
  `).join("");

  actualizarSubtotal();
});

function actualizarSubtotal() {
  document.querySelectorAll("#cart-table-body .quantity")
    .forEach(input => {
      input.addEventListener("input", ev => {
        const fila      = ev.target.closest("tr");
        const prodID    = fila.dataset.id;
        const precio    = parseFloat(fila.querySelector("td[data-price]")
                                          .dataset.price) || 0;
        const cantidad  = parseInt(ev.target.value, 10) || 0;
        const subtotal  = (precio * cantidad).toFixed(2);

        // actualiza el subtotal en pantalla
        fila.querySelector(".subtotal").innerHTML =
          `${subtotal} ` +
          fila.querySelector(".subtotal .currency").outerHTML;

        // actualizo el carrito en localStorage
        let carrito = JSON.parse(localStorage.getItem("carritoProductos"));
        carrito = carrito.map(p => {
          if (String(p.id) === prodID) p.quantity = cantidad;
          return p;
        });
        localStorage.setItem("carritoProductos", JSON.stringify(carrito));
      });
      actualizarBadgeCarrito();
    });

  // listener para el botón “Eliminar”
  document.querySelectorAll("#cart-table-body .remove-item")
    .forEach(btn => {
      btn.addEventListener("click", ev => {
        const fila   = ev.target.closest("tr");
        const prodID = fila.dataset.id;

        // quito del DOM
        fila.remove();

        // quito del localStorage
        let carrito = JSON.parse(localStorage.getItem("carritoProductos"));
        carrito = carrito.filter(p => String(p.id) !== prodID);
        localStorage.setItem("carritoProductos", JSON.stringify(carrito));
      });
    });
}