import { Router } from "express";
import { getSignUp, postSignUp } from "../controllers/authController.js";
import { signUpValidation } from "../validators/authValidators.js";

const router = Router();

router.get("/sign-up", getSignUp);
router.post("/sign-up", signUpValidation, postSignUp);

router.get("/login", (_req, res) => {
  res.send("Login page");
});

export default router;
