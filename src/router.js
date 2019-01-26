"use strict";

const Glob = require("glob");
const path = require("path");

/**
 * Fornece metodos para configurar automaticamente rotas para os controllers da aplicação.
 * Basea-se nos métodos http padrão.
 */
class Router {
  static get acceptedHttpVerbs() {
    return ["GET", "POST", "PUT", "DELETE", "PATCH"];
  }
  static get controllerSufix() {
    return "Controller";
  }

  /**
   * Retorna um array de strings contendo o nome de cada parâmetro de uma função em uma classe do ES6.
   * @param {function} func
   */
  static getArgs(func) {
    var args = func.toString().match(/.*?\(([^)]*)\)/)[1];

    return args
      .split(",")
      .map(arg => {
        // Garante que nenhum comentário inline foi convertido e elimina espaços em branco.
        return arg.replace(/\/\*.*\*\//, "").trim();
      })
      .filter(arg => {
        // Garante que nenhum valor undefined será repassado.
        return arg;
      });
  }

  /**
   * Retorna um array de objstos {verb, routePath, controllerMethod} para cada rota que deve ser criada no servidor.
   * Em caso de dois métodos com o mesmo nome o ultimo declarado prevalece.
   * @param {class} controllerClass Tipo da classe controller.
   */
  static getRoutesBy(controllerClass) {
    var routeParams = [];
    //Verificar se é um controller. Por convenção o nome das classes controller devem terminar com 'Controller'.
    if (controllerClass.name.endsWith(Router.controllerSufix)) {
      var controllerName = controllerClass.name
        .replace(Router.controllerSufix, "")
        .toLowerCase();

      Object.getOwnPropertyNames(controllerClass.prototype).forEach(method => {
        Router.acceptedHttpVerbs.forEach(httpVerb => {
          //verifica se o metodo inicia com um dos verbos http.
          if (method.toLowerCase().startsWith(httpVerb.toLowerCase())) {
            var methodArgs = Router.getArgs(controllerClass.prototype[method]);
            var methodSubRoute =
              method.toLowerCase() !== httpVerb.toLowerCase()
                ? "_".concat(
                    method.toLowerCase().replace(httpVerb.toLowerCase(), "")
                  )
                : "";

            //cria uma rota sem parametros
            routeParams.push({
              verb: httpVerb.toLowerCase(),
              routePath: "/".concat(controllerName, methodSubRoute),
              controllerMethod: method
            });

            //verifica se tem parametros
            if (methodArgs && methodArgs.length > 0) {
              //para cada parametro no controller cria uma rota para ele. A ordem dos parâmetros faz diferença.
              var paramsSubRoute = "";
              methodArgs.forEach((paramName, i, arr) => {
                paramsSubRoute = paramsSubRoute.concat("/:", paramName);
                routeParams.push({
                  verb: httpVerb.toLowerCase(),
                  routePath: "/".concat(
                    controllerName,
                    methodSubRoute,
                    paramsSubRoute
                  ),
                  controllerMethod: method
                });
              });
            }
          }
        });
      });
      return routeParams;
    } else {
      //não é um controller
      return undefined;
    }
  }

  /**
   * Retorna uma função que inicializa o controller (com um construtor sem argumentos) e  chama o devido método com os parâmetros informados
   * @param {*} controllerClass Tipo da classe controller.
   * @param {function} methodName nome do mettodo que deve ser chamado na classe controller.
   */
  static callController(controllerClass, methodName) {
    return function(req, res, next) {
      var actionParams = Object.values(req.params);
      var ctrl = new controllerClass(req.body);
      res.send(ctrl[methodName].apply(ctrl, actionParams));
      next();
    };
  }

  /**
   * Registra as rotas para cada controler presente na(s) pastas definidas em @controllersPathPattern.
   * @param {String} controllersPathPattern
   * @param {Server} server Express server.
   */
  static registerDefaultRoutes(controllersPathPattern, server) {
    Glob.sync(controllersPathPattern).forEach(file => {
      var candidateToControllerFile = require(path.resolve(file));
      Router.getRoutesBy(candidateToControllerFile).forEach(routeItem => {
        server[routeItem.verb](
          routeItem.routePath,
          Router.callController(
            candidateToControllerFile,
            routeItem.controllerMethod
          )
        );
      });
    });
  }
}
module.exports = Router;
