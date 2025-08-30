document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Verifica si el usuario esta logueado
    if (!sessionStorage.getItem('loggedIn')) {
        //Muestra yba alerta indicando que debe loguearse
        alert('Debe iniciar sesion para acceder a esta pagina.');

        // Redirige a la pagina de login
        window.location.href = 'login.html';
    }
});