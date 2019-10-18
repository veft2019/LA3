const _data = require('../services/basketballFieldService');
const errors = require("../errors");

module.exports = {
    queries: {
        allBasketballFields: async (parent, args) => {
            const results = await _data.basketBallField_db.response.body;
            return results.filter(f => f.status == args.status);
        },
        basketballField: async (parent, args) => {
            const result = await _data.fieldById(args.id);
            if(result == null) {
                throw new errors.NotFoundError();
            }
            return result;
        }
    },
    types: {
        BasketballField: {
            pickupGames: async (parent, args, { db }) =>  {
                const pickupGames = [];
                const allGames = await db.PickupGame.find({});
                allGames.forEach(game => {
                    if(game.basketballFieldId == parent.id) {
                        pickupGames.push(game);
                    }
                });
                return pickupGames;
            }
        }
    }
};
