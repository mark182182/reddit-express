'use strict';

require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mySQL = require('mysql');
const path = require('path');
const PORT = process.env.SERV_PORT;

app.use(bodyParser.json());
app.use('/assets', express.static('assets'));

const conn = mySQL.createConnection({
  host     : "mariadb.c9fog5stziuo.eu-central-1.rds.amazonaws.com",
  user     : process.env.USERNAME,
  password : process.env.PASSWORD,
  database : process.env.DATABASE,
  port     : process.env.PORT,
  multipleStatements: true,
});

conn.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Connection to Db established`);
});

app.get('/', function (req, res) {
  res.status(200).sendFile(path.join(__dirname, 'index.html'));
});

app.get('/submit', function (req, res) {
  res.status(200).sendFile(path.join(__dirname, 'submit.html'));
});

app.get('/modify', function (req, res) {
  res.status(200).sendFile(path.join(__dirname, 'modify.html'));
});

app.get('/create', function (req, res) {
  res.status(200).sendFile(path.join(__dirname, 'create.html'));
});

app.get('/login', function (req, res) {
  res.status(200).sendFile(path.join(__dirname, 'login.html'));
});

app.get('/posts', function (req, res) {
  getRows(req, res);
});

app.get('/comment', function (req, res) {
  res.status(200).sendFile(path.join(__dirname, 'comment.html'));
});

app.get('/comment/:id', function (req, res) {
  const postId = req.params.id;
  conn.query(`SELECT * FROM comments WHERE post_id = ?;`, [postId], function (err, comments) {
    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
    res.status(200).json({ comments });
  });
});

app.get('/comment/:id/owner', function (req, res) {
  getPostOwner(req, res);
});

app.post('/comment/:id', function (req, res) {
  const comment = req.body.comment;
  const owner = req.body.owner;
  const postId = req.params.id;
  console.log(owner, comment);


  conn.query(`INSERT INTO comments (comment, comment_owner, post_id) VALUES(?, ?, ?);`, [comment, owner, postId], function (err) {
    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
  });
});

app.post('/login', function (req, res) {
  const owner = req.body.owner;
  const password = req.body.password;

  conn.query(`SELECT password FROM users WHERE owner = ?`, [owner], function (err, pass) {
    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
    else {
      if (pass.length !== 0) {
        conn.query(`SELECT SHA1(?) = ? AS 'password found'`, [password, pass[0].password], function (err, result) {
          if (err) {
            console.log(err.toString());
            res.status(500).send('Database error');
            return;
          }
          if (result[0]['password found'] === 1) {
            res.status(200).json(owner);
          }
          else {
            res.status(200).json('Incorrect password!');
          }
        });
      }
      else {
        res.status(200).json('Incorrect username!');
      }
    }
  });
});


app.post('/create', function (req, res) {
  const owner = req.body.owner;
  const password = req.body.password;
  let userExist = [];

  conn.query(`SELECT owner FROM users WHERE owner = ?`, [owner], function (err, result) {
    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
    userExist.push(result);
    if (userExist[0][0] === undefined) {

      conn.query(`INSERT INTO users(owner, password) VALUES(?, SHA1(?))`, [owner, password], function (err) {
        if (err) {
          console.log(err.toString());
          res.status(500).send('Database error');
          return;
        }
        else {
          console.log(`User created with name: ${owner}`);
          getUserId(req, res);
        }
      });
    }
    else {
      res.status(200).json('User already exist!');
    }
  });
});

app.post('/posts', function (req, res) {
  const title = req.body.title;
  const url = req.body.url;
  const username = req.body.username;

  conn.query(`INSERT INTO posts2(title, url, owner) VALUES(?, ?, ?)`, [title, url, username], function (err) {
    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
    else {
      console.log(`Inserted ${req.body.title}`);
      getRows(req, res, `WHERE title = ? ORDER BY id DESC LIMIT 1`[title]);
    }
  });
});

app.put('/posts/:id/upvote', function (req, res) {
  voteChange(req, res, '+');
});

app.put('/posts/:id/downvote', function (req, res) {
  voteChange(req, res, '-');
});

app.delete('/posts/:id', function (req, res) {
  const postId = req.params.id;

  conn.query(`DELETE FROM posts2 WHERE id = ?`, [postId], function (err) {
    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
    console.log(`Post with id ${postId} deleted.`);
  });
});

app.put('/posts/:id', function (req, res) {
  const postId = req.params.id;
  const title = req.body.title;
  const url = req.body.url;
  const username = req.body.username;

  conn.query(`UPDATE posts2 SET title = ?, url = ?, owner = ?  WHERE id = ?`, [title, url, username, postId], function (err) {
    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
  });
  getRows(req, res, `WHERE id = ${postId} `);
});

function voteChange(req, res, operation) {
  const postId = req.params.id;

  conn.query(`UPDATE posts2 SET score = score ${operation} 1 WHERE id = ?`, [postId], function (err) {
    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
  });
  getRows(req, res, `WHERE id = ${postId} `);
}

function getCurrentPost(req, res) {
  const id = req.params.id;
  conn.query(`SELECT * from posts2 WHERE id = ?`, [id], function (err, rows) {
    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
    res.status(200).json(rows);
  });
}

function getRows(req, res, queryParameter) {
  conn.query(`SELECT * from posts2 ${queryParameter} ORDER BY timestamp DESC `, function (err, rows) {
    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
    res.status(200).json(rows);
  });
}

function getUserId(req, res) {
  const username = req.body.owner;
  conn.query(`SELECT owner_id FROM users WHERE owner = ?`, [username], function (err, username) {
    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
    res.status(200).json({ username });
  });
}

function getPostOwner(req, res) {
  const postId = req.params.postId;
  conn.query(`SELECT owner FROM posts2 WHERE id = ?`, [postId], function (err, owner) {
    if (err) {
      console.log(err.toString());
      res.status(500).send('Database error');
      return;
    }
    res.status(200).json({ owner });
  });
}

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT} `);
});
