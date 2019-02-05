'use strict'

const jwt = require('jsonwebtoken')
const JwtAuth = require('../security/jwt-auth')

const BaseController = require('./base-controller')
const UserStore = require('../storage/user-store')
const PasswordHasher = require('../security/password-hasher')

class AuthController extends BaseController {
	constructor(viewModelBag) {
		super(viewModelBag)
		this.repo = new UserStore()
	}

	/**
   * Authenticates the user and returns jwt.
   * uses username and password params from viewModel to authenticate.
   */
	post() {
		let username = this.viewModel.username
		let password = this.viewModel.password

		// validates credentials params
		if (!(username && username.length > 0)) {
			return this.invalidCredentials()
		}
		if (!(password && password.length > 0)) {
			return this.invalidCredentials()
		}

		//get user from database
		let dbUser = this.repo.getUserByName(username)
		if (!dbUser) {
			return this.invalidCredentials()
		}

		//validate if the provided credentials pertences a registered user.
		if (dbUser.userName === username && PasswordHasher.verifyHashedPassword(dbUser.hashedPassword, password)) {
			//auth ok
			let token = JwtAuth.generateAccessToken(dbUser.userName)
			return { auth: true, access_token: token }
		}

		return this.invalidCredentials()
	}

	invalidCredentials() {
		return this.statusCode(401, {
			auth: false,
			message: 'Invalid credentiasls!'
		})
	}
}
module.exports = AuthController
