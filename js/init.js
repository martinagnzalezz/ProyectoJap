const CATEGORIES_URL = "http://localhost:5000/cats/cat.json";
const PUBLISH_PRODUCT_URL = "http://localhost:5000/sell/publish.json";
const PRODUCTS_URL = "http://localhost:5000/cats_products/";
const PRODUCT_INFO_URL = "http://localhost:5000/products/";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:5000/products_comments/";
const CART_INFO_URL = "http://localhost:5000/user_cart/";    
const CART_BUY_URL = "http://localhost:5000/cart/buy.json";

const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

// Mostrar el nombre de usuario en la barra de navegación
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('mostrar-usuario').textContent = sessionStorage.getItem('usuario');
});

function actualizarBadgeCarrito() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;

  const carrito = JSON.parse(localStorage.getItem("carritoProductos")) || [];
  const totalUnidades = carrito.reduce((sum, prod) => sum + (prod.quantity||0), 0);
  badge.textContent = totalUnidades;

  if (totalUnidades === 0) {
    badge.classList.add("d-none");
  } else {
    badge.classList.remove("d-none");
  }
}

document.addEventListener("DOMContentLoaded", actualizarBadgeCarrito);