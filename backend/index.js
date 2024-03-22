const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./modals/user');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const bcryptSalt = bcrypt.genSaltSync(10);
const ws = require('ws');
const Message = require('./modals/messages.js');
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE, PATCH');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/', (req, res) => {
  res.json('test ok');
});

app.get('/profile', async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
      if (err) throw err.message;
      res.json(userData);
    });
  } else {
    res.status(401).json('No Token');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passwordOk = bcrypt.compareSync(password, foundUser.password);
    if (passwordOk) {
      jwt.sign({ userId: foundUser._id, username }, jwtSecret, {}, (err, token) => {
        res.cookie('token', token, { sameSite: 'none', secure: true }).json({
          id: foundUser._id,
        });
      });
    }
  }
});
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { userId: createdUser._id, username },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res
      .cookie('token', token, { sameSite: 'none', secure: true })
      .status(201)
      .json({ id: createdUser._id });
  } catch (err) {
    if (err) throw err.message;
    res.status(500).json(err.message);
  }
});

const server = app.listen(4000);

const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {
  // Read Username and Id from the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies
      .split(';')
      .find((str) => str.startsWith('token='));

    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text } = messageData;
    const messageDoc = await Message.create({
      sender: connection.userId,
      recipient,
      text,
    });
    if (recipient && text) {
      [...wss.clients]
        .filter((client) => client.userId === recipient)
        .forEach((client) =>
          client.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              id: messageDoc._id,
            })
          )
        );
    }
  });

  // notify everyone about online people (when someone connects)

  [...wss.clients].forEach((client) =>
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((client) => ({
          userId: client.userId,
          username: client.username,
        })),
      })
    )
  );
});
