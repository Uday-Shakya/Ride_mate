import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet icon paths in Vite/bundler environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const defaultCenter = [28.6139, 77.2090]; // Default center [lat, lng]

const LiveTracking = () => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    const [currentPosition, setCurrentPosition] = useState({
        lat: defaultCenter[0],
        lng: defaultCenter[1]
    });

    // Initialize Map on mount
    useEffect(() => {
        if (!mapContainerRef.current) return;

        const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

        const map = L.map(mapContainerRef.current, {
            center: [currentPosition.lat, currentPosition.lng],
            zoom: 15,
            zoomControl: false
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Geoapify map tiles (gracefully fallback to OpenStreetMap tiles if no key provided yet)
        const tileUrl = apiKey
            ? `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        L.tileLayer(tileUrl, {
            maxZoom: 20,
            attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | &copy; OpenStreetMap contributors'
        }).addTo(map);

        const marker = L.marker([currentPosition.lat, currentPosition.lng]).addTo(map);

        mapInstanceRef.current = map;
        markerRef.current = marker;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
            markerRef.current = null;
        };
    }, []);

    // Live Geolocation Tracking
    useEffect(() => {
        if (!navigator.geolocation) return;

        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });

            if (markerRef.current) {
                markerRef.current.setLatLng([latitude, longitude]);
            }
            if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([latitude, longitude]);
            }
        };

        navigator.geolocation.getCurrentPosition(handleSuccess);
        const watchId = navigator.geolocation.watchPosition(handleSuccess);

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '100%', zIndex: 0 }}
        />
    );
};

export default LiveTracking;