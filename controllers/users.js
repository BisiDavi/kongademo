const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");
const User = mongoose.model("User");
const auth = require("./auth");

router.get("/users", auth.required, function (req, res, next) {
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

router.put("/users", auth.required, function (req, res, next) {
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatatus(401);
      }

      if (typeof req.body.firstname !== "undefined") {
        firstname = req.body.firstname;
      }
      if (typeof req.body.lastname !== "undefined") {
        lastname = req.body.lastname;
      }
      if (typeof req.body.email !== "undefined") {
        email = req.body.email;
      }
      if (typeof req.body.phonenumber !== "undefined") {
        phonenumber = req.body.phonenumber;
      }
      if (typeof req.body.password !== "undefined") {
        password = user.setPassword(req.body.password);
      }
    })
    .catch(next);
});

router.post("/users/login", function (req, res, next) {
  if (!req.body.email) {
    return res.status(422).json({
      errors: { email: "can't be blank" }
    });
  }

  if (!req.body.password) {
    return res.status(422).json({
      errors: {
        password: "can't be blank"
      }
    });
  }

  passport.authenticate("local", {
    failureRedirect: "/users/login"
  }),
    (err, req, res, next) => {
      if (err) next(err);
      res.send("You are logged in");
    };
});

router.post("/users/register", function (req, res, next) {
  const user = new User();
  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  user.email = req.body.email;
  user.phonenumber = req.body.phonenumber;
  user.password = user.setPassword(req.body.password);

  user
    .save()
    .then(function () {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

module.exports = router;
