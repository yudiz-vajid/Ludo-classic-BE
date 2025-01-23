const router = require('express').Router();

const profileRoute = require('./profile');
const authRoute = require('./auth');
const ludoRoute = require('./ludo');
const transactionRoute = require('./transaction');
const stateRoute = require('./state');

router.use('/profile', profileRoute);
router.use('/auth', authRoute);
router.use('/ludo', ludoRoute);
router.use('/transaction', transactionRoute);
router.use('/state', stateRoute);

module.exports = router;
