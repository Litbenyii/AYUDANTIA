import bcrypt from "bcrypt";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";

import { updateProfileSchema } from "../validations/usuario.validation.js";
import { handleErrorClient } from "../Handlers/responseHandlers.js";

const repo = () => AppDataSource.getRepository(User);

export async function updateMyProfile(req, res) {
  try {
    const userId = req.user?.id;
    const { email, password } = req.body;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Debes iniciar sesión para actualizar tu perfil.",
      });
    }

    const { error, value } = updateProfileSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Parámetros inválidos.",
        errors: error.details.map((d) => d.message),
      });
    }

    const user = await repo().findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "No se encontró el usuario.",
      });
    }

    if (value.email && value.email !== user.email) {
      const exists = await repo().findOne({ where: { email: value.email } });
      if (exists && exists.id !== user.id) {
        return res.status(409).json({
          status: "error",
          message: "El nuevo correo ya está en uso por otro usuario.",
        });
      }
      user.email = value.email;
    }

    if (value.password) {
      user.password = await bcrypt.hash(value.password, 10);
    }

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

export async function deleteMyProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Debes iniciar sesión para eliminar tu cuenta.",
      });
    }

    const user = await repo().findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "El usuario no existe o ya fue eliminado.",
      });
    }

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

export function getPrivateProfile(req, res) {
  return res.status(200).json({
    status: "success",
    message: "Perfil privado obtenido correctamente.",
    user: req.user,
  });
}
