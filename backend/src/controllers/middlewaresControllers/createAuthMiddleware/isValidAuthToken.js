const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const { authCache, authCacheKey } = require('@/cache');

const isValidAuthToken = async (req, res, next, { userModel, jwtSecret = 'JWT_SECRET' }) => {
  try {
    const UserPassword = mongoose.model(userModel + 'Password');
    const User = mongoose.model(userModel);

    // const token = req.cookies[`token_${cloud._id}`];
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token

    if (!token)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'No authentication token, authorization denied.',
        jwtExpired: true,
      });

    const verified = jwt.verify(token, process.env[jwtSecret]);

    if (!verified)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Token verification failed, authorization denied.',
        jwtExpired: true,
      });

    const cacheKey = authCacheKey(verified.id);
    let session = authCache.get(cacheKey);

    if (!session) {
      const userPasswordPromise = UserPassword.findOne(
        { user: verified.id, removed: false },
        { loggedSessions: 1 }
      ).lean();
      const userPromise = User.findOne({ _id: verified.id, removed: false });

      const [user, userPassword] = await Promise.all([userPromise, userPasswordPromise]);

      if (!user || !userPassword)
        return res.status(401).json({
          success: false,
          result: null,
          message: "User doens't Exist, authorization denied.",
          jwtExpired: true,
        });

      session = { user, loggedSessions: new Set(userPassword.loggedSessions) };
      authCache.set(cacheKey, session);
    }

    const { user, loggedSessions } = session;

    if (!loggedSessions.has(token))
      return res.status(401).json({
        success: false,
        result: null,
        message: 'User is already logout try to login, authorization denied.',
        jwtExpired: true,
      });
    else {
      const reqUserName = userModel.toLowerCase();
      req[reqUserName] = user;
      next();
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
      controller: 'isValidAuthToken',
      jwtExpired: true,
    });
  }
};

module.exports = isValidAuthToken;
