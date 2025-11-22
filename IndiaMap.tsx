import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import indiaGeoJSON from '@/data/india-states.json';

// Fix for Leaflet marker icons
const getColoredIcon = (color: string): L.Icon => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
};

const IndiaMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add India GeoJSON
    L.geoJSON(indiaGeoJSON, {
      style: {
        fillColor: '#1A365D',
        fillOpacity: 0.2,
        color: '#1A365D',
        weight: 1
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<b>${feature.properties.name}</b>`);
      }
    }).addTo(map);

    // Add sample markers for product availability
    const markers = [
      { lat: 28.6139, lng: 77.2090, name: 'Delhi', products: 150 },
      { lat: 19.0760, lng: 72.8777, name: 'Mumbai', products: 200 },
      { lat: 12.9716, lng: 77.5946, name: 'Bangalore', products: 180 },
      { lat: 22.5726, lng: 88.3639, name: 'Kolkata', products: 120 },
      { lat: 13.0827, lng: 80.2707, name: 'Chennai', products: 160 }
    ];

    markers.forEach(marker => {
      L.marker([marker.lat, marker.lng], {
        icon: getColoredIcon('blue')
      })
        .bindPopup(`<b>${marker.name}</b><br>Available Products: ${marker.products}`)
        .addTo(map);
    });

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full"
      style={{ minHeight: '500px' }}
    />
  );
};

export default IndiaMap; 