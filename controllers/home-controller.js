"use strict";

class HomeController {
  constructor(viewModelBag) {
    this.viewModel = viewModelBag;
  }

  get(id) {
    return "Getted entity with id ".concat(id,'.');
  }

  post() {
    return 'Saved this enttity: '.concat(JSON.stringify(this.viewModel));
  }

  put(id) {
    return "Putted properties ".concat(JSON.stringify(this.viewModel), ' to update entity with id=', id, '.');
  }

  delete(id) {
    return "Deleted entity with id=".concat(id, '.');
  }
}
module.exports = HomeController;
