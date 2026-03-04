import { Router } from "express";
import {
  getNewMessage,
  postDeleteMessage,
  postNewMessage,
} from "../controllers/messageController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  deleteMessageValidation,
  newMessageValidation,
} from "../validators/messageValidators.js";

const router = Router();

router.get("/new", requireAuth, getNewMessage);
router.post("/new", requireAuth, newMessageValidation, postNewMessage);
router.post(
  "/:id/delete",
  requireAuth,
  requireAdmin,
  deleteMessageValidation,
  postDeleteMessage,
);

export default router;
