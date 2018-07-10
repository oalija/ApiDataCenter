const SQLite = require('sqlite3');
const Validate = require('./validate');

class Entity {

  constructor() {
    this.validator = new Validate();
    this.db = new SQLite.Database('data/model');
  }

  add(body, callback) {
    if (this.db && this.validator.validateEntity(body)) {
      this.db.serialize(function () {
        this.run("INSERT INTO entity_" + body.table + " (key, data) VALUES (?,?)", body.key, JSON.stringify(body.data), callback);
      });
    } else {
      callback("No valid parameters", false);
    }
  }

  edit(body, callback) {
    if (this.db && this.validator.validateEntity(body) && body.id !== undefined) {
      this.db.serialize(function () {
        this.run("UPDATE entity_" + body.table + " SET key = ?, data = ? WHERE id = ?", body.key, JSON.stringify(body.data), body.id, callback);
      });
    } else {
      callback("No valid parameters", false);
    }
  }

  delete(body, callback) {
    if (this.db && body !== undefined && body.table !== undefined && body.id !== undefined) {
      this.db.serialize(function () {
        this.run("DELETE FROM entity_" + body.table + " WHERE id = ?", body.id, callback);
      });
    } else {
      callback("No valid parameters", false);
    }
  }

  view(body, callback) {
    if (this.db && body !== undefined && body.table !== undefined && body.id !== undefined) {
      this.db.serialize(function () {
        this.get("SELECT data FROM entity_" + body.table + " WHERE id = ?", body.id, function (err, ok) {
          if (err) {
            callback(err, false);
          } else if (ok === undefined) {
            callback(false, false);
          } else {
            ok.data = JSON.parse(ok.data);
            callback(false, ok);
          }
        });
      });
    } else {
      callback("No valid parameters", false);
    }
  }

  list(body, callback) {
    if (this.db && body !== undefined && body.table !== undefined) {
      this.db.serialize(function () {
        var query = "SELECT id, key, data FROM entity_" + body.table;

        var and = false;

        if (body.min !== undefined && Entity.isNumber(body.min)) {
          query += " WHERE key >= " + body.min;
          and = true;
        }

        if (body.max !== undefined && Entity.isNumber(body.max)) {
          if(and === true){
            query += " AND "
          } else {
            query += " WHERE "
          }
          query += " key <= " + body.max;
        }

        if (body.order !== undefined && (body.order === "ASC" || body.order === "DESC")) {
          query += " ORDER BY key " + body.order;
        } else {
          query += " ORDER BY key DESC";
        }

        if (body.limit !== undefined && Entity.isNumber(body.limit)) {
          query += " LIMIT " + body.limit;
        }

        this.all(query, function (err, ok) {
          if (err) {
            callback(err, false);
          } else {
            ok.forEach(function (row) {
              row.data = JSON.parse(row.data);
            });
            callback(false, ok);
          }
        });
      });
    } else {
      callback("No valid parameters", false);
    }
  }

  static isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0)
  }

}

module.exports = Entity;