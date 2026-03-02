import { Router } from "express";

const router = Router();

router.get("/new", (_req, res) => {
  res.send("New message page");
});

export default router;
