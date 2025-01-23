const crypto = require('crypto');
const { User, Transaction } = require('../../../../models');
const { razorpay } = require('../../../../utils');
const { mongodb } = require('../../../../utils');

const controllers = {};

controllers.buyChips = async (req, res) => {
    /**
     * @param nBonus calculated in middleware.
     */
    const body = _.pick(req.body, ['nAmount']);
    const user = _.pick(req.user, ['sEmail', 'sUserName', 'sMobile', '_id']);

    const transactionData = {
        _id: mongodb.mongify(),
        iUserId: user._id,
        nAmount: body.nAmount,
        nChips: body.nAmount,
        eType: 'credit',
        eMode: 'user',
        // oOrderResponse: {},
    };
    await Transaction.create(transactionData);
    return res.reply(messages.success('payment'));
    // if (body.iPromotionId && body.iPromotionId !== '') transactionData.iPromotionId = body.iPromotionId;
    // const transaction = new Transaction(transactionData);

    // const orderBody = {
    //     amount: body.nAmount * 100,
    //     currency: 'INR',
    //     payment_capture: 1, // for auto capture payment
    // };

    // razorpay.createOrder(orderBody, (error, response) => {
    //     if (error) return res.reply(messages.server_error(), error.toString());
    //     transaction.oOrderResponse = response;
    //     response.iTransactionId = transaction._id;
    //     transaction.save((error) => {
    //         if (error) return res.reply(messages.server_error(), error.toString());
    //         res.reply(messages.success(), response);
    //     });
    // });
};

controllers.transactionList = (req, res) => {
    const body = _.pick(req.query, ['size', 'sort', 'pageNumber']);
    const sort = {};
    if (!body.sort) sort.dCreatedDate = -1;
    if (body.sort) sort[body.sort] = body.orderBy === 'DESC' ? -1 : 1;
    const skip = parseInt(body.pageNumber || 0) * parseInt(body.size || 0);
    const limit = parseInt(body.size ? body.size : 10);
    const query = [
        {
            $match: {
                iUserId: mongodb.mongify(req.user._id),
            },
        },
        {
            $project: {
                eType: '$eType',
                sDescription: '$sDescription',
                eStatus: { $toUpper: '$eStatus' },
                nAmount: '$nAmount',
                dCreatedDate: '$dCreatedDate',
            },
        },
        {
            $facet: {
                transactions: [
                    {
                        $sort: sort,
                    },
                    {
                        $skip: skip,
                    },
                    {
                        $limit: limit,
                    },
                ],
                count: [
                    {
                        $count: 'totalData',
                    },
                ],
            },
        },
    ];
    Transaction.aggregate(query, (error, transactions) => {
        if (error) return res.reply(messages.server_error(), error.toString());
        return res.reply(messages.success(), transactions);
    });
};

module.exports = controllers;
