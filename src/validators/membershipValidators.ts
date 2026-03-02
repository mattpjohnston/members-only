import { body } from "express-validator";

const joinMembershipValidation = [
  body("passcode")
    .trim()
    .notEmpty()
    .withMessage("Please enter the passcode."),
];

export { joinMembershipValidation };
