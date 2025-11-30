async function login() {
    const username = document.querySelector('input[name="usuario"]').value;
    const password = document.querySelector('input[name="contraseña"]').value;

    if (!username || !password) {
        alert('Por favor, completa ambos campos.');
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || 'Usuario o contraseña incorrectos');
            return;
        }

        // Guardar token y usuario
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('usuario', username);
        sessionStorage.setItem('loggedIn', 'true');

        window.location.href = 'index.html';
    } catch (error) {
        console.error(error);
        alert('No se pudo conectar al servidor.');
    }
}
