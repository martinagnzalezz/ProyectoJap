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
  
//cambios en el envio
  document.querySelectorAll('input[name="envio"]').forEach(radio => {
  radio.addEventListener("change", () => {

    //actulizar el costo cuando se cambia el metodo de envio
    actualizarCostos();
  });
});
  // boton finalizar compra
document.getElementById("finalizar-compra").addEventListener("click", async () => {
  if (!validarFormulario()) {
    alert("Error: Faltan campos por completar.");
    return;
  }

  const exito = await enviarCarritoAlServidor();

  if (exito) {
    alert("Compra realizada con éxito! Gracias por tu compra.");
    // limpiar carrito después de la compra
    localStorage.removeItem("carritoProductos");
    // redirigir a la pagina principal al terminar la compra
    window.location.href = "index.html";
  } else {
    alert("Ocurrió un error al registrar la compra.");
  }
});


// funcion para validar el formulario antes de finalizar la compra
function validarFormulario() {
  let valid = true;

  // validar la direccion
  const direccionInputs = document.querySelectorAll("#modalDireccion input");
  let direccionCompleta = true;
  direccionInputs.forEach(input => {
    if (input.value.trim() === "") {
      direccionCompleta = false;
      input.classList.add("is-invalid");  
    } else {
      input.classList.remove("is-invalid");
    }
  });
  
  if (!direccionCompleta) {
    alert("Por favor, complete todos los campos de la dirección.");
    valid = false;
  }

  // validar el tipo de envio
  const envioSeleccionado = document.querySelector('input[name="envio"]:checked');
  if (!envioSeleccionado) {
    alert("Por favor, seleccione un tipo de envío.");
    valid = false;
  }

  // validar la cantidad de productos
  const cantidades = document.querySelectorAll(".quantity");
  cantidades.forEach(input => {
    const cantidad = parseInt(input.value, 10);
    if (cantidad <= 0 || isNaN(cantidad)) {
      input.classList.add("is-invalid"); 
      valid = false;
    } else {
      input.classList.remove("is-invalid");
    }
  });

  // validar la forma de pago
  const pagoSeleccionado = document.querySelector('input[name="pago"]:checked');
  if (!pagoSeleccionado) {
    alert("Por favor, seleccione una forma de pago.");
    valid = false;
  } else {
    const camposPago = document.querySelectorAll(`#modalPago input:checked + input`);
    let camposPagoCompletos = true;
    camposPago.forEach(input => {
      if (input.value.trim() === "") {
        camposPagoCompletos = false;
        input.classList.add("is-invalid");  
      } else {
        input.classList.remove("is-invalid");
      }
    });
    if (!camposPagoCompletos) {
      alert("Por favor, complete los campos de pago.");
      valid = false;
    }
  }

  return valid;
}

async function enviarCarritoAlServidor() {
  const carrito = JSON.parse(localStorage.getItem("carritoProductos")) || [];
  if (carrito.length === 0) return false;

  const token = sessionStorage.getItem("token");

  // Dirección: concatenamos los inputs del modal
  const direccionInputs = document.querySelectorAll("#modalDireccion input");
  const direccion = Array.from(direccionInputs)
    .map(i => i.value.trim())
    .filter(v => v !== "")
    .join(" - ");

  // Tomar valores ya calculados en el modal
  const subtotalTexto = document.getElementById("subtotal-modal").textContent.replace(" USD", "");
  const totalTexto = document.getElementById("total-modal").textContent.replace(" USD", "");
  const subtotal = parseFloat(subtotalTexto) || 0;
  const total = parseFloat(totalTexto) || 0;

  const payload = {
    cliente: {
      nombre: sessionStorage.getItem("usuario") || "invitado",
      apellido: null,
      email: null
    },
    carrito: {
      moneda: "USD",
      total: total,
      items: carrito
    },
    compra: {
      direccion: direccion,
      subtotal: subtotal
    }
  };

  try {
    const res = await fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error(await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}


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

        // actualiza el subtotal 
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

        //llamar a actualizarCostos despues de cambiar la cantidad
        actualizarCostos();
      });
    });

  // listener para el boton eliminar
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
        
        // llamar a actualizarCostos despues de eliminar el producto
        actualizarCostos();
      });
    });
    //llamar a actualizarCostos al cargar la pagina
    actualizarCostos();
}



function actualizarCostos() {
  // obtener los productos del carrito
  let carrito = JSON.parse(localStorage.getItem("carritoProductos")) || [];
  
  // Calcular el subtotal (suma de los subtotales de cada producto)
  let subtotal = carrito.reduce((total, producto) => {
    return total + (producto.cost * producto.quantity);
  }, 0);
  
  // obtener el porcentaje del envio seleccionado
  let envioSeleccionado = document.querySelector('input[name="envio"]:checked');
  let porcentajeEnvio = envioSeleccionado ? parseFloat(envioSeleccionado.value) : 0;

  // calcular el costo de envio
  let costoEnvio = (subtotal * (porcentajeEnvio / 100)).toFixed(2);
  
  // calcular el total que es el subtotal mas el costo de envio
  let total = (subtotal + parseFloat(costoEnvio)).toFixed(2);

  // actualizar los valores en el modal
  document.getElementById("subtotal-modal").textContent = `${subtotal.toFixed(2)} USD`;
  document.getElementById("envio-modal").textContent = `${costoEnvio} USD`;
  document.getElementById("total-modal").textContent = `${total} USD`;
}
