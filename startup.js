const express = require("express");
const helmet = require("helmet");
var logger = require("morgan");

const router = require("./router");

//Comente a linha abaixo e descomente a próxima para ativar o ambiente de produção.
process.env.NODE_ENV = "development";
//process.env.NODE_ENV = 'production';

//carrega as configurações da aplicação.
require("./config/config");

const app = express();
app.use(logger("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const controllersPath = "./controllers/**/*.js";

//registra as rotas padrão no servidor
router.registerDefaultRoutes(controllersPath, app);
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.stack[0].method+" -> " + r.route.path)
  }
});

//sobe o servidor
app.listen(global.gConfig.node_port, () => {
  console.log("Server Started!");
});