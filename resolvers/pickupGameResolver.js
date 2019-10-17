/*
Should resolve a subset of the GraphQL schema for the pickup game
 */

 const db = require('../data/db');
 const errors = require('../errors'); 
 const basketballFields = require('../services/basketballFieldService');

 module.exports = {
     queries: {
         allPickupGames: () => db.PickupGame.find({}),
         pickupGame: (parent, args) => db.PickupGame.findById(args.id)
     },
     mutations: {
       createPickupGame: async (parent, args) => {
            const pickGame = {
                start: args.input.start,
                end: args.input.end,
                location: await basketballFields.fieldById_db(parent.basketballFieldId), //not working
                host: await db.Player.findById(args.input.hostId)

            }
            console.log(args);
            const results = await db.PickupGame.create(pickGame);
            console.log(results);
            return results;
        },
        removePickupGame: (parent, args) => {
            const gameToRemove = db.PickupGame.findOneAndUpdate(args.id, {delete: true}, {new: true })
            return gameToRemove;
        }
     },
     types: { //resolvea
         /*PickupGame: {
             host: parent => db.Player.findById(parent.hostId),
             location: parent => basketballFields.fieldById_db(parent.basketballFieldId)
         }*/
     }


 }