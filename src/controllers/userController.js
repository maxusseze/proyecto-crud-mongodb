const userService = require('../services/userService');

const register = async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({ message: 'Usuario registrado', id: user._id, email: user.email });
  } catch (error) {
    if (error.message === 'EMAIL_EXISTE') {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    res.status(400).json({ message: 'Datos inválidos', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const token = await userService.login(req.body);
    res.status(200).json({ token });
  } catch (error) {
    if (error.message === 'CREDENCIALES_INVALIDAS') {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

module.exports = { register, login };