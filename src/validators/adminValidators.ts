import { body } from "express-validator";

const joinAdminValidation = [
  body("passcode")
    .trim()
    .notEmpty()
    .withMessage("Please enter the admin passcode."),
];

export { joinAdminValidation };
