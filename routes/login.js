var express = require("express");
var router = express.Router();

const User = require("../models/User");
const { userPost } = require("../controllers/userController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("auth/login", {
    failedMessage: req.flash("failedMessage"),
    successMessage: req.flash("successMessage"),
  });
});

router.post("/", userPost);

module.exports = router;
