const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();

const connection = require("./Config/db");
const UserModel = require("./Models/user.model");
const NoteModel = require("./Models/note.model");
const notesRoute = require("./Routes/note.route");
const authentication = require("./Middlewares/authentication");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome To FullStack Assignment");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const userPresent = await UserModel.findOne({ email });

  if (userPresent?.email) {
    res.send("Email Already Exist");
  } else {
    try {
      bcrypt.hash(password, 5, async (err, hash) => {
        const user = new UserModel({ email, password: hash });
        await user.save();
        res.send("Signup Successfully");
      });
    } catch (error) {
      console.log(error);
      console.log("Somthing Went Wrong in Signup");
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    var user = await UserModel.find({ email });

    if (user.length > 0) {
      const hashed_password = user[0].password;
      bcrypt.compare(password, hashed_password, function (err, result) {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, "hush");
          res.send({ msg: "Login successfull", token: token });
        } else {
          res.send("Login failed");
        }
      });
    } else {
      res.send("Login failed");
    }
  } catch {
    res.send("Something went wrong, please try again later");
  }
});

app.use(authentication);
app.use("/notes", notesRoute);

app.listen(7877, async () => {
  try {
    await connection;
    console.log("connected successfully with db");
  } catch (error) {
    console.log("somthing went wrong in server");
    console.log(error);
  }
  console.log("Running on PORT 2020");
});
