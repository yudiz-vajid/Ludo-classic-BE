const router = require('express').Router();
const controllers = require('./lib/controllers');
const middleware = require('./lib/middlewares');

router.use(middleware.isAuthenticated);

router.get('/', controllers.get);
router.post('/addProto', controllers.addProto);
router.post('/setting', controllers.userSetting);

module.exports = router;
