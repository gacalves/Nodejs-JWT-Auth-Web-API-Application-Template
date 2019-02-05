'use strict'

/**
 * All controllers tha needs to be secured should inherit from this.
 */

const BaseController = require('./base-controller')

class SecuredController extends BaseController {
  constructor(viewModelBag) {
    super(viewModelBag)
  }

  static needsAuthentication() {
    return true
  }
}
module.exports = SecuredController
