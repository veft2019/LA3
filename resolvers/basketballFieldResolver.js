/*
Should resolve a subset of the GraphQL schema for the basketball field
 */

const _data = require('../services/basketballFieldService');

module.exports = {
    queries: {
      allBasketballFields: (parent, args) => {
          const temp = _data.basketBallField_db.response.body;
          return temp.filter(x => x.status == args.status);
      },
      basketballField: (parent, args) => {
          return _data.fieldById(args.id);
      }
    }
};
