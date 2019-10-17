const db = require("../data/db");
const errors = require("../errors");

module.exports = {
    queries: {
        allPlayers: async () => { const players = await db.Player.find({}); return players /*console.log(players); players.where(x => x.deleted == false)*/ },
        player: (parent, args) => db.Player.findById(args.id)
    },
    mutations: {
        createPlayer: (parent, args) => {
            const result = db.Player.create(args.input);
            return result;
        },
        updatePlayer: (parent, args) => {
            const player = db.Player.findByIdAndUpdate(args.id, { name: args.name }, { new: true });
            return player;
        },
        removePlayer: (parent, args) => {
            db.Player.findByIdAndUpdate(args.id, { deleted: true }, { new: true });
            return true;
        }
        //removePlayerFromPickupGame - unsure if this should be here or in pickupgame
    }
}
