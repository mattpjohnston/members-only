import { Router } from "express";

const router = Router();

router.get("/sign-up", (_req, res) => {
  res.send("Sign up page");
});

router.get("/login", (_req, res) => {
  res.send("Login page");
});

export default router;
