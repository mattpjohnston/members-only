import { Router } from "express";

const router = Router();

router.get("/join", (_req, res) => {
  res.send("Membership page");
});

export default router;
