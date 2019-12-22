const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const userRoutes = require("./routes/userroutes");
const app = express();

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionConfig.secure = true;
}
app.use(cors());
app.use(express.json());
app.use(
  session({
    name: "Cookie",
    secret: process.env.SESSION_SECRET,
    httpOnly: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true
    },
    resave: true,
    saveUninitialized: true
  })
);

app.use("/api/v1/users", userRoutes);

module.exports = app;
