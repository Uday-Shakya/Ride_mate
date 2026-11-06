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
