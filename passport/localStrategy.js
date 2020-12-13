const passport = require("passport");
const User = require("../database/models/user");
const LocalStrategy = require("passport-local").Strategy;

const localStrategy = _passport => {
  _passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      function (email, password, done) {
        User.findOne({ email: email })
          .then(function (user) {
            if (!user || !user.validPassword(password)) {
              return done(null, false, {
                errors: { "email or password": "is invalid" }
              });
            }

            return done(null, user);
          })
          .catch(done);
      }
    )
  );
};

module.exports = localStrategy;
