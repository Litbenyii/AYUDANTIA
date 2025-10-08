import Joi from "joi";

const emailRule = Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "cl", "net", "org", "gmail", "outlook", "hotmail"] },
  })
  .max(150)
  .required()
  .messages({
    "string.base": "El correo debe ser un texto válido.",
    "string.empty": "El correo es obligatorio.",
    "string.email": "Debes ingresar un correo electrónico válido.",
    "string.max": "El correo no puede superar los 150 caracteres.",
    "any.required": "El correo electrónico es obligatorio.",
  });

const passwordRule = Joi.string()
  .min(8)
  .max(64)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,64}$/)
  .required()
  .messages({
    "string.base": "La contraseña debe ser un texto.",
    "string.empty": "La contraseña es obligatoria.",
    "string.min": "La contraseña debe tener al menos 8 caracteres.",
    "string.max": "La contraseña no puede superar los 64 caracteres.",
    "string.pattern.base":
      "La contraseña debe incluir al menos una letra minúscula, una mayúscula, un número y un símbolo.",
    "any.required": "La contraseña es obligatoria.",
  });

export const registerSchema = Joi.object({
  email: emailRule,
  password: passwordRule,
})
  .options({
    abortEarly: false, 
    stripUnknown: true, 
  })
  .messages({
    "object.unknown": "El campo {#label} no está permitido.",
  });

export const loginSchema = Joi.object({
  email: emailRule,
  password: Joi.string().required().messages({
    "string.empty": "La contraseña es obligatoria.",
    "any.required": "Debes ingresar tu contraseña.",
  }),
})
  .options({
    abortEarly: false,
    stripUnknown: true,
  });

export const updateProfileSchema = Joi.object({
  email: emailRule.optional(),
  password: passwordRule.optional(),
})
  .or("email", "password")
  .messages({
    "object.missing": "Debes enviar al menos un campo válido para actualizar tu perfil.",
  })
  .options({
    abortEarly: false,
    stripUnknown: true,
  });

