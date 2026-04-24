import { useState } from 'react';
import { moverEquipo } from '../../services/api';

export const ItemCard = ({ item, recargarInventario }) => {
  const [nuevaUbicacion, setNuevaUbicacion] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleMover = async () => {
    if (!nuevaUbicacion || nuevaUbicacion === item.ubicacion) return;

    setCargando(true);
    try {
      await moverEquipo(item.id, nuevaUbicacion);
      // Si todo sale bien, le avisamos al componente padre que recargue los datos
      recargarInventario();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al mover el equipo");
    } finally {
      setCargando(false);
    }
  };

  // Extraemos los atributos si existen (en Rust es un Option<JSON>)
  const atributos = item.atributos || {};

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white w-full max-w-sm">
      {/* Cabecera */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-800">{item.nombre}</h3>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          {item.ubicacion}
        </span>
      </div>

      {/* Atributos JSON dinámicos */}
      <ul className="text-sm text-gray-600 mb-4 space-y-1">
        <li><span className="font-medium text-gray-700">Categoría:</span> {item.categoria_global}</li>
        <li><span className="font-medium text-gray-700">Stock:</span> {item.cantidad}</li>
        {Object.entries(atributos).map(([key, value]) => (
          <li key={key}>
            <span className="font-medium text-gray-700 capitalize">{key}:</span> {value}
          </li>
        ))}
      </ul>

      {/* Acciones: Select + Botón */}
      <div className="flex gap-2">
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          value={nuevaUbicacion}
          onChange={(e) => setNuevaUbicacion(e.target.value)}
          disabled={cargando}
        >
          <option value="">Mover a...</option>
          {['IT', 'Deposito', 'En uso', 'Ronny'].map((ubic) => (
            // Evitamos mostrar la ubicación actual en el select
            ubic !== item.ubicacion && (
              <option key={ubic} value={ubic}>{ubic}</option>
            )
          ))}
        </select>

        <button
          onClick={handleMover}
          disabled={!nuevaUbicacion || cargando}
          className={`font-medium rounded-md text-sm px-4 py-2 transition-colors ${!nuevaUbicacion || cargando
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          {cargando ? '...' : 'Mover'}
        </button>
      </div>
    </div>
  );
};