const User = require("../models/User");

function userPost(req, res) {
  const { email, password } = req.body;

  User.get(email, (data) => {
    if (data) {
      User.login(password, data.password, (result) => {
        if (!result) {
          req.flash("failedMessage", "password is wrong");
          res.redirect("/");
        } else {
          req.session.user = { id: data.id, email: data.email, avatar: data.avatar };
          res.redirect("/todos");
        }
      });
    } else {
      req.flash("failedMessage", "user not exists, please sign up");
      res.redirect("/");
    }
  });
}

function registerPost(req, res) {
  const { email, password, retypepassword } = req.body;

  User.get(email, (data) => {
    if (data) {
      req.flash("failedMessage", `user with email ${email} is exist`);
      res.redirect("/register");
    } else if (password != retypepassword) {
      req.flash("failedMessage", "password dosen't match");
      res.redirect("/register");
    } else {
      User.create(email, password, () => {
        req.flash(
          "successMessage",
          "successfully registered, please sign in!"
        );
        res.redirect("/");
      });
    }
  });
}

module.exports = { userPost, registerPost };
