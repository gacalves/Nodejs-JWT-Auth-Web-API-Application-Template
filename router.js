/**
 * Fornece metodos para configurar automaticamente rotas para os controllers da aplicação.
 * Basea-se nos métodos http padrão.
 */

const glob = require("glob");
const path = require("path");
const acceptedHttpVerbs = ["GET", "POST", "PUT", "DELETE", "HEAD"];
const controllerSufix = "Controller";

/**
 * Retorna um array de strings contendo o nome de cada parâmetro de uma função em uma classe do ES6.
 * @param {function} func
 */
function getArgs(func) {
  // First match everything inside the function argument parentesis.
  var args = func.toString().match(/.*?\(([^)]*)\)/)[1];

  // Split the arguments string into an array comma delimited.
  return args
    .split(",")
    .map(arg => {
      // Ensure no inline comments are parsed and trim the whitespace.
      return arg.replace(/\/\*.*\*\//, "").trim();
    })
    .filter(arg => {
      // Ensure no undefined values are added.
      return arg;
    });
}

/**
 * Retorna um array de objstos {verb, routePath, controllerMethod} para cada rota que deve ser criada no servidor.
 * Em caso de dois métodos com o mesmo nome o ultimo declarado prevalece.
 * @param {class} controllerClass Tipo da classe controller.
 */
function getRoutesBy(controllerClass) {
  var routeParams = [];
  //Verificar se é um controller. Por convenção o nome das classes controller devem terminar com 'Controller'.
  if (controllerClass.name.endsWith(controllerSufix)) {
    var controllerName = controllerClass.name
      .replace(controllerSufix, "")
      .toLowerCase();

    Object.getOwnPropertyNames(controllerClass.prototype).forEach(method => {
      acceptedHttpVerbs.forEach(httpVerb => {
        //verifica se o metodo inicia com um dos verbos http.
        if (method.toLowerCase().startsWith(httpVerb.toLowerCase())) {
          var methodArgs = getArgs(controllerClass.prototype[method]);
          var methodSubRoute =
            method.toLowerCase() !== httpVerb.toLowerCase()
              ? "/".concat(
                  method.toLowerCase().replace(httpVerb.toLowerCase(), "")
                )
              : "";
          if (methodArgs && methodArgs.length > 0) {
            //para cada parametro no controller cria uma rota para ele. A ordem dos parâmetros faz diferença.
            var paramsSubRoute = "";
            getArgs(controllerClass.prototype[method]).forEach(
              (paramName, i, arr) => {
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
              }
            );
          } else {
            //cria uma rota sem parametros
            routeParams.push({
              verb: httpVerb.toLowerCase(),
              routePath: "/".concat(controllerName, methodSubRoute),
              controllerMethod: method
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
function callController(controllerClass, methodName) {
  return function(req, res, next) {
    res.send(new controllerClass()[methodName](req.params));
    next();
  };
}

/**
 * Registra as rotas para cada controler presente na(s) pastas definidas em @controllersPathPattern.
 * @param {String} controllersPathPattern
 * @param {Server} server Restify server.
 */
function registerDefaultRoutes(controllersPathPattern, server) {
  glob.sync(controllersPathPattern).forEach(file => {
    var candidateToControllerFile = require(path.resolve(file));
    getRoutesBy(candidateToControllerFile).forEach(routeItem => {
      server[routeItem.verb](
        routeItem.routePath,
        callController(candidateToControllerFile, routeItem.controllerMethod)
      );
    });
    //console.log(candidateToControllerFile.prototype);
  });
}

module.exports = { registerDefaultRoutes: registerDefaultRoutes };
