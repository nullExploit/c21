var express = require("express");
var router = express.Router();

const { registerPost } = require("../controllers/userController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("auth/register", {
    failedMessage: req.flash("failedMessage"),
    successMessage: req.flash("successMessage"),
  });
});

router.post("/", registerPost);

module.exports = router;
