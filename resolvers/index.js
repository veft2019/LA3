const playerResolver = require('./playerResolver');
const pickupGameResolver = require('./pickupGameResolver');
const basketBallResolver = require('./basketballFieldResolver');
const moment = require('moment');
const { GraphQLScalarType } = require('graphql');

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
    ...playerResolver.types,
    ...pickupGameResolver.types,
    ...basketBallResolver.types,

    Moment: new GraphQLScalarType({
        name: 'Moment',
        description: 'Getting Icelandic locale in llll format',
        parseValue: (value) => { return value; },
        parseLiteral: (value) => { return value; },
        serialize: (value) => {
            return moment(value).locale('is').format('llll');
        }
    })
};
