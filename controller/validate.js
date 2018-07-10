class Validate {

  constructor() {
  }

  validateModel(body) {
    if (body !== undefined && body.table !== undefined && body.schema !== undefined) {
      return this.validateSchema(body.schema);
    }
  }

  validateEntity(body) {
    if (body !== undefined && body.table !== undefined && body.data !== undefined && body.key !== undefined) {
      return true;
    }
  }

  validateSchema(schema) {
    var valid = true;
    var fields = [];

    if (schema.fields !== undefined) {
      schema.fields.forEach(function (field) {
        if (field.name !== undefined && field.type !== undefined && field.mandatory !== undefined && !fields.includes(field.name)) {
          fields.push(field.name);
        } else {
          return false;
        }
      });
    }

    if (fields.length === 0) {
      valid = false;
    }

    return valid;
  }

}

module.exports = Validate;
