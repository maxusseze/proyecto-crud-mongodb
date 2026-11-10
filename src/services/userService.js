const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async ({ nombre, email, password }) => {
  const existe = await User.findOne({ email });
  if (existe) throw new Error('EMAIL_EXISTE');
  const user = new User({ nombre, email, password });
  return user.save();
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('CREDENCIALES_INVALIDAS');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('CREDENCIALES_INVALIDAS');
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

module.exports = { register, login };