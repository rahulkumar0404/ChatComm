const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    password: { type: String },
  },
  { timestamps: true }
);
UserSchema.path('username').index({ unique: true });
const UserModal = mongoose.model('User', UserSchema);

module.exports = UserModal;
