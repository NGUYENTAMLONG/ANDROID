const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const router = express.Router();
const url = require("url");
//GET all user
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) throw Error("Not found !!!");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: `${error}` });
  }
});
//GET user by id
router.get("/:id", async (req, res) => {
  try {
    const users = await User.findOne({ _id: req.params.id });
    if (!users) throw Error("Not found !!!");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: `${error}` });
  }
});
//POST user => for REGISTER/for Admin add more user
router.post("/", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username.trim(),
      password: hashedPass,
      email: req.body.email.trim(),
      phonenumber: req.body.phonenumber.trim(),
    });
    const checkUsername = await User.findOne({ username: req.body.username });
    if (checkUsername) {
      res.status(400).json({
        result: false,
        at: "username",
        message: "Username already exists !!!",
      });
    }
    const checkEmail = await User.findOne({ email: req.body.email });
    if (!checkEmail) {
      const user = await newUser.save();
      if (!user) {
        res.status(400).json({ msg: "Something wrong went save user!!!" });
      }
      res.status(200).json({
        result: true,
        at: "email",
        message: "Your email account is valid !!!",
        url: "https://nguyentamlong.github.io/ANDROID/Pages/login.html",
      });
    } else {
      res.status(400).json({
        result: false,
        at: "email",
        message: "email account already exists !!!",
      });
    }
  } catch (error) {
    res.status(400).json({ msg: `${error}` });
  }
});
// PUT/PATH user (update user)
router.patch("/:id", async (req, res) => {
  const { username, email, password, phonenumber } = req.body;
  const checkPassword = await User.findOne({ password: password });
  let updateUser = {};
  if (!checkPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    updateUser = {
      username,
      email,
      password: hashedPass,
      phonenumber,
    };
  } else {
    updateUser = {
      username,
      email,
      phonenumber,
    };
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, updateUser, {
      timestamps: true,
    });
    if (!user) throw Error("Something went wrong while updating the user!");
    res
      .status(200)
      .json({ success: "Update successful !!!", userUpdate: updateUser });
  } catch (error) {
    res.status(400).json({ msg: `${error}` });
  }
});
//DELETE the user
router.delete("/:id", async (req, res) => {
  try {
    const userDelete = await User.findByIdAndDelete(req.params.id);
    if (!userDelete)
      throw Error("Something went wrong while deleting the post!");
    res.status(200).json({ success: true, msg: "Successfully deleted !!!" });
  } catch (error) {
    res.status(400).json({ msg: `${error}` });
  }
});
//Login POST
// api/user/login
router.post("/login", async (req, res) => {
  // res.json(req.body);
  try {
    const loginUser = await User.findOne({ email: req.body.email });
    !loginUser &&
      res
        .status(400)
        .json({ result: false, at: "email", message: "Email not found !!!" });
    const validate = await bcrypt.compare(
      req.body.password,
      loginUser.password
    );
    !validate &&
      res.status(400).json({
        result: false,
        at: "password",
        message: "Invalid password !!! =(",
      });
    // https://nguyentamlong.github.io/ANDROID/Pages/index.html
    res.status(200).json({
      result: true,
      url: `https://nguyentamlong.github.io/ANDROID/Pages/index.html?user=${loginUser.username}`,
    });
    //   .redirect(
    //   url.format({
    //     pathname: "https://nguyentamlong.github.io/ANDROID/Pages/index.html",
    //     query: {
    //       user: loginUser.username,
    //     },
    //   })
    // );
  } catch (error) {
    res.status(400).json({ msg: `${error}` });
  }
});

// Password retrieval
//api/user/recover (using nodemail)
router.post("/recover", async (req, res) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const { email } = req.body;
  const checkEmail = await User.findOne({ email: email }); // bien checkEmail luc nay neu ton tai thi se duoc gan cho la mot object user tim dc trong database
  if (!checkEmail) {
    res.status(400).json({ result: false, msg: "Email does not exist !!!" });
  } else {
    //ma hoa id
    const salt = await bcrypt.genSalt(10);
    const hashedId = await bcrypt.hash(checkEmail._id.toString(), salt);
    //  ***********
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tamlong12032000@gmail.com",
        pass: "coecwfixjwxofzha",
      },
    });

    const mailOptions = {
      from: "youremail@gmail.com",
      to: `${email}`,
      subject: "Sending Email using Node.js",
      text: "Click vào đường link bên dưới để lấy lại mật khẩu nào!",
      html: `<h1>Hello! I am admin of OnlineQuiz</h1>
      <p>If you want to reset your password, please go to the link</p>
      <b>Link is here</b><a href="https://nguyentamlong.github.io/ANDROID/Pages/change.html?user=${checkEmail.username}&&id=${hashedId}""> Get Password Now !!!</a>`, // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({
          result: true,
          msg: "Successfully !!! Please check your email",
          email: email,
        });
      }
    });
  }
});
//api/user/change-password
router.post("/change-password", async (req, res) => {
  const { password, encodeId, username } = req.body;
  const user = await User.findOne({ username: username }); // buoc nay try/catch k can thiet vi xac thuc nguoi dung da co tu gia doan truoc
  const validate = await bcrypt.compare(user._id.toString(), encodeId);
  if (!validate) {
    console.log({ msg: "Something went wrong while validating!!!" });
  } else {
    console.log({ msg: "Ids are match!!!" });
    const salt = await bcrypt.genSalt(10);
    const hashedChangedPass = await bcrypt.hash(password, salt);
    const userAfterChangedPassword = {
      username: user.username,
      email: user.email,
      password: hashedChangedPass,
      phonenumber: user.phonenumber,
    };
    try {
      const changePassword = await User.findByIdAndUpdate(
        user._id,
        userAfterChangedPassword,
        {
          timestamps: true,
        }
      );
      if (!user) throw Error("Something went wrong while updating the user!");
      res.status(200).json({
        success: "Update successful !!!",
        userUpdate: userAfterChangedPassword,
      });
    } catch (error) {
      console.log(error);
    }
  }
});
module.exports = router;
