/*
Should resolve a subset of the GraphQL schema for the pickup game
 */

 const db = require('../data/db');



 module.exports = {
     queries: {
         allPickupGames: () => db.PickupGame
     },

     mutations: {
       createNewPickUpGame: (parent, args) => {
            const newPickUpGame = {
   
               // input 
               // start: Moment!
               // end: Moment!
               // basketballFieldId: String!
               // hostId: String!
   
            }
        },

        updatePickUpGames: (parent, args) => {

        },
        deletePickUpGames: (parent, args) => {
   
        }
     }

 }