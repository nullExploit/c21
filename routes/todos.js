var express = require("express");
var router = express.Router();

const { isLogged } = require("../helpers/util");
const {
  getData,
  getAdd,
  getEdit,
  postAdd,
  postEdit,
  getDelete,
  signOut,
  changePic,
  uploadAvatar
} = require("../controllers/todosController");

/* GET users listing. */
router.get("/", isLogged, getData);
router.get("/add", isLogged, getAdd);
router.get("/delete/:id", isLogged, getDelete);
router.get("/edit/:id", isLogged, getEdit);
router.get("/signout", isLogged, signOut);
router.get("/avatar", isLogged, changePic)

router.post("/add", isLogged, postAdd);
router.post("/edit/:id", isLogged, postEdit);
router.post("/avatar", isLogged, uploadAvatar)

module.exports = router;
