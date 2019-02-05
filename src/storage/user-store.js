'use strict'

/**
 * Manages persistence for users registries.
 * In production environments this class needs to be altered to access an DBMS.
 */

const DbContext = require('./local-db')

class UserStore {
  constructor() {
    this.userRepo = new DbContext().users
  }

  /**
   * Get the user from database. If not found returns undefined.
   * @param {string} userName the username to be recovered.
   */
  getUserByName(userName) {
    return this.userRepo.filter({ userName: userName }).value()[0]
  }

  /**
   * Inserts new user on database.
   * @param {User} user user to be created.
   */
  create(user) {
    return this.userRepo.push(user.toJSON()).write()
  }
}

module.exports = UserStore
