function login() {
    const username = document.querySelector('input[name="usuario"]').value;
    const password = document.querySelector('input[name="contraseña"]').value;

    if (username && password) {
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('usuario', username);
        sessionStorage.setItem('contraseña', password);
        window.location.href = 'index.html';
    } else {
        alert('Por favor, completa ambos campos.');
    }
    
}

