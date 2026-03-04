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
    const isMember = Boolean(currentUser?.isMember);
    const isAdmin = Boolean(currentUser?.isAdmin);
    const canSeeDetails = Boolean(isMember || isAdmin);
    const canDeleteMessages = isAdmin;
    let successMessage = "";
    let infoMessage = "";

    if (req.query.membership === "joined") {
      successMessage = "You are now a club member.";
    }

    if (req.query.admin === "upgraded") {
      successMessage = "You are now an admin.";
    }

    if (req.query.membership === "already") {
      infoMessage = "You are already a club member.";
    }

    if (req.query.admin === "already") {
      infoMessage = "You are already an admin.";
    }

    res.render("home", {
      currentUser,
      messages,
      isMember,
      isAdmin,
      canSeeDetails,
      canDeleteMessages,
      successMessage,
      infoMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Could not load home page.");
  }
});

export default router;
