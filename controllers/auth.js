const jwt = require("express-jwt");
const secret = process.env.SECRET;

function getTokenFromHeader(req) {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}


const auth = {
  required: jwt({
    secret: "gentleman",
    userProperty: "payload",
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: "gentleman",
    userProperty: "payload",
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
