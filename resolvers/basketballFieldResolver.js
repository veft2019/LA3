/*
Should resolve a subset of the GraphQL schema for the basketball field
 */

const _data = require('../services/basketballFieldService');
const errors = require("../errors");

module.exports = {
    queries: {
      allBasketballFields: async (parent, args) => {
          const fields = await _data.basketBallField_db.response.body;
          return fields.filter(f => f.status == args.status);
      },
      basketballField: async (parent, args) => {
          const field = await _data.fieldById(args.id);
          if(field == null) {
              // if field was not found by field argument
              // throw NotFoundError
              throw new errors.NotFoundError();
          }
          else {
              return field;
          }
      }
    }
};
