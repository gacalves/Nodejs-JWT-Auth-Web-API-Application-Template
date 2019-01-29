"use strict";

const DbContext = require("./local-db");

class UserStore {
  constructor() {
    this.userRepo = new DbContext().users;
  }

  getUserByName(userName) {
    return this.userRepo.filter({ userName: userName }).value()[0];
    
  }

  create(user) {
    return this.userRepo.push(user.toJSON()).write();
  }
}

module.exports = UserStore;
