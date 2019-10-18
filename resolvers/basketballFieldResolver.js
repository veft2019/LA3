/*
Should resolve a subset of the GraphQL schema for the basketball field
 */

const _data = require('../services/basketballFieldService');

module.exports = {
    queries: {
      allBasketballFields: async (parent, args) => {
          const fields = await _data.basketBallField_db.response.body;
          return fields.filter(f => f.status == args.status);
      },
      basketballField: async (parent, args) => {
          return await _data.fieldById(args.id);
      }
    }
};
