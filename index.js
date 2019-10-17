const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers
   // For the database should use some context auth see the project description
});

server.listen()
    .then(({ url }) => console.log(`🚀 GraphQL Service is running on ${ url }`));
