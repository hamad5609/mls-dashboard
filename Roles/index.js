export const Roles = {
  ADMIN: "ADMIN_ROLE",
  USER: "USER_ROLE",
};

export const AuthRoles = (Role) => {
  return (req, res, next) => {
    if (req.body?.role !== Role) {
      res.status(403);
      return res.send("Not Allowed");
    }
    next();
  }

};
