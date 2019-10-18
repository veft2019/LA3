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
            const pickupGame = {
                start: args.input.start,
                end: args.input.end,
                location: await basketballFields.fieldById(args.input.basketballFieldId), 
                host: await db.Player.findById(args.input.hostId)
            }
            const results = await db.PickupGame.create(pickupGame);
            return results;
        },
        removePickupGame: (parent, args) => {
            const gameToRemove = db.PickupGame.findOneAndUpdate(args.id, {delete: true}, {new: true })
            return true;
        },
        addPlayerToPickupGame: async (parent, args) => {
            const playerId = await db.Player.findById(args.input.playerId); 
            const result = await db.PickupGame.findOneAndUpdate(args.input.pickupGameId, {$push: {registerdPlayers: playerId}}, {new: true} )
            return result;
        }
     }
    
 }