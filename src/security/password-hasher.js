"use strict";
var crypto = require("crypto");

class PasswordHasher {
  /**
   * generates random string of characters i.e salt
   * @function
   * @param {number} length - Length of the random string.
   */
  static genRandomString(length) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex") /** convert to hexadecimal format */
      .slice(0, length); /** return required number of characters */
  }

  /**
   * hash password with sha512.
   * @function
   * @param {string} password - List of required fields.
   * @param {string} salt - Data to be validated.
   */
  static sha512(password, salt) {
    let hash = crypto.createHmac("sha512", salt);
    hash.update(password);
    let value = hash.digest("hex");
    return {
      salt: salt,
      passwordHash: value
    };
  }

  static saltHashPassword(userpassword) {
    let salt = PasswordHasher.genRandomString(16); /** Gives us salt of length 16 */
    let passwordData = PasswordHasher.sha512(userpassword, salt);

    //encodes salt em hash togheter
    return Buffer.from(
      salt.concat(passwordData.passwordHash).toString("base64")
    );
  }
}

module.exports = { hashPassword: PasswordHasher.saltHashPassword };
