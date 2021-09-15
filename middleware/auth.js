module.exports = function (req, res, next) {
  if (!req.session.isAuthenticated) {
    res.redirect("/auth/login");
  }
  next();
};
