const router = require('express').Router();
const controllers = require('./lib/controllers');
const middleware = require('./lib/middlewares');

router.use(middleware.isAuthenticated);
router.post('/buy', controllers.buyChips);
router.get('/list', controllers.transactionList);

module.exports = router;
