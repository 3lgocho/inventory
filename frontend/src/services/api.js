// 1. EL LOGIN (NUEVO)
export const loginUsuario = async (email, password) => {
    // Ajusta la ruta a '/auth/login' si no estás usando el proxy de Vite con '/api'
    const respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!respuesta.ok) throw new Error('Credenciales incorrectas');
    return await respuesta.json();
};

// 2. TU GET (INTACTO)
export const obtenerInventario = async () => {
    const respuesta = await fetch('/api/inventario');
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor Rust');
    return await respuesta.json();
};

// 3. TU MOVE (INTACTO)
export const moverEquipo = async (id, nueva_ubicacion) => {
    const respuesta = await fetch('/api/inventario/mover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nueva_ubicacion }),
    });
    if (!respuesta.ok) throw new Error('Error al actualizar la ubicación');
    return await respuesta.json();
};

// 4. TU CREATE (CON EL TOKEN INYECTADO)
export const crearEquipo = async (nuevoItem) => {
    const token = localStorage.getItem('token'); // Buscamos la llave en la bóveda

    const response = await fetch('/api/items/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Inyectamos el Token para pasar el AuthUser
        },
        body: JSON.stringify(nuevoItem)
    });
    if (!response.ok) throw new Error('Error al crear el equipo');
    return response.json();
};