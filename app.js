const express = require("express");
const cors = require('cors')
const session = require('express-session');
const userRoutes = require('./routes/userroutes')
const app = express();

const sessionConfig = session({
  name: 'Cookie',
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000,
    secure: true, 
  }, 
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
})

app.use(cors())
app.use(express.json())
app.use(sessionConfig())

app.use("/api/v1/users",userRoutes)

module.exports = app;
