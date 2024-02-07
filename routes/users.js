var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "./uploads" });
var User = require("../models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var nodeMailer = require("nodemailer");
const { check, validationResult } = require("express-validator/check");
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.get("/", ensureAuthenticated, function (req, res, next) {
  res.render("userdashboard");
});
router.get("/register", function (req, res, next) {
  res.render("register", { title: "Register" });
});
router.get("/login", function (req, res, next) {
  res.render("login", { title: "Login" });
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Invalid Credentials",
  }),
  function (req, res) {
    req.flash("success", "You are now logged in");
    res.redirect("/");
  }
);

passport.serializeUser(function(user,done){
  done(null,user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.getUserByUsername(username);

      if (!user) {
        return done(null, false, { message: "unknown user" });
      }
      const isMatch = await User.comparePassword(password, user.password);

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Invalid Password" });
      }
    } catch (err) {
      return done(err);
    }
  })
);

router.post(
  "/register",
  upload.single("profile"),
  [
    check("name", "Name is empty!! Required").not().isEmpty(),
    check("email", "Email required").not().isEmpty(),
    check("contact", "contact length should be 10")
      .not()
      .isEmpty()
      .isLength({ max: 10 }),
  ],
  function (req, res, next) {
    var form = {
      person: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      uname: req.body.username,
      pass: req.body.password,
    };
    console.log(form);
    const errr = validationResult(req);
    if (!errr.isEmpty()) {
      console.log(errr);
      res.render("register", { errors: errr.errors, form: form });
    } else {
      var name = req.body.name;
      var email = req.body.email;
      var uname = req.body.username;
      var password = req.body.password;
      var contact = req.body.contact;
      if (req.file) {
        var profileimage = req.file.filename;
      } else {
        var profileimage = "noimage.jpg";
      }
      var newUser = new User({
        name: name,
        email: email,
        password: password,
        profileimage: profileimage,
        uname: uname,
        contact: contact,
        role: "user",
      });
      User.createUser(newUser);
      res.location("/");
      res.redirect("./login");
    }
  }
);

router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) {
      console.error(err);
      return next(err);
    }
    req.flash('success', 'You are now logged out');
    res.redirect('/users/login');
  });
});


function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login')
}

module.exports = router;
