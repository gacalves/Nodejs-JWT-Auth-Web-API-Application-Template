"use strict";

const BaseController = require('./base-controller');

class SecuredController extends BaseController{

  constructor(viewModelBag) {
    super(viewModelBag);
  }

  static needsAuthentication(){
      return true;
  }
}
module.exports = SecuredController;
