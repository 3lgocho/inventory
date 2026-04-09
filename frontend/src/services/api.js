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
    const token = localStorage.getItem('token'); // ¡Asegúrate de enviar el token!
    const respuesta = await fetch('/api/items/get-all', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor Rust');
    return await respuesta.json();
};

// 3. TU MOVE (INTACTO)
export const moverEquipo = async (id, nueva_ubicacion) => {
    const token = localStorage.getItem('token');
    const respuesta = await fetch('/api/movement/register', { // Ruta correcta de Manu
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ item_id: id, tipo: 'SALIDA', cantidad: 1, observacion: `Movido a ${nueva_ubicacion}` }),
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

export const registrarUsuario = async (nombre, email, password) => {
    const respuesta = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
    });

    if (!respuesta.ok) {
        // En lugar de .json(), usamos .text() porque el backend envía texto plano en los errores
        const mensajeError = await respuesta.text();
        throw new Error(mensajeError || 'Error al registrar usuario');
    }

    // Si el status es 201 (Created), no intentamos parsear JSON porque el body está vacío
    return respuesta;
};

// Obtener la lista de todos los usuarios (Solo para admins)
export const obtenerUsuarios = async () => {
    const token = localStorage.getItem('token');
    const respuesta = await fetch('/api/auth/users', { // Ajustado a la ruta de Manu
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!respuesta.ok) throw new Error('No se pudieron cargar los usuarios');
    return await respuesta.json();
};

// Eliminar un usuario por ID
export const eliminarUsuario = async (id) => {
    const token = localStorage.getItem('token');
    const respuesta = await fetch(`/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!respuesta.ok) throw new Error('Error al eliminar usuario');
    return true;
};