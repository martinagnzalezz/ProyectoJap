const productID = localStorage.getItem("productID");
const RATINGS_KEY = `ratings_${productID}`;
let listaRatings = JSON.parse(localStorage.getItem(RATINGS_KEY) || "[]");

console.log("productID =", productID);
console.log("RATINGS_KEY =", RATINGS_KEY);
console.log("lo que hay guardado ya para este producto:", localStorage.getItem(RATINGS_KEY));

document.addEventListener("DOMContentLoaded", () => {
  const productID = localStorage.getItem("productID");
  const catID = localStorage.getItem("catID");

  console.log("Loaded productID:", productID, "catID:", catID); // Debug log

  if (!productID || !catID) {
    console.error("Falta productID o catID en localStorage");
    document.querySelector("#product-info-container").innerHTML = 
      '<p class="text-center text-danger">Error: No se puede cargar el producto. Por favor, selecciona un producto desde <a href="products.html">Productos</a>.</p>';
    document.getElementById("spinner-wrapper").style.display = "none";
    return;
  }

  const urlPrd = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
  const urlCat = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  document.getElementById("spinner-wrapper").style.display = "block";

  // Cargar producto principal
  fetch(urlPrd)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.json();
    })
    .then(producto => {
      console.log("Fetched product:", producto); 
      mostrarInfoProducto(producto);
      ratingEstrellas();
      formularioRating();
      mostrarRatings();
      document.getElementById("spinner-wrapper").style.display = "none";
    })
    .catch(error => {
      console.error("Error al cargar producto:", error);
      document.querySelector("#product-info-container").innerHTML = 
        '<p class="text-center text-danger">Error al cargar el producto. Intenta de nuevo desde <a href="products.html">Productos</a>.</p>';
      document.getElementById("spinner-wrapper").style.display = "none";
    });

  // Cargar productos relacionados
  fetch(urlCat)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log("Fetched related products:", data.products);
      const relatedProducts = data.products.filter(p => String(p.id) !== String(productID));
      mostrarProductosRelacionados(relatedProducts);
      document.getElementById("spinner-wrapper").style.display = "none";
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
        <a href="products.html" onclick="localStorage.setItem('catID','${catID}');">${producto.category}</a> &gt;
        ${producto.name}
      </nav>
    </div>
    <div class="card mx-auto shadow p-3 mb-5 bg-body rounded" style="max-width: 600px;">
      <img id="main-image" src="${producto.images[0] || 'img/placeholder.jpg'}" class="card-img-top" alt="${producto.name}">
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
            <img src="${img || 'img/placeholder.jpg'}" class="card-img-top img-thumbnail" alt="Imagen extra" 
                 style="width: 100%; height: 100%; object-fit: contain;" onclick="showImage('${img}')">
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
    `);
  }

  // Actualizamos el título de la sección rating con el nombre del producto.
  const tituloRating = document.getElementById("rating-title");
  if (tituloRating) {
    tituloRating.textContent = `Califica a ${producto.name}!`;
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
        <img class="d-block w-100" src="${producto.image || 'img/placeholder.jpg'}" alt="${producto.name}">
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

function ratingEstrellas() {
  const estrellas = document.querySelectorAll("#rating-estrella i");
  let ratingSeleccionado = 0;

  estrellas.forEach(function(estrella) {
    estrella.addEventListener("click", function() {
      ratingSeleccionado = parseInt(estrella.dataset.value, 10);
      estrellas.forEach(function(e) {
        if (parseInt(e.dataset.value, 10) <= ratingSeleccionado) {
          e.classList.remove("far");
          e.classList.add("fas", "text-warning");
        } else {
          e.classList.remove("fas", "text-warning");
          e.classList.add("far");
        }
      });
    });
  });
}

function formularioRating() {
  const btnEnviar = document.getElementById("btn-enviar");
  const estrellas = Array.from(document.querySelectorAll("#rating-estrella i"));
  const radios = document.querySelectorAll('input[name="radio"]');
  const textoRating = document.getElementById("rating-texto");

  btnEnviar.addEventListener("click", function() {
    const ratingSeleccionado = estrellas.filter(e => e.classList.contains("fas"));
    const puntaje = ratingSeleccionado.length;
    const radioSeleccionado = document.querySelector('input[name="radio"]:checked');
    const radioFrase = radioSeleccionado ? radioSeleccionado.value : "No seleccionado";
    const comentario = textoRating.value.trim();
    const tiempoActual = new Date();
    const tiempoActualString = tiempoActual.toLocaleString();

    // Validamos que se haya seleccionado un puntaje y escrito un comentario.
    if (puntaje === 0) {
      alert("Por favor, selecciona una calificación con estrellas.");
      return;
    }
    if (!radioSeleccionado) {
      alert("Por favor, selecciona una opción de cómo conociste el producto.");
      return;
    }
    if (comentario === "") {
      alert("Por favor, escribe un comentario.");
      return;
    }
    // Confirmación antes de enviar.
    if (!confirm(`¿Estás segur@ de tu calificación?\n\n⭐ ${puntaje}\n${radioFrase}\n"${comentario}"\n\n¿Deseas enviarlo?`)) {
      return;
    }

    // Creamos el objeto rating y lo agregamos al array ratings.
    const nuevoRating = {puntaje, radioFrase, comentario, tiempoActualString};
    listaRatings.push(nuevoRating);

    // Guardamos el array actualizado en localStorage.
    localStorage.setItem(RATINGS_KEY, JSON.stringify(listaRatings));

    mostrarRatings();

    // Limpiamos el formulario.
    estrellas.forEach(e => {
      e.classList.remove("fas", "text-warning");
      e.classList.add("far");
    });
    radios.forEach(radio => radio.checked = false);
    textoRating.value = "";
  });
}

function mostrarRatings() {
  // Si ya existe un contenedor de reseñas anterior, lo elimino para evitar que se dupliquen
  const viejoContenedor = document.getElementById("ratings-container");
  if (viejoContenedor) viejoContenedor.remove();

  // Creo un nuevo contenedor para las reseñas
  const contenedor = document.createElement("div");
  contenedor.id = "ratings-container";
  contenedor.classList.add("mt-4");

  // Si todavía no hay reseñas guardadas, muestro un mensaje diciéndolo
  if (listaRatings.length === 0) {
    contenedor.innerHTML = `<p class="text-muted">Todavía no hay calificaciones para este producto.</p>`;
  } else {
    // Si hay reseñas, las recorro en orden de las más recientes a las más antiguas
    listaRatings.slice().reverse().forEach(rating => {
      // Creo un bloque (div) para cada reseña individual
      const item = document.createElement("div");
      item.classList.add("border", "p-3", "mb-2", "bg-white", "rounded");

      // Agrego dentro del bloque todos los campos
      item.innerHTML = `
        <div class="d-flex justify-content-between">
          <div>
            ${'⭐'.repeat(rating.puntaje)}${'☆'.repeat(5 - rating.puntaje)}
          </div>
          <small class="text-muted">${rating.tiempoActualString}</small>
        </div>
        <p class="mb-1"><em>Cómo lo conociste:</em> ${rating.radioFrase}</p>
        <p class="mb-0">${rating.comentario}</p>
      `;

      // Agrego cada reseña al contenedor principal
      contenedor.appendChild(item);
    });
  }

  // Selecciono el contenedor principal de la página donde se van a mostrar las reseñas
  const main = document.querySelector("main .container:last-child");

  let titulo = document.getElementById("titulo-reseñas");
  if (!titulo) {
    const hr = document.createElement("hr");
    titulo = document.createElement("h3");
    titulo.id = "titulo-reseñas";
    titulo.textContent = "Reseñas del producto:";
    main.appendChild(hr);
    main.appendChild(titulo);
  }
  // Agrego el contenedor con todas las reseñas al main
  main.appendChild(contenedor);
}
