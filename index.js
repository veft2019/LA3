const { ApolloServer } = require('apollo-server');

const server = new ApolloServer({
    /*
        Add typeDefs
        Add resolvers
    */
});

server.listen()
    .then(({ url }) => console.log(`GraphQL Service is running on ${ url }`));
