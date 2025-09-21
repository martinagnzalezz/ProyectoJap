document.addEventListener("DOMContentLoaded", () => {
  const productID = localStorage.getItem("productID");

  if (!productID) {
    console.error("No se encontró productID en localStorage");
    return;
  }

  const url = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      mostrarInfoProducto(data);
    })
    .catch(error => console.error("Error al cargar producto:", error));
});

function mostrarInfoProducto(producto) {
  const container = document.querySelector("main .container");
  container.innerHTML = `
    <div class="card mx-auto shadow p-3 mb-5 bg-body rounded" style="max-width: 600px;">
      <img id="main-image" src="${producto.images[0]}" class="card-img-top" alt="${producto.name}">
      <div class="card-body text-center">
        <h4 class="fw-bold">${producto.name}</h4>
        <p>${producto.description}</p>
        <p><span class="fw-bold text-success">Precio:</span> ${producto.currency} ${producto.cost}</p>
        <p>Vendidos: ${producto.soldCount}</p>
      </div>
    </div>

    <div class="d-flex justify-content-center flex-wrap gap-3">
      ${producto.images
        .map(img => `
          <div class="card" style="width: 120px; height: 120px; overflow: hidden; cursor: pointer;">
            <img src="${img}" class="card-img-top img-thumbnail" alt="Imagen extra" 
            style="width: 100%; height: 100%; object-fit: contain;"
            onclick="showImage('${img}')">
          </div>
        `).join("")}
    </div>
  `;

  
  if (!document.getElementById("imageModal")) {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content bg-transparent border-0">
            <img id="modal-image" src="" class="img-fluid rounded">
          </div>
        </div>
      </div>
    `);
  }
}

function showImage(src) {
  document.getElementById("modal-image").src = src;
  const modal = new bootstrap.Modal(document.getElementById("imageModal"));
  modal.show();
}
