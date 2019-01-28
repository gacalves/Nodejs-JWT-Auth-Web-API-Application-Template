"use strict";
const jwt = require("jsonwebtoken");
const ClaimTypes = require("./claim-types");

class JWTUtils {
  static verifyJWT(req, res, next) {
    let token = req.headers.authorization;
    if (token && token.length > 0) {
      token = token.split(" ")[1];
    }
    if (!token)
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." });

    jwt.verify(token, global.gConfig.jwt_secret, function(err, decoded) {
      if (err)
        return res.status(401).send({
          auth: false,
          message: "Failed to authenticate token: ".concat(err.message, ".")
        });

      // todo: criar uma interface de banco de dados para resgatar isto aqui.
      //se tudo estiver ok, salva no request para uso posterior

      req.userId = decoded.id;
      next();
    });
  }
}
module.exports = JWTUtils;
