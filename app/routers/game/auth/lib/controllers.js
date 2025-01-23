const { User } = require('../../../../models');
const { fakeUser } = require('../../../../utils');

const controllers = {};

controllers.register = async (req, res) => {
  try {
    const body = _.pick(req.body, ['sEmail', 'sPassword', 'sUserName']);

    if (!body.sEmail) return res.reply(messages.required_field('Email'));
    if (!body.sPassword) return res.reply(messages.required_field('Password'));
    if (!body.sUserName) return res.reply(messages.required_field('user Name'));

    if (_.isEmail(body.sEmail)) return res.reply(messages.wrong_format('Email'));
    if (_.isPassword(body.sPassword)) return res.reply(messages.wrong_format('password'));

    const query = {
      sEmail: body.sEmail,
    };

    const _user = await User.findOne(query).lean();
    if (_user) return res.reply(messages.already_exists('email'));
    body.sPassword = _.encryptPassword(body.sPassword);
    await User.create(body);
    res.reply(messages.success());
  } catch (error) {
    console.log(error);
    res.reply(messages.server_error(), error);
  }
};

controllers.simpleLogIn = async (req, res) => {
  try {
    const body = _.pick(req.body, ['sEmail', 'sPassword']);

    if (!body.sEmail) return res.reply(messages.required_field('Email'));
    if (!body.sPassword) return res.reply(messages.required_field('Password'));

    const query = {
      sEmail: body.sEmail,
    };

    const _user = await User.findOne(query);
    if (!_user || _user.sPassword !== _.encryptPassword(body.sPassword)) return res.reply(messages.custom.user_not_found);
    _user.sToken = _.encodeToken({ _id: _user._id });
    await _user.save();
    return res.reply(messages.success(), {}, { authorization: _user.sToken });
  } catch (error) {
    console.log(error);
    res.reply(messages.server_error(), error);
  }
};

controllers.logout = async (req, res) => {
  try {
    await User.updateOne({ _id: req.user._id }, { $unset: { sToken: true } });
    res.reply(messages.success());
  } catch (error) {
    res.reply(messages.server_error(), error);
  }
};

controllers.refreshToken = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    user.sToken = _.encodeToken({ _id: user._id.toString(), eUserType: user.eUserType });
    await user.save();
    return res.reply(messages.success('Login'), {}, { authorization: user.sToken });
  } catch (error) {
    res.reply(messages.server_error(), error);
  }
};

controllers.autoLoginUsers = async (req, res) => {
  try {
    const users = await User.find({ sToken: { $exists: false } }, { eUserType: true });
    for (const user of users) {
      user.sToken = _.encodeToken({ _id: user._id.toString(), eUserType: user.eUserType });
      await user.save();
    }
    return res.reply(messages.success('Auto Login'), {});
  } catch (error) {
    res.reply(messages.server_error(), error);
  }
};

controllers.guestLogin = async (req, res) => {
  try {
    const body = _.pick(req.body, ['sDeviceId']);

    if (!body.sDeviceId) return res.reply(messages.required_field('Device Id'));
    const user = await User.findOne({ sDeviceId: body.sDeviceId }, { sToken: 1, _id: 0 }).lean();

    let newUser;
    if (!user) {
      let createUser = fakeUser.getRandomPlayer();
      createUser.sDeviceId = body.sDeviceId;
      newUser = await User.create(createUser);
      newUser.sToken = _.encodeToken({ _id: newUser._id });
      newUser.eUserType = 'user';
      await newUser.save();
      newUser = { sToken: newUser.sToken };
    }
    req.user = !user ? newUser : user;

    return res.reply(messages.success(), req.user, { authorization: req.user.sToken });
  } catch (error) {
    return res.reply(messages.server_error(), error);
  }
};

module.exports = controllers;
