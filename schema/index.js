// Should export a root object which is composed of all the declared and defined types
const { gql } = require('apollo-server'); // What Arnar used in Super Mario
const enums = require('./enums');
const input = require('./input');
const mutations = require('./mutations');
const queries = require('./queries');
const scalar = require('./scalar');
const types = require('./types');

module.exports = gql`
    ${enums}
    ${input}
    ${mutations}
    ${queries}
    ${scalar}
    ${types}
`;
