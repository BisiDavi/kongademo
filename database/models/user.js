const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
var crypto = require("crypto");
const dotenv = require("dotenv");
const Schema = mongoose.Schema;

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
    hash: String,
    salt: String
  },
  { timestamps: true }
);

UserSchema.methods.generateJWT = function () {
  let today = new Date();
  let exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  );
};

UserSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
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

const User = mongoose.model("User", UserSchema);

module.exports = User;
