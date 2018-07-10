const Express = require('express');
const BodyParser = require('body-parser');
const Model = require('./model');
const Entity = require('./entity');
const TOKEN = "lJFtEYxdLF0x8rk2RdeJKLyo92Fr8ajo";

class Api {

  constructor() {
    this.rest = Express();
    this.rest.use(BodyParser.json()); // support json encoded bodies
    this.rest.use(BodyParser.urlencoded({extended: true})); // support encoded bodies
    this.rest.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', false);

      // Pass to next layer of middleware
      next();
    });
    this.model = new Model();
    this.entity = new Entity();
  }

  init() {
    this.endpoint('/model/list', this.model, "list");
    this.endpoint('/model/view', this.model, "view");
    this.endpoint('/model/add', this.model, "add");
    this.endpoint('/model/edit', this.model, "edit");
    this.endpoint('/model/delete', this.model, "delete");

    this.endpoint('/entity/list', this.entity, "list");
    this.endpoint('/entity/view', this.entity, "view");
    this.endpoint('/entity/add', this.entity, "add");
    this.endpoint('/entity/edit', this.entity, "edit");
    this.endpoint('/entity/delete', this.entity, "delete");

    this.rest.listen(3000,'0.0.0.0');
    console.log("Submit GET or POST to http://localhost:3000/");
  }

  endpoint(endpoint, object, callback) {
    this.rest.post(endpoint, function (req, res) {
      if (req.body !== null && req.body.token === TOKEN) {
        object[callback](req.body, function (err, ok) {
          if (!err && ok !== false) {
            res.json(ok);
            res.status(200);
            res.end();
          } else {
            console.log(err);
            res.status(400);
            res.end();
          }
        });
      } else {
        res.status(400);
        res.end();
      }
    });
  }
}

module.exports = Api;