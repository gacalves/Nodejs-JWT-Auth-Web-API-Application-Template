"use strict";

let _userName;
let _email;
let _givenName;
let _lastName;
let _hashePwd;

class User {
  constructor(userName, email, givenName, lastName, hashePwd) {
    this._userName = userName;
    this._email = email;
    this._givenName = givenName;
    this._lastName = lastName;
    this._hashePwd = hashePwd;
  }

  get userName() {
    return this._userName;
  }
  get email() {
    return this._email;
  }
  get givenName() {
    return this._givenName;
  }
  get lastName() {
    return this._lastName;
  }
  get hashePwd() {
    return this._hashePwd;
  }

  set userName(value) {
    this._userName = value;
  }
  set email(value) {
    this._email = value;
  }
  set givenName(value) {
    this._givenName = value;
  }
  set lastName(value) {
    this._lastName = value;
  }

  toJSON() {
    let json =  {
      userName: this._userName,
      email: this._email,
      givenName: this._givenName,
      lastName: this._lastName,
      hashedPassword: this._hashePwd
    };

    console.log(json);
    return json;
  }
}

module.exports = User;
