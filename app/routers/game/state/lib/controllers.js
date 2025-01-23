const { User } = require('../../../../models');
const boardManager = require('../../../../game/BoardManager');

const controllers = {};

controllers.get = async (req, res) => {
    const { aLudoBoard } = req.user;
    const aAvailableBoards = [];

    for (const boardId of aLudoBoard) {
        const board = await boardManager.getBoard(boardId);
        if (board) {
            const oParticipant = board.getParticipant(req.user._id.toString());
            if (oParticipant) aAvailableBoards.push(boardId);
        }
    }

    await User.updateOne({ _id: req.user._id }, { $set: { aLudoBoard: aAvailableBoards } });
    res.reply(messages.success(), aAvailableBoards);
};

module.exports = controllers;
