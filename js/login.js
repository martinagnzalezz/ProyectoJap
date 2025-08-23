function login() {
    const username = document.querySelector('input[name="usuario"]').value;
    const password = document.querySelector('input[name="contraseña"]').value;

    if (username.trim() === '' || password.trim() === '') {
            alert('Por favor, completa ambos campos.');
        } else {
            window.location.href = 'index.html';
        }
}