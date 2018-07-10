const SQLite = require('sqlite3');
const Validate = require('./validate');

class Model {

  constructor() {
    this.validator = new Validate();
    this.db = new SQLite.Database('data/model');
    this.table();
  }

  table() {
    this.db.serialize(function () {
      this.run("CREATE TABLE IF NOT EXISTS model (name TEXT PRIMARY KEY, schema TEXT)", function (err, row) {
        if (err) {
          console.log('Error :' + err);
          this.db = false;
        }
      });
    });
  }

  add(body, callback) {
    if (this.db && this.validator.validateModel(body)) {
      this.db.serialize(function () {
        this.run("INSERT INTO model (name, schema) VALUES (?, ?)", body.table, JSON.stringify(body.schema));
        this.run("CREATE TABLE IF NOT EXISTS entity_" + body.table + " (id INTEGER PRIMARY KEY, key INTEGER NOT NULL, data TEXT)", callback);
      });
    } else {
      callback("No valid parameters", false);
    }
  }

  edit(body, callback) {
    if (this.db && this.validator.validateModel(body)) {
      this.db.serialize(function () {
        this.run("UPDATE model SET schema = ? WHERE name = ?", JSON.stringify(body.schema), body.table, callback);
      });
    } else {
      callback("No valid parameters", false);
    }
  }

  delete(body, callback) {
    if (this.db && body !== undefined && body.table !== undefined) {
      this.db.serialize(function () {
        this.run("DELETE FROM model WHERE name = ?", body.table);
        this.run("DROP TABLE entity_" + body.table, callback);
      });
    } else {
      callback("No valid parameters", false);
    }
  }

  view(body, callback) {
    if (this.db && body !== undefined && body.table !== undefined) {
      this.db.serialize(function () {
        this.get("SELECT name, schema FROM model WHERE name = ?", body.table, function (err, ok) {
          if (err) {
            callback(err, false);
          } else if (ok === undefined) {
            callback(false, false);
          } else {
            ok.schema = JSON.parse(ok.schema);
            callback(false, ok);
          }
        });
      });
    } else {
      callback("No valid parameters", false);
    }
  }

  list(body, callback) {
    if (this.db) {
      this.db.serialize(function () {
        this.all("SELECT name, schema FROM model", function (err, ok) {
          if (err) {
            callback(err, false);
          } else {
            ok.forEach(function (row) {
              row.schema = JSON.parse(row.schema);
            });
            callback(false, ok);
          }
        });
      });
    } else {
      callback("No valid parameters", false);
    }
  }
}

module.exports = Model;