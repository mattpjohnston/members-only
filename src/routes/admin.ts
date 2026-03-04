import { Router } from "express";
import { getJoinAdmin, postJoinAdmin } from "../controllers/adminController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { joinAdminValidation } from "../validators/adminValidators.js";

const router = Router();

router.get("/", (_req, res) => {
  res.send("Admin page");
});

router.get("/join", requireAuth, getJoinAdmin);
router.post("/join", requireAuth, joinAdminValidation, postJoinAdmin);

export default router;
