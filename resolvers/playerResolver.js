const db = require("../data/db");
const errors = require("../errors");

module.exports = {
    queries: {
        allPlayers: () => db.Player.find({}),
        player: (parent, args) => db.Player.findById(args.id)
    },
    mutations: {
        createPlayer: (parent, args) => {
            const result = db.Player.create(args.input);
            return result;
        },
        updatePlayer: (parent, args) => {

        },
        removePlayer: (parent, args) => {

        },
        //removePlayerFromPickupGame - unsure if this should be here or in pickupgame
    }
}
