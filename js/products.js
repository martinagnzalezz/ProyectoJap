
document.addEventListener("DOMContentLoaded", () => {
  const catID = localStorage.getItem("catID") || "101";
  const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  let productos = [];
  let filtrados = [];

  fetch(url)
    .then(response => response.json())
    .then(data => {
      productos = data.products;
      filtrados = [...productos];
      mostrarProductos(productos.sort((a, b) => b.soldCount - a.soldCount));
    })
    .catch(error => console.error("Error al cargar productos:", error));

  configurarEventListeners();
});

function configurarEventListeners() {
  const btnSortAsc = document.getElementById("btnSortAsc");
  const btnSortDesc = document.getElementById("btnSortDesc");
  
  if (btnSortAsc) {
    btnSortAsc.addEventListener("click", () => procesarProductos('asc'));
  }
  
  if (btnSortDesc) {
    btnSortDesc.addEventListener("click", () => procesarProductos('desc'));
  }

  const btnFiltrar = document.getElementById("btnFiltrar");
  if (btnFiltrar) {
    btnFiltrar.addEventListener("click", () => {
      procesarProductos();
      const inputBusqueda = document.getElementById("inputBusqueda");
      if (inputBusqueda) inputBusqueda.value = '';
    });
  }

  const inputBusqueda = document.getElementById("inputBusqueda");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", buscarProducto);
  }
}

function procesarProductos(ordenarPor = null) {
  let lista = [...productos];
  
  if (ordenarPor === 'asc') {
    lista.sort((a, b) => a.cost - b.cost);
  } else if (ordenarPor === 'desc') {
    lista.sort((a, b) => b.cost - a.cost);
  } else {
    lista.sort((a, b) => b.soldCount - a.soldCount);
  }
  
  const precioMinInput = document.getElementById("precioMin");
  const precioMaxInput = document.getElementById("precioMax");
  
  let min = 0;
  let max = Infinity;
  
  if (precioMinInput) {
    min = parseInt(precioMinInput.value) || 0;
  }
  if (precioMaxInput) {
    max = parseInt(precioMaxInput.value) || Infinity;
  }
  
  filtrados = lista.filter(p => p.cost >= min && p.cost <= max);
  mostrarProductos(filtrados);
}

function mostrarProductos(lista) {
  const container = document.getElementById("product-list");
  if (!container) {
    console.error("No se encontró el contenedor 'product-list'");
    return;
  }
  
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = '<div class="col-12"><p class="text-center">No se encontraron productos</p></div>';
    return;
  }

  lista.forEach(producto => {
    const html = `
      <div class="col-12 col-sm-6 col-lg-4 mb-4">
        <div class="card h-100 text-center product-card" onclick="verProducto(${producto.id})">
          <img src="${producto.image}" class="card-img-top" alt="${producto.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Sin+imagen'">
          <div class="card-body">
            <h5 class="card-title text-uppercase fw-bold">${producto.name}</h5>
            <p class="card-text">${producto.description}</p>
            <p class="precio">Precio: ${producto.currency} ${producto.cost}</p>
            <p class="vendidos">Vendidos: ${producto.soldCount}</p>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += html;
  });
}

function buscarProducto() {
  const inputBusqueda = document.getElementById("inputBusqueda");
  if (!inputBusqueda) return;
  
  const texto = inputBusqueda.value.toLowerCase().trim();
  
  if (texto === '') {
    mostrarProductos(filtrados);
    return;
  }
  
  let buscado = filtrados.filter(p => 
    p.name.toLowerCase().includes(texto) || 
    p.description.toLowerCase().includes(texto)
  );
  
  mostrarProductos(buscado);
}

function verProducto(id) {
  localStorage.setItem("productID", id);
  window.location.href = "product-info.html";
}