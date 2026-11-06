const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');
const mongoose = require('mongoose');
const mapService = require('./maps.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');



async function getFare(pickup, destination) {

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };



    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };

    return fare;


}
module.exports.getFare = getFare;

function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}

module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);



    const ride = rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[ vehicleType ]
    })

    return ride;
}

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}
module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed',
        completedAt: new Date()
    })

    return ride;
}

module.exports.rateCaptain = async ({ rideId, rating, feedback, userId }) => {
    if (!rideId || !rating) {
        throw new Error('Ride ID and rating are required');
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        user: userId
    }).populate('captain');

    if (!ride) {
        throw new Error('Ride not found or unauthorized');
    }

    if (!ride.captain) {
        throw new Error('No captain assigned to this ride');
    }

    // Update ride rating and feedback
    ride.rating = numericRating;
    ride.feedback = feedback ? String(feedback).trim() : '';
    ride.ratedAt = new Date();
    await ride.save();

    const captainId = ride.captain._id ? ride.captain._id : ride.captain;

    // Recalculate captain average rating and total ratings via aggregation
    const stats = await rideModel.aggregate([
        {
            $match: {
                captain: new mongoose.Types.ObjectId(captainId),
                rating: { $exists: true, $ne: null }
            }
        },
        {
            $group: {
                _id: '$captain',
                avgRating: { $avg: '$rating' },
                totalRatings: { $sum: 1 }
            }
        }
    ]);

    const avgRating = stats.length > 0 ? parseFloat(stats[0].avgRating.toFixed(1)) : numericRating;
    const totalRatings = stats.length > 0 ? stats[0].totalRatings : 1;

    const updatedCaptain = await captainModel.findByIdAndUpdate(
        captainId,
        {
            rating: avgRating,
            totalRatings: totalRatings
        },
        { new: true }
    );

    return {
        ride,
        captain: updatedCaptain
    };
};