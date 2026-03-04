import { Router } from "express";
import { getAllMessages } from "../db/messages.js";

type CurrentUser = {
  id?: number;
  firstName?: string;
  isMember?: boolean;
  isAdmin?: boolean;
};

const router = Router();

router.get("/", async (req, res) => {
  try {
    const currentUser = req.user as CurrentUser | undefined;
    const messages = await getAllMessages();
    const canSeeDetails = Boolean(
      currentUser?.isMember || currentUser?.isAdmin,
    );
    const canDeleteMessages = Boolean(currentUser?.isAdmin);

    res.render("home", {
      currentUser,
      messages,
      canSeeDetails,
      canDeleteMessages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Could not load home page.");
  }
});

export default router;
