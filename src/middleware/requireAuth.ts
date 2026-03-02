import type { RequestHandler } from "express";

const requireAuth: RequestHandler = (req, res, next) => {
  if (req.user) {
    return next();
  }

  return res.redirect("/auth/login");
};

export { requireAuth };
