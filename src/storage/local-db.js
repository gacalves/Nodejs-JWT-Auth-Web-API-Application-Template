const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

class DbContext {
  constructor() {
    this.adapter = new FileSync("db.json");
    this.db = low(this.adapter);
    // Set some defaults (required if your JSON file is empty)
    this.db.defaults({ users: [] }).write();
  }

  get users() {   
    return this.db.get("users");
  }
}

module.exports = DbContext;
