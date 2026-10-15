const NodeCache = require('node-cache');

// In-process caches. With more than one server instance these should move to a shared store (e.g. Redis).
const settingsCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });
const authCache = new NodeCache({ stdTTL: 60, useClones: false });

const SETTINGS_KEY = 'allSettings';

const clearSettingsCache = () => settingsCache.del(SETTINGS_KEY);

const authCacheKey = (userId) => 'auth:' + userId.toString();

const clearAuthCache = (userId) => {
  if (userId) authCache.del(authCacheKey(userId));
};

module.exports = {
  settingsCache,
  authCache,
  SETTINGS_KEY,
  clearSettingsCache,
  authCacheKey,
  clearAuthCache,
};
