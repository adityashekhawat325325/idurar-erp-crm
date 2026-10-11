const listAllSettings = require('./listAllSettings');
const { settingsCache, SETTINGS_KEY } = require('@/cache');

const loadSettings = async () => {
  const cached = settingsCache.get(SETTINGS_KEY);
  if (cached) return { ...cached };

  const allSettings = {};
  const datas = await listAllSettings();
  datas.forEach(({ settingKey, settingValue }) => {
    allSettings[settingKey] = settingValue;
  });

  // don't cache an empty result, listAllSettings returns [] on DB errors
  if (datas.length > 0) settingsCache.set(SETTINGS_KEY, allSettings);

  return { ...allSettings };
};

module.exports = loadSettings;
