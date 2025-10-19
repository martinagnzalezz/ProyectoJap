document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("perfilForm");
  const campos = ["nombre", "apellido", "email", "telefono"];
  const fotoPerfil = document.getElementById("fotoPerfil");
  const cargarFoto = document.getElementById("cargarFoto");

  //Precargar email si es la primera vez
  const emailGuardado = localStorage.getItem("emailUsuario");
  if (emailGuardado) {
    document.getElementById("email").value = emailGuardado;
  } else {
    const nuevoEmail = prompt("Ingrese su correo electrónico:");
    if (nuevoEmail) {
      localStorage.setItem("emailUsuario", nuevoEmail);
      document.getElementById("email").value = nuevoEmail;
    }
  }

  //Cargar datos guardados
  campos.forEach(campo => {
    const valor = localStorage.getItem(`perfil_${campo}`);
    if (valor) document.getElementById(campo).value = valor;
  });

  //Cargar imagen de perfil guardada 
  const imagenGuardada = localStorage.getItem("fotoPerfil");
  if (imagenGuardada) fotoPerfil.src = imagenGuardada;

  //Guardar cambios del formulario
  form.addEventListener("submit", e => {
    e.preventDefault();
    campos.forEach(campo => {
      localStorage.setItem(`perfil_${campo}`, document.getElementById(campo).value);
    });
    alert("Datos guardados correctamente.");
  });

  //Guardar imagen de perfil
  cargarFoto.addEventListener("change", e => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => {
      fotoPerfil.src = lector.result;
      localStorage.setItem("fotoPerfil", lector.result);
    };
    lector.readAsDataURL(archivo);
  });
});


const modoSwitch = document.getElementById('modoSwitch'); // Switch de modo claro/oscuro
const modoIcono = document.getElementById("modoIcono"); // Nuevo emoji del switch


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
  actualizarIconoModo(modoGuardado || 'claro'); 
});

// Al cambiar el switch
modoSwitch.addEventListener('change', () => {
  if (modoSwitch.checked) {
    document.body.classList.replace('light-mode', 'dark-mode');
    localStorage.setItem('modo', 'oscuro');
    actualizarIconoModo('oscuro'); 
  } else {
    document.body.classList.replace('dark-mode', 'light-mode');
    localStorage.setItem('modo', 'claro');
    actualizarIconoModo('claro'); 
  }
});