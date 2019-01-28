"use strict";

const BaseController = require("./base-controller");
const jwt = require("jsonwebtoken");

class AuthController extends BaseController {
  constructor(viewModelBag) {
    super(viewModelBag);
  }

  post() {
    if (
      this.viewModel.username === "geovane" &&
      this.viewModel.password === "123"
    ) {
      //auth ok
      const id = 1;
      let token = jwt.sign({ id }, global.gConfig.jwt_secret, {
        expiresIn: 300,
        notBefore: Math.floor(Date.now() / 1000)
      });
      return { auth: true, access_token: token };
    }

    return this.statusCode(401, {
      auth: false,
      message: "Invalid credentials!"
    });
  }

}
module.exports = AuthController;
