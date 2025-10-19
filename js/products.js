
document.addEventListener("DOMContentLoaded", () => {

  const catID = localStorage.getItem("catID");
  
  const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      productos = data.products;
      filtrados = [...productos];
      mostrarProductos(productos.sort((a, b) => b.soldCount - a.soldCount));
    })
    .catch(error => console.error("Error al cargar productos:", error));
});

let productos = [];
let filtrados = [];

function procesarProductos(ordenarPor = null) {
  let lista = [...productos];
  
  if (ordenarPor === 'asc') {
    lista.sort((a, b) => a.cost - b.cost);
  } else if (ordenarPor === 'desc') {
    lista.sort((a, b) => b.cost - a.cost);
  }
  
  let min = parseInt(document.getElementById("precioMin").value) || 0;
  let max = parseInt(document.getElementById("precioMax").value) || Infinity;
  filtrados = lista.filter(p => p.cost >= min && p.cost <= max);
  
  mostrarProductos(filtrados);
}

function mostrarProductos(lista) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = '<p class="col-12 text-center">No se encontraron productos</p>';
    return;
  }

  lista.forEach(producto => {
    const html = `
      <div class="col-12 col-sm-6 col-lg-4 mb-4">
        <div class="card h-100 text-center product-card" onclick="verProducto(${producto.id})">
          <img src="${producto.image}" class="card-img-top" alt="${producto.name}">
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
  const texto = document.getElementById("inputBusqueda").value.toLowerCase();
  
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

btnSortAsc.addEventListener("click", () => procesarProductos('asc'));
btnSortDesc.addEventListener("click", () => procesarProductos('desc'));
btnFiltrar.addEventListener("click", () => {
  procesarProductos();
  document.getElementById("inputBusqueda").value = '';
});

document.getElementById("inputBusqueda").addEventListener("input", buscarProducto);

function verProducto(id) {
  localStorage.setItem("productID", id);
  window.location.href = "product-info.html";
}

