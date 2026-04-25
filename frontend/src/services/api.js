const verificarTokenExpirado = (respuesta) => {
    if (respuesta.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
    }
    return respuesta;
};

export const loginUsuario = async (email, password) => {
    const respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    // Aquí NO usamos el interceptor porque un 401 aquí significa "mala contraseña"
    if (!respuesta.ok) throw new Error('Credenciales incorrectas');
    return await respuesta.json();
};

export const obtenerInventario = async () => {
    const token = localStorage.getItem('token');
    const respuesta = await fetch('/api/items/get-all', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    verificarTokenExpirado(respuesta); // Interceptamos
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor Rust');
    return await respuesta.json();
};

export const moverEquipo = async (id, nueva_ubicacion) => {
    const token = localStorage.getItem('token');
    const respuesta = await fetch('/api/movement/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ item_id: id, tipo: 'SALIDA', cantidad: 1, observacion: `Movido a ${nueva_ubicacion}` }),
    });
    verificarTokenExpirado(respuesta); // Interceptamos
    if (!respuesta.ok) throw new Error('Error al actualizar la ubicación');
    return await respuesta.json();
};

export const crearEquipo = async (nuevoItem) => {
    const token = localStorage.getItem('token');

    const payload = {
        ...nuevoItem,
        atributos: nuevoItem.atributos || {}
    };

    const respuesta = await fetch('/api/items/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    verificarTokenExpirado(respuesta);

    if (!respuesta.ok) {
        // En lugar de explotar con .json(), leemos el texto del error
        const errorTexto = await respuesta.text();
        console.error("Error detallado del backend:", errorTexto);
        throw new Error(errorTexto || 'Error al crear el equipo');
    }

    // Leemos la respuesta con seguridad
    const cuerpo = await respuesta.text();
    return cuerpo ? JSON.parse(cuerpo) : {};
};

export const registrarUsuario = async (nombre, email, password) => {
    const token = localStorage.getItem('token');

    const payload = {
        name: nombre,
        email: email,
        password: password
        // (Sin el rol, tal como lo quitaste)
    };

    const respuesta = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    verificarTokenExpirado(respuesta);

    if (!respuesta.ok) {
        const errorData = await respuesta.text();
        throw new Error(`Error al registrar usuario: ${errorData}`);
    }

    // SOLUCIÓN AQUÍ: Leemos como texto primero. 
    // Si Rust envió algo, lo convertimos a JSON. Si envió vacío, devolvemos un objeto de éxito.
    const text = await respuesta.text();
    return text ? JSON.parse(text) : { success: true };
};

export const obtenerUsuarios = async () => {
    const token = localStorage.getItem('token');
    const respuesta = await fetch('/api/auth/get-all', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    verificarTokenExpirado(respuesta); // Interceptamos
    if (!respuesta.ok) throw new Error('No se pudieron cargar los usuarios');
    return await respuesta.json();
};

export const eliminarUsuario = async (id) => {
    const token = localStorage.getItem('token');
    const respuesta = await fetch(`/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    verificarTokenExpirado(respuesta); // Interceptamos
    if (!respuesta.ok) throw new Error('Error al eliminar usuario');
    return true;
};

// 5. ACTUALIZAR EQUIPO (Para editar atributos)
export const actualizarEquipo = async (id, datosActualizados) => {
    const token = localStorage.getItem('token');

    // Mapeo: Si el componente envía "atributos", se cambia a "attributes"
    const payload = datosActualizados.atributos
        ? { attributes: datosActualizados.atributos }
        : datosActualizados;

    const respuesta = await fetch(`/api/items/update/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!respuesta.ok) throw new Error('Error al actualizar el equipo');
    return await respuesta.json();
};

export const actualizarUsuario = async (id, data) => {
    const token = localStorage.getItem('token');

    const payload = {
        name: data.name,
        email: data.email,
        ...(data.password && data.password.length > 0 && { password: data.password })
    };

    const respuesta = await fetch(`/api/auth/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    verificarTokenExpirado(respuesta); // Interceptamos 401

    if (!respuesta.ok) {
        const errorTexto = await respuesta.text();
        throw new Error(errorTexto || "Error al actualizar usuario");
    }

    return await respuesta.json();
};