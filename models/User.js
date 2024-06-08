const db = require("./pg.js");
const bcrypt = require("bcrypt");

class User {
  constructor(email, password, avatar) {
    this.email = email;
    this.password = password;
    this.avatar = avatar;
  }

  static create(email, password, callback) {
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
          email,
          hash,
        ])
          .then(callback())
          .catch((err) => console.log("Tolong hubungi administrator", err));
      })
      .catch((err) => console.log("Tolong hubungi administrator", err));
  }

  static get(email, callback) {
    db.query("SELECT * FROM users WHERE email = $1", [email])
      .then((data) => callback(data.rows[0]))
      .catch((err) => console.log("Tolong hubungi administrator", err));
  }

  static login(password, hash, callback) {
    bcrypt
      .compare(password, hash)
      .then((res) => callback(res))
      .catch((err) => console.log("Tolong hubungi administrator", err));
  }

  static upload(img, userid, callback) {
    db.query("UPDATE users SET avatar = $1 WHERE id = $2", [img, userid])
      .then(callback())
      .catch((err) => {
        return console.log("Tolong hubungi administrator!", err);
      });
  }
}

module.exports = User;
