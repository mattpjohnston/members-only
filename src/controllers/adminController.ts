import type { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { promoteUserToAdmin } from "../db/users.js";

type JoinAdminViewModel = {
  error: string;
  success: string;
  isAdmin: boolean;
};

const getJoinAdmin: RequestHandler = (req, res) => {
  const currentUser = req.user as { isAdmin?: boolean } | undefined;
  const isAdmin = Boolean(currentUser?.isAdmin);

  if (isAdmin) {
    return res.redirect("/?admin=already");
  }

  const viewModel: JoinAdminViewModel = {
    error: "",
    success: "",
    isAdmin,
  };

  return res.render("admin/join", viewModel);
};

const postJoinAdmin: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  const passcode = String(req.body.passcode ?? "").trim();
  const adminPasscode = process.env.ADMIN_PASSCODE;
  const currentUser = req.user as
    | { id?: number; isAdmin?: boolean }
    | undefined;

  if (!currentUser?.id) {
    const viewModel: JoinAdminViewModel = {
      error: "You need to log in before becoming an admin.",
      success: "",
      isAdmin: false,
    };

    return res.status(401).render("admin/join", viewModel);
  }

  if (currentUser.isAdmin) {
    return res.redirect("/?admin=already");
  }

  if (!errors.isEmpty()) {
    const viewModel: JoinAdminViewModel = {
      error: String(errors.array()[0]?.msg ?? "Invalid input."),
      success: "",
      isAdmin: false,
    };

    return res.status(400).render("admin/join", viewModel);
  }

  if (!adminPasscode) {
    const viewModel: JoinAdminViewModel = {
      error: "Admin passcode is not configured on the server.",
      success: "",
      isAdmin: false,
    };

    return res.status(500).render("admin/join", viewModel);
  }

  if (passcode !== adminPasscode) {
    const viewModel: JoinAdminViewModel = {
      error: "That admin passcode is not correct.",
      success: "",
      isAdmin: false,
    };

    return res.status(400).render("admin/join", viewModel);
  }

  const didUpdateAdmin = await promoteUserToAdmin(currentUser.id);

  if (!didUpdateAdmin) {
    const viewModel: JoinAdminViewModel = {
      error: "Could not update admin status. Please try again.",
      success: "",
      isAdmin: false,
    };

    return res.status(500).render("admin/join", viewModel);
  }

  return res.redirect("/?admin=upgraded");
};

export { getJoinAdmin, postJoinAdmin };
