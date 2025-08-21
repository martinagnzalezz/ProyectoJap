document.addEventListener("DOMContentLoaded", () => {
  fetch('https://japceibal.github.io/emercado-api/cats_products/101.json')
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
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${producto.image}" class="card-img-top" alt="${producto.name}">
          <div class="card-body">
            <h5 class="card-title">${producto.name}</h5>
            <p class="card-text">${producto.description}</p>
            <p><strong>Precio:</strong> ${producto.currency} ${producto.cost}</p>
            <p><small class="text-muted">Vendidos: ${producto.soldCount}</small></p>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += html;
  });
}