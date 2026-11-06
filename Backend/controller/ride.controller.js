const rideService = require('../services/ride.sevice')
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');




module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);

        // Notify captains in background without blocking response
        (async () => {
            try {
                let pickupCoordinates = null;
                try {
                    pickupCoordinates = await mapService.getAddressCoordinates(pickup);
                } catch (coordErr) {
                    console.log('Could not geocode pickup address for radius filter, falling back to active captains:', coordErr.message);
                }

                const ltd = pickupCoordinates ? pickupCoordinates.ltd : undefined;
                const lng = pickupCoordinates ? pickupCoordinates.lng : undefined;

                const captainsInRadius = await mapService.getCaptainsInTheRadius(ltd, lng, 10);

                const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
                if (rideWithUser) {
                    rideWithUser.otp = "";
                }

                console.log(`[Ride Dispatch] Found ${captainsInRadius.length} captain(s) for new ride: ${ride._id}`);

                captainsInRadius.forEach(captain => {
                    if (captain.socketId) {
                        console.log(`[Ride Dispatch] Emitting 'new-ride' to captain: ${captain._id} (socket: ${captain.socketId})`);
                        sendMessageToSocketId(captain.socketId, {
                            event: 'new-ride',
                            data: rideWithUser
                        });
                    } else {
                        console.log(`[Ride Dispatch] Captain ${captain._id} has no active socketId`);
                    }
                });
            } catch (notifyErr) {
                console.error('[Ride Dispatch Error]:', notifyErr);
            }
        })();

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }

};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}
module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.rateCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, rating, feedback } = req.body;

    try {
        const result = await rideService.rateCaptain({
            rideId,
            rating: Number(rating),
            feedback,
            userId: req.user._id
        });

        // Notify captain in real-time via socket if captain is connected
        if (result.captain && result.captain.socketId) {
            sendMessageToSocketId(result.captain.socketId, {
                event: 'rating-received',
                data: {
                    rideId: result.ride._id,
                    rating: Number(rating),
                    feedback: feedback || '',
                    captainRating: result.captain.rating,
                    totalRatings: result.captain.totalRatings
                }
            });
        }

        return res.status(200).json({
            message: 'Captain rated successfully',
            ride: result.ride,
            captain: {
                _id: result.captain._id,
                fullname: result.captain.fullname,
                rating: result.captain.rating,
                totalRatings: result.captain.totalRatings
            }
        });
    } catch (err) {
        console.error('Error rating captain:', err);
        return res.status(500).json({ message: err.message });
    }
}