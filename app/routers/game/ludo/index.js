const router = require('express').Router();
const controllers = require('./lib/controllers');
const middleware = require('./lib/middlewares');

router.post('/board/initGame', middleware.isApiKeyValid, middleware.createPrototype, controllers.joinTableMM);
router.get('/board/game/:iGameId', middleware.isApiKeyValid, controllers.findGame);
router.get('/board/stuck-game/:iGameId', middleware.isApiKeyValid, controllers.findStuckGame);
router.get('/board/status', middleware.isClientAuthenticated, controllers.gatGameState);

// // NewMode Two Token
// router.post('/board/token/initGame', middleware.isApiKeyValid, middleware.createPrototype, controllers.joinTableTT);

// // NewMode Popular
// router.post('/board/popular/initGame', middleware.isApiKeyValid, middleware.PopularModePrototype, controllers.joinTableTT);

// // NewMode Quick
// router.post('/board/quick/initGame', middleware.isApiKeyValid, middleware.quickModePrototype, controllers.joinTableTT);

module.exports = router;
