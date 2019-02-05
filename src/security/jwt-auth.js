'use strict'

/**
 * Manages generation and validation for auth tokens.
 */

const jwt = require('jsonwebtoken')
const ClaimTypes = require('./claim-types')
const UserStore = require('../storage/user-store')

class JwtAuth {
/**
 * Check if a provided token is valid.
 * @param {Express.Request} req http request.
 * @param {Express.Response} res http response
 * @param {Express.NextFunction} next redirections for Express js.
 */
	static verifyJWT(req, res, next) {
		let token = req.headers.authorization
		if (token && token.length > 0) {
			token = token.split(' ')[1]
		}
		if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })

		jwt.verify(token, global.gConfig.jwt_secret, function(err, decoded) {
			if (err)
				return res.status(401).send({
					auth: false,
					message: 'Failed to authenticate token: '.concat(err.message, '.')
				})

			//checks if user is in database
			let user = new UserStore().getUserByName(decoded.user_name)
			if (user) req.userName = decoded.user_name
			else return res.status(401).send({ auth: false, message: 'Invalid token.' })

			//if all done go ahead
			next()
		})
	}

	/**
   * Generate the jwt access token.
   * @param {string} userName username to inject on generated token.
   */
	static generateAccessToken(userName) {
		let notBefore = Math.floor(Date.now() / 1000);
		console.log(Date.now());
		
		let token = jwt.sign({ user_name: userName }, global.gConfig.jwt_secret, {
			expiresIn: global.gConfig.jwt_expires_in_seconds,
			notBefore: Math.floor(Date.now() / 1000)
		})
		return token
	}
}
module.exports = JwtAuth
