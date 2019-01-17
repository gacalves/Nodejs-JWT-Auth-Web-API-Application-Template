"use strict";

class HomeController {
  constructor() {
    this.teste = "";
  }

  get(params, fooo, testa) {
    return JSON.stringify(params, fooo, testa);
  }

  getFulano() {
    console.log('get sem parametros');
  }

  put() {
    return "toma bosta";
  }

  teste() {}
}
module.exports = HomeController;
