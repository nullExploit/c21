const Todo = require("../models/Todo");
const User = require("../models/User");
const path = require("path");
const { unlinkSync, readdirSync } = require("node:fs");

function getData(req, res) {
  const { title, complete, deadlineFrom, deadlineTo } = req.query,
    operation = req.query.operation || "AND",
    url = req.url === "/" ? "/?page=1&sortBy=id&sortMode=asc" : req.url,
    page = req.query.page || 1,
    { id, email } = req.session.user,
    sortBy = req.query.sortBy ? req.query.sortBy : "id",
    sortMode = req.query.sortMode ? req.query.sortMode : "asc";

  User.get(email, (data) => {
    const avatar = data.avatar ? data.avatar : "default-.jpg";

    Todo.all(
      title,
      complete,
      deadlineFrom,
      deadlineTo,
      operation,
      page,
      id,
      sortBy,
      sortMode,
      ({ datas, pages, offset }) => {
        res.render("todos/view", {
          datas,
          pages,
          page,
          url,
          offset,
          title,
          complete,
          deadlineFrom,
          deadlineTo,
          operation,
          email,
          avatar,
          sortBy,
          sortMode,
        });
      }
    );
  });
}

function getAdd(req, res) {
  res.render("todos/form", { data: {}, url: {} });
}

function getEdit(req, res) {
  const index = req.params.id,
    url = req.url;

  Todo.get(index, (data) => {
    res.render("todos/form", { data, url });
  });
}

function postAdd(req, res) {
  const { title } = req.body,
    userid = Number(req.session.user.id);

  Todo.create(title, userid, () => {
    res.redirect("/todos");
  });
}

function postEdit(req, res) {
  const { title, complete, deadline } = req.body,
    userid = req.session.user.id,
    index = req.params.id;

  Todo.update(title, complete, deadline, userid, index, () => {
    res.redirect("/todos");
  });
}

function getDelete(req, res) {
  const index = req.params.id;

  Todo.delete(index, () => {
    res.redirect("/todos");
  });
}

function signOut(req, res) {
  req.session.destroy((err) => {
    if (err) return console.log("Tolong hubungi administrator!", err);
    res.redirect("/");
  });
}

function changePic(req, res) {
  const email = req.session.user.email;

  User.get(email, (data) => {
    const avatar = data.avatar ? data.avatar : "default-.jpg";
    res.render("todos/avatar", { avatar });
  });
}

function uploadAvatar(req, res) {
  if (!req.files) {
    res.redirect("/todos");
  } else {
    const userid = req.session.user.id,
      file = req.files.avatar,
      fileName = `${Date.now()}-${userid}-${file.name}`,
      filePath = path.join(__dirname, "..", "public", "uploads", fileName);

    for (let file of readdirSync(
      path.join(__dirname, "..", "public", "uploads")
    )) {
      if (file.split("-")[1] == userid) {
        unlinkSync(path.join(__dirname, "..", "public", "uploads", file));
      }
    }

    file.mv(filePath, (err) => {
      if (err) return console.log("Tolong hubungi administrator!", err);

      User.upload(fileName, userid, () => {
        res.redirect("/todos");
      });
    });
  }
}

module.exports = {
  getData,
  getAdd,
  getEdit,
  postAdd,
  postEdit,
  getDelete,
  signOut,
  changePic,
  uploadAvatar,
};
