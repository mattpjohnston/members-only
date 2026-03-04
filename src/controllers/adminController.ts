import type { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { promoteUserToAdmin } from "../db/users.js";

type JoinAdminViewModel = {
  error: string;
  success: string;
};

const getJoinAdmin: RequestHandler = (req, res) => {
  const joined = req.query.joined === "1";
  const currentUser = req.user as { isAdmin?: boolean } | undefined;

  const viewModel: JoinAdminViewModel = {
    error: "",
    success: joined && currentUser?.isAdmin ? "You are now an admin." : "",
  };

  res.render("admin/join", viewModel);
};

const postJoinAdmin: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  const passcode = String(req.body.passcode ?? "").trim();
  const adminPasscode = process.env.ADMIN_PASSCODE;

  if (!errors.isEmpty()) {
    const viewModel: JoinAdminViewModel = {
      error: String(errors.array()[0]?.msg ?? "Invalid input."),
      success: "",
    };

    return res.status(400).render("admin/join", viewModel);
  }

  if (!adminPasscode) {
    const viewModel: JoinAdminViewModel = {
      error: "Admin passcode is not configured on the server.",
      success: "",
    };

    return res.status(500).render("admin/join", viewModel);
  }

  if (passcode !== adminPasscode) {
    const viewModel: JoinAdminViewModel = {
      error: "That admin passcode is not correct.",
      success: "",
    };

    return res.status(400).render("admin/join", viewModel);
  }

  const currentUser = req.user as { id?: number } | undefined;

  if (!currentUser?.id) {
    const viewModel: JoinAdminViewModel = {
      error: "You need to log in before becoming an admin.",
      success: "",
    };

    return res.status(401).render("admin/join", viewModel);
  }

  const didUpdateAdmin = await promoteUserToAdmin(currentUser.id);

  if (!didUpdateAdmin) {
    const viewModel: JoinAdminViewModel = {
      error: "Could not update admin status. Please try again.",
      success: "",
    };

    return res.status(500).render("admin/join", viewModel);
  }

  return res.redirect("/admin/join?joined=1");
};

export { getJoinAdmin, postJoinAdmin };
