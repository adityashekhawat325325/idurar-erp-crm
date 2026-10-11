const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  settingCategory: {
    type: String,
    required: true,
    lowercase: true,
  },
  settingKey: {
    type: String,
    lowercase: true,
    required: true,
  },
  settingValue: {
    type: mongoose.Schema.Types.Mixed,
  },
  valueType: {
    type: String,
    default: 'String',
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  isCoreSetting: {
    type: Boolean,
    default: false,
  },
});

settingSchema.index({ settingKey: 1 }, { unique: true });

// keep the cached settings in sync with every write that goes through the model
const { clearSettingsCache } = require('../../cache');

settingSchema.post('save', clearSettingsCache);
settingSchema.post(
  ['findOneAndUpdate', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany'],
  clearSettingsCache
);

module.exports = mongoose.model('Setting', settingSchema);
