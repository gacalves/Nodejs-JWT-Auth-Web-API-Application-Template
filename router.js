/**
 * Fornece metodos para configurar automaticamente rotas para os controllers da aplicação.
 * Basea-se nos métodos http padrão.
 */

const glob = require("glob");
const path = require("path");
const acceptedHttpVerbs = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const controllerSufix = "Controller";

/**
 * Retorna um array de strings contendo o nome de cada parâmetro de uma função em uma classe do ES6.
 * @param {function} func
 */
function getArgs(func) {
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
          var methodSubRoute = method.toLowerCase() !== httpVerb.toLowerCase() ? "_".concat(method.toLowerCase().replace(httpVerb.toLowerCase(), "")) : "";
          
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
            methodArgs.forEach(
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
  return function (req, res, next) {
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
function registerDefaultRoutes(controllersPathPattern, server) {
  glob.sync(controllersPathPattern).forEach(file => {
    var candidateToControllerFile = require(path.resolve(file));
    getRoutesBy(candidateToControllerFile).forEach(routeItem => {
      server[routeItem.verb](
        routeItem.routePath,
        callController(candidateToControllerFile, routeItem.controllerMethod)
      );
    });
  });
}

module.exports = { registerDefaultRoutes: registerDefaultRoutes };
