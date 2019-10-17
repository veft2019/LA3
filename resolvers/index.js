const playerResolver = require('./playerResolver');
const pickupGameResolver = require('./pickupGameResolver');
const basketBallResolver = require('./basketballFieldResolver');

module.exports = {
    Query: {
        ...pickupGameResolver.queries,
        ...playerResolver.queries,
        ...basketBallResolver.queries
    },
    Mutation: {
        ...pickupGameResolver.mutations,
        ...playerResolver.mutations
    },
    ...pickupGameResolver.types
};
