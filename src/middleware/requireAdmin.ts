import type { RequestHandler } from "express";

const requireAdmin: RequestHandler = (req, res, next) => {
  const currentUser = req.user as { isAdmin?: boolean } | undefined;

  if (currentUser?.isAdmin) {
    return next();
  }

  return res.status(403).send("Forbidden");
};

export { requireAdmin };
