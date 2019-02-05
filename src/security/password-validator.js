'use strict'

/**
 * Aux the user password common validations.
 */

class PasswordValidator {
  constructor() {
    this.valid = true
    this.regexValidator = []
  }


  shouldContainLowerCase() {
    this.regexValidator.push('(?=.*[a-z])')
    return this
  }

  shouldContainUpperCase() {
    this.regexValidator.push('(?=.*[A-Z])')
    return this
  }

  shouldContainDigit() {
    this.regexValidator.push('(?=.*[0-9])')
    return this
  }

  shouldContainSymbols() {
    this.regexValidator.push('(?=.*[^a-zA-Z0-9\\s])')
    return this
  }

  minLength(min) {
    this.regexValidator.push('(^.{'.concat(min, ',}$)'))
    return this
  }

  maxLength(max) {
    this.regexValidator.push('(^.{1,'.concat(max, '10}$)'))
    return this
  }

  isValid(password) {
    if (password && password.length > 0) {
      this.regexValidator.every(regex => {
        let val = password.match(regex)
        if (!(val && val.length > 0)) {
          this.valid = false
          return false
        } else {
          this.valid = true
          return true
        }
      })
      return this.valid
    } else {
      return false
    }
  }
}
module.exports = PasswordValidator
