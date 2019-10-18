 //const db = require('../data/db');
 const errors = require('../errors'); 
 const basketballFields = require('../services/basketballFieldService');


 module.exports = {
     queries: {
         allPickupGames: async (parent, args, { db }) => {
           const pickupGames = (await db.PickupGame.find({})).filter(g => g.deleted === false);
           return pickupGames;
         },
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
            const gameToRemove = await db.PickupGame.findByIdAndUpdate(args.id, { deleted: true }, {new: true })
            return true;
        },
        addPlayerToPickupGame: async (parent, args, { db }) => {
            const playerId = await db.Player.findById(args.input.playerId); 
            const result = await db.PickupGame.findByIdAndUpdate(args.input.pickupGameId, { $push: { registeredPlayers: args.input.playerId } }, {new: true} )
            return result;
        },
        removePlayerFromPickupGame: async (parent, args, { db }) => {
            const playerId = await db.Player.findById(args.input.playerId);
            const pickupGameId = await db.PickupGame.findById(args.input.pickupGameId); 
            const result = await db.PickupGame.findByIdAndUpdate(args.input.pickupGameId, {$pull: {registerdPlayers: args.input.playerId}}, {new: true} )
            return result;
        }
     },
     types: {
        PickupGame: {
            location: async (parent, args, { db }) => await basketballFields.fieldById(parent.basketballFieldId),
            host: async (parent, args, { db }) => await db.Player.findById(parent.hostId),
            registeredPlayers: async (parent, args, { db }) => {
                const final = [];
                const players = await db.Player.find({});
                
                parent.registeredPlayers.forEach(pId => {
                    players.forEach( p => {
                        console.log(pId);
                        console.log(p);
                        if(pId == p.id) {
                            final.push(p);
                        }
                    })
                });
               return final;
            }
        }
    }
}