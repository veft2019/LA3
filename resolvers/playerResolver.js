const db = require("../data/db");
const errors = require("../errors");

module.exports = {
    queries: {
        allPlayers: async () => { 
            const players = (await db.Player.find({})).filter(p => p.deleted === false);
            return players;
        },
        player: async (parent, args) => { 
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
        createPlayer: async (parent, args) => {
            const result = await db.Player.create(args.input);
            return result;
        },
        updatePlayer: async (parent, args) => {
            const player = await db.Player.findByIdAndUpdate(args.id, { name: args.name }, { new: true });
            return player;
        },
        removePlayer: async (parent, args) => {
            await db.Player.findByIdAndUpdate(args.id, { deleted: true }, { new: true });
            return true;
        }
        //removePlayerFromPickupGame - unsure if this should be here or in pickupgame
    }
}
