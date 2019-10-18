const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const mongooseDb = require('./data/db');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => ({
        db: mongooseDb
    })
});

server.listen()
    .then(({ url }) => console.log(`🚀 GraphQL Service is running on ${ url }`));
