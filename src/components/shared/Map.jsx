import { MapPin, Navigation } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useCallback, useRef, useState } from 'react';
import Map, { Layer, Marker, Source } from 'react-map-gl';
import { DEFAULT_CENTER, MAPBOX_TOKEN } from '../../utils/constants';

const MapComponent = ({ origin, destination, onOriginChange, onDestinationChange }) => {
  const [viewport, setViewport] = useState({
    latitude: DEFAULT_CENTER.lat,
    longitude: DEFAULT_CENTER.lng,
    zoom: 12
  });

  const [selectingOrigin, setSelectingOrigin] = useState(false);
  const [selectingDestination, setSelectingDestination] = useState(false);

  const mapRef = useRef();

  const handleMapClick = useCallback((event) => {
    const { lng, lat } = event.lngLat;

    if (selectingOrigin) {
      onOriginChange({ lat, lng });
      setSelectingOrigin(false);
    } else if (selectingDestination) {
      onDestinationChange({ lat, lng });
      setSelectingDestination(false);
    }
  }, [selectingOrigin, selectingDestination, onOriginChange, onDestinationChange]);

  // Ruta entre origen y destino
  const routeGeoJSON = origin && destination ? {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [origin.lng, origin.lat],
        [destination.lng, destination.lat]
      ]
    }
  } : null;

  const routeLayer = {
    id: 'route',
    type: 'line',
    paint: {
      'line-color': '#3b82f6',
      'line-width': 4,
      'line-opacity': 0.8
    }
  };

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        onClick={handleMapClick}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Marcador de Origen */}
        {origin && (
          <Marker longitude={origin.lng} latitude={origin.lat}>
            <div className="relative">
              <MapPin className="w-8 h-8 text-green-600 drop-shadow-lg" fill="currentColor" />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Origen
              </div>
            </div>
          </Marker>
        )}

        {/* Marcador de Destino */}
        {destination && (
          <Marker longitude={destination.lng} latitude={destination.lat}>
            <div className="relative">
              <MapPin className="w-8 h-8 text-red-600 drop-shadow-lg" fill="currentColor" />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Destino
              </div>
            </div>
          </Marker>
        )}

        {/* Ruta */}
        {routeGeoJSON && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer {...routeLayer} />
          </Source>
        )}
      </Map>

      {/* Controles */}
      <div className="absolute top-4 right-4 space-y-2">
        <button
          onClick={() => {
            setSelectingOrigin(true);
            setSelectingDestination(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg font-semibold transition-colors ${
            selectingOrigin 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <MapPin className="w-5 h-5" />
          {selectingOrigin ? 'Selecciona origen en el mapa' : 'Seleccionar Origen'}
        </button>

        <button
          onClick={() => {
            setSelectingDestination(true);
            setSelectingOrigin(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg font-semibold transition-colors ${
            selectingDestination 
              ? 'bg-red-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Navigation className="w-5 h-5" />
          {selectingDestination ? 'Selecciona destino en el mapa' : 'Seleccionar Destino'}
        </button>
      </div>
    </div>
  );
};

export default MapComponent;