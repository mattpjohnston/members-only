import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.send("Admin page");
});

export default router;
