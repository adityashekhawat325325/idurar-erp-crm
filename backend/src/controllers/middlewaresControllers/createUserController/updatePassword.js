const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generate: uniqueId } = require('shortid');
const { clearAuthCache } = require('@/cache');

const updatePassword = async (userModel, req, res) => {
  const UserPassword = mongoose.model(userModel + 'Password');

  const reqUserName = userModel.toLowerCase();
  const userProfile = req[reqUserName];

  let { password } = req.body;

  if (password.length < 8)
    return res.status(400).json({
      msg: 'The password needs to be at least 8 characters long.',
    });

  // Find document by id and updates with the required fields

  if (userProfile.email === 'admin@admin.com') {
    return res.status(403).json({
      success: false,
      result: null,
      message: "you couldn't update demo password",
    });
  }

  const salt = uniqueId();

  const passwordHash = bcrypt.hashSync(salt + password);

  // sign out every session of that user, except the requester's own when changing their own password
  const authHeader = req.headers['authorization'];
  const currentToken = authHeader && authHeader.split(' ')[1];
  const isSelf = userProfile._id.toString() === req.params.id;

  const UserPasswordData = {
    password: passwordHash,
    salt: salt,
    loggedSessions: isSelf && currentToken ? [currentToken] : [],
  };

  const resultPassword = await UserPassword.findOneAndUpdate(
    { user: req.params.id, removed: false },
    { $set: UserPasswordData },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();
  clearAuthCache(req.params.id);

  // Code to handle the successful response

  if (!resultPassword) {
    return res.status(403).json({
      success: false,
      result: null,
      message: "User Password couldn't save correctly",
    });
  }

  return res.status(200).json({
    success: true,
    result: {},
    message: 'we update the password by this id: ' + userProfile._id,
  });
};

module.exports = updatePassword;
