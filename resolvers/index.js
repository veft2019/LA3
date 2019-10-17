const playerResolver = require('./playerResolver');
const pickupGameResolver = require('./pickupGameResolver');

module.exports = {
    Query: {
        ...pickupGameResolver.queries,
        ...playerResolver.queries
    },
    Mutation: {
        ...pickupGameResolver.mutations,
        ...playerResolver.mutations
    },
    ...pickupGameResolver.types
};