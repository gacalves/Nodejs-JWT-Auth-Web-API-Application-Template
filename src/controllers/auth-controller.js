"use strict";

const jwt = require("jsonwebtoken");
const BaseController = require("./base-controller");
const UserStore = require("../storage/user-store");
const PasswordHasher = require("../security/password-hasher");

class AuthController extends BaseController {
  constructor(viewModelBag) {
    super(viewModelBag);
    this.repo = new UserStore();
  }

  post() {
    let username = this.viewModel.username;
    let password = this.viewModel.password;

    if (!(username && username.length > 0)) {
      return this.invalidCredentials();
    }
    if (!(password && password.length > 0)) {
      return this.invalidCredentials();
    }

    let dbUser = this.repo.getUserByName(username);
    if (!dbUser) {
      return this.invalidCredentials();
    }

    if (
      dbUser.userName === username &&
      PasswordHasher.verifyHashedPassword(dbUser.hashedPassword, password)
    ) {
      //auth ok
      const id = 1;
      let token = jwt.sign({ id }, global.gConfig.jwt_secret, {
        expiresIn: 300,
        notBefore: Math.floor(Date.now() / 1000)
      });
      return { auth: true, access_token: token };
    }

    return this.invalidCredentials();
  }

  invalidCredentials() {
    return this.statusCode(401, {
      auth: false,
      message: "Invalid credentiasls!"
    });
  }
}
module.exports = AuthController;
