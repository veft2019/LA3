const errors = require("../errors");

module.exports = {
    queries: {
        allPlayers: async (parent, args, { db }) => { 
            const players = (await db.Player.find({})).filter(p => p.deleted === false);
            return players;
        },
        player: async (parent, args, { db }) => { 
            const player = await db.Player.findById(args.id);
            if(!player.deleted) {
                return player;
            }
            else {
                //Throw error
                throw new errors.NotFoundError();
            }
        }
    },
    mutations: {
        createPlayer: async (parent, args, { db }) => {
            const result = await db.Player.create(args.input);
            return result;
        },
        updatePlayer: async (parent, args, { db }) => {
            const player = await db.Player.findByIdAndUpdate(args.id, { name: args.name }, { new: true });
            return player;
        },
        removePlayer: async (parent, args, { db }) => {
            await db.Player.findByIdAndUpdate(args.id, { deleted: true }, { new: true });
            return true;
        }
    },
    types: {
        Player: {
            playedGames: async (parent, args, { db }) => {
                const playedGames = [];
                const allGames = await db.PickupGame.find({});
                parent.playedGames.forEach(gameId => {
                    allGames.forEach(game => {
                        if(gameId == game.id) {
                            playedGames.push(game);
                        }
                    })
                });
                return playedGames;
            }
        }
    }
}
