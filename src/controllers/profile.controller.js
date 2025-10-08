// src/controllers/profile.controller.js
import bcrypt from "bcrypt";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";

const repo = () => AppDataSource.getRepository(User);

// PATCH /api/profile/private
export async function updateMyProfile(req, res) {
  try {
    const userId = req.user?.id;
    const { email, password } = req.body;

    if (!userId)
      return res.status(401).json({
        status: "error",
        message: "Debes iniciar sesión para actualizar tu perfil.",
      });

    const user = await repo().findOne({ where: { id: userId } });
    if (!user)
      return res.status(404).json({
        status: "error",
        message: "No se encontró el usuario.",
      });

    if (!email && !password)
      return res.status(400).json({
        status: "error",
        message: "Debes ingresar al menos un campo para actualizar (correo o contraseña).",
      });

    if (email && email !== user.email) {
      const exists = await repo().findOne({ where: { email } });
      if (exists && exists.id !== user.id)
        return res.status(409).json({
          status: "error",
          message: "El nuevo correo ya está en uso por otro usuario.",
        });
      user.email = email;
    }

    if (password) user.password = await bcrypt.hash(password, 10);

    const updated = await repo().save(user);

    return res.status(200).json({
      status: "success",
      message: "Perfil actualizado correctamente.",
      user: { id: updated.id, email: updated.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Ocurrió un error al intentar actualizar el perfil.",
    });
  }
}

// DELETE /api/profile/private
export async function deleteMyProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({
        status: "error",
        message: "Debes iniciar sesión para eliminar tu cuenta.",
      });

    const user = await repo().findOne({ where: { id: userId } });
    if (!user)
      return res.status(404).json({
        status: "error",
        message: "El usuario no existe o ya fue eliminado.",
      });

    await repo().remove(user);

    return res.status(200).json({
      status: "success",
      message: "Tu cuenta ha sido eliminada correctamente. Lamentamos verte partir.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Ocurrió un error al intentar eliminar la cuenta.",
    });
  }
}

// GET /api/profile/private (solo para ver tus datos del token)
export function getPrivateProfile(req, res) {
  return res.status(200).json({
    status: "success",
    message: "Perfil privado obtenido correctamente.",
    user: req.user, // { id, email } desde el JWT
  });
}

