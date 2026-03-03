import { body } from "express-validator";

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

export { newMessageValidation };
