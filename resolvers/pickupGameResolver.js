 //const db = require('../data/db');
 const errors = require('../errors'); 
 const basketballFields = require('../services/basketballFieldService');


 module.exports = {
     queries: {
         allPickupGames: async (parent, args, { db }) => await db.PickupGame.find({}),
         pickupGame: async (parent, args, { db }) => await db.PickupGame.findById(args.id)
     },
     mutations: {
       createPickupGame: async (parent, args, { db }) => {
           console.log(args);
            const pickupGame = {
                start: args.input.start.value,
                end: args.input.end.value,
                basketballFieldId: args.input.basketballFieldId,
                hostId: args.input.hostId
            }
            const results = await db.PickupGame.create(pickupGame);
            return results;
        },
        removePickupGame: async (parent, args, { db }) => {
            const gameToRemove = await db.PickupGame.findOneAndUpdate(args.id, {delete: true}, {new: true })
            return true;
        },
        addPlayerToPickupGame: async (parent, args, { db }) => {
            const playerId = await db.Player.findById(args.input.playerId); 
            const result = await db.PickupGame.findOneAndUpdate(args.input.pickupGameId, {$push: {registerdPlayers: playerId}}, {new: true} )
            return result;
        }
     },
     types: {
        PickupGame: {
            location: async (parent, args, { db }) => await db.PickupGame.findById(parent.basketballFieldId),
            host: async (parent, args, { db }) => await db.Player.findById(parent.hostId),
        }
     }
    
 }