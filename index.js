const express = require("express");
const mysql   = require("mysql");
const session = require("express-session");
const pool    = require("./dbPool");
const app     = express();

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(session({secret:"secret", resave:true, saveUninitialized:true}));

app.get("/", async function(req, res) {
  res.render("index", {"error": ""});
});

app.post("/login", async function(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  let dbPassword = "default";
  let sql = "SELECT * FROM book_club_users WHERE username = ?";
  let rows = await executeSQL(sql, [username]);

  if(rows.length > 0)
    dbPassword = rows[0].password;

  if (password == dbPassword) {
    req.session.authenticated = true;
    req.session.valid = rows[0].id;
    res.redirect("/home");
  } else {
    res.render("index", {"error": "ERROR: Wrong username or password"});
  }
});

app.get("/logout", async function(req, res) {
  req.session.destroy();
  res.render("index", {"error": "Logged out successfully!"});
});

app.get("/home", async function(req, res) {

  if(req.session.authenticated) {
    let id = req.session.valid;
    let sql = "SELECT * FROM book_club_users WHERE id = ?";
    let rows = await executeSQL(sql, [id]);
    res.render("home", {"rows":rows});
  } else {
    res.render("index", {"error": "ERROR: Login to view this page."});
  }
});

app.get("/add_book", async function(req, res) {
  if(req.session.authenticated) {
    res.render("add_book");
  } else {
    res.render("index", {"error": "ERROR: Login to view this page."});
  }
});

app.get("/edit_book", async function(req, res) {
  if(req.session.authenticated) {
    let sql = `SELECT * FROM book_club_books
               WHERE id = ${req.query.id}`;
    let rows = await executeSQL(sql);
    console.log(rows)
    res.render("edit_book", {"book":rows});
  } else {
    res.render("index", {"error": "ERROR: Login to view this page."});
  }
});

app.get("/book_list", async function(req, res) {
  if(req.session.authenticated) {
    let userId =  req.session.valid;
    let sql = `SELECT * FROM book_club_books`;
    let books = await executeSQL(sql);

    sql = `SELECT * FROM book_club_favorites`;
    let rows = await executeSQL(sql);

    res.render("book_list", {"books":books, "favorites":rows, "userId":userId})
  } else {
    res.render("index", {"error": "ERROR: Login to view this page."});
  }
});

app.get("/favorite_books", async function(req, res) {
  if(req.session.authenticated) {
    res.render("favorite_books");
  } else {
    res.render("index", {"error": "ERROR: Login to view this page."});
  }
});

app.get("/top_ten_books", async function(req, res) {
  if(req.session.authenticated) {
    res.render("top_ten_books");
  } else {
    res.render("index", {"error": "ERROR: Login to view this page."});
  }
});

app.get("/api/add_book", async function(req, res) {
  if(req.session.authenticated) {
    let sql = "INSERT INTO book_club_books (title, author, isbn, category, agegroup, favorite_count) VALUES (?,?,?,?,?,?)";
    let sqlParams = [req.query.title, req.query.author, req.query.isbn, req.query.category, req.query.agegroup, 0];
    let rows = await executeSQL(sql, sqlParams);
    console.log(rows);
    res.json({"message":"Book added succesfully!"});
  } else {
    res.send("Unauthenticated");
  }
});

app.get("/api/edit_book", async function(req, res) {
  if(req.session.authenticated) {
    let sql = `UPDATE book_club_books 
               SET title = ?, 
                   author = ?, 
                   isbn = ?, 
                   category = ?, 
                   agegroup = ? 
               WHERE id = ?`;
    let sqlParams = [req.query.title, req.query.author, req.query.isbn, req.query.category, req.query.agegroup, req.query.id];
    let rows = await executeSQL(sql, sqlParams);
    console.log(rows);
    res.json({"message":"Book edited succesfully!"});
  } else {
    res.send("Unauthenticated");
  }
});

app.get("/delete_book", async function(req, res) {
  if(req.session.authenticated) {
    let sql = `DELETE
              FROM book_club_books
              WHERE id =  ${req.query.id}`;
    let rows = await executeSQL(sql);
    res.redirect("/book_list");
  } else {
    res.send("Unauthenticated");
  }
});

app.get("/favorite_book", async function(req, res) {
  if(req.session.authenticated) {
    let id = req.session.valid;

    sql = `INSERT INTO book_club_favorites 
          (user_id, book_id) VALUES (?,?)`;
    let sqlParams = [id, req.query.book_id];
    rows = await executeSQL(sql, sqlParams);

    sql = `SELECT COUNT(book_id) AS count 
          FROM book_club_favorites 
          WHERE book_id = ${req.query.book_id}`;
    rows = await executeSQL(sql);

    sql = `UPDATE book_club_books 
          SET favorite_count = ${rows[0].count}
          WHERE id = ${req.query.book_id}`;
    rows = await executeSQL(sql);
    
    res.redirect("/book_list");
    } else {
      res.send("Unauthenticated");
    }
});

app.get("/unfavorite_book", async function(req, res) {
  if(req.session.authenticated) {
    let id = req.session.valid;

    sql = `DELETE FROM book_club_favorites 
          WHERE user_id = ${id} AND book_id = ${req.query.book_id}`;
    rows = await executeSQL(sql);

    sql = `SELECT COUNT(book_id) AS count 
          FROM book_club_favorites 
          WHERE book_id = ${req.query.book_id}`;
    rows = await executeSQL(sql);

    sql = `UPDATE book_club_books 
          SET favorite_count = ${rows[0].count}
          WHERE id = ${req.query.book_id}`;
    rows = await executeSQL(sql);
    
    res.redirect("/book_list");
  } else {
    res.send("Unauthenticated");
  }
});

async function executeSQL(sql, params) {
  return new Promise(function(resolve, reject) {
    pool.query(sql, params, function(err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });
}

app.listen(3000, () => {
  console.log("Server is listening...");
});