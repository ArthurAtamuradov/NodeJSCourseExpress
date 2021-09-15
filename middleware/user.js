const user = require("../models/user");

module.exports = async function (req, res, next) {
  if (!req.session.user) {
    return next();
  }
  req.user = await user.findById(req.session.user._id);
  next();
};
