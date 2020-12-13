const passport = require("passport");
const User = require("../database/models/user");
const LocalStrategy = require("passport-local").Strategy;

const validPassword = (password, hash, salt) => {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
};

const genHashedPassword = password => {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return {
    salt: salt,
    hash: genHash
  };
};

const localStrategy = _passport => {
  _passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function (username, password, cb) {
        User.findOne({ email: username })
          .then(user => {
            if (!user) {
              return cb(null, false);
            }
            User.comparePassword(password);
            const isValid = validPassword(password, user.hash, user.salt);

            if (isValid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          })
          .catch(err => {
            cb(err);
          });
      }
    )
  );
};

module.exports = localStrategy;
