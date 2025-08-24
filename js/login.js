function login() {
    const username = document.querySelector('input[name="usuario"]').value;
    const password = document.querySelector('input[name="contraseña"]').value;

    if (username.trim() === '' || password.trim() === '') {
            alert('Por favor, completa ambos campos.');
    } else {
            if (username && password) {
        //Se guarda el estado de inicio de sesion en sessionStorage.
        sessionStorage.setItem('loggedIn', 'true');

        //Se guarda el nombre de usuario y contraseña en localStorage.
        localStorage.setItem('username', username);
        //localStorage.setItem('password', password);

        //Se redirige al usuario a la pagina de inicio index.html.
        window.location.href = 'index.html';
    } else {
        //En el caso que la condicion anterior no se cumpla, se muestra un mensaje de error.
        alert('Por favor, ingrese su nombre de usuario y contraseña.');
    }
        }
}