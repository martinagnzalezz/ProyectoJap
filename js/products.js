document.addEventListener("DOMContentLoaded", () => {
  fetch('https://japceibal.github.io/emercado-api/cats_products/101.json')
    .then(response => response.json())
    .then(data => {
      productos = data.products;
      mostrarProductos(data.products.sort((a, b) => b.soldCount - a.soldCount));
    })
    .catch(error => console.error("Error al cargar productos:", error));
});



function mostrarProductos(lista) {
  const container = document.getElementById("product-list");
  container.innerHTML = ""; 

  lista.forEach(producto => {
    const html = `
      <div class="col-12 col-sm-6 col-lg-4 mb-4">
        <div class="card h-100 text-center">
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

btnSortAsc.addEventListener("click", () => {
  mostrarProductos(productos.sort((a, b) => a.cost - b.cost));
});

btnSortDesc.addEventListener("click", () => {
  mostrarProductos(productos.sort((a, b) => b.cost - a.cost));
});


//btnFiltrar.addEventListener("click", () => {
//const min = parseInt(document.getElementById("precioMin").value) || 0;
//const max = parseInt(document.getElementById("precioMax").value) || Infinity;
//const filtrados = productos.filter(p => p.cost >= min && p.cost <= max);
//mostrarProductos(filtrados);//