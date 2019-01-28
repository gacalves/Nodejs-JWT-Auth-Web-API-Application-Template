/**
 * Example of controller class.
 */

"use strict";

const SecuredController = require('./secured-controller');

class HomeController extends SecuredController{

  /**
   * Instantiates the controller and save the view model data in instance during the request lifecycle.
   * @param {JSON} viewModelBag view model data
   */
  constructor(viewModelBag) {
    super(viewModelBag);
  }

  get(id) {
    return "Getted entity with id ".concat(JSON.stringify(this.viewModel));
  }

  post() {
    return "Saved this enttity: ".concat(JSON.stringify(this.viewModel));
  }

  put(id) {
    return "Putted properties ".concat(
      JSON.stringify(this.viewModel),
      " to update entity with id=",
      id,
      "."
    );
  }

  delete(id) {
    return "Deleted entity with id=".concat(id, ".");
  }
}
module.exports = HomeController;
