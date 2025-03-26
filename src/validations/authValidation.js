import Joi from "joi";

export const registerValidation = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
        )
      )
      .required()
      .messages({
        "string.pattern.base":
          "Password must have at least 8 characters, one uppercase, one lowercase, one number, and one special character.",
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords must match.",
      }),

    // profileImage: Joi.string().optional(),
  });
  
  export const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
