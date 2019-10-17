const playerResolver = require('./playerResolver');

module.exports = {
    Query: {
        ...playerResolver.queries
    },
    Mutation: {
        ...playerResolver.mutations
    }
    //types
};