const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  pseudo: { type: String, required: true, unique: true, minlength: 3 },
  mdp:    { type: String, required: true }
});

userSchema.pre('save', async function () {
  if (this.isModified('mdp')) {
    this.mdp = await bcrypt.hash(this.mdp, 10);
  }
});

userSchema.methods.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.mdp);
};

module.exports = mongoose.model('User', userSchema);