document.addEventListener("DOMContentLoaded", () => {
  
  const catID = localStorage.getItem("catID");

  const url = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      mostrarProductos(data.products);
    })
    .catch(error => console.error("Error al cargar productos:", error));
});

function mostrarProductos(lista) {
  const container = document.getElementById("product-list");
  container.innerHTML = ""; 

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

function verProducto(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}