const _data = require('../services/basketballFieldService');
const errors = require("../errors");

module.exports = {
    queries: {
        allBasketballFields: async (parent, args) => {
            const fields = await _data.basketBallField_db.response.body;
            console.log(args);
            return fields.filter(f => f.status == args.status);
        },
        basketballField: async (parent, args) => {
            const field = await _data.fieldById(args.id);
            if(field == null) {
                // if field was not found by field argument
                // throw NotFoundError
                throw new errors.NotFoundError();
            }
            else {
                return field;
            }
        }
    },
    types: {
        BasketballField: {
            pickupGames: async (parent, args, { db }) =>  {
                const pickupGames = [];
                const result = await db.PickupGame.find({});
                // Go through each  and find corresponding player in database
                result.forEach(game => {
                    if(game.basketballFieldId == parent.id) {
                        pickupGames.push(game);
                    }
                });
                return pickupGames;
            }
        }
    }
};
