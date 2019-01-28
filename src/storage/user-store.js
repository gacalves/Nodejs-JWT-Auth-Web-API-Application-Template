"use strict";

const DbContext = require("./local-db");

class UserStore {
  constructor() {
    this.userRepo = new DbContext().users;
  }

  getUserByName(userName) {
    return this.userRepo.filter({ userName: userName }).value();
  }

  create(user) {
    return this.userRepo.push(user.toJSON()).write();
  }
}

module.exports = UserStore;
