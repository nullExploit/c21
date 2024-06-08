const db = require("./pg");

class Todo {
  constructor(title, complete, deadline) {
    this.title = title;
    this.complete = complete;
    this.deadline = deadline;
  }

  static all(
    title,
    complete,
    deadlineFrom,
    deadlineTo,
    operation,
    page,
    userid,
    sortBy,
    sortMode,
    callback
  ) {
    const limit = 5,
      offset = (page - 1) * limit,
      queryParams = [],
      params = [];

    let sql = "SELECT COUNT(*) AS total FROM todos";

    if (userid) {
      queryParams.push(`userid = $${queryParams.length + 1}`);
      params.push(userid);
    }

    if (title) {
      queryParams.push(`title LIKE '%' || $${queryParams.length + 1} || '%'`);
      params.push(title);
    }

    if (complete) {
      queryParams.push(`complete = $${queryParams.length + 1}`);
      params.push(JSON.parse(complete));
    }

    if (deadlineFrom) {
      queryParams.push(`deadline >= $${queryParams.length + 1}`);
      params.push(deadlineFrom);
    }

    if (deadlineTo) {
      queryParams.push(`deadline <= $${queryParams.length + 1}`);
      params.push(deadlineTo + " 23:59");
    }

    if (queryParams.length) {
      if (operation == "OR") {
        sql += ` WHERE ${queryParams.join(" OR ")} `;
      } else if (operation == "AND") {
        sql += ` WHERE ${queryParams.join(" AND ")} `;
      }
    }

    db.query(sql, params)
      .then((data) => {
        const total = Number(data.rows[0].total),
          pages = Math.ceil(total / limit);

        sql =
          "SELECT *, TO_CHAR(deadline, 'DD Mon YYYY HH:MI') AS reformat, now() AS now FROM todos";

        if (queryParams.length) {
          if (operation == "OR") {
            sql += ` WHERE ${queryParams.join(" OR ")} `;
          } else if (operation == "AND") {
            sql += ` WHERE ${queryParams.join(" AND ")} `;
          }
        }

        sql += `ORDER BY ${sortBy} ${sortMode}`

        sql += ` limit $${queryParams.length + 1} offset $${
          queryParams.length + 2
        }`;
        params.push(limit, offset);

        db.query(sql, params)
          .then((data) => {
            callback({ datas: data.rows, pages, offset });
          })
          .catch((err) => {
            return console.log("Tolong hubungi administrator!", err);
          });
      })
      .catch((err) => {
        return console.log("Tolong hubungi administrator!", err);
      });
  }

  static get(id, callback) {
    db.query(
      "SELECT *, TO_CHAR(deadline, 'YYYY-MM-DD HH24:MI') AS reformat FROM todos WHERE id = $1",
      [id]
    )
      .then((data) => callback(data.rows[0]))
      .catch((err) => {
        return console.log("Tolong hubungi administrator!", err);
      });
  }

  static create(title, userid, callback) {
    db.query("INSERT INTO todos (title, userid) VALUES ($1, $2)", [
      title,
      userid,
    ])
      .then(callback())
      .catch((err) => {
        return console.log("Tolong hubungi administrator!", err);
      });
  }

  static update(title, complete, deadline, userid, id, callback) {
    db.query(
      "UPDATE todos SET title = $1, complete = $2, deadline = $3, userid = $4 WHERE id = $5",
      [title, complete, deadline, userid, id]
    )
      .then(callback())
      .catch((err) => {
        return console.log("Tolong hubungi administrator!", err);
      });
  }

  static delete(id, callback) {
    db.query("DELETE FROM todos WHERE id = $1", [id])
      .then(callback())
      .catch((err) => {
        return console.log("Tolong hubungi administrator!", err);
      });
  }


}

module.exports = Todo;
