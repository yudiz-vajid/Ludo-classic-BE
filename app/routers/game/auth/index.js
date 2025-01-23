const router = require('express').Router();
const controllers = require('./lib/controllers');
const middleware = require('./lib/middlewares');

// router.use(middleware.apiLimiter);
router.post('/register', controllers.register);
router.post('/login/simple', controllers.simpleLogIn);
router.get('/logout', middleware.isAuthenticated, controllers.logout);
router.post('/token/refresh', middleware.isAuthenticated, controllers.refreshToken);
router.post('/autoLogin', controllers.autoLoginUsers);
router.post('/guestLogin', controllers.guestLogin);

module.exports = router;
