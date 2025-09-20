import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  try {
    if (!req.auth?.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - you must be logged in" });
    }

    // Attach Clerk user object for ALL logged-in users
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    req.user = currentUser;

    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (req, res, next) => {
  const isAdmin =
    process.env.ADMIN_EMAIL ===
    req.user?.primaryEmailAddress?.emailAddress;

  if (!isAdmin) {
    return res
      .status(403)
      .json({ message: "Unauthorized - you must be admin" });
  }

  next();
};
