const router = require('express').Router();
const middleware = require('./lib/middleware');
const controllers = require('./lib/controllers');

router.get('/', middleware.isAuthenticated, controllers.get);

module.exports = router;
