const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const {validationResult} = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');
const rideModel = require('../models/ride.model');

module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreayExist = await captainModel.findOne({
        email
    });
    if (isCaptainAlreayExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname || undefined,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });
    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });
}

module.exports.loginCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);
    res.status(200).json({ token, captain });
}
module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain});
}
module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blackListTokenModel.create({ token });
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}

module.exports.getCaptainRatings = async (req, res, next) => {
    try {
        const reviews = await rideModel.find({
            captain: req.captain._id,
            rating: { $exists: true, $ne: null }
        })
        .populate('user', 'fullname')
        .select('rating feedback ratedAt pickup destination fare')
        .sort({ ratedAt: -1 })
        .limit(20);

        return res.status(200).json({
            rating: req.captain.rating || 5,
            totalRatings: req.captain.totalRatings || 0,
            reviews
        });
    } catch (err) {
        console.error('Error fetching captain ratings:', err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.getCaptainStats = async (req, res, next) => {
    try {
        const captainId = req.captain._id;

        // Fetch all completed rides for this captain
        const completedRides = await rideModel.find({
            captain: captainId,
            status: 'completed'
        }).sort({ completedAt: -1, updatedAt: -1 });

        // Calculate today's start date
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        let earnedToday = 0;
        let totalMeters = 0;
        let totalDurationSec = 0;

        completedRides.forEach(ride => {
            const rideDate = ride.completedAt || ride.updatedAt || ride.createdAt;
            if (rideDate && new Date(rideDate) >= startOfToday) {
                earnedToday += Number(ride.fare) || 0;
            }

            if (ride.distance && typeof ride.distance === 'number') {
                totalMeters += ride.distance;
            } else if (ride.fare) {
                // Approximate 1 km per ~12 fare if route distance wasn't logged
                totalMeters += Math.round((ride.fare / 12) * 1000);
            }

            if (ride.duration && typeof ride.duration === 'number') {
                totalDurationSec += ride.duration;
            } else if (ride.fare) {
                // Approximate ~2.5 mins per ride unit
                totalDurationSec += Math.round((ride.fare / 10) * 150);
            }
        });

        const totalDistanceKm = Number((totalMeters / 1000).toFixed(1));
        const hoursOnline = Number((totalDurationSec / 3600).toFixed(1));

        return res.status(200).json({
            earnedToday,
            totalJobs: completedRides.length,
            totalDistance: totalDistanceKm,
            hoursOnline,
            rating: req.captain.rating || 5.0,
            totalRatings: req.captain.totalRatings || 0,
            vehicle: req.captain.vehicle,
            profilePicture: req.captain.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
        });
    } catch (err) {
        console.error('Error fetching captain stats:', err);
        return res.status(500).json({ message: err.message });
    }
}

module.exports.updateProfilePicture = async (req, res, next) => {
    try {
        const { profilePicture } = req.body;
        if (!profilePicture || typeof profilePicture !== 'string') {
            return res.status(400).json({ message: 'Valid profile picture URL or image data is required' });
        }

        const captain = await captainModel.findByIdAndUpdate(
            req.captain._id,
            { profilePicture },
            { new: true }
        );

        return res.status(200).json({
            message: 'Profile picture updated successfully',
            captain
        });
    } catch (err) {
        console.error('Error updating captain profile picture:', err);
        return res.status(500).json({ message: err.message });
    }
}
