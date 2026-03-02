import { Router } from "express";
import {
  getJoinMembership,
  postJoinMembership,
} from "../controllers/membershipController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { joinMembershipValidation } from "../validators/membershipValidators.js";

const router = Router();

router.get("/join", requireAuth, getJoinMembership);
router.post("/join", requireAuth, joinMembershipValidation, postJoinMembership);

export default router;
