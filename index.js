const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');

const server = new ApolloServer({
    typeDefs
    /*
        Add resolvers
    */
   // For the database should use some context auth see the project description
});

server.listen()
    .then(({ url }) => console.log(`🚀 GraphQL Service is running on ${ url }`));
