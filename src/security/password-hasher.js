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

  static saltHashPassword(userpassword, salt) {
    let passwordData = PasswordHasher.sha512(userpassword, salt);

    //encodes salt em hash togheter
    let buffer = Buffer.from(salt.concat(passwordData.passwordHash),'ascii');
    return buffer.toString("base64");
  }

  static hashPassword(userpassword) {
    /** Gives us salt of length define in config file */
    let salt = PasswordHasher.genRandomString(global.gConfig.salt_hash_size);
    return PasswordHasher.saltHashPassword(userpassword, salt);
  }

  static getSalt(hashedPassword) {
    let buffer = Buffer.from(hashedPassword, "base64");
    let salt = buffer.toString("ascii").slice(0, global.gConfig.salt_hash_size);
    return salt;
  }

  /**
   * Checks if a user password is equal the same as your hashed version.
   * @param {string} encodedPassword - the ecoded/hashed password from database.
   * @param {string} providedPassword - plain password entered by user.
   */
  static verifyHashedPassword(encodedPassword, providedPassword) {
    //extracts salt of encoded password
    let salt = PasswordHasher.getSalt(encodedPassword);
    //encodes providede password with salt extracted
    let providedPasswordEncoded = PasswordHasher.saltHashPassword(
      providedPassword,
      salt
    );

    return providedPasswordEncoded === encodedPassword ? true : false;
  }
}

module.exports = {
  hashPassword: PasswordHasher.hashPassword,
  verifyHashedPassword: PasswordHasher.verifyHashedPassword
};
