const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const createToken = (data) => {
  const token = jwt.sign(data, jwtSecretKey);
  return token;
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  console.log("token", token);
  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    //user chinh la payload:
    // "users": {
    //     "id": 9,
    //     "roleId": 12
    // },
    //tao ra 1 vung 'user' tren req va gan gia tri =  user payload
    req.user = user;
    next();
  });
};

//higher order function trong js
const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    if (req.user.roleId == role) {
      next();
    } else {
      res.sendStatus(401);
    }
  };
};

module.exports = { createToken, verifyToken, checkRole };
