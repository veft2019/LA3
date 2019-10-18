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
            // Check whether the resource with the provided id exists 
            if(result == null) {
                throw new errors.NotFoundError("Pickup game with this id was not found!");
            }
            return result;
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

            const startTimeMoment = moment(args.input.start.value);
            const endTimeMoment = moment(args.input.end.value);
            
            // A mutation which accepts an id as a field argument must check whether the resource with the provided id exists
            const hostPlayer = await db.Player.findById(pickupGame.hostId);
            if(hostPlayer == null) {
                throw new errors.NotFoundError("HostId: Player with this id was not found!")
            }

            // A mutation which accepts an id as a field argument must check whether the resource with the provided id exists
            const field = await basketballFields.fieldById(pickupGame.basketballFieldId);
            if(field == null) {
                throw new errors.NotFoundError("BasketballFieldId: Basketall field with this id was not found!");
            }

            // Pickup games cannot be added to a basketball field which has a status of closed
            if(field.status == "CLOSED") {
                throw new errors.BasketballFieldClosedError("This basketball field has been marked closed!");
            }

            // Pickup games that have an end date which comes before the start date cannot be created
            if(!startTimeMoment.isBefore(endTimeMoment)) {
                throw new errors.UserInputError("Start time may not be before end time!");
            }

            if(startTimeMoment.isBefore(moment())) {
                throw new errors.UserInputError("You cannot schedule games in the past!");
            }
            
            // Pickup games can be at max 2 hours, but a minimum of 5 minutes
            const diffTime = endTimeMoment.diff(startTimeMoment, 'minutes');
            if(diffTime > 120 || diffTime < 5) {
                throw new errors.UserInputError("Games can not be under 5 minutes or over 2 hours!");
            }
            
            // Pickup games cannot overlap if they are being played in the same basketball field
            const allUpcomingPickupGames = (await db.PickupGame.find({})).filter(g => g.deleted === false);
            allUpcomingPickupGames.forEach(game => {
                if(game.basketballFieldId == pickupGame.basketballFieldId) {
                    if(!startTimeMoment.isAfter(moment(game.end)) || 
                       !endTimeMoment.isBefore(moment(game.start))) {
                            console.log("OVERLAP!!!");
                            throw new errors.PickupGameOverlapError("Overlap! Game already registered at this time on this field!");
                    }
                }
            });

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
            
            // Check whether the resource with the provided id exists
            const player = await db.Player.findById(args.input.playerId);
            if(player == null) {
                throw new errors.NotFoundError(); 
            }

            // Check whether the resource with the provided id exists
            const game = await db.PickupGame.findById(args.input.pickupGameId);
            if(game == null) {
                throw new errors.NotFoundError();
            }

            // Check whether the resource with the provided id exists
            const field = await basketballFields.fieldById(game.basketballFieldId); 
            if(field == null) {
                throw new errors.NotFoundError();
            }

            // Check if game is full or not 
            if(field.capacity <= game.registeredPlayers.length) {
                throw new errors.PickupGameExceedMaximumError("This game is full");
            }

            // Check if player is already registerd in the game 
            if(game.registeredPlayers.includes(args.input.playerId)) { 
                throw new errors.UserInputError("Player is already registerd");
            }

            const startTimeMoment = moment(game.start);
            const endTimeMoment = moment(game.end); 
            const now = moment();

            // Check if the game has already passed
            if(endTimeMoment.isBefore(now)) {
                throw new errors.PickupGameAlreadyPassedError();
            }
        
            // Check if the user is aldready signed up for a game at the same time
            const allGames = (await db.PickupGame.find({})).filter(g => g.deleted === false);
            allGames.forEach(g => {
                if(g.registeredPlayers.includes(args.input.playerId)) {
                    const gameIStart = moment(g.start);
                    const gameIEnd = moment(g.end);
                    if(!startTimeMoment.isAfter(gameIEnd) || !endTimeMoment.isBefore(gameIStart)) {
                        throw new errors.PickupGameOverlapError("This user is already signed up for a game at this time");
                    }
                }
            })

            // Add player to a specific pickup game
            const result = await db.PickupGame.findByIdAndUpdate(args.input.pickupGameId, { $push: { registeredPlayers: args.input.playerId } }, {new: true} )
            await db.Player.findByIdAndUpdate(args.input.playerId, { $push: { playedGames: result.id } }, {new: true});
            
            return result;
            
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