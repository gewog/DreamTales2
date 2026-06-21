import type { RequestHandler } from "express";

export const requireAdminAuth: RequestHandler = (req, res, next) => {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    res.status(503).json({
      error: "Admin API is disabled. Set the ADMIN_API_KEY environment variable.",
    });
    return;
  }

  const authHeader = req.headers.authorization;
  const token =
    typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

  if (!token || token !== adminKey) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
};
