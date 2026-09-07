const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_fallback_key';

const isValidEmail = (email) => {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

// 1. REGISTRO DE USUARIO
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ msg: 'Formato de correo electrónico no válido' });
    }

    // Verificar si el usuario ya existe en MongoDB
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ msg: 'Este correo ya está registrado' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar nuevo usuario
    const newUser = new User({
      nombre: nombre.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user'
    });
    await newUser.save();

    return res.status(201).json({ msg: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Error en registro:', err);
    return res.status(500).json({ error: 'Error interno del servidor al registrar usuario' });
  }
});

// 2. INICIO DE SESIÓN (LOGIN)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Correo y contraseña son requeridos' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ msg: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    // Generar Token JWT con rol incluido
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ error: 'Error interno del servidor al iniciar sesión' });
  }
});

module.exports = router;
