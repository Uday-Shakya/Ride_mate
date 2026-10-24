const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const mapsController = require('../controller/maps.controller');
const { query } = require('express-validator');



router.get('/get-coordinates', 
    query('address').isString().isLength({ min: 3 }),
    authMiddleware.authUser, mapsController.getCoordinates);

    router.get('/get-distance-time',
    query('origin').isString().isLength({ min: 3 }),
    query('destination').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapsController.getDistanceTime
);

router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapsController.getAutoCompleteSuggestions
)





module.exports = router;