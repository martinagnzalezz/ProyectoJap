document.addEventListener("DOMContentLoaded", () => {
  const productID = localStorage.getItem("productID");
  const catID = localStorage.getItem("catID");

  console.log("Loaded productID:", productID, "catID:", catID); // Debug log

  if (!productID || !catID) {
    console.error("Falta productID o catID en localStorage");
    document.querySelector("#product-info-container").innerHTML = 
      '<p class="text-center text-danger">Error: No se puede cargar el producto. Por favor, selecciona un producto desde <a href="products.html">Productos</a>.</p>';
    return;
  }

  const urlPrd = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
  const urlCat = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  document.getElementById("spinner-wrapper").style.display = "block";

  fetch(urlPrd)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.json();
    })
    .then(producto => {
      console.log("Fetched product:", producto); 
      mostrarInfoProducto(producto);
      document.getElementById("spinner-wrapper").style.display = "none";
    })
    .catch(error => {
      console.error("Error al cargar producto:", error);
      document.querySelector("#product-info-container").innerHTML = 
        '<p class="text-center text-danger">Error al cargar el producto. Intenta de nuevo desde <a href="products.html">Productos</a>.</p>';
      document.getElementById("spinner-wrapper").style.display = "none";
    });

  fetch(urlCat)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log("Fetched related products:", data.products);
      const relatedProducts = data.products.filter(p => String(p.id) !== String(productID));
      mostrarProductosRelacionados(relatedProducts);
    })
    .catch(error => {
      console.error("Error al cargar productos relacionados:", error);
      document.querySelector("#carouselProduct .carousel-inner").innerHTML = 
        '<div class="carousel-item active"><p class="text-center text-danger">Error al cargar productos relacionados.</p></div>';
      document.getElementById("spinner-wrapper").style.display = "none";
    });
});

function mostrarInfoProducto(producto) {
  const catID = localStorage.getItem("catID");
  const container = document.querySelector("main .container#product-info-container");

  container.innerHTML = `
    <div class="text-center my-4">
      <h1 class="fw-bold">${producto.name}</h1>
      <nav id="breadcrumb" class="mb-3 text-muted">
        <a href="categories.html">Categorías</a> &gt;
        <a 
          href="products.html" 
          onclick="localStorage.setItem('catID','${catID}');"
        >
          ${producto.category}
        </a> &gt;
        ${producto.name}
      </nav>
    </div>

    <div class="card mx-auto shadow p-3 mb-5 bg-body rounded" style="max-width: 600px;">
      <img id="main-image" src="${producto.images[0]}" class="card-img-top" alt="${producto.name}">
      <div class="card-body text-center">
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

function mostrarProductosRelacionados(lista) {
  const carouselInner = document.querySelector("#carouselProduct .carousel-inner");

  if (lista.length === 0) {
    carouselInner.innerHTML = `
      <div class="carousel-item active">
        <img class="d-block w-100" src="img/placeholder.jpg" alt="No hay productos relacionados">
        <div class="carousel-caption d-none d-md-block">
          <h5>Sin productos relacionados</h5>
          <p>No hay productos disponibles en esta categoría.</p>
        </div>
      </div>
    `;
    return;
  }

  carouselInner.innerHTML = lista
    .map((producto, index) => `
      <div class="carousel-item ${index === 0 ? 'active' : ''}" onclick="verProducto(${producto.id})">
        <img class="d-block w-100" src="${producto.image}" alt="${producto.name}">
        <div class="carousel-caption d-none d-md-block">
          <h5>${producto.name}</h5>
          <p>Precio: ${producto.currency} ${producto.cost} | Vendidos: ${producto.soldCount}</p>
        </div>
      </div>
    `).join("");
}

function showImage(src) {
  document.getElementById("modal-image").src = src;
  const modal = new bootstrap.Modal(document.getElementById("imageModal"));
  modal.show();
}

function verProducto(id) {
  localStorage.setItem("productID", id);
  window.location.href = "product-info.html";
}