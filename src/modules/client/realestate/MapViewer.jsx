import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
// Using CDN URLs to avoid Vite resolution issues with assets inside node_modules
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to handle map clicks for location selection
function LocationMarker({ onLocationSelect, initialPosition }) {
  const [position, setPosition] = React.useState(initialPosition || null);
  const map = useMap();

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
      map.flyTo(initialPosition, map.getZoom());
    }
  }, [initialPosition, map]);

  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        setPosition(e.latlng);
        onLocationSelect(e.latlng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Ubicación seleccionada</Popup>
    </Marker>
  );
}

// Helper to center map when terrains change
function MapRecenter({ terrains }) {
  const map = useMap();
  useEffect(() => {
    if (terrains && terrains.length > 0) {
      const validTerrains = terrains.filter(t => t.coordinates);
      if (validTerrains.length > 0) {
        const bounds = L.latLngBounds(validTerrains.map(t => [t.coordinates.lat, t.coordinates.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [terrains, map]);
  return null;
}

const MapViewer = ({ terrains, onLocationSelect, selectedLocation, readOnly = false, height = "400px" }) => {
  const center = selectedLocation || (terrains && terrains.length > 0 && terrains[0].coordinates) || { lat: -12.046374, lng: -77.042793 }; // Lima as default

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-lg border border-white/20" style={{ height }}>
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={13} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {readOnly && terrains && terrains.map((terrain) => (
          terrain.coordinates && (
            <Marker key={terrain.id} position={[terrain.coordinates.lat, terrain.coordinates.lng]}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-slate-800">{terrain.address}</h3>
                  <p className="text-xs text-slate-600">{terrain.district}, {terrain.city}</p>
                  <p className="text-sm font-semibold mt-1">S/ {terrain.totalPrice?.toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {!readOnly && (
          <LocationMarker 
            onLocationSelect={onLocationSelect} 
            initialPosition={selectedLocation} 
          />
        )}

        {readOnly && terrains && <MapRecenter terrains={terrains} />}
      </MapContainer>
    </div>
  );
};

export default MapViewer;
