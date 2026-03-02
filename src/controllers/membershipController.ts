import type { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { promoteUserToMember } from "../db/users.js";

type JoinMembershipViewModel = {
  error: string;
  success: string;
};

const getJoinMembership: RequestHandler = (req, res) => {
  const joined = req.query.joined === "1";
  const currentUser = req.user as { isMember?: boolean } | undefined;
  const viewModel: JoinMembershipViewModel = {
    error: "",
    success:
      joined && currentUser?.isMember ? "You are now a club member." : "",
  };

  res.render("membership/join", viewModel);
};

const postJoinMembership: RequestHandler = async (req, res) => {
  const passcode = String(req.body.passcode ?? "").trim();
  const secretPasscode = process.env.MEMBERSHIP_PASSCODE;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstErrorMessage = String(
      errors.array()[0]?.msg ?? "Invalid input.",
    );
    const viewModel: JoinMembershipViewModel = {
      error: firstErrorMessage,
      success: "",
    };

    return res.status(400).render("membership/join", viewModel);
  }

  if (!secretPasscode) {
    const viewModel: JoinMembershipViewModel = {
      error: "Membership passcode is not configured on the server.",
      success: "",
    };

    return res.status(500).render("membership/join", viewModel);
  }

  if (passcode !== secretPasscode) {
    const viewModel: JoinMembershipViewModel = {
      error: "That passcode is not correct.",
      success: "",
    };

    return res.status(400).render("membership/join", viewModel);
  }

  const currentUser = req.user as { id?: number } | undefined;

  if (!currentUser?.id) {
    const viewModel: JoinMembershipViewModel = {
      error: "You need to log in before joining the club.",
      success: "",
    };

    return res.status(401).render("membership/join", viewModel);
  }

  const didUpdateMembership = await promoteUserToMember(currentUser.id);

  if (!didUpdateMembership) {
    const viewModel: JoinMembershipViewModel = {
      error: "Could not update membership status. Please try again.",
      success: "",
    };

    return res.status(500).render("membership/join", viewModel);
  }

  return res.redirect("/membership/join?joined=1");
};

export { getJoinMembership, postJoinMembership };
