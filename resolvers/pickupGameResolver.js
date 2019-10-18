const errors = require('../errors'); 
const basketballFields = require('../services/basketballFieldService');
var moment = require('moment');

module.exports = {
    queries: {
        allPickupGames: async (parent, args, { db }) => {
            const results = (await db.PickupGame.find({})).filter(g => g.deleted === false);
            return results;
        },
        pickupGame: async (parent, args, { db }) => { 
            const result = await db.PickupGame.findById(args.id); 
            if(result == null) {
                throw new errors.NotFoundError();
            }
            else {
                return result;
            }
        }
    },
    mutations: {
        createPickupGame: async (parent, args, { db }) => {
            const pickupGame = {
                start: args.input.start.value,
                end: args.input.end.value,
                basketballFieldId: args.input.basketballFieldId,
                hostId: args.input.hostId
            }

            //moment.locale('is');
            const startTimeMoment = moment(args.input.start.value);
            const endTimeMoment = moment(args.input.end.value);
            
            //TODO:
            //Check if the hostid points to an existing player as well
            const hostPlayer = await db.Player.findById(pickupGame.hostId);
            if(hostPlayer == null) {
                throw new errors.NotFoundError("HostId: Player with this id was not found!")
            }
            //Check first if the basketballFieldId points to an existing thing
            const field = await basketballFields.fieldById(pickupGame.basketballFieldId);
            if(field == null) {
                throw new errors.NotFoundError("BasketballFieldId: Basketall field with this id was not found!");
            }

            //If the basketballField exists, check if its closed, which it may not be to continue
            console.log("field");
            console.log(field);
            console.log("field status");
            console.log(field.status);
            console.log("field status type");
            console.log(typeof(field.status));
            if(field.status == "CLOSED") {
                throw new errors.BasketballFieldClosedError();
            }

            //Check if:
                //Game start date is before game end date (NOT ALLOWED)
            if(startTimeMoment.isBefore(endTimeMoment)) {
                throw new errors.UserInputError("Start time may not be before end time!");
            }
                //Difference between start and end date is less than 5 minutes or longer than 2 hours
            const diffTime = startTimeMoment.diff(endTimeMoment, 'minutes');
            if(diffTime > 120 || diffTime < 5) {
                throw new errors.UserInputError("Games can not be under 5 minutes or over 2 hours!");
            }
                //Game may not start in the past (Date.now probably)
            if(startTimeMoment.isBefore(moment())) {
                throw new errors.UserInputError("You cannot schedule games in the past!");
            }

            //Check if there is another pickupGame at the same time on the same field (Overlap)
            
            const results = await db.PickupGame.create(pickupGame);
            
            //Add host as the first registered player and add this game to the hosts played games
            await db.PickupGame.findByIdAndUpdate(results.id, { $push: { registeredPlayers: args.input.hostId } }, {new: true} )
            await db.Player.findByIdAndUpdate(args.input.hostId, { $push: { playedGames: results.id } }, {new: true});
            
            return results;
        },
        removePickupGame: async (parent, args, { db }) => {
            const gameToRemove = await db.PickupGame.findByIdAndUpdate(args.id, { deleted: true }, {new: true })
            return true;
        },
        addPlayerToPickupGame: async (parent, args, { db }) => {
            const player = await db.Player.findById(args.input.playerId);
            //TODO: 
            //Check if player exists
            //Check if this pickupGame is already over (date.now probably or moment())

            const game = await db.PickupGame.findById(args.input.pickupGameId);

            const field = await basketballFields.fieldById(game.basketballFieldId);

            if(field.capacity <= game.registeredPlayers.length) {
                console.log("Capacity for this game has been reached");
                throw new errors.PickupGameExceedMaximumError()
            }
            if(game.registeredPlayers.includes(args.input.playerId)) {
                //Dont add the player, maybe throw error?
                console.log("Player already exists if statement");
                throw new errors.NotFoundError();
            }
            else {
                const result = await db.PickupGame.findByIdAndUpdate(args.input.pickupGameId, { $push: { registeredPlayers: args.input.playerId } }, {new: true} )
                await db.Player.findByIdAndUpdate(args.input.playerId, { $push: { playedGames: result.id } }, {new: true});
                return result;
            }
        },
        removePlayerFromPickupGame: async (parent, args, { db }) => {
            //TODO:
            //Check if pickupGame has passed, in whic case, we are not allowed to remove the players from it
            //Check if you just removed the host from the game, in which case, pick the next alphabetical player in the 
            //registered players list and make him the host
            //If there are no registered players when the host is removed, mark the pickup game as deleted
            const player = await db.Player.findById(args.input.playerId);
            const pickupGame = await db.PickupGame.findById(args.input.pickupGameId);

            const result = await db.PickupGame.findByIdAndUpdate(args.input.pickupGameId, { $pull: { registeredPlayers: args.input.playerId } }, {new: true} )
            return true;
        }
    },
    types: {
        PickupGame: {
            location: async (parent, args, { db }) => await basketballFields.fieldById(parent.basketballFieldId),
            host: async (parent, args, { db }) => await db.Player.findById(parent.hostId),
            registeredPlayers: async (parent, args, { db }) => {
                const playersInGame = [];
                const allPlayers = await db.Player.find({});
                
                parent.registeredPlayers.forEach(playerIds => {
                    allPlayers.forEach(playerObj => {
                        if(playerIds == playerObj.id) {
                            playersInGame.push(playerObj);
                        }
                    })
                });
               return playersInGame;
            }
        }
    }
}