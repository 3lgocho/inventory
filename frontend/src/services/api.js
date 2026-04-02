export const obtenerInventario = async () => {
    const respuesta = await fetch('/api/inventario');
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor Rust');
    return await respuesta.json();
};

export const moverEquipo = async (id, nueva_ubicacion) => {
    const respuesta = await fetch('/api/inventario/mover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nueva_ubicacion }),
    });
    if (!respuesta.ok) throw new Error('Error al actualizar la ubicación');
    return await respuesta.json();
};