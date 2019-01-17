const restify = require("restify");

const router = require("./router");

//Coment a linha abaixo e descomente a próxima para ativar o ambiente de produção.
process.env.NODE_ENV = 'development';
//process.env.NODE_ENV = 'production';

//carrega as configurações da aplicação.
const config = require("./config/config");

const server = restify.createServer();
const controllersPath = "./controllers/**/*.js";

//registra as rotas padrão no servidor
router.registerDefaultRoutes(controllersPath, server);

//sobe o servidor
server.listen(global.gConfig.node_port, () => {
  console.log("Servidor subiu. ui!");
});
