const express = require("express");
const bodyParser = require("body-parser");
const SHA256 = require("crypto-js/sha256");
const MD5 = require("crypto-js/md5");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const multer  = require('multer')
const fs = require('fs');
import db from "./db/db";

const secretKey = 's-StbU5h=yu2k-aV67H3mo@rajabiD+1G0=s=a-y' // Our Super Secret Key :)
const port = 3000
let app = new express();

// handle app rendering
import serverSideAppRoutes from './app'
app.use('/', serverSideAppRoutes)

// For File Upload at signup section
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    let arr = file.originalname.split('.');
    cb(null, file.fieldname + '-' + Date.now() + '.' + arr[arr.length-1])
  }
})
const upload = multer({ storage })


// Access Origin Resource Sharing Setup
app.use(cors());

// Set body parser as middleware
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Setup template engine and pug
app.set('views', './views/');
app.set('view engine', 'pug')

// Serve static content for views
app.use(express.static('../static'));

// Connect to mysql DB
db.connect();



const checkToken = (token, callback, err) => {
  if (!token) {
    err('no token specified.');
  } else {
    try {
      let decoded = jwt.verify(token, secretKey);
      callback(decoded.id);
    } catch (e) {
      err('token invalid or expired.');
    }
  }
}
const checkTokenMiddleware = (req, res, next) => {
  let token = req.headers['authorization'];
  checkToken(token, (userID) => {
    req.userID = userID
    next()
  }, (err) => {
    res.sendStatus(401).send(err);
  });
}
const extractUserIDFromToken = (req, res, next) => {
  let token = req.headers['authorization'];
  checkToken(token, (userID) => {
    req.userID = userID
    next()
  }, (err) => {
    next()
  });
}





/// Comments
//
app.get('/comments/:sayingID', (req, res) => {
  db.query(`SELECT * from comments WHERE sayingID=${req.params.sayingID} ORDER BY createdAt DESC`, (commentsErr, commentsRows, commentsFields) => {
    if (commentsErr) throw commentsErr;

      db.query(`SELECT * from users`, (userErr, userRows, userFields) => {
        if (userErr) throw userErr;
        let rows = commentsRows.map((c) => {
          let user = userRows.filter((user) => { return user.id === c.userID })[0]
          return { ...c, user: { fullname: user.fullname, username: user.username, avatar: user.avatar } };
        })
        res.json(rows);
      });

  });
});
// add comment
app.post('/comment', checkTokenMiddleware, (req, res) => {
  let { sayingID, text, ...body} = req.body;
  let { userID } = req
  db.query(`INSERT INTO comments (\`id\`, \`userID\`, \`sayingID\`, \`text\`, \`createdAt\`)
            VALUES (NULL,'${userID}','${sayingID}','${text}','${Date.now() / 1000 | 0}')`, (err, rows, fields) => {
    if (err) throw err;

    db.query(`UPDATE sayings SET commentsCount = commentsCount + 1 WHERE id = '${sayingID}'`, (err, rows, fields) => {
      if (err) {
        res.status(404).send(err)
        throw err;
      }
      else {
        res.json({
          error: '',
          status: 'success',
          changedRows: rows.changedRows
        })
      }
    });

  });
});




/// Like
//
app.post('/like', checkTokenMiddleware, (req, res) => {
  let { sayingID, ...body} = req.body
  let { userID } = req
  db.query(`INSERT INTO likes (\`id\`, \`userID\`, \`sayingID\`, \`createdAt\`)
            VALUES (NULL,'${userID}','${sayingID}','${Date.now() / 1000 | 0}')`, (err, rows, fields) => {
    if (err) throw err;

    db.query(`UPDATE sayings SET likesCount = likesCount + 1 WHERE id = '${sayingID}'`, (err, rows, fields) => {
      if (err) {
        res.status(404).send(err)
        throw err;
      }
      else {
        res.json({
          error: '',
          status: 'success',
          changedRows: rows.changedRows
        })
      }
    });

  });
});
// -----
app.post('/unlike', checkTokenMiddleware, (req, res) => {
  let { sayingID, ...body} = req.body
  let { userID } = req
  db.query(`DELETE FROM likes WHERE sayingID='${sayingID}' AND userID='${userID}'`, (delErr, delRows, delFields) => {
    if (delErr) throw delErr;
    if (delRows.affectedRows > 0) {

      db.query(`UPDATE sayings SET likesCount = likesCount - 1 WHERE id = '${sayingID}'`, (err, rows, fields) => {
        if (err) {
          res.status(404).send(err)
          throw err;
        }
        else {
          res.json({
            error: '',
            status: 'success',
            changedRows: rows.changedRows
          })
        }
      });

    } else {
      res.json({
        error: 'there were no like to unlike',
        status: 'fail',
        changedRows: delRows.changedRows
      })
    }
  });
});







/// Sayings
//
app.get('/sayings', extractUserIDFromToken, (req, res) => {
  db.query(`SELECT * from sayings ORDER BY createdAt DESC`, (sayingErr, sayingRows, sayingFields) => {
    if (sayingErr) throw sayingErr;

    db.query(`SELECT * from users`, (userErr, userRows, userFields) => {
      if (userErr) throw userErr;

      console.log(req.userID);
      if (req.userID != 'undefined' && req.userID != '' && req.userID) {

        db.query(`SELECT * from likes WHERE userID = '${req.userID}'`, (likesErr, likesRows, likesFields) => {
          if (likesErr) throw likesErr;
          let rows = sayingRows.map((saying) => {
            let user = userRows.filter((user) => { return user.id === saying.userID })[0]
            let like = likesRows.filter((like) => { return like.sayingID === saying.id })
            let isLiked = false;
            if (like.length > 0) isLiked = true
            return { ...saying, user: { fullname: user.fullname, username: user.username, avatar: user.avatar }, isLiked };
          })
          res.json(rows);
        });


      } else {

        let rows = sayingRows.map((saying) => {
          let user = userRows.filter((user) => { return user.id === saying.userID })[0]
          return { ...saying, user: { fullname: user.fullname, username: user.username, avatar: user.avatar } };
        })
        res.json(rows);

      }


    });

  });
});
app.get('/sayingsWithComments', (req, res) => {
  /*
   * All of this requests can be replaced
   * by a SQL LEFT JOIN for SQL lovers!
   * It will also have a better performance
   */
  db.query(`SELECT * from sayings ORDER BY createdAt DESC`, (sayingErr, sayingRows, sayingFields) => {
    if (sayingErr) throw sayingErr;

    db.query(`SELECT * from users`, (userErr, userRows, userFields) => {
      if (userErr) throw userErr;

      db.query(`SELECT * from comments`, (commentsErr, commentsRows, commentsFields) => {
        if (userErr) throw userErr;

        let rows = sayingRows.map((saying) => {
          let user = userRows.filter((user) => { return user.id === saying.userID })[0]
          let comments = commentsRows.filter((comment) => { return comment.sayingID === saying.id })
          return { ...saying, user: { fullname: user.fullname, username: user.username, avatar: user.avatar }, comments };
        })
        res.json(rows);

      });

    });

  });
});

// add saying
app.post('/saying', checkTokenMiddleware, (req, res) => {
  let { text, ...body} = req.body
  let { userID } = req
  db.query(`INSERT INTO sayings (\`id\`, \`userID\`, \`text\`, \`createdAt\`)
            VALUES (NULL,'${userID}','${text}','${Date.now() / 1000 | 0}')`, (sayingErr, sayingRows, sayingFields) => {
    if (sayingErr) throw sayingErr;
    if (sayingRows.affectedRows > 0) {

      db.query(`UPDATE users SET sayingsCount = sayingsCount + 1 WHERE id = '${userID}'`, (err, rows, fields) => {
        if (err) {
          res.status(404).send(err)
          throw err;
        }
        else {
          res.json({
            error: '',
            status: 'success',
            changedRows: rows.changedRows
          })
        }
      });

    } else {
      res.json({
        error: 'unable to insert new saying record',
        status: 'fail',
        changedRows: sayingRows.changedRows
      })
    }
  });
});



/// Users
//
app.get('/users', (req, res) => {
  db.query(`SELECT * from users ORDER BY createdAt`, (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
});
// by username
app.get('/user/username/:username', (req, res) => {
  db.query(`SELECT * from users WHERE username=${req.params.username}`, (err, rows, fields) => {
    if (err) throw err;
    res.json(rows[0]);
  });
});
// by id
app.get('/user/id/:id', (req, res) => {
  db.query(`SELECT * from users WHERE id=${req.params.id}`, (err, rows, fields) => {
    if (err) throw err;
    res.json(rows[0]);
  });
});


/// Signup
// middleware for handling uploads is upload.single()
// handling mysql stuff
app.post('/signup', upload.single('avatar'), (req, res) => {
  let { username, fullname, email, password, ...body} = req.body;
  let avatar = ''
  if ( req.file ) {
    avatar = req.file.path
  }
  db.query(`INSERT INTO \`users\`(\`id\`, \`username\`, \`password\`, \`fullname\`, \`email\`, \`avatar\`, \`createdAt\`)
            VALUES (NULL,'${username}','${SHA256(password).toString()}','${fullname}','${email}','${avatar}','${Date.now() / 1000 | 0}')`, (err, rows, fields) => {
  //   if (err) throw err;
    res.status(200).json({
      'error': '',
      'status': 'successful'
    });
  });
});


/// Login
app.post('/login', (req, res) => {
  let { username, password, ...body} = req.body;
  console.log(SHA256(password).toString());
  db.query(`SELECT * from users WHERE username='${username}' AND password='${SHA256(password).toString()}'`, (err, rows, fields) => {
    if (err) throw err;
    console.log(rows);
    if (rows.length === 1) {
      // Valid login
      var token = jwt.sign({ id: rows[0].id }, secretKey);
      res.status(200).json({ error: '', token: token, msg: 'Login Successful.' });
    }
    else {
      // InValid Login
      res.status(401).json({ error: 'login failed' });
    }
  });
});











/// Fire server!
app.listen(port, () => {
    console.log(`listening on port ${port} ...`)
})
