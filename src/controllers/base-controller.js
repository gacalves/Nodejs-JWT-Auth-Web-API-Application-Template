'use strict'

/**
 * Base Controller that all controllers should inherit.
 */
let res
let req

class BaseController {
  constructor(viewModelBag) {
    this.viewModel = viewModelBag
  }

  get response() {
    return res
  }

  set response(value) {
    res = value
  }

  get request() {
    return req
  }

  set request(value) {
    req = value
  }

  statusCode(httpStatusCode, message) {
    this.response.status(httpStatusCode)
    return message
  }
}

module.exports = BaseController
