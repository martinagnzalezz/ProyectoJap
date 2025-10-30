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


