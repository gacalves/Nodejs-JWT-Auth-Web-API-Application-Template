'use strict'

const Glob = require('glob')
const path = require('path')
const JwtAuth = require('./security/jwt-auth')
const util = require('util')

/**
 * Provides methods to automatically configure routes to application controllers.
 * Based on standard http methods.
 */
class Router {
	static get acceptedHttpVerbs() {
		return [
			'CHECKOUT',
			'COPY',
			'DELETE',
			'GET',
			'HEAD',
			'LOCK',
			'MERGE',
			'MKACTIVITY',
			'MKCOL',
			'MOVE',
			'NOTIFY',
			'OPTIONS',
			'PATCH',
			'POST',
			'PURGE',
			'PUT',
			'REPORT',
			'SEARCH',
			'SUBSCRIBE',
			'TRACE',
			'UNLOCK',
			'UNSUBSCRIBE'
		]
	}
	static get controllerSufix() {
		return 'Controller'
	}

	/**
   * Returs an string array containing parameter names for an function on a ES6 class.
   * @param {function} func
   */
	static getArgs(func) {
		var args = func.toString().match(/.*?\(([^)]*)\)/)[1]

		return args
			.split(',')
			.map(arg => {
				// Ensures no inline comments are binded an trim white spaces
				return arg.replace(/\/\*.*\*\//, '').trim()
			})
			.filter(arg => {
				// Ensures no undefined values
				return arg
			})
	}

	/**
   * Returns an object array {verb, routePath, controllerMethod} for each route that will be created on server.
   * In case of two methods with the same name the last declared prevails.
   * @param {class} controllerClass Tipo da classe controller.
   */
	static getRoutesBy(controllerClass) {
		var routeParams = []
		//Check if it is a controller. By convention the name of the controller classes must end with 'Controller'.
		if (controllerClass.name.endsWith(Router.controllerSufix)) {
			var controllerName = controllerClass.name.replace(Router.controllerSufix, '').toLowerCase()

			Object.getOwnPropertyNames(controllerClass.prototype).forEach(method => {
				Router.acceptedHttpVerbs.forEach(httpVerb => {
					//verifies that the method starts with one of the http verbs.
					if (method.toLowerCase().startsWith(httpVerb.toLowerCase())) {
						var methodArgs = Router.getArgs(controllerClass.prototype[method])
						var methodSubRoute =
							method.toLowerCase() !== httpVerb.toLowerCase()
								? '/'.concat(method.toLowerCase().replace(httpVerb.toLowerCase(), ''))
								: ''

						//create a route without parameters
						routeParams.push({
							verb: httpVerb.toLowerCase(),
							routePath: '/'.concat(controllerName, methodSubRoute),
							controllerMethod: method
						})

						//check if method has parameters
						if (methodArgs && methodArgs.length > 0) {
							//for each parameter in the controller creates a route for it. The order of the parameters is importante.
							var paramsSubRoute = ''
							methodArgs.forEach((paramName, i, arr) => {
								paramsSubRoute = paramsSubRoute.concat('/:', paramName)
								routeParams.push({
									verb: httpVerb.toLowerCase(),
									routePath: '/'.concat(controllerName, methodSubRoute, paramsSubRoute),
									controllerMethod: method
								})
							})
						}
					}
				})
			})
			return routeParams
		} else {
			//its not a controller
			return undefined
		}
	}

	/**
   * Retorna uma função que inicializa o controller (com um construtor sem argumentos) e  chama o devido método com os parâmetros informados
   * @param {*} controllerClass Tipo da classe controller.
   * @param {function} methodName nome do mettodo que deve ser chamado na classe controller.
   */
	static callController(controllerClass, methodName) {
		return function(req, res, next) {
			var actionParams = Object.values(req.params)
			var ctrl = new controllerClass(req.body)
			ctrl.response = res
			ctrl.request = req

			if (util.types.isAsyncFunction(ctrl[methodName])) {
        		ctrl[methodName].apply(ctrl, actionParams).then(asyncControllerResult => {
          			asyncControllerResult ? res.json(asyncControllerResult) : res.json({})
          			next()
        		})
      		} else {
        		let controllerResult = ctrl[methodName].apply(ctrl, actionParams)
				res.json(controllerResult)
				next()
      		}
		}
	}

	/**
   * Registra as rotas para cada controler presente na(s) pastas definidas em @controllersPathPattern.
   * @param {String} controllersPathPattern
   * @param {Server} server Express server.
   */
	static registerDefaultRoutes(controllersPathPattern, server) {
		Glob.sync(controllersPathPattern).forEach(file => {
			var candidateToControllerFile = require(path.resolve(file))
			Router.getRoutesBy(candidateToControllerFile).forEach(routeItem => {
				//valida de o controller exige autenticação JWT e injeta a middleware que verifica o token
				if (candidateToControllerFile.needsAuthentication && candidateToControllerFile.needsAuthentication()) {
					server[routeItem.verb](
						routeItem.routePath,
						JwtAuth.verifyJWT,
						Router.callController(candidateToControllerFile, routeItem.controllerMethod)
					)
				} else {
					server[routeItem.verb](
						routeItem.routePath,
						Router.callController(candidateToControllerFile, routeItem.controllerMethod)
					)
				}
			})
		})
		//logs express routes
		server._router.stack.forEach(function(r) {
			if (r.route && r.route.path) {
			  console.log(Object.keys(r.route.methods)[0] + ' => ' + r.route.path)
			}
		})
	}
}
module.exports = Router
