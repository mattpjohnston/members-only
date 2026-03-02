import { Router } from "express";
import passport from "../config/passport.js";
import {
  getLogin,
  getSignUp,
  postLogout,
  postSignUp,
} from "../controllers/authController.js";
import { signUpValidation } from "../validators/authValidators.js";

const router = Router();

router.get("/sign-up", getSignUp);
router.post("/sign-up", signUpValidation, postSignUp);

router.get("/login", getLogin);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login?error=1",
  }),
);
router.post("/logout", postLogout);

export default router;
