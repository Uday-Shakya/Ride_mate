const axios = require('axios');
const captainModel = require('../models/captain.model');

// Helper to extract or resolve coordinates from an address or "lat,lng" string
const parseOrGetCoordinates = async (location) => {
    if (!location) {
        throw new Error('Location is required');
    }

    if (typeof location === 'object' && location.ltd !== undefined && location.lng !== undefined) {
        return { ltd: location.ltd, lng: location.lng };
    }

    if (typeof location === 'string') {
        const coordMatch = location.trim().match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
        if (coordMatch) {
            return {
                ltd: parseFloat(coordMatch[1]),
                lng: parseFloat(coordMatch[3])
            };
        }
    }

    return await module.exports.getAddressCoordinates(location);
};

module.exports.getAddressCoordinates = async (address) => {
    if (!address) {
        throw new Error('Address is required');
    }

    // Direct lat,lng string support
    if (typeof address === 'string') {
        const coordMatch = address.trim().match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
        if (coordMatch) {
            return {
                ltd: parseFloat(coordMatch[1]),
                lng: parseFloat(coordMatch[3])
            };
        }
    }

    const apiKey = process.env.GEOAPIFY_API_KEY || process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        throw new Error('Geoapify API key is missing. Set GEOAPIFY_API_KEY in .env');
    }

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.features && response.data.features.length > 0) {
            const feature = response.data.features[0];
            const lat = feature.properties?.lat ?? feature.geometry?.coordinates[1];
            const lng = feature.properties?.lon ?? feature.geometry?.coordinates[0];

            return {
                ltd: lat,
                lng: lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error('Geoapify geocode error:', error.message);
        throw error;
    }
};

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GEOAPIFY_API_KEY || process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        throw new Error('Geoapify API key is missing. Set GEOAPIFY_API_KEY in .env');
    }

    const originCoords = await parseOrGetCoordinates(origin);
    const destCoords = await parseOrGetCoordinates(destination);

    const url = `https://api.geoapify.com/v1/routing?waypoints=${originCoords.ltd},${originCoords.lng}|${destCoords.ltd},${destCoords.lng}&mode=drive&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);

        if (response.data && response.data.features && response.data.features.length > 0) {
            const properties = response.data.features[0].properties;

            const distanceMeters = Math.round(properties.distance);
            const durationSeconds = Math.round(properties.time);

            return {
                distance: {
                    text: `${(distanceMeters / 1000).toFixed(1)} km`,
                    value: distanceMeters
                },
                duration: {
                    text: `${Math.round(durationSeconds / 60)} mins`,
                    value: durationSeconds
                },
                status: 'OK'
            };
        } else {
            throw new Error('No routes found');
        }
    } catch (err) {
        console.error('Geoapify routing error:', err.message);
        throw err;
    }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GEOAPIFY_API_KEY || process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        throw new Error('Geoapify API key is missing. Set GEOAPIFY_API_KEY in .env');
    }

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(input)}&apiKey=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data && response.data.features) {
            return response.data.features
                .map(feature => feature.properties?.formatted)
                .filter(Boolean);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error('Geoapify autocomplete error:', err.message);
        throw err;
    }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // radius in km (default to 50 km for local development and testing)
    const searchRadius = radius && radius > 2 ? radius : 50;

    let captains = [];

    if (ltd !== undefined && lng !== undefined) {
        try {
            captains = await captainModel.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [ [ ltd, lng ], searchRadius / 6371 ]
                    }
                }
            });
        } catch (err) {
            console.error('Error in $geoWithin query:', err.message);
        }
    }

    // Fallback: If no captains found in geographic radius (e.g., testing or cross-city addresses),
    // find any captain who is currently connected via socket (active socketId)
    if (!captains || captains.length === 0) {
        console.log('No captains found in radius. Falling back to all connected captains.');
        captains = await captainModel.find({
            socketId: { $exists: true, $ne: null, $ne: '' }
        });
    }

    return captains;
};