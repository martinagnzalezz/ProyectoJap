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
      document.getElementById("spinner-wrapper").style.display = "none";
    })
    .catch(error => {
      console.error("Error al cargar producto:", error);
      document.querySelector("#product-info-container").innerHTML = 
        '<p class="text-center text-danger">Error al cargar el producto. Intenta de nuevo desde <a href="products.html">Productos</a>.</p>';
      document.getElementById("spinner-wrapper").style.display = "none";
    });

//carga los comentarios de la api
    const urlComentarios = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;

fetch(urlComentarios)
  .then(response => response.json())
  .then(comentariosAPI => {
    const comentariosLocales = listaRatings.map(rating => ({
      user: "Usuario Anónimo",
      score: rating.puntaje,
      description: rating.comentario,
      dateTime: rating.tiempoActualString
    }));
    const todosLosComentarios = comentariosLocales.concat(comentariosAPI);
    mostrarComentariosAPI(todosLosComentarios); 
  })
  .catch(error => {
    console.error("Error al cargar comentarios desde API:", error);
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

// Volvemos a mostrar todos los comentarios (API + locales)
const urlComentarios = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;
fetch(urlComentarios)
  .then(response => response.json())
  .then(comentariosAPI => {
    const comentariosLocales = listaRatings.map(rating => ({
      user: "Usuario Anónimo",
      score: rating.puntaje,
      description: rating.comentario,
      dateTime: rating.tiempoActualString
    }));
    const todosLosComentarios = comentariosLocales.concat(comentariosAPI);
    mostrarComentariosAPI(todosLosComentarios);
  });

    // Limpiamos el formulario.
    estrellas.forEach(e => {
      e.classList.remove("fas", "text-warning");
      e.classList.add("far");
    });
    radios.forEach(radio => radio.checked = false);
    textoRating.value = "";
  });
}


function mostrarComentariosAPI(comentarios) {
  const main = document.querySelector("main .container:last-child");

  let titulo = document.getElementById("titulo-comentarios-todos");
  if (!titulo) {
    titulo = document.createElement("h3");
    titulo.id = "titulo-comentarios-todos";
    titulo.textContent = "Comentarios del producto:";
    main.appendChild(document.createElement("hr"));
    main.appendChild(titulo);
  }

  let contenedor = document.getElementById("comentarios-api-container");
  if (contenedor) contenedor.remove();

  contenedor = document.createElement("div");
  contenedor.id = "comentarios-api-container";

  if (comentarios.length === 0) {
    contenedor.innerHTML = `<p class="text-muted">Este producto aún no tiene comentarios.</p>`;
  } else {
    contenedor.innerHTML = comentarios.map(c => `
      <div class="border p-3 mb-3 rounded bg-white">
        <div class="d-flex justify-content-between">
          <strong>${c.user}</strong>
          <small class="text-muted">${c.dateTime}</small>
        </div>
        <div class="mb-1">${'⭐'.repeat(c.score)}${'☆'.repeat(5 - c.score)}</div>
        <p class="mb-0">${c.description}</p>
      </div>
    `).join("");
  }

  main.appendChild(contenedor);
}

const modoSwitch = document.getElementById('modoSwitch'); // Switch de modo claro/oscuro
const modoIcono = document.getElementById("modoIcono"); // Nuevo: el emoji del switch


// Función para actualizar el ícono según el modo
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
  actualizarIconoModo(modoGuardado || 'claro'); // 🔁 Actualizar ícono al iniciar
});

// Al cambiar el switch
modoSwitch.addEventListener('change', () => {
  if (modoSwitch.checked) {
    document.body.classList.replace('light-mode', 'dark-mode');
    localStorage.setItem('modo', 'oscuro');
    actualizarIconoModo('oscuro'); // 🔁 Cambiar ícono
  } else {
    document.body.classList.replace('dark-mode', 'light-mode');
    localStorage.setItem('modo', 'claro');
    actualizarIconoModo('claro'); // 🔁 Cambiar ícono
  }
});

  