import { Router } from "express";
import { getAllMessages } from "../db/messages.js";

type CurrentUser = {
  id?: number;
  firstName?: string;
};

const router = Router();

router.get("/", async (req, res) => {
  try {
    const currentUser = req.user as CurrentUser | undefined;
    const messages = await getAllMessages();

    res.render("home", {
      currentUser,
      messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Could not load home page.");
  }
});

export default router;
