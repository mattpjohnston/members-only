import type { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { promoteUserToMember } from "../db/users.js";

type JoinMembershipViewModel = {
  error: string;
  success: string;
  isMember: boolean;
  isAdmin: boolean;
};

const getJoinMembership: RequestHandler = (req, res) => {
  const currentUser = req.user as
    | { isMember?: boolean; isAdmin?: boolean }
    | undefined;
  const isMember = Boolean(currentUser?.isMember);
  const isAdmin = Boolean(currentUser?.isAdmin);

  if (isMember || isAdmin) {
    return res.redirect("/?membership=already");
  }

  const viewModel: JoinMembershipViewModel = {
    error: "",
    success: "",
    isMember,
    isAdmin,
  };

  return res.render("membership/join", viewModel);
};

const postJoinMembership: RequestHandler = async (req, res) => {
  const passcode = String(req.body.passcode ?? "").trim();
  const secretPasscode = process.env.MEMBERSHIP_PASSCODE;
  const errors = validationResult(req);
  const currentUser = req.user as
    | { id?: number; isMember?: boolean; isAdmin?: boolean }
    | undefined;

  if (!currentUser?.id) {
    const viewModel: JoinMembershipViewModel = {
      error: "You need to log in before joining the club.",
      success: "",
      isMember: false,
      isAdmin: false,
    };

    return res.status(401).render("membership/join", viewModel);
  }

  if (currentUser.isMember || currentUser.isAdmin) {
    return res.redirect("/?membership=already");
  }

  if (!errors.isEmpty()) {
    const firstErrorMessage = String(
      errors.array()[0]?.msg ?? "Invalid input.",
    );
    const viewModel: JoinMembershipViewModel = {
      error: firstErrorMessage,
      success: "",
      isMember: false,
      isAdmin: false,
    };

    return res.status(400).render("membership/join", viewModel);
  }

  if (!secretPasscode) {
    const viewModel: JoinMembershipViewModel = {
      error: "Membership passcode is not configured on the server.",
      success: "",
      isMember: false,
      isAdmin: false,
    };

    return res.status(500).render("membership/join", viewModel);
  }

  if (passcode !== secretPasscode) {
    const viewModel: JoinMembershipViewModel = {
      error: "That passcode is not correct.",
      success: "",
      isMember: false,
      isAdmin: false,
    };

    return res.status(400).render("membership/join", viewModel);
  }

  const didUpdateMembership = await promoteUserToMember(currentUser.id);

  if (!didUpdateMembership) {
    const viewModel: JoinMembershipViewModel = {
      error: "Could not update membership status. Please try again.",
      success: "",
      isMember: false,
      isAdmin: false,
    };

    return res.status(500).render("membership/join", viewModel);
  }

  return res.redirect("/?membership=joined");
};

export { getJoinMembership, postJoinMembership };
