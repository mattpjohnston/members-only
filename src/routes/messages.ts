import { Router } from "express";
import {
  getNewMessage,
  postNewMessage,
} from "../controllers/messageController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { newMessageValidation } from "../validators/messageValidators.js";

const router = Router();

router.get("/new", requireAuth, getNewMessage);
router.post("/new", requireAuth, newMessageValidation, postNewMessage);

export default router;
