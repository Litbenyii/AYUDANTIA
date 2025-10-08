// src/controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";

const repo = () => AppDataSource.getRepository(User);

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ 
        status: "error",
        message: "Debes ingresar un correo electrónico y una contraseña." 
      });

    const exists = await repo().findOne({ where: { email } });
    if (exists)
      return res.status(409).json({ 
        status: "error",
        message: "El correo ingresado ya está registrado en el sistema." 
      });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = repo().create({ email, password: hashed });
    const saved = await repo().save(newUser);

    return res.status(201).json({
      status: "success",
      message: "Usuario registrado exitosamente.",
      user: { id: saved.id, email: saved.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Ocurrió un error al intentar registrar el usuario.",
    });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        status: "error",
        message: "Debes ingresar tu correo y contraseña para continuar.",
      });

    const user = await repo().findOne({ where: { email } });
    if (!user)
      return res.status(401).json({
        status: "error",
        message: "Correo o contraseña incorrectos.",
      });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({
        status: "error",
        message: "Correo o contraseña incorrectos.",
      });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: "success",
      message: "Inicio de sesión exitoso.",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Ocurrió un error al iniciar sesión.",
    });
  }
}
