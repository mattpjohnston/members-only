import { body, param } from "express-validator";

const newMessageValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title must be 100 characters or less"),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Message text is required")
    .isLength({ max: 5000 })
    .withMessage("Message text must be 5000 characters or less"),
];

const deleteMessageValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid message id."),
];

export { newMessageValidation, deleteMessageValidation };
