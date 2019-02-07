'use strict'

/**
 * This controller provides registration for new users.
 */

const BaseController = require('./base-controller')
const PasswordHasher = require('../security/password-hasher')
const PasswordValidator = require('../security/password-validator')
const UserStore = require('../storage/user-store')
const User = require('../models/user')

class RegisterController extends BaseController {
  constructor(viewModelBag) {
    super(viewModelBag)
    this.repo = new UserStore()
  }

  post() {
    if (
      this.viewModel &&
      this.viewModel.username &&
      this.viewModel.username.length > 0 &&
      this.viewModel.password &&
      this.viewModel.password.length > 0
    ) {
      //define password police
      let pwdValidator = new PasswordValidator()
        .shouldContainDigit()
        .shouldContainLowerCase()
        .shouldContainUpperCase()
        .shouldContainSymbols()
        .minLength(6)

      if (!pwdValidator.isValid(this.viewModel.password)) {
        return { error: 'Invalid Password.' }
      }

      let userNameAlreadyInUse = this.repo.getUserByName(
        this.viewModel.username
      )

      if (userNameAlreadyInUse) {
        return { error: 'Username already in use.' }
      }

      //hash user password
      var hashedPwd = PasswordHasher.hashPassword(this.viewModel.password)

      let user = new User(
        this.viewModel.username,
        this.viewModel.email,
        this.viewModel.givenName,
        this.viewModel.lastName,
        hashedPwd
      )
      let result = this.repo.create(user)
      if (result === undefined) {
        return this.statusCode(500, { message: 'Failed to create user.' })
      } else {
        return { message: 'User successful created.' }
      }
    }
  }
}
module.exports = RegisterController
