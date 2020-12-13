const passport = require("passport");
const localStrategy = require("./localStrategy");
const User = require("../database/models/user");

const usePassport = _app => {
  passport.serializeUser((user, done) => {
    console.log("*** serializeUser called, user: ");
    console.log(user);
    console.log("-----------------");
    done(null, { _id: user._id });
  });

  passport.deserializeUser((id, done) => {
    console.log("DeserializeUser called");
    User.findOne({ _id: id }, (err, user) => {
      console.log("*** Deserialize user, user:");
      console.log(user);
      console.log("...............");
      done(null, user);
    });
  });

  localStrategy(passport);

  _app.use(passport.initialize());
  _app.use(passport.session());
};
module.exports = usePassport;
