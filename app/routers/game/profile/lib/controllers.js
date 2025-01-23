const { BoardProtoType, User } = require('../../../../models');

const controllers = {};

controllers.get = async (req, res) => {
  try {
    const query = {
      _id: req.user._id,
    };
    const project = {
      sUserName: true,
      sEmail: true,
      nChips: true,
      nGameWon: true,
      nGamePlayed: true,
      nGameLost: true,
      bVibrationEnabled: true,
      bSoundEnabled: true,
      bMusicEnabled: true,
      aLudoBoard: true,
    };
    const user = await User.findOne(query, project).lean();
    return res.reply(messages.success(), { ...user, nGamePlayed: user.nGameWOn + user.nGameLost });
  } catch (error) {
    res.reply(messages.server_error(), error);
  }
};

controllers.userSetting = async (req, res) => {
  try {
    const data = _.pick(req.body, ['bVibrationEnabled', 'bSoundEnabled', 'bMusicEnabled']);
    const query = {};

    if (['true', 'false'].includes(data.bVibrationEnabled)) query.bVibrationEnabled = data.bVibrationEnabled;
    if (['true', 'false'].includes(data.bSoundEnabled)) query.bSoundEnabled = data.bSoundEnabled;
    if (['true', 'false'].includes(data.bMusicEnabled)) query.bMusicEnabled = data.bMusicEnabled;

    await User.updateOne({ _id: req.user._id }, { $set: query });
    return res.reply(messages.success());
  } catch (error) {
    res.reply(messages.server_error(), error);
  }
};

controllers.addProto = async (req, res) => {
  try {
    const body = _.pick(req.body, ['nBoardFee', 'sName', 'nMaxPlayer', 'aWinningAmount', 'eBoardType', 'nGameType']);
    if (!body.nBoardFee) return res.reply(messages.required_field('nBoardFee'));
    if (!body.sName) return res.reply(messages.required_field('board Name'));
    if (!body.aWinningAmount) return res.reply(messages.required_field('Winning Amount'));
    await BoardProtoType.create(body);
    res.reply(messages.success('add proto'));
  } catch (error) {
    res.reply(messages.server_error(), error);
  }
};
module.exports = controllers;
