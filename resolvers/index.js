const playerResolver = require('./playerResolver');
const basketResolver = require('./basketballFieldResolver');

module.exports = {
    Query: {
        ...playerResolver.queries,
        ...basketResolver.queries
    },
    Mutation: {
        ...playerResolver.mutations
    }
    //types
};
