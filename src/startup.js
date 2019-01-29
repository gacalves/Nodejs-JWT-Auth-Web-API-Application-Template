"use strict";

const express = require("express");
const helmet = require("helmet");
var logger = require("morgan");
//const JWTUtils =require("./jwt-auth");

const Router = require("./router");

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
//app.use(JWTUtils.verifyJWT);
const controllersPath = "./src/controllers/**/*.js";

//registra as rotas padrão no servidor
Router.registerDefaultRoutes(controllersPath, app);

//sobe o servidor
app.listen(global.gConfig.node_port, () => {
  console.log("Server Started!");
});
