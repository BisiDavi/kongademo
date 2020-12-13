const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;


dotenv.config();

const secret = process.env.SECRET;

const UserSchema = new Schema(
  {
    firstname: { type: String, unique: false, required: true },
    lastname: { type: String, unique: false, required: true },
    email: {
      type: String,
      unique: true,
      required: [true, "cant't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    phonenumber: { type: Number, unique: true, required: true },
    password: { type: String, unique: false, required: true },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }
  },
  { timestamps: true }
);


UserSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      firstname: this.firstname,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

UserSchema.methods.toAuthJSON = function () {
  return {
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    token: this.generateJWT(),
    phonenumber: this.phonenumber
  };
};
UserSchema.methods.comparePassword = function (userPassword, cb) {
  bcrypt.compare(userPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
