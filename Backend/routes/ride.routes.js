const express = require('express');
const router = express.Router();
const { body , query} = require('express-validator');
const rideController = require('../controller/ride.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isLength({ min: 3 }).withMessage('Invalid vehicle type'),

    rideController.createRide
    )

    router.get('/get-fare',
        authMiddleware.authUser,
        query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
        query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
        rideController.getFare
    )
    router.post('/confirm',
        authMiddleware.authCaptain,
        body('rideId').isMongoId().withMessage('Invalid ride id'),
        rideController.confirmRide
    )
    router.get('/start-ride',
        authMiddleware.authCaptain,
        query('rideId').isMongoId().withMessage('Invalid ride id'),
        query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
        rideController.startRide
    )
    router.post('/end-ride',
        authMiddleware.authCaptain,
        body('rideId').isMongoId().withMessage('Invalid ride id'),
        rideController.endRide
    )

    router.post('/rate-captain',
        authMiddleware.authUser,
        body('rideId').isMongoId().withMessage('Invalid ride id'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('feedback').optional().isString().withMessage('Feedback must be a string'),
        rideController.rateCaptain
    )

    router.post('/rate',
        authMiddleware.authUser,
        body('rideId').isMongoId().withMessage('Invalid ride id'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('feedback').optional().isString().withMessage('Feedback must be a string'),
        rideController.rateCaptain
    )

    router.get('/latest-unrated',
        authMiddleware.authUser,
        rideController.getLatestUnratedRide
    )

    router.get('/user-rides',
        authMiddleware.authUser,
        rideController.getUserRides
    )

module.exports = router;