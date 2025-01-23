const { User, Transaction } = require('../../../../models');
const { requestLimiter } = require('../../../../utils');

const middleware = {};

middleware.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.header('authorization');
        if (!token) return res.reply(messages.unauthorized());

        const decodedToken = _.decodeToken(token);
        if (!decodedToken) return res.reply(messages.unauthorized());

        const project = {
            sUserName: true,
            sEmail: true,
            eStatus: true,
            sToken: true,
            nChips: true,
            eUserType: true,
            // oBanking: true,
            // oKYC: true,
            // oClubInfo: true,
            // nWithdrawable: true,
            // isEmailVerified: true,
        };

        const user = await User.findOne({ _id: decodedToken._id }, project).lean();

        if (!user) return res.reply(messages.custom.user_not_found);
        if (user.sToken !== token) return res.reply(messages.unauthorized());
        if (user.eStatus === 'd') return res.reply(messages.custom.user_deleted);
        if (user.eStatus === 'n') return res.reply(messages.custom.user_blocked);
        req.user = user;
        next();
    } catch (error) {
        return res.reply(messages.server_error(), error.toString());
    }
};

// middleware.getSettings = (req, res, next) => {
//     const project = { oPurchaseRange: 1, oWithdrawRange: 1 };
//     Setting.findOne({}, project, (error, response) => {
//         if (error) return res.reply(messages.server_error(), error.toString());
//         req.settings = response;
//         next();
//     });
// };

middleware.apiLimiter = (req, res, next) => {
    const params = {
        path: req.path,
        remoteAddress: req.sRemoteAddress || '127.0.0.1',
        maxRequestTime: 1000,
    };
    requestLimiter.setLimit(params, (error) => {
        if (error) return res.reply(messages.too_many_request());
        next();
    });
};

module.exports = middleware;
